import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { useForm as useHookForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

interface Props {
    mustVerifyEmail: boolean;
    status?: string;
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
}

const updateProfileSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
});

const deleteUserSchema = z.object({
    password: z.string().min(1, 'Password is required'),
});

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile',
        href: '/profile',
    },
];

export default function Edit({ mustVerifyEmail, status, auth }: Props) {
    const updateProfileForm = useHookForm<z.infer<typeof updateProfileSchema>>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: auth.user.name,
            email: auth.user.email,
        },
    });

    const deleteUserForm = useHookForm<z.infer<typeof deleteUserSchema>>({
        resolver: zodResolver(deleteUserSchema),
        defaultValues: {
            password: '',
        },
    });

    const onUpdateProfile = async (values: z.infer<typeof updateProfileSchema>) => {
        try {
            await router.patch('/profile', values);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    const onDeleteUser = async (values: z.infer<typeof deleteUserSchema>) => {
        if (!confirm('Are you sure you want to delete your account?')) return;

        try {
            await router.delete('/profile', {
                data: values,
            });
        } catch (error) {
            toast.error('Failed to delete account');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile" />

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...updateProfileForm}>
                            <form onSubmit={updateProfileForm.handleSubmit(onUpdateProfile)} className="space-y-6">
                                <FormField
                                    control={updateProfileForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={updateProfileForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            {mustVerifyEmail && (
                                                <p className="text-sm text-gray-600">
                                                    Your email address is unverified.
                                                </p>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" disabled={updateProfileForm.formState.isSubmitting}>
                                    Save
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Delete Account</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...deleteUserForm}>
                            <form onSubmit={deleteUserForm.handleSubmit(onDeleteUser)} className="space-y-6">
                                <FormField
                                    control={deleteUserForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" variant="destructive" disabled={deleteUserForm.formState.isSubmitting}>
                                    Delete Account
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
