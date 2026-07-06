import { z } from 'zod';

export const requestAccessSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  department: z.string().min(2),
  reason: z.string().min(10)
});

export const assetSchema = z.object({
  name: z.string().min(2),
  type: z.string().min(2),
  assetId: z.string().min(3),
  serialNumber: z.string().min(3),
  model: z.string().min(2),
  specs: z.string().nullish(),
  purchaseDate: z.string(),
  warrantyEndDate: z.string(),
  condition: z.enum(['Excellent', 'Good', 'Fair', 'Needs repair']),
  status: z.enum(['Available', 'Assigned', 'Maintenance', 'Retired']),
  location: z.string().min(2),
  assignedEmployeeId: z.string().nullish(),
  qrEnabled: z.boolean().default(false)
});

export const inventorySchema = z.object({
  name: z.string().min(2),
  category: z.string().min(2),
  quantity: z.coerce.number().int().min(0),
  unit: z.string().min(1),
  location: z.string().min(2),
  reorderLevel: z.coerce.number().int().min(0),
  condition: z.enum(['New', 'Good', 'Usable', 'Damaged']),
  notes: z.string().nullish()
});

export const ticketSchema = z.object({
  subject: z.string().min(4),
  category: z.string().min(2),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  message: z.string().min(10)
});

export const announcementSchema = z.object({
  title: z.string().min(4),
  body: z.string().min(10),
  audience: z.enum(['All employees', 'Admin only', 'Department']),
  status: z.enum(['Draft', 'Published'])
});
