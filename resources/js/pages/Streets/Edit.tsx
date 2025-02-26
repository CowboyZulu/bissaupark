import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { GoogleMapDrawer } from '@/components/ui/google-map-drawer';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Street, type Zone } from '@/types/vehicle';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { useState } from 'react';

interface Props {
    street: Street;
    zones: Zone[];
    googleMapsApiKey: string;
}

const formSchema = z.object({
    type: z.enum(['main', 'cross'], {
        required_error: 'Please select a street type.',
    }),
    name: z.string().min(2, {
        message: 'Name must be at least 2 characters.',
    }),
    zone_id: z.string().optional(),
    is_active: z.boolean().default(true),
    start_latitude: z.number().nullable().default(null),
    end_latitude: z.number().nullable().default(null),
    start_longitude: z.number().nullable().default(null),
    end_longitude: z.number().nullable().default(null),
    path_coordinates: z.array(z.object({
        lat: z.number(),
        lng: z.number()
    })).default([]),
});

type FormValues = z.infer<typeof formSchema>;

export default function Edit({ street, zones, googleMapsApiKey }: Props) {
    const [pathDrawn, setPathDrawn] = useState(street.path_coordinates && street.path_coordinates.length > 0);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: street.type,
            name: street.name,
            zone_id: street.zone_id ? street.zone_id.toString() : 'none',
            is_active: street.is_active,
            start_latitude: street.start_latitude,
            end_latitude: street.end_latitude,
            start_longitude: street.start_longitude,
            end_longitude: street.end_longitude,
            path_coordinates: street.path_coordinates || [],
        },
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
        {
            title: 'Streets',
            href: route('streets.index'),
        },
        {
            title: 'Edit',
            href: route('streets.edit', street.id),
        },
    ];

    function onSubmit(values: FormValues) {
        if (!pathDrawn && !confirm('You have not drawn a street path. Do you want to continue without a path?')) {
            return;
        }

        // Transform zone_id to number or null before sending to the server
        const formData = {
            ...values,
            zone_id: values.zone_id && values.zone_id !== 'none' ? parseInt(values.zone_id) : null,
        };

        router.put(route('streets.update', street.id), formData, {
            onSuccess: () => {
                toast.success('Street updated successfully');
            },
            onError: (errors) => {
                Object.keys(errors).forEach(key => {
                    toast.error(errors[key]);
                });
            },
        });
    }

    function handlePathChange(
        coordinates: Array<{lat: number, lng: number}>,
        startPoint: {lat: number, lng: number},
        endPoint: {lat: number, lng: number}
    ) {
        form.setValue('path_coordinates', coordinates);
        form.setValue('start_latitude', startPoint.lat || null);
        form.setValue('start_longitude', startPoint.lng || null);
        form.setValue('end_latitude', endPoint.lat || null);
        form.setValue('end_longitude', endPoint.lng || null);
        setPathDrawn(coordinates.length > 0);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Street" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Edit Street</h1>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 rounded-xl border">
                    <div className="p-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Type*</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select street type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="main">Main Street</SelectItem>
                                                        <SelectItem value="cross">Cross Street</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name*</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="zone_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Zone</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select zone" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="none">None</SelectItem>
                                                        {zones.map((zone) => (
                                                            <SelectItem key={zone.id} value={zone.id.toString()}>
                                                                {zone.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="is_active"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">Active Status</FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <FormLabel>Street Location*</FormLabel>
                                    <p className="text-sm text-gray-500">
                                        Draw the street path on the map. Click to add points, and double-click to complete the path.
                                    </p>
                                    <GoogleMapDrawer
                                        apiKey={googleMapsApiKey}
                                        initialCoordinates={street.path_coordinates || []}
                                        onPathChange={handlePathChange}
                                        height="500px"
                                    />
                                </div>

                                <Button type="submit">Update Street</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 