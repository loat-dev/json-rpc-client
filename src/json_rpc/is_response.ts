import type { ExtractRequestMethodNames } from '../open_rpc/method/index.ts';
import type { OpenRpcDocument } from '../open_rpc/open_rpc_document.ts';
import type { IncomingMessage } from './incoming_message.ts';
import type { ResponseObject } from './json_rpc_object.ts';


/**
 * Type guard to check if an incoming message is a response.
 * 
 * @param data Incoming message to check
 * @returns True if the message is a response (has id field)
 */
export function isResponse<Schema extends OpenRpcDocument>(
  data : IncomingMessage<Schema>
) : data is ResponseObject<Schema, ExtractRequestMethodNames<Schema>> {
  return 'id' in data;
}
