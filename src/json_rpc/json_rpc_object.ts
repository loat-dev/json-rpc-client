// deno-lint-ignore-file no-explicit-any
import type { ExtractMethod } from '../open_rpc/method/extract_method.ts';
import type { ExtractNotificationMethodNames } from '../open_rpc/method/extract_notification_method_names.ts';
import type { ExtractRequestMethodNames } from '../open_rpc/method/extract_request_method_names.ts';
import type { ExtractParams } from '../open_rpc/method/params/extract_params.ts';
import type { OpenRpcDocument } from '../open_rpc/open_rpc_document.ts';


export interface JsonRpcObject {
  /**
   * A String specifying the version of the JSON-RPC protocol. MUST be exactly "2.0".
   */
  readonly jsonrpc : '2.0'
}

/**
 * https://jsonrpc.org/specification#request_object
 */
export interface RequestObject<
  Schema extends OpenRpcDocument,
  MethodName extends ExtractRequestMethodNames<Schema>
> extends JsonRpcObject {
  /**
   * A String containing the name of the method to be invoked.
   * Method names that begin with the word rpc followed by a period character (U+002E or ASCII 46)
   * are reserved for rpc-internal methods and extensions and MUST NOT be used for anything else.
   */
  method : MethodName,
  /**
   * A Structured value that holds the parameter values to be used during the invocation of the method.
   * This member MAY be omitted.
   */
  params? : ExtractParams<Schema, ExtractMethod<Schema, MethodName>>,
  /**
   * An identifier established by the Client that MUST contain a String, Number, or NULL value if included.
   * If it is not included it is assumed to be a notification.
   */
  id : string | number | null
}

/**
 * https://jsonrpc.org/specification#notification
 */
export type NotificationObject<
  Schema extends OpenRpcDocument,
  MethodName extends ExtractNotificationMethodNames<Schema>
> = Omit<RequestObject<Schema, MethodName>, 'id'>

export type ReservedErrorCodes =
  /** Parse error. Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text. */
  | -32700
  /** Invalid Request. The JSON sent is not a valid Request object. */
  | -32600
  /** Method not found. The method does not exist/is not available. */
  | -32601
  /** Invalid params. Invalid method parameter(s). */
  | -32602
  /** Internal error. Internal JSON-RPC error. */
  | -32603

/**
 * https://jsonrpc.org/specification#error_object
 */
export interface ErrorObject {
  /**
   * A Number that indicates the error type that occurred.
   */
  // deno-lint-ignore ban-types
  code : ReservedErrorCodes | (number & {})

  /**
   * A String providing a short description of the error.
   */
  message : string

  /**
   * A Primitive or Structured value that contains additional information about the error.
   */
  data? : any
}

/**
 * https://www.jsonrpc.org/specification#response_object
 */
export interface ResponseObject extends JsonRpcObject {
  /**
   * The value of this member is determined by the method invoked on the Server.
   */
  result : any,

  error : ErrorObject
}
