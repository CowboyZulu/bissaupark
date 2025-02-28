import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Checkbox } from "@/components/ui/checkbox";
import { type Permission } from '@/types/user';

// Create a sortable column header
export function createSortableHeader(label: string) {
  return ({ column }: { column: any }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}

// Create columns for Permissions table
export function createPermissionColumns(
  onDelete: (id: number) => void
): ColumnDef<Permission, any>[] {
  return [
    {
      id: 'select',
      header: ({ table }: { table: any }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }: { row: any }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: createSortableHeader('Name'),
      cell: ({ row }: { row: any }) => <div className="capitalize">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'slug',
      header: createSortableHeader('Slug'),
      cell: ({ row }: { row: any }) => <div>{row.getValue('slug')}</div>,
    },
    {
      accessorKey: 'description',
      header: createSortableHeader('Description'),
      cell: ({ row }: { row: any }) => <div>{row.getValue('description') || '-'}</div>,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: any }) => {
        const permission = row.original as Permission;
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={route('permissions.edit', permission.id)}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(permission.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
} 