import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerFormField } from '@/components/ui/date-picker';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Driver, type VehicleCategory } from '@/types/vehicle';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';

interface Props {
    categories: VehicleCategory[];
    drivers: Driver[];
}

const formSchema = z.object({
    plate_number: z.string().min(2, {
        message: 'Plate number must be at least 2 characters.',
    }),
    category_id: z.string().min(1, {
        message: 'Category is required.',
    }),
    model: z.string().min(1, {
        message: 'Model is required.',
    }),
    make: z.string().min(1, {
        message: 'Make is required.',
    }),
    color: z.string().min(1, {
        message: 'Color is required.',
    }),
    driver_id: z.string().optional(),
});

export default function Create({ categories, drivers }: Props) {
    const [driversList, setDriversList] = useState<Driver[]>(drivers);
    const [isDriverDialogOpen, setIsDriverDialogOpen] = useState(false);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            plate_number: '',
            category_id: '',
            model: '',
            make: '',
            color: '',
            driver_id: '',
        },
    });

    const driverFormSchema = z.object({
        license_number: z.string().min(2, {
            message: 'License number must be at least 2 characters.',
        }),
        first_name: z.string().min(2, {
            message: 'First name must be at least 2 characters.',
        }),
        last_name: z.string().min(2, {
            message: 'Last name must be at least 2 characters.',
        }),
        license_expiry: z.string().min(1, {
            message: 'License expiry date is required.',
        }),
    });

    const driverForm = useForm<z.infer<typeof driverFormSchema>>({
        resolver: zodResolver(driverFormSchema),
        defaultValues: {
            license_number: '',
            first_name: '',
            last_name: '',
            license_expiry: '',
        },
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
        {
            title: 'Vehicles',
            href: route('vehicles.index'),
        },
        {
            title: 'Create',
            href: route('vehicles.create'),
        },
    ];

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Convert string IDs to numbers for the backend
        const formattedValues = {
            ...values,
            category_id: parseInt(values.category_id),
            driver_id: values.driver_id && values.driver_id !== "0" ? parseInt(values.driver_id) : null,
        };

        router.post(route('vehicles.store'), formattedValues, {
            onSuccess: () => {
                toast.success('Vehicle created successfully');
            },
        });
    }

    function onDriverSubmit(values: z.infer<typeof driverFormSchema>) {
        router.post(route('drivers.store'), values, {
            preserveScroll: true,
            onSuccess: (page) => {
                toast.success('Driver created successfully');
                setIsDriverDialogOpen(false);
                driverForm.reset();
                
                // Add the new driver to the list and select it
                if (page.props.driver) {
                    const newDriver = page.props.driver as Driver;
                    setDriversList(prev => [...prev, newDriver]);
                    form.setValue('driver_id', newDriver.id.toString());
                }
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Vehicle" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Create Vehicle</h1>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 rounded-xl border">
                    <div className="p-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="plate_number"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Plate Number *</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="category_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category *</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.id} value={category.id.toString()}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="make"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Make *</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="model"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Model *</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="color"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Color *</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="driver_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex justify-between items-center">
                                                <FormLabel>Driver</FormLabel>
                                                <Dialog open={isDriverDialogOpen} onOpenChange={setIsDriverDialogOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                                                            <PlusCircle className="h-4 w-4" />
                                                            Add Driver
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Add New Driver</DialogTitle>
                                                        </DialogHeader>
                                                        <Form {...driverForm}>
                                                            <form onSubmit={driverForm.handleSubmit(onDriverSubmit)} className="space-y-4">
                                                                <FormField
                                                                    control={driverForm.control}
                                                                    name="license_number"
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel>License Number *</FormLabel>
                                                                            <FormControl>
                                                                                <Input {...field} />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <FormField
                                                                        control={driverForm.control}
                                                                        name="first_name"
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormLabel>First Name *</FormLabel>
                                                                                <FormControl>
                                                                                    <Input {...field} />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                    
                                                                    <FormField
                                                                        control={driverForm.control}
                                                                        name="last_name"
                                                                        render={({ field }) => (
                                                                            <FormItem>
                                                                                <FormLabel>Last Name *</FormLabel>
                                                                                <FormControl>
                                                                                    <Input {...field} />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                            </FormItem>
                                                                        )}
                                                                    />
                                                                </div>
                                                                
                                                                <FormField
                                                                    control={driverForm.control}
                                                                    name="license_expiry"
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel>License Expiry Date *</FormLabel>
                                                                            <FormControl>
                                                                                <DatePickerFormField
                                                                                    {...field}
                                                                                    placeholder="Select expiry date"
                                                                                />
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                
                                                                <div className="flex justify-end">
                                                                    <Button type="submit">Create Driver</Button>
                                                                </div>
                                                            </form>
                                                        </Form>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a driver (optional)" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="0">None</SelectItem>
                                                    {driversList.map((driver) => (
                                                        <SelectItem key={driver.id} value={driver.id.toString()}>
                                                            {driver.first_name} {driver.last_name} ({driver.license_number})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit">Create Vehicle</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 