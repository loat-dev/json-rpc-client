import schema from '../example_schemas/json_rpc_api_schema.ts';
import { Client } from './client.ts';
import { validatedOpenRpcDocument } from './open_rpc/validated_open_rpc_document.ts';


validatedOpenRpcDocument(schema)

const client = new Client('', schema)
 
client.call('minecraft:server/status').then((response) => {response.players})

client.addEventListener('minecraft:notification/allowlist/added', (event) => {
  event.detail.forEach((player) => {
    player
  })
})
