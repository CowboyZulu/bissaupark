import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type User } from '@/types/user';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/ui/data-table';
import { createUserColumns } from '@/utils/table-utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LayoutGrid, LayoutList, Search, UserPlus } from 'lucide-react';

interface Props {
    users: {
        data: User[];
        links: any[];
        from: number;
        to: number;
        total: number;
        current_page: number;
        last_page: number;
    };
    roles?: { id: number; name: string }[];
}

export default function Index({ users, roles = [] }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
        {
            title: 'Users',
            href: route('users.index'),
        },
    ];

    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('users.destroy', id), {
                onSuccess: () => {
                    toast.success('User deleted successfully');
                },
                onError: () => {
                    toast.error('Failed to delete user');
                },
            });
        }
    };

    const columns = createUserColumns(handleDelete);

    const handlePageChange = (page: number) => {
        router.visit(route('users.index', { page }));
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params: Record<string, any> = { search: searchQuery };
        
        if (selectedRole !== 'all') {
            params.role = selectedRole;
        }
        
        if (selectedStatus !== 'all') {
            params.status = selectedStatus;
        }
        
        router.visit(route('users.index', params));
    };

    const handleRoleChange = (value: string) => {
        setSelectedRole(value);
        const params: Record<string, any> = { search: searchQuery };
        
        if (value !== 'all') {
            params.role = value;
        }
        
        if (selectedStatus !== 'all') {
            params.status = selectedStatus;
        }
        
        router.visit(route('users.index', params));
    };

    const handleStatusChange = (value: string) => {
        setSelectedStatus(value);
        const params: Record<string, any> = { search: searchQuery };
        
        if (selectedRole !== 'all') {
            params.role = selectedRole;
        }
        
        if (value !== 'all') {
            params.status = value;
        }
        
        router.visit(route('users.index', params));
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-semibold">Users</h1>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => setViewMode('table')} 
                            className={viewMode === 'table' ? 'bg-primary text-primary-foreground' : ''}>
                            <LayoutList className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => setViewMode('grid')}
                            className={viewMode === 'grid' ? 'bg-primary text-primary-foreground' : ''}>
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button asChild>
                            <a href={route('users.create')}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Create User
                            </a>
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Filter Users</CardTitle>
                        <CardDescription>Filter users by name, role, or status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search users..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={selectedRole} onValueChange={handleRoleChange}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    {roles.map(role => (
                                        <SelectItem key={role.id} value={role.id.toString()}>{role.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedStatus} onValueChange={handleStatusChange}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button type="submit">Filter</Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 rounded-xl border">
                    {viewMode === 'table' ? (
                        <div className="p-4">
                            <DataTable
                                columns={columns}
                                data={users.data}
                                searchKey="name"
                                searchPlaceholder="Filter users..."
                                pagination={{
                                    pageCount: users.last_page,
                                    pageIndex: users.current_page - 1,
                                    pageSize: users.data.length,
                                    total: users.total,
                                    from: users.from,
                                    to: users.to,
                                    links: users.links,
                                    onPageChange: handlePageChange
                                }}
                                emptyMessage="No users found"
                            />
                        </div>
                    ) : (
                        <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {users.data.length > 0 ? (
                                users.data.map(user => (
                                    <Card key={user.id} className="overflow-hidden">
                                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                            <Avatar className="h-12 w-12">
                                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 space-y-1 overflow-hidden">
                                                <CardTitle className="text-base truncate">{user.name}</CardTitle>
                                                <CardDescription className="text-xs truncate">{user.email}</CardDescription>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pb-2">
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {user.roles.map((role: any) => (
                                                    <Badge key={role.id} variant="outline">
                                                        {role.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex justify-between pt-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={route('users.edit', user.id)}>Edit</a>
                                            </Button>
                                            <Button 
                                                variant="destructive" 
                                                size="sm" 
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                Delete
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full flex h-40 items-center justify-center">
                                    <p className="text-muted-foreground">No users found</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}