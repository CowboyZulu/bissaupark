import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { ClampingRate } from '@/types/vehicle';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { DataTable } from '@/components/ui/data-table';
import { createClampingRateColumns } from '@/utils/table-utils';

interface ClampingRatesIndexProps {
	clampingRates: {
		data: ClampingRate[];
		links: any[];
		from: number;
		to: number;
		total: number;
		current_page: number;
		last_page: number;
	};
}

export default function Index({ clampingRates }: ClampingRatesIndexProps) {
	const [ isDeleting, setIsDeleting ] = useState(false);

	// Handle delete
	const handleDelete = (id: number) => {
		if (confirm('Are you sure you want to delete this clamping rate?')) {
			setIsDeleting(true);
			router.delete(route('clamping-rates.destroy', id), {
				onSuccess: () => {
					toast.success('Clamping rate deleted successfully');
					setIsDeleting(false);
				},
				onError: (errors) => {
					toast.error(errors.message || 'Failed to delete clamping rate');
					setIsDeleting(false);
				}
			});
		}
	};

	// Generate columns using the utility function
	const columns = createClampingRateColumns(handleDelete, isDeleting);

	const breadcrumbs: BreadcrumbItem[] = [
		{
			title: 'Dashboard',
			href: route('dashboard')
		},
		{
			title: 'Clamping Rates',
			href: route('clamping-rates.index')
		}
	];

	// Handle page change
	const handlePageChange = (page: number) => {
		router.visit(route('clamping-rates.index', { page }));
	};

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Clamping Rates" />

			<div className="flex h-full flex-1 flex-col gap-4 p-4">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-semibold">Clamping Rates</h1>
				</div>

				<DataTable
					columns={columns}
					data={clampingRates.data}
					searchKey="vehicleCategory.name"
					searchPlaceholder="Search by vehicle category..."
					createRoute={route('clamping-rates.create')}
					createButtonLabel="Add Clamping Rate"
					pagination={{
						pageCount: clampingRates.last_page,
						pageIndex: clampingRates.current_page - 1,
						pageSize: clampingRates.data.length,
						total: clampingRates.total,
						from: clampingRates.from,
						to: clampingRates.to,
						links: clampingRates.links,
						onPageChange: handlePageChange
					}}
					statusOptions={{
						key: 'is_active',
						options: [
							{ label: 'All', value: null },
							{ label: 'Active', value: 'Active' },
							{ label: 'Inactive', value: 'Inactive' }
						]
					}}
					emptyMessage="No clamping rates found."
				/>
			</div>
		</AppLayout>
	);
}
