import type { ExtractMethod, ExtractRequestMethodNames } from '../open_rpc/method/index.ts';
import type { OpenRpcDocument } from '../open_rpc/open_rpc_document.ts';
import type { ExtractResult } from '../open_rpc/result/extract_result.ts';
import type { ErrorObject } from './json_rpc_object.ts';


/**
 * Structure to track pending requests.
 * 
 * @template Schema OpenRPC document schema
 * @template MethodName Name of the request method
 */
export interface PendingRequest<
  Schema extends OpenRpcDocument,
  MethodName extends ExtractRequestMethodNames<Schema>
> {
  resolve : (value : ExtractResult<Schema, ExtractMethod<Schema, MethodName>>) => void;
  reject : (error : ErrorObject) => void;
}
