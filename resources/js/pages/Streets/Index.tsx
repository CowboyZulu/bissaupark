import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Street } from '@/types/vehicle';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/ui/data-table';
import { createStreetColumns } from '@/utils/table-utils';

interface Props {
    streets: {
        data: Street[];
        links: any[];
        from: number;
        to: number;
        total: number;
        current_page: number;
        last_page: number;
    };
}

export default function Index({ streets }: Props) {
    const [processing, setProcessing] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
        {
            title: 'Streets',
            href: route('streets.index'),
        },
    ];

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this street?')) {
            setProcessing(id);
            router.delete(route('streets.destroy', id), {
                onSuccess: () => {
                    toast.success('Street deleted successfully');
                    setProcessing(null);
                },
                onError: () => {
                    toast.error('Failed to delete street');
                    setProcessing(null);
                },
            });
        }
    };

    const handleToggleStatus = (street: Street) => {
        setProcessing(street.id);
        const { zone, ...streetData } = street;
        router.put(route('streets.update', street.id), {
            ...streetData,
            is_active: !street.is_active,
        }, {
            onSuccess: () => {
                toast.success(`Street ${street.is_active ? 'deactivated' : 'activated'} successfully`);
                setProcessing(null);
            },
            onError: () => {
                toast.error('Failed to update street status');
                setProcessing(null);
            },
        });
    };

    const isProcessing = (id: number) => processing === id;

    const columns = createStreetColumns(handleToggleStatus, handleDelete, isProcessing);

    const handlePageChange = (page: number) => {
        router.visit(route('streets.index', { page }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Streets" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Streets</h1>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 rounded-xl border">
                    <div className="p-4">
                        <DataTable
                            columns={columns}
                            data={streets.data}
                            searchKey="name"
                            searchPlaceholder="Filter streets..."
                            createRoute={route('streets.create')}
                            createButtonLabel="Add Street"
                            pagination={{
                                pageCount: streets.last_page,
                                pageIndex: streets.current_page - 1,
                                pageSize: streets.data.length,
                                total: streets.total,
                                from: streets.from,
                                to: streets.to,
                                links: streets.links,
                                onPageChange: handlePageChange
                            }}
                            emptyMessage="No streets found"
                            statusOptions={{
                                key: "is_active",
                                options: [
                                    { label: "All", value: null },
                                    { label: "Active", value: "Active" },
                                    { label: "Inactive", value: "Inactive" }
                                ]
                            }}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 