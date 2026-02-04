import type { ResolveMethodType } from '../method/resolve_method_types.ts';
import type { MethodOrReference, OpenRpcDocument } from '../open_rpc_document.ts';

/**
 * Extracts and resolves the result type for a method.
 * Returns void if no result is defined.
 * 
 * @template Schema OpenRPC document schema
 * @template Method Method object to extract the result from
 * 
 * @example
 * ```
 * type Method1Result = ExtractResult<Schema, Method1>
 * // => { name: string, id: string }[]
 * ```
 */
export type ExtractResult<
  Schema extends OpenRpcDocument,
  Method extends MethodOrReference
> = Method extends { result : { schema : infer SchemaValue } }
  ? ResolveMethodType<Schema, SchemaValue>
  : void;
