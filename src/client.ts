import { ExtractMethod } from './schema_structure/extract_method.ts';
import { ExtractMethodNames } from './schema_structure/extract_method_names.ts';
import { ExtractResult } from './schema_structure/extract_result.ts';
import { ExtractParams } from './schema_structure/extract_params.ts';
import { OpenRpcSchema } from './schema_structure/open_rpc_schema.ts';

// JSON-RPC 2.0 Types
interface JsonRpcRequest {
  jsonrpc: "2.0";
  method: string;
  params?: unknown;
  id: string | number;
}

interface JsonRpcResponse {
  jsonrpc: "2.0";
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
  id: string | number | null;
}

export class JsonRpcError extends Error {
  constructor(
    public code: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = "JsonRpcError";
  }
}

export class Client<Schema extends OpenRpcSchema> {
  private schema: Schema;
  private address: string;
  private ws: WebSocket;
  private requestId = 0;
  private pendingRequests = new Map<number, {
    resolve: (value: unknown) => void;
    reject: (error: Error) => void;
  }>();

  constructor(
    address: string,
    options: { token: string; schema: Schema }
  ) {
    this.address = address;
    this.schema = options.schema;
    
    this.ws = new WebSocket(`ws://${this.address}`, {
      headers: {
        'Authorization': `Bearer ${options.token}`
      }
    });

    // Setup message handler
    this.ws.addEventListener('message', (event) => {
      this.handleMessage(event);
    });

    // Setup close handler
    this.ws.addEventListener('close', (event) => {
      this.handleClose(event);
    });

    // Setup error handler
    this.ws.addEventListener('error', (event) => {
      this.handleError(event);
    });
  }

  public get info() : Schema['info'] {
    return this.schema.info;
  }

  public get openrpc() : string {
    return this.schema.openrpc;
  }

  public async call<
    Name extends ExtractMethodNames<Schema>,
    Method = ExtractMethod<Schema, Name>
  >(
    method: Name,
    ...params: ExtractParams<Schema, Method>
  ): Promise<ExtractResult<Schema, Method>> {
    // Wait for connection to be established
    await this.connectionPromise;

    // Check if connection is still open
    if (this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    // Generate unique request ID
    const id = ++this.requestId;

    // Build JSON-RPC request
    const request: JsonRpcRequest = {
      jsonrpc: "2.0",
      method: method as string,
      id
    };

    // Add params if provided
    if (params.length > 0) {
      // Find method definition to get parameter names
      const methodDef = this.findMethodInSchema(method as string);
      
      if (methodDef?.params && methodDef.params.length > 0) {
        // Build params object with named parameters
        const paramsObj: Record<string, unknown> = {};
        for (let i = 0; i < params.length; i++) {
          const paramDef = methodDef.params[i];
          if (paramDef?.name) {
            paramsObj[paramDef.name] = params[i];
          }
        }
        request.params = paramsObj;
      } else {
        // Fallback: use params as-is
        request.params = params.length === 1 ? params[0] : params;
      }
    }

    // Create promise for response
    const responsePromise = new Promise<unknown>((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
    });

    // Send request
    this.ws.send(JSON.stringify(request));

    // Wait for response
    return responsePromise as Promise<ExtractResult<Schema, Method>>;
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const response = JSON.parse(event.data) as JsonRpcResponse;

      // Handle response
      if ('id' in response && typeof response.id === 'number') {
        const pending = this.pendingRequests.get(response.id);
        
        if (pending) {
          this.pendingRequests.delete(response.id);

          if (response.error) {
            pending.reject(
              new JsonRpcError(
                response.error.code,
                response.error.message,
                response.error.data
              )
            );
          } else {
            pending.resolve(response.result);
          }
        }
      }
      // Handle notifications (no id)
      else {
        this.handleNotification(response);
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  private handleNotification(response: JsonRpcResponse): void {
    // Override this method in subclass to handle notifications
    // For example, you could emit events here
    // console.log('Received notification:', response);
  }

  private handleClose(event: CloseEvent): void {
    // Reject all pending requests
    for (const [id, pending] of this.pendingRequests.entries()) {
      pending.reject(
        new Error(`WebSocket closed: ${event.code} ${event.reason}`)
      );
      this.pendingRequests.delete(id);
    }
  }

  private handleError(event: Event): void {
    console.error('WebSocket error:', event);
  }

  private findMethodInSchema(methodName: string): { params?: ReadonlyArray<{ name?: string }> } | undefined {
    if (
      typeof this.schema === "object" &&
      this.schema !== null &&
      "methods" in this.schema &&
      Array.isArray((this.schema as { methods: unknown }).methods)
    ) {
      const methods = (this.schema as { methods: ReadonlyArray<{ name: string; params?: ReadonlyArray<{ name?: string }> }> }).methods;
      return methods.find((m) => m.name === methodName);
    }
    return undefined;
  }

  // Public API for connection management
  public waitForConnection(): Promise<void> {
    return this.connectionPromise;
  }

  public close(code?: number, reason?: string): void {
    this.ws.close(code, reason);
  }

  public get readyState(): number {
    return this.ws.readyState;
  }

  public get isConnected(): boolean {
    return this.ws.readyState === WebSocket.OPEN;
  }

  // Event handler registration
  public onNotification(handler: (notification: JsonRpcResponse) => void): void {
    const originalHandler = this.handleNotification.bind(this);
    this.handleNotification = (response: JsonRpcResponse) => {
      originalHandler(response);
      handler(response);
    };
  }

  public onClose(handler: (event: CloseEvent) => void): void {
    this.ws.addEventListener('close', handler);
  }

  public onError(handler: (event: Event) => void): void {
    this.ws.addEventListener('error', handler);
  }
}
