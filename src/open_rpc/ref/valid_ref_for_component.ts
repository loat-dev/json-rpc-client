import type { ExtractComponentNames } from '../component/extract_component_names.ts';
import type { Components, OpenRpcDocument } from '../open_rpc_document.ts';

/**
 * Generates a valid $ref string for a given component type.
 * 
 * @template Schema OpenRPC document schema
 * @template ComponentType Component type (e.g., "schemas", "errors")
 */
export type ValidRefForComponent<
  Schema extends OpenRpcDocument,
  ComponentType extends keyof Components
> = `#/components/${ComponentType}/${ExtractComponentNames<Schema, ComponentType>}`;
