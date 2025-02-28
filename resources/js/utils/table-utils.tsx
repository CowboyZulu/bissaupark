import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Edit, Trash2, MapPin, Pencil, Eye } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Switch } from "@/components/ui/switch";
import { Trash } from "lucide-react";
import { Street, ViolationType, Zone } from "@/types/vehicle";
import { Role } from "@/types/user";
import { Checkbox } from "@/components/ui/checkbox";
import { type User } from '@/types/user';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { type Vehicle } from '@/types/vehicle';
import { format } from 'date-fns';
import { type Driver } from '@/types/vehicle';

// Helper function to format currency
export const formatCurrency = (amount: number, currency: string = "XOF") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

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

// Create a status badge cell
export function createStatusBadgeCell() {
  return ({ row }: { row: any }) => (
    <Badge variant={row.original.is_active ? "default" : "destructive"}>
      {row.original.is_active ? "Active" : "Inactive"}
    </Badge>
  );
}

// Create an actions cell with edit and delete buttons
export function createActionsCell<T extends { id: number }>(
  editRoute: string,
  onDelete: (id: number) => void,
  isDeleting: boolean
) {
  return ({ row }: { row: any }) => {
    const item = row.original as T;
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={route(editRoute, item.id)}>
            <Edit className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(item.id)}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  };
}

// Create a currency cell
export function createCurrencyCell(key: string, currency: string = "XOF") {
  return ({ row }: { row: any }) => formatCurrency(row.getValue(key), currency);
}

// Create a relation name cell (e.g., zone.name, vehicleCategory.name)
export function createRelationNameCell(path: string, fallback: string = "N/A") {
  return ({ row }: { row: any }) => {
    const parts = path.split(".");
    let value = row.original;
    
    for (const part of parts) {
      value = value?.[part];
      if (value === undefined || value === null) {
        return fallback;
      }
    }
    
    return value;
  };
}

// Create a badge cell for boolean values
export function createBooleanBadgeCell(key: string, trueLabel: string = "Yes", falseLabel: string = "No") {
  return ({ row }: { row: any }) => (
    row.getValue(key) ? (
      <Badge variant="secondary">{trueLabel}</Badge>
    ) : (
      <Badge variant="outline">{falseLabel}</Badge>
    )
  );
}

// Create columns for ParkingRates table
export function createParkingRateColumns(
  handleDelete: (id: number) => void,
  isDeleting: boolean
): ColumnDef<any, any>[] {
  return [
    {
      accessorKey: "zone.name",
      header: createSortableHeader("Zone"),
      cell: createRelationNameCell("zone.name"),
    },
    {
      accessorKey: "vehicleCategory.name",
      header: createSortableHeader("Vehicle Category"),
      cell: createRelationNameCell("vehicleCategory.name"),
    },
    {
      accessorKey: "rate_type",
      header: createSortableHeader("Rate Type"),
      cell: ({ row }) => {
        const rateType = row.getValue("rate_type");
        let label = "Unknown";
        
        switch (rateType) {
          case "hourly":
            label = "Hourly";
            break;
          case "daily":
            label = "Daily";
            break;
          case "monthly":
            label = "Monthly";
            break;
          default:
            label = String(rateType);
        }
        
        return <Badge variant="outline">{label}</Badge>;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "amount",
      header: createSortableHeader("Amount"),
      cell: createCurrencyCell("amount"),
    },
    {
      accessorKey: "time_range",
      header: "Time Range",
      cell: ({ row }) => {
        const rate = row.original;
        return rate.rate_type === "hourly" && rate.start_time && rate.end_time
          ? `${rate.start_time} - ${rate.end_time}`
          : "N/A";
      },
    },
    {
      accessorKey: "is_weekend_rate",
      header: createSortableHeader("Weekend"),
      cell: createBooleanBadgeCell("is_weekend_rate"),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id) ? "Yes" : "No");
      },
    },
    {
      accessorKey: "is_holiday_rate",
      header: createSortableHeader("Holiday"),
      cell: createBooleanBadgeCell("is_holiday_rate"),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id) ? "Yes" : "No");
      },
    },
    {
      accessorKey: "is_active",
      header: createSortableHeader("Status"),
      cell: createStatusBadgeCell(),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id) ? "Active" : "Inactive");
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: createActionsCell("parking-rates.edit", handleDelete, isDeleting),
    },
  ];
}

