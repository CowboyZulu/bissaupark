import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Zone } from '@/types/vehicle';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/ui/data-table';
import { createZoneColumns } from '@/utils/table-utils';

interface Props {
    zones: {
        data: Zone[];
        links: any[];
        from: number;
        to: number;
        total: number;
        current_page: number;
        last_page: number;
    };
}

export default function Index({ zones }: Props) {
    const [processing, setProcessing] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
        {
            title: 'Zones',
            href: route('zones.index'),
        },
    ];

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this zone?')) {
            setProcessing(id);
            router.delete(route('zones.destroy', id), {
                onSuccess: () => {
                    toast.success('Zone deleted successfully');
                    setProcessing(null);
                },
                onError: () => {
                    toast.error('Failed to delete zone');
                    setProcessing(null);
                },
            });
        }
    };

    const handleToggleStatus = (zone: Zone) => {
        setProcessing(zone.id);
        router.put(route('zones.update', zone.id), {
            ...zone,
            is_active: !zone.is_active,
        }, {
            onSuccess: () => {
                toast.success(`Zone ${zone.is_active ? 'deactivated' : 'activated'} successfully`);
                setProcessing(null);
            },
            onError: () => {
                toast.error('Failed to update zone status');
                setProcessing(null);
            },
        });
    };

    const isProcessing = (id: number) => processing === id;

    const columns = createZoneColumns(handleToggleStatus, handleDelete, isProcessing);

    const handlePageChange = (page: number) => {
        router.visit(route('zones.index', { page }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Zones" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Zones</h1>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 rounded-xl border">
                    <div className="p-4">
                        <DataTable
                            columns={columns}
                            data={zones.data}
                            searchKey="name"
                            searchPlaceholder="Filter zones..."
                            createRoute={route('zones.create')}
                            createButtonLabel="Add Zone"
                            pagination={{
                                pageCount: zones.last_page,
                                pageIndex: zones.current_page - 1,
                                pageSize: zones.data.length,
                                total: zones.total,
                                from: zones.from,
                                to: zones.to,
                                links: zones.links,
                                onPageChange: handlePageChange
                            }}
                            statusOptions={{
                                key: "is_active",
                                options: [
                                    { label: "All", value: null },
                                    { label: "Active", value: "Active" },
                                    { label: "Inactive", value: "Inactive" }
                                ]
                            }}
                            emptyMessage="No zones found"
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 