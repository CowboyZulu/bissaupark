import React, { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuCheckboxItem, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter, Plus } from "lucide-react";
import { Link } from "@inertiajs/react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  createRoute?: string;
  createButtonLabel?: string;
  pagination?: {
    pageCount: number;
    pageIndex: number;
    pageSize: number;
    total: number;
    from: number;
    to: number;
    links?: any[];
    onPageChange?: (page: number) => void;
  };
  statusOptions?: {
    key: string;
    options: { label: string; value: string | null }[];
  };
  emptyMessage?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  createRoute,
  createButtonLabel = "Create",
  pagination,
  statusOptions,
  emptyMessage = "No results found",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (searchKey) {
      table.getColumn(searchKey)?.setFilterValue(value);
    }
  };

  // Handle status filter
  const handleStatusFilter = (value: string | null) => {
    if (statusOptions?.key) {
      if (value && value !== "all") {
        table.getColumn(statusOptions.key)?.setFilterValue(value === "Active");
      } else {
        table.getColumn(statusOptions.key)?.setFilterValue(undefined);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {searchKey && (
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(event) => handleSearch(event.target.value)}
              className="max-w-sm"
            />
          )}
          
          {statusOptions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {statusOptions.options.map((option) => (
                  <React.Fragment key={option.label}>
                    <DropdownMenuItem onClick={() => handleStatusFilter(option.value)}>
                      {option.label}
                    </DropdownMenuItem>
                    {option.label === "All" && <DropdownMenuSeparator />}
                  </React.Fragment>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ChevronDown className="h-4 w-4 mr-2" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {createRoute && (
          <Button asChild>
            <Link href={createRoute}>
              <Plus className="mr-2 h-4 w-4" />
              {createButtonLabel}
            </Link>
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total} entries
          </div>
          <div className="flex items-center gap-2">
            {pagination.links?.map((link, index) => (
              <Button
                key={index}
                variant={link.active ? "default" : "outline"}
                disabled={!link.url || link.active}
                onClick={() => pagination.onPageChange && pagination.onPageChange(link.label)}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 