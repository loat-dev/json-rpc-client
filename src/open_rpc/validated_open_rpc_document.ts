// deno-lint-ignore-file no-explicit-any

/**
 * Enhancement wrapper function with compile-time $ref validation using TypeScript generics.
 */

import type {OpenRpcDocument} from './spec.ts';


/**
 * Extract component names by type
 */
type ExtractComponentNames<
  Schema extends OpenRpcDocument,
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
  Schema extends OpenRpcDocument,
  ComponentType extends string
> = `#/components/${ComponentType}/${ExtractComponentNames<Schema, ComponentType>}`;

/**
 * All valid $ref strings for a schema
 */
type ValidRef<Schema extends OpenRpcDocument> = 
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
  Schema extends OpenRpcDocument,
  Ref extends string
> = Ref extends ValidRef<Schema>
  ? true
  : false;

/**
 * Recursively collect all invalid $refs from a type
 */
type CollectInvalidRefs<
  Schema extends OpenRpcDocument,
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
type HasInvalidRefs<Schema extends OpenRpcDocument> = [CollectInvalidRefs<Schema, Schema>] extends [never]
  ? false
  : true;

/**
 * Validated OpenRPC Document type
 */
export type ValidatedOpenRPCDocument<Schema extends OpenRpcDocument> = HasInvalidRefs<Schema> extends true
  ? [ 
      'Schema contains invalid $ref(s):',
      CollectInvalidRefs<Schema, Schema>
    ]
  : Schema;

/**
 * Helper function to define and validate an OpenRPC schema at compile-time.
 * TypeScript will show an error if any $ref points to a non-existent component.
 * 
 * @param schema The OpenRPC schema with 'as const' assertion
 * @returns The validated schema
 */
export function validatedOpenRPCDocument<Schema extends OpenRpcDocument>(
  schema : ValidatedOpenRPCDocument<Schema>
) : ValidatedOpenRPCDocument<Schema> {
  return schema;
}
