// deno-lint-ignore-file no-explicit-any

import type {OpenRPCDocument} from './spec.ts';

/**
 * The OpenRPC Specification defines a standard, programming language-agnostic interface description for JSON-RPC 2.0 APIs.
 * This file contains annotated TypeScript types based on the OpenRPC meta-schema and the specification document.
 * 
 * Enhanced with compile-time $ref validation using TypeScript generics.
 */

// ============================================================================
// TYPE GENERICS FOR $REF VALIDATION
// ============================================================================

/**
 * Extract component names by type
 */
type ExtractComponentNames<
  Schema extends OpenRPCDocument,
  ComponentType extends string
> = Schema extends {components : infer Components}
  ? Components extends Record<ComponentType, infer ComponentItems>
    ? ComponentItems extends Record<string, any>
      ? keyof ComponentItems & string
      : never
    : never
  : never;

/**
 * Valid $ref string for a given component type
 */
type ValidRefForComponent<
  Schema extends OpenRPCDocument,
  ComponentType extends string
> = `#/components/${ComponentType}/${ExtractComponentNames<Schema, ComponentType>}`;

/**
 * All valid $ref strings for a schema
 */
type ValidRef<Schema extends OpenRPCDocument> = 
  | ValidRefForComponent<Schema, "schemas">
  | ValidRefForComponent<Schema, "contentDescriptors">
  | ValidRefForComponent<Schema, "errors">
  | ValidRefForComponent<Schema, "examples">
  | ValidRefForComponent<Schema, "examplePairings">
  | ValidRefForComponent<Schema, "links">
  | ValidRefForComponent<Schema, "tags">;

/**
 * Check if a $ref is valid
 */
type IsValidRef<
  Schema extends OpenRPCDocument,
  Ref extends string
> = Ref extends ValidRef<Schema>
  ? true
  : false;

/**
 * Recursively collect all invalid $refs from a type
 */
type CollectInvalidRefs<
  Schema extends OpenRPCDocument,
  Value
> = 
  Value extends { $ref: infer Ref }
    ? Ref extends string
      ? IsValidRef<Schema, Ref> extends false
        ? Ref
        : never
      : never
    : Value extends readonly (infer ArrayItem)[]
      ? CollectInvalidRefs<Schema, ArrayItem>
      : Value extends object
        ? {[Key in keyof Value]: CollectInvalidRefs<Schema, Value[Key]>}[keyof Value]
        : never;

/**
 * Check if schema has any invalid refs
 */
type HasInvalidRefs<Schema extends OpenRPCDocument> = [CollectInvalidRefs<Schema, Schema>] extends [never]
  ? false
  : true;

/**
 * Validated OpenRPC Document type
 */
export type ValidatedOpenRPCDocument<Schema extends OpenRPCDocument> = HasInvalidRefs<Schema> extends true
  ? [ 
      'Schema contains invalid $ref(s)',
      CollectInvalidRefs<Schema, Schema>
    ]
  : Schema;

/**
 * Helper function to define and validate an OpenRPC schema at compile-time.
 * TypeScript will show an error if any $ref points to a non-existent component.
 * 
 * Usage:
 * ```typescript
 * export default defineOpenRPCDocument({
 *   openrpc: "1.3.2",
 *   info: { title: "My API", version: "1.0.0" },
 *   components: {
 *     contentDescriptors: {
 *       UserId: { name: "userId", schema: { type: "string" } }
 *     }
 *   },
 *   methods: [{
 *     name: "getUser",
 *     params: [{ $ref: "#/components/contentDescriptors/UserId" }], // Valid
 *     result: { name: "user", schema: { type: "object" } }
 *   }]
 * } as const),
 * ```
 * 
 * @param schema - The OpenRPC schema with 'as const' assertion
 * @returns The validated schema
 */
export function validateDocument<const Schema extends OpenRPCDocument>(
  schema : ValidatedOpenRPCDocument<Schema>
) : ValidatedOpenRPCDocument<Schema> {
  return schema;
}
