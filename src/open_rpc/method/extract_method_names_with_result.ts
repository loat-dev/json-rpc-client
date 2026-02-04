import type { MethodObjectName, OpenRpcDocument } from '../open_rpc_document.ts';

/**
 * Extracts all method names from an OpenRPC schema as a union type that have a result entry.
 * 
 * @template Schema OpenRPC document schema
 * 
 * @example
 * ```
 * type Methods = ExtractMethodNames<Schema>
 * // => "method1" | "method2" | ...
 * ```
 */
export type ExtractMethodNames<
  Schema extends OpenRpcDocument,
  Properties extends Record<string, unknown> = Record<string, unknown>
> = Schema extends { methods : readonly (infer Methods)[] }
  ? Methods extends { name : infer MethodName extends MethodObjectName } & Properties
    ? MethodName
    : never
  : never;
