import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Role } from '@/types/user';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/ui/data-table';
import { createRoleColumns } from '@/utils/table-utils';

interface Props {
    roles: {
        data: Role[];
        links: any[];
        from: number;
        to: number;
        total: number;
        current_page: number;
        last_page: number;
    };
}

export default function Index({ roles }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
        {
            title: 'Roles',
            href: route('roles.index'),
        },
    ];

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this role?')) {
            router.delete(route('roles.destroy', id), {
                onSuccess: () => {
                    toast.success('Role deleted successfully');
                },
                onError: (errors) => {
                    if (errors.error) {
                        toast.error(errors.error);
                    } else {
                        toast.error('Failed to delete role');
                    }
                },
            });
        }
    };

    const columns = createRoleColumns(handleDelete);

    const handlePageChange = (page: number) => {
        router.visit(route('roles.index', { page }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Roles</h1>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 rounded-xl border">
                    <div className="p-4">
                        <DataTable
                            columns={columns}
                            data={roles.data}
                            searchKey="name"
                            searchPlaceholder="Filter roles..."
                            createRoute={route('roles.create')}
                            createButtonLabel="Create Role"
                            pagination={{
                                pageCount: roles.last_page,
                                pageIndex: roles.current_page - 1,
                                pageSize: roles.data.length,
                                total: roles.total,
                                from: roles.from,
                                to: roles.to,
                                links: roles.links,
                                onPageChange: handlePageChange
                            }}
                            emptyMessage="No roles found."
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 