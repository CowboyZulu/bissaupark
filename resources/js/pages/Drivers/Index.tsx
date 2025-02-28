import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Driver } from '@/types/vehicle';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/ui/data-table';
import { createDriverColumns } from '@/utils/table-utils';

interface Props {
    drivers: {
        data: Driver[];
        links: any[];
        from: number;
        to: number;
        total: number;
        current_page: number;
        last_page: number;
    };
}

export default function Index({ drivers }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
        {
            title: 'Drivers',
            href: route('drivers.index'),
        },
    ];

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this driver?')) {
            router.delete(route('drivers.destroy', id), {
                onSuccess: () => {
                    toast.success('Driver deleted successfully');
                },
                onError: (errors) => {
                    if (errors.error) {
                        toast.error(errors.error);
                    } else {
                        toast.error('Failed to delete driver');
                    }
                },
            });
        }
    };

    const columns = createDriverColumns(handleDelete);

    const handlePageChange = (page: number) => {
        router.visit(route('drivers.index', { page }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Drivers" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Drivers</h1>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 rounded-xl border">
                    <div className="p-4">
                        <DataTable
                            columns={columns}
                            data={drivers.data}
                            searchKey="license_number"
                            searchPlaceholder="Filter drivers..."
                            createRoute={route('drivers.create')}
                            createButtonLabel="Create Driver"
                            pagination={{
                                pageCount: drivers.last_page,
                                pageIndex: drivers.current_page - 1,
                                pageSize: drivers.data.length,
                                total: drivers.total,
                                from: drivers.from,
                                to: drivers.to,
                                links: drivers.links,
                                onPageChange: handlePageChange
                            }}
                            emptyMessage="No drivers found"
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 