// Create columns for TowingRates table
export function createTowingRateColumns(
  handleDelete: (id: number) => void,
  isDeleting: boolean
): ColumnDef<any, any>[] {
  return [
    {
      accessorKey: "zone.name",
      header: createSortableHeader("Zone"),
      cell: createRelationNameCell("zone.name"),
    },
    {
      accessorKey: "vehicleCategory.name",
      header: createSortableHeader("Vehicle Category"),
      cell: createRelationNameCell("vehicleCategory.name"),
    },
    {
      accessorKey: "service_fee",
      header: createSortableHeader("Service Fee"),
      cell: createCurrencyCell("service_fee"),
    },
    {
      accessorKey: "fine_amount",
      header: createSortableHeader("Fine Amount"),
      cell: createCurrencyCell("fine_amount"),
    },
    {
      accessorKey: "daily_storage_fee",
      header: createSortableHeader("Daily Storage Fee"),
      cell: createCurrencyCell("daily_storage_fee"),
    },
    {
      accessorKey: "is_active",
      header: createSortableHeader("Status"),
      cell: createStatusBadgeCell(),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id) ? "Active" : "Inactive");
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: createActionsCell("towing-rates.edit", handleDelete, isDeleting),
    },
  ];
}

// Create columns for FineRates table
export function createFineRateColumns(
  handleDelete: (id: number) => void,
  isDeleting: boolean
): ColumnDef<any, any>[] {
  return [
    {
      accessorKey: "zone.name",
      header: createSortableHeader("Zone"),
      cell: createRelationNameCell("zone.name"),
    },
    {
      accessorKey: "vehicleCategory.name",
      header: createSortableHeader("Vehicle Category"),
      cell: createRelationNameCell("vehicleCategory.name"),
    },
    {
      accessorKey: "violationType.name",
      header: createSortableHeader("Violation Type"),
      cell: createRelationNameCell("violationType.name"),
    },
    {
      accessorKey: "amount",
      header: createSortableHeader("Amount"),
      cell: createCurrencyCell("amount"),
    },
    {
      accessorKey: "is_active",
      header: createSortableHeader("Status"),
      cell: createStatusBadgeCell(),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id) ? "Active" : "Inactive");
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: createActionsCell("fine-rates.edit", handleDelete, isDeleting),
    },
  ];
}

