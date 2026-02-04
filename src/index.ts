import schema from '../example_schemas/json_rpc_api_schema.ts';
import { JsonRpcClient } from './json_rpc_client.ts';
import { validatedOpenRpcDocument } from './open_rpc/validated_open_rpc_document.ts';


validatedOpenRpcDocument(schema)

const client = new JsonRpcClient('', schema)
 
client.call('minecraft:allowlist')

client.addEventListener('minecraft:notification/allowlist/added', (event) => {

})
