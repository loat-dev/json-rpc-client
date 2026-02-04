import type { Components, OpenRpcDocument } from '../open_rpc_document.ts';


/**
 * Extracts component names by component type.
 * 
 * @template Schema OpenRPC document schema
 * @template ComponentName Type of component (e.g., "schemas", "errors")
 */
export type ExtractComponentNames<
  Schema extends OpenRpcDocument,
  ComponentName extends keyof Components
> = Schema extends { components: infer Components }
  ? Components extends Record<ComponentName, infer ComponentItems>
    ? ComponentItems extends Record<string, unknown>
      ? keyof ComponentItems & string
      : never
    : never
  : never;
