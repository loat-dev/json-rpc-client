import type {ResolveRef} from './resolve_ref.ts';
import type {$Ref, OpenRpcDocument} from './spec.ts';

/**
 * Maps JSON Schema type strings to TypeScript types.
 */
type JsonSchemaTypeMap = {
  string : string;
  integer : number;
  number : number;
  boolean : boolean;
  null : null;
};

/**
 * Resolves a JSON Schema type string to its TypeScript equivalent.
 */
type ResolveJsonSchemaType<Type extends string> = Type extends keyof JsonSchemaTypeMap
  ? JsonSchemaTypeMap[Type]
  : never;

/**
 * Recursively resolves a JSON Schema type definition to its TypeScript equivalent.
 * Handles $ref resolution, primitives, arrays, objects, enums, and union types.
 * 
 * @template Schema The OpenRPC document schema
 * @template TypeDef The type definition to resolve
 * 
 * @example
 * ```ts
 * type PlayerType = ResolveMethodType<Schema, { $ref: "#/components/schemas/player" }>
 * type StringArray = ResolveMethodType<Schema, { type: "array", items: { type: "string" } }>
 * ```
 */
export type ResolveMethodType<
  Schema extends OpenRpcDocument,
  TypeDef
> = 
  // Handle $ref - delegate to ResolveRef and recurse
  TypeDef extends {$ref: infer Ref extends $Ref }
    ? ResolveMethodType<Schema, ResolveRef<Schema, Ref>>
    // Handle string with enum
    : TypeDef extends {type : "string", enum : ReadonlyArray<infer EnumItem> }
      ? EnumItem
      // Handle string
      : TypeDef extends {type : "string" }
        ? string
        // Handle integer/number
        : TypeDef extends {type : "integer" | "number"}
          ? number
          // Handle boolean
          : TypeDef extends {type: "boolean"}
            ? boolean
            // Handle null
            : TypeDef extends {type: "null"}
              ? null
              // Handle array
              : TypeDef extends {type : "array", items: infer Items}
                ? Array<ResolveMethodType<Schema, Items>>
                // Handle union types (e.g., type: ["boolean", "integer"])
                : TypeDef extends {type : readonly (infer UnionTypes extends string)[]}
                  ? ResolveJsonSchemaType<UnionTypes>
                  // Handle object with properties
                  : TypeDef extends {type : "object", properties : infer Properties}
                    ? {[Key in keyof Properties]? : ResolveMethodType<Schema, Properties[Key]>}
                    // Fallback for unknown types
                    : unknown;
