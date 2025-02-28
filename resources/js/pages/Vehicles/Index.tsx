import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Vehicle } from '@/types/vehicle';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/ui/data-table';
import { createVehicleColumns } from '@/utils/table-utils';

interface Props {
    vehicles: {
        data: Vehicle[];
        links: any[];
        from: number;
        to: number;
        total: number;
        current_page: number;
        last_page: number;
    };
}

export default function Index({ vehicles }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
        {
            title: 'Vehicles',
            href: route('vehicles.index'),
        },
    ];

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this vehicle?')) {
            router.delete(route('vehicles.destroy', id), {
                onSuccess: () => {
                    toast.success('Vehicle deleted successfully');
                },
                onError: () => {
                    toast.error('Failed to delete vehicle');
                },
            });
        }
    };

    const columns = createVehicleColumns(handleDelete);

    const handlePageChange = (page: number) => {
        router.visit(route('vehicles.index', { page }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vehicles" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Vehicles</h1>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 rounded-xl border">
                    <div className="p-4">
                        <DataTable
                            columns={columns}
                            data={vehicles.data}
                            searchKey="plate_number"
                            searchPlaceholder="Filter vehicles..."
                            createRoute={route('vehicles.create')}
                            createButtonLabel="Create Vehicle"
                            pagination={{
                                pageCount: vehicles.last_page,
                                pageIndex: vehicles.current_page - 1,
                                pageSize: vehicles.data.length,
                                total: vehicles.total,
                                from: vehicles.from,
                                to: vehicles.to,
                                links: vehicles.links,
                                onPageChange: handlePageChange
                            }}
                            emptyMessage="No vehicles found"
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 