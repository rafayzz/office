import type { VisualName } from '@/lib/visuals';

export type NavigationItem = {
  label: string;
  href: string;
  visual: VisualName;
  description?: string;
};

export const adminNavigation: NavigationItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', visual: 'dashboard', description: 'Operational overview' },
  { label: 'Employee Requests', href: '/admin/employee-requests', visual: 'requests', description: 'Approval queue' },
  { label: 'Employees', href: '/admin/employees', visual: 'employees', description: 'Directory and roles' },
  { label: 'Assets', href: '/admin/assets', visual: 'assets', description: 'Trackable equipment' },
  { label: 'Inventory', href: '/admin/inventory', visual: 'inventory', description: 'Quantity-based stock' },
  { label: 'Private Tickets', href: '/admin/tickets', visual: 'tickets', description: 'Confidential cases' },
  { label: 'Announcements', href: '/admin/announcements', visual: 'announcements', description: 'Company updates' },
  { label: 'Reports', href: '/admin/reports', visual: 'reports', description: 'Simple summaries' },
  { label: 'Settings', href: '/admin/settings', visual: 'settings', description: 'Security and workspace' }
];

export const employeeNavigation: NavigationItem[] = [
  { label: 'Dashboard', href: '/employee/dashboard', visual: 'dashboard', description: 'My workspace' },
  { label: 'My Assets', href: '/employee/my-assets', visual: 'assets', description: 'Assigned items' },
  { label: 'My Tickets', href: '/employee/tickets', visual: 'tickets', description: 'Private support' },
  { label: 'Announcements', href: '/employee/announcements', visual: 'announcements', description: 'Published updates' },
  { label: 'Profile', href: '/employee/profile', visual: 'profile', description: 'Personal details' }
];

export const reportsNavigation: NavigationItem[] = [
  { label: 'Employee Summary', href: '/admin/reports#employees', visual: 'employees' },
  { label: 'Asset Summary', href: '/admin/reports#assets', visual: 'assets' },
  { label: 'Inventory Summary', href: '/admin/reports#inventory', visual: 'inventory' },
  { label: 'Ticket Summary', href: '/admin/reports#tickets', visual: 'tickets' }
];
