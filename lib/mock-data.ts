import type { Announcement, Asset, Employee, EmployeeRequest, InventoryItem, Ticket } from '@/lib/types';

// OfficeOS now reads live data from Firebase. These empty exports remain only to avoid legacy import breakage if you add older components back later.
export const employees: Employee[] = [];
export const employeeRequests: EmployeeRequest[] = [];
export const assets: Asset[] = [];
export const inventoryItems: InventoryItem[] = [];
export const tickets: Ticket[] = [];
export const announcements: Announcement[] = [];
export const currentEmployee: Employee = {
  id: '', uid: '', name: '', email: '', department: '', title: '', role: 'employee', status: 'pending', location: '', joinedAt: ''
};
export const dashboardStats = { activeEmployees: 0, pendingRequests: 0, assignedAssets: 0, openTickets: 0, lowStockItems: 0 };
