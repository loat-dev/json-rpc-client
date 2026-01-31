import type { ArrayType, BooleanType, EnumType, IntegerType, NullType, ObjectType, RefType, StringType, UnionArrayType } from './open_rpc_schema.ts';
import type { ResolveRef } from './resolve_ref.ts';


// type ResolveSchema<
//   Schema,
//   Value
// > = Value extends {$ref: infer Ref extends string}
//   ? ResolveSchema<Schema, ResolveRef<Schema, Ref>>
//   : Value extends {type: "string", enum: ReadonlyArray<infer EnumItem>}
//     ? EnumItem
//     : Value extends {type: "string"}
//       ? string
//       : Value extends {type: "integer" | "number"}
//         ? number
//         : Value extends {type: "boolean"}
//           ? boolean
//           : Value extends {type: "null"}
//             ? null
//             : Value extends {type: "array", items: infer Items}
//               ? Array<ResolveSchema<Schema, Items>>
//               : Value extends {type: readonly ["boolean", "integer"] | readonly ["integer", "boolean"]}
//                 ? boolean | number
//                 : Value extends { type: "object"; properties: infer Properties }
//                   ? {[Key in keyof Properties]: ResolveSchema<Schema, Properties[Key]>}
//                   : unknown;

export type ResolveSchema<
  Schema,
  Value
> = Value extends RefType<infer Ref>
  ? ResolveSchema<Schema, ResolveRef<Schema, Ref>>
  : Value extends EnumType<infer EnumItem>
    ? EnumItem
    : Value extends StringType
      ? string
      : Value extends IntegerType
        ? number
        : Value extends BooleanType
          ? boolean
          : Value extends NullType
            ? null
            : Value extends ArrayType<infer Items>
              ? Array<ResolveSchema<Schema, Items>>
              : Value extends UnionArrayType<BooleanType | IntegerType>
                ? boolean | number
                : Value extends ObjectType<infer Properties>
                  ? {[Key in keyof Properties]?: ResolveSchema<Schema, Properties[Key]>}
                  : unknown;
