import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type ViolationType } from '@/types/vehicle';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    violationTypes: ViolationType[];
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Violation Types" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Violation Types</h1>
                    <Link href={route('violation-types.create')}>
                        <Button className="flex items-center gap-1">
                            <Plus className="h-4 w-4" />
                            Add Violation Type
                        </Button>
                    </Link>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 rounded-xl border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 text-muted-foreground border-b">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Name</th>
                                    <th className="px-4 py-3 font-medium">Code</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {violationTypes.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-3 text-center text-muted-foreground">
                                            No violation types found
                                        </td>
                                    </tr>
                                ) : (
                                    violationTypes.map((violationType) => (
                                        <tr key={violationType.id} className="border-b">
                                            <td className="px-4 py-3">{violationType.name}</td>
                                            <td className="px-4 py-3">
                                                <code className="bg-muted rounded px-1 py-0.5">{violationType.code}</code>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Switch
                                                    checked={violationType.is_active}
                                                    onCheckedChange={() => handleToggleStatus(violationType)}
                                                    disabled={processing === violationType.id}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={route('violation-types.edit', violationType.id)}>
                                                        <Button variant="outline" size="icon" className="h-8 w-8">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive"
                                                        onClick={() => handleDelete(violationType.id)}
                                                        disabled={processing === violationType.id}
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 