export function createClampingRateColumns(
  handleDelete: (id: number) => void,
  isDeleting: boolean
): ColumnDef<any, any>[] {
  return [
    {
      accessorKey: "vehicleCategory.name",
      header: createSortableHeader("Vehicle Category"),
      cell: createRelationNameCell("vehicleCategory.name"),
    },
    {
      accessorKey: "amount",
      header: createSortableHeader("Amount"),
      cell: createCurrencyCell("amount"),
    },
    {
      accessorKey: "is_active",
      header: createSortableHeader("Status"),
      cell: createStatusBadgeCell(),
      filterFn: (row, id, value) => {
        return value === undefined || row.getValue(id) === value;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: createActionsCell("clamping-rates.edit", handleDelete, isDeleting),
    },
  ];
}

export function createVehicleCategoryColumns(
  onDelete: (id: number) => void
): ColumnDef<any, any>[] {
  return [
    {
      accessorKey: "name",
      header: createSortableHeader("Name"),
      cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "description",
      header: createSortableHeader("Description"),
      cell: ({ row }) => <div>{row.getValue("description") || "-"}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href={route("vehicle-categories.edit", category.id)}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={() => onDelete(category.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
}

export function createStreetColumns(
    onToggleStatus: (street: Street) => void,
    onDelete: (id: number) => void,
    isProcessing: (id: number) => boolean
) {
    return [
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }: { row: any }) => {
                const type = row.getValue("type") as string;
                return (
                    <span className={`inline-block px-2 py-1 rounded text-xs ${type === 'main' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {type === 'main' ? 'Main' : 'Cross'}
                    </span>
                );
            },
        },
        {
            accessorKey: "name",
            header: createSortableHeader("Name"),
        },
        {
            accessorKey: "code",
            header: createSortableHeader("Code"),
        },
        {
            accessorKey: "zone.name",
            header: createSortableHeader("Zone"),
            cell: ({ row }: { row: any }) => createRelationNameCell(row.original, "zone"),
        },
        {
            accessorKey: "is_active",
            header: createSortableHeader("Status"),
            cell: ({ row }: { row: any }) => {
                const street = row.original as Street;
                return (
                    <Switch
                        checked={street.is_active}
                        onCheckedChange={() => onToggleStatus(street)}
                        disabled={isProcessing(street.id)}
                    />
                );
            },
            filterFn: (row: any, id: string, value: string) => {
                if (value === "all") return true;
                return value === "active" ? row.getValue(id) : !row.getValue(id);
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: { row: any }) => {
                const street = row.original as Street;
                return (
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('streets.show', street.id)}>
                                <MapPin className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('streets.edit', street.id)}>
                                <Edit className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(street.id)}
                            disabled={isProcessing(street.id)}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];
}

export function createRoleColumns(
    onDelete: (id: number) => void
) {
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
                const role = row.original as Role;
                return createActionsCell(
                    route('roles.edit', role.id),
                    () => onDelete(role.id),
                    false
                );
            },
        },
    ];
}

export function createViolationTypeColumns(
    onToggleStatus: (violationType: ViolationType) => void,
    onDelete: (id: number) => void,
    isProcessing: (id: number) => boolean
) {
    return [
        {
            accessorKey: "name",
            header: createSortableHeader("Name"),
        },
        {
            accessorKey: "code",
            header: createSortableHeader("Code"),
        },
        {
            accessorKey: "is_active",
            header: createSortableHeader("Status"),
            cell: ({ row }: { row: any }) => {
                const violationType = row.original as ViolationType;
                return (
                    <Switch
                        checked={violationType.is_active}
                        onCheckedChange={() => onToggleStatus(violationType)}
                        disabled={isProcessing(violationType.id)}
                    />
                );
            },
            filterFn: (row: any, id: string, value: string) => {
                if (value === "all") return true;
                return value === "active" ? row.getValue(id) : !row.getValue(id);
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: { row: any }) => {
                const violationType = row.original as ViolationType;
                return (
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('violation-types.edit', violationType.id)}>
                                <Edit className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(violationType.id)}
                            disabled={isProcessing(violationType.id)}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];
}

export function createZoneColumns(
    onToggleStatus: (zone: Zone) => void,
    onDelete: (id: number) => void,
    isProcessing: (id: number) => boolean
) {
    return [
        {
            accessorKey: "name",
            header: createSortableHeader("Name"),
        },
        {
            accessorKey: "code",
            header: createSortableHeader("Code"),
        },
        {
            accessorKey: "is_active",
            header: createSortableHeader("Status"),
            cell: ({ row }: { row: any }) => {
                const zone = row.original as Zone;
                return (
                    <Switch
                        checked={zone.is_active}
                        onCheckedChange={() => onToggleStatus(zone)}
                        disabled={isProcessing(zone.id)}
                    />
                );
            },
            filterFn: (row: any, id: string, value: string) => {
                if (value === "all") return true;
                return value === "active" ? row.getValue(id) : !row.getValue(id);
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: { row: any }) => {
                const zone = row.original as Zone;
                return (
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('zones.edit', zone.id)}>
                                <Edit className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(zone.id)}
                            disabled={isProcessing(zone.id)}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];
}

export function createUserColumns(onDelete: (id: number) => void) {
  return [
    {
      id: "select",
      header: ({ table }: any) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }: any) => (
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
      accessorKey: "name",
      header: "Name",
      cell: ({ row }: any) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }: any) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "roles",
      header: "Roles",
      cell: ({ row }: any) => {
        const roles = row.original.roles;
        return (
          <div className="flex gap-1">
            {roles.map((role: any) => (
              <span key={role.id} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                {role.name}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={route('users.edit', user.id)}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(user.id)} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

export function createVehicleColumns(onDelete: (id: number) => void) {
  return [
    {
      accessorKey: 'plate_number',
      header: "Plate Number",
      cell: ({ row }: any) => <div>{row.getValue('plate_number')}</div>,
    },
    {
      accessorKey: 'category.name',
      header: "Category",
      cell: ({ row }: any) => <div>{row.original.category?.name || '-'}</div>,
    },
    {
      accessorKey: 'make',
      header: "Make",
      cell: ({ row }: any) => <div>{row.getValue('make')}</div>,
    },
    {
      accessorKey: 'model',
      header: "Model",
      cell: ({ row }: any) => <div>{row.getValue('model')}</div>,
    },
    {
      accessorKey: 'color',
      header: "Color",
      cell: ({ row }: any) => <div>{row.getValue('color')}</div>,
    },
    {
      accessorKey: 'driver.full_name',
      header: "Driver",
      cell: ({ row }: any) => <div>{row.original.driver?.full_name || '-'}</div>,
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const vehicle = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={route('vehicles.edit', vehicle.id)}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(vehicle.id)} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

export function createParkingSpaceColumns(onDelete: (id: number) => void) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'parallel':
        return 'Parallel';
      case 'perpendicular':
        return 'Perpendicular';
      case 'angled':
        return 'Angled';
      default:
        return type;
    }
  };

  return [
    {
      accessorKey: "space_number",
      header: "Space Number",
      cell: ({ row }: any) => <div className="font-medium">{row.getValue("space_number")}</div>,
    },
    {
      accessorKey: "street.name",
      header: "Street",
      cell: ({ row }: any) => <div>{row.original.street?.name || '-'}</div>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }: any) => (
        <Badge variant="outline">{getTypeLabel(row.getValue("type"))}</Badge>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }: any) => (
        row.getValue("is_active") ? (
          <Badge className="bg-green-500">Active</Badge>
        ) : (
          <Badge variant="destructive">Inactive</Badge>
        )
      ),
    },
    {
      id: "special",
      header: "Special",
      cell: ({ row }: any) => (
        <div>
          {row.original.is_handicap && (
            <Badge className="mr-1 bg-blue-500">Handicap</Badge>
          )}
          {row.original.is_loading_zone && (
            <Badge className="bg-yellow-500">Loading</Badge>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }: any) => {
        const parkingSpace = row.original;

        return (
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" asChild>
              <Link href={route('parking-spaces.show', parkingSpace.id)}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" asChild>
              <Link href={route('parking-spaces.edit', parkingSpace.id)}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => onDelete(parkingSpace.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
}

export function createDriverColumns(onDelete: (id: number) => void) {
  return [
    {
      accessorKey: 'license_number',
      header: "License Number",
      cell: ({ row }: any) => <div>{row.getValue('license_number')}</div>,
    },
    {
      accessorKey: 'first_name',
      header: "First Name",
      cell: ({ row }: any) => <div>{row.getValue('first_name')}</div>,
    },
    {
      accessorKey: 'last_name',
      header: "Last Name",
      cell: ({ row }: any) => <div>{row.getValue('last_name')}</div>,
    },
    {
      accessorKey: 'phone',
      header: "Phone",
      cell: ({ row }: any) => <div>{row.getValue('phone') || '-'}</div>,
    },
    {
      accessorKey: 'email',
      header: "Email",
      cell: ({ row }: any) => <div>{row.getValue('email') || '-'}</div>,
    },
    {
      accessorKey: 'license_expiry',
      header: "License Expiry",
      cell: ({ row }: any) => <div>{format(new Date(row.getValue('license_expiry')), 'dd/MM/yyyy')}</div>,
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const driver = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={route('drivers.edit', driver.id)}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(driver.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
} 