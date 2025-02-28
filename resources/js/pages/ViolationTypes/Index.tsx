import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type ViolationType } from '@/types/vehicle';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/ui/data-table';
import { createViolationTypeColumns } from '@/utils/table-utils';

interface Props {
    violationTypes: {
        data: ViolationType[];
        links: any[];
        from: number;
        to: number;
        total: number;
        current_page: number;
        last_page: number;
    };
}

export default function Index({ violationTypes }: Props) {
    const [processing, setProcessing] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
        {
            title: 'Violation Types',
            href: route('violation-types.index'),
        },
    ];

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this violation type?')) {
            setProcessing(id);
            router.delete(route('violation-types.destroy', id), {
                onSuccess: () => {
                    toast.success('Violation type deleted successfully');
                    setProcessing(null);
                },
                onError: () => {
                    toast.error('Failed to delete violation type');
                    setProcessing(null);
                },
            });
        }
    };

    const handleToggleStatus = (violationType: ViolationType) => {
        setProcessing(violationType.id);
        router.put(route('violation-types.update', violationType.id), {
            ...violationType,
            is_active: !violationType.is_active,
        }, {
            onSuccess: () => {
                toast.success(`Violation type ${violationType.is_active ? 'deactivated' : 'activated'} successfully`);
                setProcessing(null);
            },
            onError: () => {
                toast.error('Failed to update violation type status');
                setProcessing(null);
            },
        });
    };

    const isProcessing = (id: number) => processing === id;

    const columns = createViolationTypeColumns(handleToggleStatus, handleDelete, isProcessing);

    const handlePageChange = (page: number) => {
        router.visit(route('violation-types.index', { page }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Violation Types" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Violation Types</h1>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 rounded-xl border">
                    <div className="p-4">
                        <DataTable
                            columns={columns}
                            data={violationTypes.data}
                            searchKey="name"
                            searchPlaceholder="Filter violation types..."
                            createRoute={route('violation-types.create')}
                            createButtonLabel="Add Violation Type"
                            pagination={{
                                pageCount: violationTypes.last_page,
                                pageIndex: violationTypes.current_page - 1,
                                pageSize: violationTypes.data.length,
                                total: violationTypes.total,
                                from: violationTypes.from,
                                to: violationTypes.to,
                                links: violationTypes.links,
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
                            emptyMessage="No violation types found"
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 