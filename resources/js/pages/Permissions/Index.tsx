import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Permission } from '@/types/user';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/ui/data-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { createPermissionColumns } from '@/utils/permission-utils';

interface Props {
    permissions: {
        data: Permission[];
        links: any[];
        from: number;
        to: number;
        total: number;
        current_page: number;
        last_page: number;
    };
}

export default function Index({ permissions }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
        {
            title: 'Permissions',
            href: route('permissions.index'),
        },
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [permissionToDelete, setPermissionToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = (id: number) => {
        setIsDeleting(true);
        router.delete(route('permissions.destroy', id), {
            onSuccess: () => {
                setIsDeleting(false);
                setPermissionToDelete(null);
                toast.success('Permission deleted successfully');
            },
            onError: (errors) => {
                setIsDeleting(false);
                setPermissionToDelete(null);
                if (errors.error) {
                    toast.error(errors.error);
                } else {
                    toast.error('Failed to delete permission');
                }
            },
        });
    };

    const confirmDelete = (id: number) => {
        setPermissionToDelete(id);
    };

    const columns = createPermissionColumns(confirmDelete);

    const handlePageChange = (page: number) => {
        router.visit(route('permissions.index', { page }));
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.visit(route('permissions.index', { search: searchQuery }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permissions" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-semibold">Permissions</h1>
                    <Button asChild>
                        <a href={route('permissions.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Permission
                        </a>
                    </Button>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Search Permissions</CardTitle>
                        <CardDescription>Find permissions by name or description</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search permissions..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button type="submit">Search</Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 rounded-xl border">
                    <div className="p-4">
                        <DataTable
                            columns={columns}
                            data={permissions.data}
                            searchKey="name"
                            searchPlaceholder="Filter permissions..."
                            pagination={{
                                pageCount: permissions.last_page,
                                pageIndex: permissions.current_page - 1,
                                pageSize: permissions.data.length,
                                total: permissions.total,
                                from: permissions.from,
                                to: permissions.to,
                                links: permissions.links,
                                onPageChange: handlePageChange
                            }}
                            emptyMessage="No permissions found."
                        />
                    </div>
                </div>
            </div>

            <AlertDialog open={permissionToDelete !== null} onOpenChange={(open) => {
                if (!open) setPermissionToDelete(null);
            }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the permission
                            and may affect roles that use it.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => permissionToDelete && handleDelete(permissionToDelete)}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
} 