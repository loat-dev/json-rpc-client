import type { ExtractNotificationMethodNames } from '../open_rpc/method/index.ts';
import type { OpenRpcDocument } from '../open_rpc/open_rpc_document.ts';
import type { IncomingMessage } from './incoming_message.ts';
import type { NotificationObject } from './json_rpc_object.ts';

export function isNotification<Schema extends OpenRpcDocument>(
  data : IncomingMessage<Schema>
) : data is NotificationObject<Schema, ExtractNotificationMethodNames<Schema>> {
  return 'method' in data && !('id' in data);
}
