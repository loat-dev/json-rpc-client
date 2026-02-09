import type { ExtractNotificationMethodNames, ExtractRequestMethodNames } from '../open_rpc/method/index.ts';
import type { OpenRpcDocument } from '../open_rpc/open_rpc_document.ts';
import type { NotificationObject, ResponseObject } from './json_rpc_object.ts';

/**
 * Incoming message types from the server.
 * 
 * @template Schema OpenRPC document schema
 */
export type IncomingMessage<Schema extends OpenRpcDocument> =
  | ResponseObject<Schema, ExtractRequestMethodNames<Schema>>
  | NotificationObject<Schema, ExtractNotificationMethodNames<Schema>>;
