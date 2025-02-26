import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Street } from '@/types/vehicle';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash, MapPin } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    streets: Street[];
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Streets" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Streets</h1>
                    <Button asChild>
                        <Link href={route('streets.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Street
                        </Link>
                    </Button>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 rounded-xl border">
                    <div className="p-4">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-2 text-left">Type</th>
                                        <th className="px-4 py-2 text-left">Name</th>
                                        <th className="px-4 py-2 text-left">Code</th>
                                        <th className="px-4 py-2 text-left">Zone</th>
                                        <th className="px-4 py-2 text-left">Status</th>
                                        <th className="px-4 py-2 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {streets.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-2 text-center">No streets found</td>
                                        </tr>
                                    ) : (
                                        streets.map((street) => (
                                            <tr key={street.id} className="border-b">
                                                <td className="px-4 py-2">
                                                    <span className={`inline-block px-2 py-1 rounded text-xs ${street.type === 'main' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                                        {street.type === 'main' ? 'Main' : 'Cross'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2">{street.name}</td>
                                                <td className="px-4 py-2">{street.code}</td>
                                                <td className="px-4 py-2">{street.zone?.name || 'N/A'}</td>
                                                <td className="px-4 py-2">
                                                    <Switch
                                                        checked={street.is_active}
                                                        onCheckedChange={() => handleToggleStatus(street)}
                                                        disabled={processing === street.id}
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div className="flex space-x-2">
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link href={route('streets.show', street.id)}>
                                                                <MapPin className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link href={route('streets.edit', street.id)}>
                                                                <Edit className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDelete(street.id)}
                                                            disabled={processing === street.id}
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
            </div>
        </AppLayout>
    );
} 