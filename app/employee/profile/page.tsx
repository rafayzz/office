import { type LucideIcon, Mail, MapPin, Phone, UserRoundCog } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { getMyProfile } from '@/lib/data/firestore';
import { formatDate, initials } from '@/lib/utils';

export default async function EmployeeProfilePage() {
  const currentEmployee = await getMyProfile();
  return (
    <>
      <PageHeader eyebrow="My account" visual="profile" title="Profile" description="Your own profile details. Employee access is intentionally limited to personal records." />
      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <Card><CardHeader className="items-center text-center"><div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-primary text-2xl font-semibold text-primary-foreground">{initials(currentEmployee.name)}</div><CardTitle>{currentEmployee.name}</CardTitle><CardDescription>{currentEmployee.title}</CardDescription><Badge variant="success">{currentEmployee.status}</Badge></CardHeader></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><UserRoundCog className="h-4 w-4" /> Employee details</CardTitle><CardDescription>Loaded securely from your Firebase users profile.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2"><Detail icon={Mail} label="Email" value={currentEmployee.email} /><Detail icon={Phone} label="Phone" value={currentEmployee.phone || 'Not added'} /><Detail icon={MapPin} label="Location" value={currentEmployee.location} /><Detail icon={UserRoundCog} label="Department" value={currentEmployee.department} /><Detail icon={UserRoundCog} label="Manager" value={currentEmployee.manager || 'Not added'} /><Detail icon={UserRoundCog} label="Joined" value={formatDate(currentEmployee.joinedAt)} /></CardContent></Card>
      </div>
    </>
  );
}
function Detail({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) { return <div className="flex items-center gap-3 rounded-2xl border bg-muted/20 p-4"><div className="rounded-xl bg-muted p-2 text-muted-foreground"><Icon className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">{label}</p><p className="text-sm font-medium">{value}</p></div></div>; }
