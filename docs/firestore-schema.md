# OfficeOS Firestore Schema

## users/{uid}
Fields: uid, name, email, department, title, role, status, location, phone, manager, joinedAt, approvedAt, approvedBy, deactivatedAt, deactivatedBy.

Denormalize: name, email, department on tickets/assets where needed for fast reads.

Indexes: role + status, department + status.

## employeeRequests/{requestId}
Fields: name, email, department, roleRequested, reason, status, requestedAt, approvedAt, approvedBy, rejectedAt, rejectedBy.

Indexes: status + requestedAt.

## assets/{assetId}
Fields: name, type, assetId, serialNumber, model, specs, purchaseDate, warrantyEndDate, condition, status, location, assignedEmployeeId, assignedEmployeeName, qrEnabled, invoiceFilePath, warrantyFilePath, createdAt, updatedAt.

Indexes: status + type, assignedEmployeeId + status, warrantyEndDate + status.

## assetAssignments/{assignmentId}
Fields: assetDocId, assetId, assetName, employeeId, employeeName, assignedAt, returnedAt, assignedBy, checkedInBy, notes.

Indexes: employeeId + returnedAt, assetDocId + assignedAt.

## inventoryItems/{itemId}
Fields: name, category, quantity, unit, location, reorderLevel, condition, notes, updatedAt, createdAt, updatedBy.

Indexes: category + location, quantity + reorderLevel cannot fully handle low-stock comparison; use denormalized lowStock boolean if needed.

## tickets/{ticketId}
Fields: subject, category, priority, status, creatorId, creatorUid, creatorName, creatorEmail, createdAt, updatedAt.

Subcollection: tickets/{ticketId}/messages/{messageId}
Fields: authorId, authorUid, authorName, authorRole, message, attachmentPath, createdAt.

Indexes: creatorId + updatedAt, status + updatedAt, priority + status.

## announcements/{announcementId}
Fields: title, body, status, audience, department, createdBy, createdByName, createdAt, publishedAt.

Indexes: status + publishedAt, audience + status.

## auditLogs/{auditLogId}
Server-writable only.
Fields: actorId, actorName, action, entityType, entityId, metadata, createdAt.

Indexes: entityType + createdAt, actorId + createdAt.

## notifications/{notificationId}
Fields: userId, title, body, type, read, entityType, entityId, createdAt.

Indexes: userId + read + createdAt.
