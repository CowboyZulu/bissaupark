import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type User } from '@/types/user';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/ui/data-table';
import { createUserColumns } from '@/utils/table-utils';

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
}

export default function Index({ users }: Props) {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Users</h1>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 rounded-xl border">
                    <div className="p-4">
                        <DataTable
                            columns={columns}
                            data={users.data}
                            searchKey="name"
                            searchPlaceholder="Filter users..."
                            createRoute={route('users.create')}
                            createButtonLabel="Create User"
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
                </div>
            </div>
        </AppLayout>
    );
}