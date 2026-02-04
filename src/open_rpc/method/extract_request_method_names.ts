import type { OpenRpcDocument } from '../open_rpc_document.ts';
import type { ExtractMethodNames } from './extract_method_names.ts';

/**
 * Extracts all method names from an OpenRPC schema as a union type that have a result entry.
 * 
 * @template Schema OpenRPC document schema
 */
export type ExtractRequestMethodNames<Schema extends OpenRpcDocument> = ExtractMethodNames<Schema, { result: unknown }>
