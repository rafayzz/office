export type UserRole = 'admin' | 'employee';
export type UserStatus = 'pending' | 'active' | 'rejected' | 'deactivated';

export type EmployeeRequest = {
  id: string;
  uid?: string;
  name: string;
  email: string;
  department: string;
  roleRequested: UserRole;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
};

export type Employee = {
  id: string;
  uid: string;
  name: string;
  email: string;
  department: string;
  title: string;
  role: UserRole;
  status: UserStatus;
  location: string;
  joinedAt: string;
  phone?: string;
  manager?: string;
};

export type AssetCondition = 'Excellent' | 'Good' | 'Fair' | 'Needs repair';
export type AssetStatus = 'Available' | 'Assigned' | 'Maintenance' | 'Retired';

export type AssetAssignment = {
  id: string;
  employeeId: string;
  employeeName: string;
  assignedAt: string;
  returnedAt?: string;
  notes?: string;
};

export type Asset = {
  id: string;
  name: string;
  type: string;
  assetId: string;
  serialNumber: string;
  model: string;
  specs: string;
  purchaseDate: string;
  warrantyEndDate: string;
  condition: AssetCondition;
  status: AssetStatus;
  location: string;
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
  assignmentHistory: AssetAssignment[];
  qrEnabled: boolean;
  invoiceFilePath?: string;
  invoiceFileName?: string;
  warrantyFilePath?: string;
  warrantyFileName?: string;
};

export type InventoryCondition = 'New' | 'Good' | 'Usable' | 'Damaged';

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  location: string;
  reorderLevel: number;
  condition: InventoryCondition;
  notes?: string;
  updatedAt: string;
};

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TicketStatus = 'Open' | 'In review' | 'Waiting employee' | 'Resolved' | 'Closed';

export type TicketMessage = {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  message: string;
  createdAt: string;
  attachmentPath?: string;
  attachmentName?: string;
};

export type Ticket = {
  id: string;
  subject: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  creatorId: string;
  creatorName: string;
  creatorEmail: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  status: 'Draft' | 'Published';
  audience: 'All employees' | 'Admin only' | 'Department';
  department?: string;
  createdByName: string;
  createdAt: string;
  publishedAt?: string;
};

export type AuditLog = {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
};


export type WorkspaceSettings = {
  id: 'workspace';
  companyName: string;
  defaultLocation: string;
  timezone: string;
  lowStockNotifications: 'enabled' | 'disabled';
  defaultSignupStatus: 'pending';
  defaultApprovedRole: 'employee';
  rejectedUserRedirect: string;
  updatedAt?: string;
};
