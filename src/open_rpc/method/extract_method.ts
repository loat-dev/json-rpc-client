import type { ExtractMethodNames } from './extract_method_names.ts';
import type { OpenRpcDocument } from '../open_rpc_document.ts';

/**
 * Extracts a specific method object by name from an OpenRPC schema.
 * 
 * @template Schema OpenRPC document schema
 * @template MethodName Name of the method to extract (must be a valid method name)
 * 
 * @example
 * ```
 * type Method1 = ExtractMethod<Schema, "method1">
 * ```
 */
export type ExtractMethod<
  Schema extends OpenRpcDocument,
  MethodName extends ExtractMethodNames<Schema>
> = Schema extends { methods : readonly (infer MethodsArray)[] }
  ? Extract<MethodsArray, { name : MethodName }>
  : never;
