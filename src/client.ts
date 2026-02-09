import type { OpenRpcDocument } from './open_rpc/open_rpc_document.ts';
import type { ExtractMethod } from './open_rpc/method/extract_method.ts';
import type { ExtractParams } from './open_rpc/method/params/extract_params.ts';
import type { ExtractResult } from './open_rpc/result/extract_result.ts';
import type { ExtractRequestMethodNames } from './open_rpc/method/extract_request_method_names.ts';
import type { ExtractNotificationMethodNames } from './open_rpc/method/extract_notification_method_names.ts';
import { validatedOpenRpcDocument, type ValidatedOpenRpcDocument } from './open_rpc/validated_open_rpc_document.ts';
import { CustomEventTarget, type CustomEventListenerOrCustomEventListenerObject } from './custom_event_target.ts';
import type { ErrorObject, NotificationObject, RequestObject, ResponseObject } from './json_rpc/json_rpc_object.ts';
import type { ExtractMethodNames } from './open_rpc/method/extract_method_names.ts';


/**
 * Options for the JsonRpcClient.
 */
interface ClientOptions {
  token? : string
}


/**
 * Internal structure to track pending requests
 */
interface PendingRequest<
  Schema extends OpenRpcDocument,
  MethodName extends ExtractRequestMethodNames<Schema>
> {
  resolve : (value : ExtractResult<Schema, ExtractMethod<Schema, MethodName>>) => void;
  reject : (error : ErrorObject) => void;
}

/**
 * Incoming message types from the server
 */
type IncomingMessage<Schema extends OpenRpcDocument> =
  | ResponseObject<Schema, ExtractMethodNames<Schema>>
  | NotificationObject<Schema, ExtractNotificationMethodNames<Schema>>;


/**
 * @template Schema OpenRPC document schema
 */
export class Client<Schema extends OpenRpcDocument> extends CustomEventTarget {
  private readonly ws : WebSocket;
  private readonly schema : Schema;
  private readonly pendingRequests : Map<
    number,
    PendingRequest<Schema, ExtractRequestMethodNames<Schema>>
  > = new Map();
  private requestId : number = 0;
  
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

  private isNotification(
    data : IncomingMessage<Schema>
  ) : data is NotificationObject<Schema, ExtractNotificationMethodNames<Schema>> {
    return 'method' in data && !('id' in data);
  }

  private isResponse(
    data : IncomingMessage<Schema>
  ) : data is ResponseObject<Schema, ExtractRequestMethodNames<Schema>> {
    return 'id' in data;
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
      
      if (this.isNotification(data)) {
        this.handleNotification(data);
        return;
      }

      if (this.isResponse(data)) {
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
