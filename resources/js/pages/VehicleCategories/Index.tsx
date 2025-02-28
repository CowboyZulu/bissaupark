import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { VehicleCategory } from '@/types/vehicle';
import { DataTable } from '@/components/ui/data-table';
import { createVehicleCategoryColumns } from '@/utils/table-utils';
import { toast } from 'sonner';

interface Props {
	categories: {
		data: VehicleCategory[];
		links: any[];
		from: number;
		to: number;
		total: number;
		current_page: number;
		last_page: number;
	};
}

export default function Index({ categories }: Props) {
	const handleDelete = (id: number) => {
		if (confirm('Are you sure you want to delete this category?')) {
			router.delete(route('vehicle-categories.destroy', id), {
				onSuccess: () => {
					toast.success('Vehicle category deleted successfully');
				},
				onError: (errors) => {
					if (errors.error) {
						toast.error(errors.error);
					} else {
						toast.error('Failed to delete vehicle category');
					}
				}
			});
		}
	};

	const columns = createVehicleCategoryColumns(handleDelete);

	const breadcrumbs: BreadcrumbItem[] = [
		{
			title: 'Dashboard',
			href: route('dashboard')
		},
		{
			title: 'Vehicle Categories',
			href: route('vehicle-categories.index')
		}
	];

	const handlePageChange = (page: number) => {
		router.visit(route('vehicle-categories.index', { page }));
	};

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Vehicle Categories" />

			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-semibold">Vehicle Categories</h1>
				</div>

				<div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 rounded-xl border">
					<div className="p-4">
						<DataTable
							columns={columns}
							data={categories.data}
							searchKey="name"
							searchPlaceholder="Filter categories..."
							createRoute={route('vehicle-categories.create')}
							createButtonLabel="Create Category"
							pagination={{
								pageCount: categories.last_page,
								pageIndex: categories.current_page - 1,
								pageSize: categories.data.length,
								total: categories.total,
								from: categories.from,
								to: categories.to,
								links: categories.links,
								onPageChange: handlePageChange
							}}
							emptyMessage="No categories found."
						/>
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
