import type { CollectInvalidRefs } from './ref/collect_invalid_refs.ts';
import type { HasInvalidRefs } from './ref/has_invalid_refs.ts';
import type { OpenRpcDocument } from './open_rpc_document.ts';


/**
 * Validated OpenRPC Document type
 */
export type ValidatedOpenRpcDocument<Schema extends OpenRpcDocument> = HasInvalidRefs<Schema> extends true
  ? [ 
      'Schema contains invalid $ref(s):',
      CollectInvalidRefs<Schema>
    ]
  : Schema;

/**
 * Helper function to define and validate an OpenRPC schema.
 * 
 * @param schema OpenRPC schema with 'as const' assertion
 * @returns The validated schema
 */
export function validatedOpenRpcDocument<
  Schema extends OpenRpcDocument
>(schema : ValidatedOpenRpcDocument<Schema>) : Schema {
  return schema as Schema;
}
