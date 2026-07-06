export function assetDocumentPath(assetId: string, fileName: string) {
  return `assets/${assetId}/${safeFileName(fileName)}`;
}

export function ticketAttachmentPath(ticketId: string, ownerId: string, fileName: string) {
  return `tickets/${ticketId}/${ownerId}/${safeFileName(fileName)}`;
}

function safeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
}
