import type { OpenRpcDocument } from '../open_rpc_document.ts';
import type { ExtractMethodNames } from './extract_method_names.ts';


/**
 * Extracts all method names from an OpenRPC schema as a union type that don't have a result entry.
 * 
 * @template Schema OpenRPC document schema
 */
export type ExtractNotificationMethodNames<Schema extends OpenRpcDocument> = ExtractMethodNames<Schema> extends infer MethodNames
  ? MethodNames extends string
    ? MethodNames extends ExtractMethodNames<Schema, { result: unknown }>
      ? never
      : MethodNames
    : never
  : never;

