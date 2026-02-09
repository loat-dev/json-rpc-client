import type { OpenRpcDocument } from './open_rpc/open_rpc_document.ts';
import type { ExtractMethod } from './open_rpc/method/extract_method.ts';
import type { ExtractParams } from './open_rpc/method/params/extract_params.ts';
import type { ExtractResult } from './open_rpc/result/extract_result.ts';
import type { ExtractRequestMethodNames } from './open_rpc/method/extract_request_method_names.ts';
import type { ExtractNotificationMethodNames } from './open_rpc/method/extract_notification_method_names.ts';
import { validatedOpenRpcDocument, type ValidatedOpenRpcDocument } from './open_rpc/validated_open_rpc_document.ts';
import { CustomEventTarget, type CustomEventListenerOrCustomEventListenerObject } from './custom_event_target.ts';
import type { NotificationObject, RequestObject, ResponseObject } from './json_rpc/json_rpc_object.ts';
import type { PendingRequest } from './json_rpc/pending_requests.ts';
import type { IncomingMessage } from './json_rpc/incoming_message.ts';
import { isNotification } from './json_rpc/is_notification.ts';
import { isResponse } from './json_rpc/is_response.ts';


/**
 * Options for the JsonRpcClient.
 */
interface ClientOptions {
  /**
   * Optional authentication token for WebSocket connection.
   */
  token? : string
}

/**
 * JSON-RPC 2.0 WebSocket client with full type safety based on OpenRPC schema.
 * 
 * @template Schema OpenRPC document schema
 * 
 * @example
 * ```ts
 * const client = new Client('ws://localhost:8080', schema);
 * 
 * // Type-safe method calls
 * const result = await client.call('minecraft:allowlist');
 * 
 * // Type-safe event listeners
 * client.addEventListener('minecraft:notification/server/started', (event) => {
 *   console.log('Server started');
 * });
 * ```
 */
export class JsonRpcClient<Schema extends OpenRpcDocument> extends CustomEventTarget {
  private readonly ws : WebSocket;
  private readonly pendingRequests : Map<
    number,
    PendingRequest<Schema, ExtractRequestMethodNames<Schema>>
  > = new Map();
  private requestId : number = 0;
  public readonly schema : Schema;
  
  constructor(
    url : string,
    schema : ValidatedOpenRpcDocument<Schema>,
    options? : ClientOptions
  ) {
    super();

    this.schema = validatedOpenRpcDocument(schema);

    this.ws = new WebSocket(url, {
      headers: options?.token ? { Authorization: `Bearer ${options.token}` } : undefined
    });

    this.ws.addEventListener("open", () => {
      console.log('Client connected');
    });

    this.ws.addEventListener("close", () => {
      console.log('Client disconnected');

      this.pendingRequests.forEach((pending) => {
        pending.reject({
          code: -32603,
          message: 'Connection closed'
        });
      });
      this.pendingRequests.clear();
    });

    this.ws.addEventListener("error", (event) => {
      console.log('Client error:', event)
    });

    this.ws.addEventListener("message", (event) => {
      this.handleMessage(event)
    });
  }

  private handleNotification(data : NotificationObject<Schema, ExtractNotificationMethodNames<Schema>>) : void {
    const event = new CustomEvent(data.method, {
      detail: data.params || []
    });
    this.dispatchEvent(event);
  }

  private handleResponse(data : ResponseObject<Schema, ExtractRequestMethodNames<Schema>>) : void {
    const pending = this.pendingRequests.get(data.id as number);
    
    if (!pending) {
      console.warn('Received response for unknown request id:', data.id);
      return;
    }

    this.pendingRequests.delete(data.id as number);

    if (data.error) {
      pending.reject(data.error);
    } else {
      pending.resolve(data.result);
    }
  }

  private handleMessage(event : MessageEvent) : void {
    try {
      const data : IncomingMessage<Schema> = JSON.parse(event.data);
      
      if (isNotification(data)) {
        this.handleNotification(data);
        return;
      }

      if (isResponse(data)) {
        this.handleResponse(data);
        return;
      }

      console.warn('Received unknown message format:', data);
    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  }

  public call<
    MethodName extends ExtractRequestMethodNames<Schema>,
    Method extends ExtractMethod<Schema, MethodName>
  >(
    method : MethodName,
    ...params : ExtractParams<Schema, Method>
  ) : Promise<ExtractResult<Schema, Method>> {
    const id = ++this.requestId;

    const request : RequestObject<Schema, MethodName> = {
      jsonrpc: '2.0',
      method,
      params: params.length > 0 ? params : undefined,
      id
    };

    return new Promise<ExtractResult<Schema, Method>>((resolve, reject) => {
      this.pendingRequests.set(id, {
        resolve,
        reject
      });

      try {
        this.ws.send(JSON.stringify(request));
      } catch (error) {
        this.pendingRequests.delete(id);
        reject({
          code: -32603,
          message: error instanceof Error ? error.message : 'Failed to send request'
        });
      }
    });
  }

  override addEventListener<MethodName extends ExtractNotificationMethodNames<Schema>>(
    type : MethodName,
    listener : CustomEventListenerOrCustomEventListenerObject<ExtractParams<Schema, ExtractMethod<Schema, MethodName>>> | null,
    options? : boolean | AddEventListenerOptions
  ) : void {
    super.addEventListener(type, listener, options);
  }

  override removeEventListener<MethodName extends ExtractNotificationMethodNames<Schema>>(
    type : MethodName,
    listener : CustomEventListenerOrCustomEventListenerObject<ExtractParams<Schema, ExtractMethod<Schema, MethodName>>> | null,
    options? : boolean | EventListenerOptions
  ) : void {
    super.removeEventListener(type, listener, options);
  }
}
