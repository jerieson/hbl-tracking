import { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { Customer } from '@/types/customer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash2, ChevronDown, ChevronUp, ChevronsUpDown, Search, Mail, Phone, MapPin, Building2, Briefcase, User } from 'lucide-react';

interface DataTableProps {
  data: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: number) => void;
}

export function CustomerDataTable({ data, onEdit, onDelete }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'company_name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-muted p-0 font-semibold"
          >
            Company Name
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('company_name')}</div>
      ),
    },
    {
      accessorKey: 'first_name',
      header: 'Contact Person',
      cell: ({ row }) => {
        const firstName = row.original.first_name;
        const lastName = row.original.last_name;
        const designation = row.original.designation;
        return (
          <div className="space-y-0.5">
            {firstName || lastName ? (
              <div className="text-sm">
                {firstName} {lastName}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">—</div>
            )}
            {designation && (
              <div className="text-xs text-muted-foreground">{designation}</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'email',
      header: 'Contact Info',
      cell: ({ row }) => {
        const email = row.original.email;
        const phone = row.original.contact_number;
        const countryCode = row.original.country_code;
        return (
          <div className="space-y-0.5 text-sm">
            {email ? (
              <div className="truncate max-w-[200px]">{email}</div>
            ) : (
              <div className="text-muted-foreground">—</div>
            )}
            {phone && (
              <div className="text-xs text-muted-foreground">
                {countryCode} {phone}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'business_address',
      header: 'Address',
      cell: ({ row }) => {
        const address = row.getValue('business_address') as string;
        const area = row.original.area;
        return (
          <div className="max-w-[250px]">
            <div className="text-sm truncate">{address}</div>
            {area && <div className="text-xs text-muted-foreground mt-0.5">{area}</div>}
          </div>
        );
      },
    },
    {
      accessorKey: 'nature_of_business',
      header: 'Business Type',
      cell: ({ row }) => {
        const value = row.getValue('nature_of_business') as string;
        return value ? (
          <div className="text-sm max-w-[150px] truncate">{value}</div>
        ) : (
          <div className="text-sm text-muted-foreground">—</div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-muted p-0 font-semibold"
          >
            Status
            {column.getIsSorted() === 'asc' ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const tapped = row.original.tapped;
        return (
          <div className="flex gap-1.5">
            <Badge variant={status === 'active' ? 'default' : 'secondary'}>
              {status}
            </Badge>
            <Badge variant="outline">
              {tapped ? 'Tapped' : 'Untapped'}
            </Badge>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(customer)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => customer.id && onDelete(customer.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <Select
          value={(table.getColumn('status')?.getFilterValue() as string) ?? 'all'}
          onValueChange={(value) =>
            table.getColumn('status')?.setFilterValue(value === 'all' ? '' : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[160px] h-10">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="text-muted-foreground text-sm">No customers found.</div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const customer = row.original;
            return (
              <Card key={row.id} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header with Company */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b">
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <h3 className="font-semibold text-sm truncate">
                            {customer.company_name}
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <Badge variant={customer.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {customer.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {customer.tapped ? 'Tapped' : 'Untapped'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2.5 text-sm">
                      {/* Contact Person */}
                      {(customer.first_name || customer.last_name) && (
                        <div className="flex items-start gap-2">
                          <User className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <span className="font-medium">
                              {customer.first_name} {customer.last_name}
                            </span>
                            {customer.designation && (
                              <span className="text-muted-foreground block text-xs mt-0.5">
                                {customer.designation}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Email */}
                      {customer.email && (
                        <div className="flex items-start gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <a 
                            href={`mailto:${customer.email}`}
                            className="text-primary hover:underline truncate text-xs"
                          >
                            {customer.email}
                          </a>
                        </div>
                      )}

                      {/* Phone */}
                      {customer.contact_number && (
                        <div className="flex items-start gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <a 
                            href={`tel:${customer.country_code}${customer.contact_number}`}
                            className="text-primary hover:underline text-xs"
                          >
                            {customer.country_code} {customer.contact_number}
                          </a>
                        </div>
                      )}

                      {/* Address */}
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-muted-foreground text-xs">
                            {customer.business_address}
                          </p>
                          {customer.area && (
                            <p className="text-muted-foreground/75 text-xs mt-1">
                              Area: {customer.area}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Nature of Business */}
                      {customer.nature_of_business && (
                        <div className="flex items-start gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-muted-foreground">
                            {customer.nature_of_business}
                          </span>
                        </div>
                      )}

                      {/* Remarks */}
                      {customer.remarks && (
                        <div className="bg-muted/50 px-3 py-2 rounded-md">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Remarks:</span> {customer.remarks}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(customer)}
                        className="flex-1 h-9"
                      >
                        <Edit className="mr-2 h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => customer.id && onDelete(customer.id)}
                        className="flex-1 h-9 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground text-sm">No customers found.</div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="text-xs sm:text-sm text-muted-foreground">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          of {table.getFilteredRowModel().rows.length} customers
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-9 px-3"
          >
            Previous
          </Button>
          <div className="text-xs sm:text-sm font-medium px-3 py-1.5 bg-muted rounded-md min-w-[80px] text-center">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-9 px-3"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}