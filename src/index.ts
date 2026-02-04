import schema from '../example_schemas/json-rpc-api-schema.ts';
import { JsonRpcClient } from './json_rpc_client.ts';
import { validatedOpenRpcDocument } from './open_rpc/validated_open_rpc_document.ts';


validatedOpenRpcDocument(schema)

new JsonRpcClient('', schema).call('minecraft:allowlist/add', [{name: ''}])
