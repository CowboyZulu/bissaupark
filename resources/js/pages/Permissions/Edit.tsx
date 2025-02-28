import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Permission } from '@/types/user';
import { Head, router } from '@inertiajs/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    permission: Permission;
}

const formSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters').max(255),
    description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Edit({ permission }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
        {
            title: 'Permissions',
            href: route('permissions.index'),
        },
        {
            title: 'Edit',
            href: route('permissions.edit', permission.id),
        },
    ];

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: permission.name,
            description: permission.description || '',
        },
    });

    const onSubmit = (values: FormValues) => {
        router.put(route('permissions.update', permission.id), values, {
            onSuccess: () => {
                toast.success('Permission updated successfully');
                router.visit(route('permissions.index'));
            },
            onError: (errors) => {
                Object.keys(errors).forEach((key) => {
                    form.setError(key as keyof FormValues, {
                        type: 'manual',
                        message: errors[key],
                    });
                });
                toast.error('Failed to update permission');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Permission: ${permission.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Edit Permission</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Permission Details</CardTitle>
                        <CardDescription>
                            Edit the permission details
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter permission name" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                The name of the permission (e.g., "Create Users")
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter permission description"
                                                    className="min-h-[100px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                A brief description of what this permission allows
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.visit(route('permissions.index'))}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting ? 'Updating...' : 'Update Permission'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
} 