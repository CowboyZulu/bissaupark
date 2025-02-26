import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Zone } from '@/types/vehicle';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    zones: Zone[];
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Zones" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Zones</h1>
                    <Link href={route('zones.create')}>
                        <Button className="flex items-center gap-1">
                            <Plus className="h-4 w-4" />
                            Add Zone
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
                                {zones.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-3 text-center text-muted-foreground">
                                            No zones found
                                        </td>
                                    </tr>
                                ) : (
                                    zones.map((zone) => (
                                        <tr key={zone.id} className="border-b">
                                            <td className="px-4 py-3">{zone.name}</td>
                                            <td className="px-4 py-3">
                                                <code className="bg-muted rounded px-1 py-0.5">{zone.code}</code>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Switch
                                                    checked={zone.is_active}
                                                    onCheckedChange={() => handleToggleStatus(zone)}
                                                    disabled={processing === zone.id}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={route('zones.edit', zone.id)}>
                                                        <Button variant="outline" size="icon" className="h-8 w-8">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive"
                                                        onClick={() => handleDelete(zone.id)}
                                                        disabled={processing === zone.id}
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