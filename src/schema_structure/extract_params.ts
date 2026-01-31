import { MethodObject } from './open_rpc_schema.ts';
import type { ResolveSchema } from './resolve_schema.ts';

export type ExtractParams<
  Schema,
  Method
> = Method extends {params : infer Params extends readonly unknown[]}
  ? { 
    [Item in keyof Params] : Params[Item] extends {schema : infer SchemaValue, required : true}
      ? ResolveSchema<Schema, SchemaValue>
      : Params[Item] extends {schema : infer SchemaValue}
        ? ResolveSchema<Schema, SchemaValue> | undefined
        : never
  }
  : [];

// export type ExtractParams<
//   Schema,
//   Method
// > = Method extends MethodObject<string, infer Params>
//   ? { 
//     [Item in keyof Params] : Params[Item] extends {schema : infer SchemaValue, required : true}
//       ? ResolveSchema<Schema, SchemaValue>
//       : Params[Item] extends {schema : infer SchemaValue}
//         ? ResolveSchema<Schema, SchemaValue> | undefined
//         : never
//   }
//   : [];
