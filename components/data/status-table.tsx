import Link from 'next/link';
import { Badge, statusVariant } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Visual } from '@/components/ui/visual';

type Column<T> = {
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
};

export function StatusTable<T extends { id: string }>({
  title,
  rows,
  columns,
  viewHref,
  emptyLabel = 'No records found'
}: {
  title?: string;
  rows: T[];
  columns: Column<T>[];
  viewHref?: (row: T) => string;
  emptyLabel?: string;
}) {
  return (
    <Card className="overflow-hidden">
      {title ? (
        <CardHeader className="border-b border-slate-950/[0.06] bg-white/42">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      ) : null}
      <CardContent className={title ? 'pt-0' : 'p-0'}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.header} className={column.className}>{column.header}</TableHead>
              ))}
              {viewHref ? <TableHead className="text-right">Action</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (viewHref ? 1 : 0)} className="py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-3">
                    <Visual name="empty" alt="No records" size={72} />
                    <span>{emptyLabel}</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} className="transition-colors hover:bg-slate-950/[0.025]">
                  {columns.map((column) => (
                    <TableCell key={column.header} className={column.className}>{column.cell(row)}</TableCell>
                  ))}
                  {viewHref ? (
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm" className="rounded-2xl">
                        <Link href={viewHref(row)}>View</Link>
                      </Button>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function StatusBadge({ value }: { value: string }) {
  return <Badge variant={statusVariant(value)}>{value}</Badge>;
}
