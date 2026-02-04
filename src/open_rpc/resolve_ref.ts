import type { OpenRpcDocument } from './spec.ts';

/**
 * Resolves a JSON Schema $ref string to its actual type definition.
 * Supports references to any component type in the OpenRPC schema.
 * 
 * @template Schema The OpenRPC document schema
 * @template Ref The $ref string to resolve (e.g., "#/components/schemas/player")
 * 
 * @example
 * ```ts
 * type PlayerRef = ResolveRef<Schema, "#/components/schemas/player">
 * ```
 */
export type ResolveRef<
  Schema extends OpenRpcDocument,
  Ref extends string
> = Ref extends `#/components/${infer ComponentType}/${infer ComponentName}`
  ? ComponentType extends keyof NonNullable<Schema['components']>
    ? NonNullable<Schema['components']>[ComponentType] extends infer Components
      ? ComponentName extends keyof Components
        ? Components[ComponentName]
        : never
      : never
    : never
  : never;
