import type { OpenRpcDocument } from './open_rpc/open_rpc_document.ts';
import type { ExtractMethod } from './open_rpc/method/extract_method.ts';
import type { ExtractParams } from './open_rpc/method/params/extract_params.ts';
import type { ExtractResult } from './open_rpc/result/extract_result.ts';
import type { ExtractRequestMethodNames } from './open_rpc/method/extract_request_method_names.ts';
import type { ExtractNotificationMethodNames } from './open_rpc/method/extract_notification_method_names.ts';
import { validatedOpenRpcDocument, type ValidatedOpenRpcDocument } from './open_rpc/validated_open_rpc_document.ts';
import { CustomEventTarget, type CustomEventListenerOrCustomEventListenerObject } from './custom_event_target.ts';


/**
 * Options for the JsonRpcClient.
 */
interface JsonRpcClientOptions {
  token? : string
}

/**
 * @template Schema OpenRPC document schema
 */
export class JsonRpcClient<Schema extends OpenRpcDocument> extends CustomEventTarget {
  private readonly ws : WebSocket;
  private readonly schema : Schema;
  private requestId : number = 0;
  
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
      console.log('Client connected');
    });

    this.ws.addEventListener("close", () => {
      console.log('Client disconnected');
      
    });

    this.ws.addEventListener("error", (event) => {
      console.log('Client error:', event)
    });

    this.ws.addEventListener("message", (event) => {
      this.handleMessage(event)
    });
  }
  private handleMessage(event : MessageEvent) : void {
    console.log(event.data);
  }

  public call<
    MethodName extends ExtractRequestMethodNames<Schema>,
    Method extends ExtractMethod<Schema, MethodName>
  >(
    method : MethodName,
    ...params : ExtractParams<Schema, Method>
  ) : Promise<ExtractResult<Schema, Method>> {
    console.log(method, ...params);
    
    return new Promise(() => {})
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
