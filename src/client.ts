import jsonRpcApiSchema from './json-rpc-api-schema.ts';
import { ExtractMethod } from './schema_structure/extract_method.ts';
import { ExtractMethodNames } from './schema_structure/extract_method_names.ts';
import { ExtractResult } from './schema_structure/extract_result.ts';
import { ExtractParams } from './schema_structure/extract_params.ts';
import { OpenRpcSchema } from './schema_structure/open_rpc_schema.ts';

export class Client<Schema extends OpenRpcSchema> {
  private schema: Schema;

  constructor(schema: Schema) {
    this.schema = schema;
  }

  public call<
    Name extends ExtractMethodNames<Schema>,
    Method = ExtractMethod<Schema, Name>
  >(
    method : Name,
    ...params : ExtractParams<Schema, Method>
  ) : Promise<ExtractResult<Schema, Method>> {
    console.log(`Calling ${method}`, params);

    throw new Error("JSON-RPC transport not implemented");
  }
}

const client = new Client(jsonRpcApiSchema)

client.call('minecraft:allowlist/add', [{id: '', name: ''}])
