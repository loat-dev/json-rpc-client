import type { ResolveMethodType } from '../method/resolve_method_types.ts';
import type { MethodOrReference, OpenRpcDocument } from '../open_rpc_document.ts';

/**
 * Extracts and resolves parameter types for a method.
 * Handles required vs optional parameters correctly.
 * 
 * @template Schema OpenRPC document schema
 * @template Method Method object to extract parameters from
 * 
 * @example
 * ```
 * type Params = ExtractParams<Schema, Method1>
 * // => [{ name: string, id: string }[]]
 * ```
 */
export type ExtractParams<
  Schema extends OpenRpcDocument,
  Method extends MethodOrReference
> = Method extends { params : infer Params extends readonly unknown[] }
  ? {
      [Index in keyof Params] : Params[Index] extends { schema : infer SchemaValue, required : true }
        ? ResolveMethodType<Schema, SchemaValue>
        : Params[Index] extends { schema : infer SchemaValue }
          ? ResolveMethodType<Schema, SchemaValue> | undefined
          : never
    }
  : [];
