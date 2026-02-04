import type { OpenRpcDocument } from './open_rpc/open_rpc_document.ts';
import type { ExtractMethod } from './open_rpc/method/extract_method.ts';
import type { ExtractParams } from './open_rpc/method/params/extract_params.ts';
import type { ExtractResult } from './open_rpc/result/extract_result.ts';
import type { ExtractRequestMethodNames } from './open_rpc/method/extract_request_method_names.ts';
import type { ExtractNotificationMethodNames } from './open_rpc/method/extract_notification_method_names.ts';
import { validatedOpenRpcDocument, type ValidatedOpenRpcDocument } from './open_rpc/validated_open_rpc_document.ts';

interface JsonRpcClientOptions {
  token? : string
}

/**
 * @template Schema OpenRPC document schema
 */
export class JsonRpcClient<Schema extends OpenRpcDocument> extends EventTarget {
  private readonly ws : WebSocket;
  private readonly schema : Schema;
  
  constructor(
    url : string,
    schema : ValidatedOpenRpcDocument<Schema>,
    options? : JsonRpcClientOptions
  ) {
    super();

    this.schema = validatedOpenRpcDocument(schema);

    this.ws = new WebSocket(url, {
      headers: options?.token ? { Authorization: `Bearer ${options.token}` } : undefined
    });

    this.ws.addEventListener("open", () => {
      this.dispatchEvent(new Event("open"));
    });

    this.ws.addEventListener("close", (event) => {
      this.dispatchEvent(event);
    });

    this.ws.addEventListener("error", (event) => {
      this.dispatchEvent(event);
    });

    this.ws.addEventListener("message", (event) => {
      this.dispatchEvent(event);
    });
  }

  public call<
    RequestMethodName extends ExtractRequestMethodNames<Schema>,
    Method extends ExtractMethod<Schema, RequestMethodName>
  >(
    method : RequestMethodName,
    ...params : ExtractParams<Schema, Method>
  ): Promise<ExtractResult<Schema, Method>> {
    this.schema.info
    console.log(method, ...params);
    
    return new Promise(() => {})
  }

  override addEventListener<
    NotificationName extends ExtractNotificationMethodNames<Schema>,
    Method extends ExtractMethod<Schema, NotificationName>
  >(
    type : NotificationName,
    listener : EventListenerOrEventListenerObject | null,
    options? : boolean | AddEventListenerOptions
  ): void {
    super.addEventListener(type, listener, options);
  }

  override removeEventListener<
    NotificationName extends ExtractNotificationMethodNames<Schema>,
    Method extends ExtractMethod<Schema, NotificationName>
  >(
    type : NotificationName,
    callback : EventListenerOrEventListenerObject | null,
    options? : EventListenerOptions | boolean
  ): void {
    super.removeEventListener(type, callback, options);
  }
}
