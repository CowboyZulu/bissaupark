import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { ParkingRate } from '@/types/vehicle';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { DataTable } from '@/components/ui/data-table';
import { createParkingRateColumns } from '@/utils/table-utils';

interface ParkingRatesIndexProps {
	parkingRates: {
		data: ParkingRate[];
		links: any[];
		from: number;
		to: number;
		total: number;
		current_page: number;
		last_page: number;
	};
}

export default function Index({ parkingRates }: ParkingRatesIndexProps) {
	const [ isDeleting, setIsDeleting ] = useState(false);

	// Handle delete
	const handleDelete = (id: number) => {
		if (confirm('Are you sure you want to delete this parking rate?')) {
			setIsDeleting(true);
			router.delete(route('parking-rates.destroy', id), {
				onSuccess: () => {
					toast.success('Parking rate deleted successfully');
					setIsDeleting(false);
				},
				onError: (errors) => {
					toast.error(errors.message || 'Failed to delete parking rate');
					setIsDeleting(false);
				}
			});
		}
	};

	// Generate columns
	const columns = createParkingRateColumns(handleDelete, isDeleting);

	// Breadcrumbs
	const breadcrumbs: BreadcrumbItem[] = [
		{
			title: 'Dashboard',
			href: route('dashboard')
		},
		{
			title: 'Parking Rates',
			href: route('parking-rates.index')
		}
	];

	// Status filter options
	const statusOptions = {
		key: 'is_active',
		options: [
			{ label: 'All', value: null },
			{ label: 'Active', value: 'Active' },
			{ label: 'Inactive', value: 'Inactive' }
		]
	};

	// Handle pagination
	const handlePageChange = (page: number) => {
		router.get(route('parking-rates.index', { page }));
	};

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Parking Rates" />

			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-semibold">Parking Rates</h1>
				</div>

				<div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 rounded-xl border">
					<div className="p-4">
						<DataTable
							columns={columns}
							data={parkingRates.data}
							searchKey="zone.name"
							searchPlaceholder="Search by zone or vehicle category..."
							createRoute={route('parking-rates.create')}
							createButtonLabel="Create Parking Rate"
							pagination={{
								pageCount: parkingRates.last_page,
								pageIndex: parkingRates.current_page - 1,
								pageSize: parkingRates.data.length,
								total: parkingRates.total,
								from: parkingRates.from,
								to: parkingRates.to,
								links: parkingRates.links,
								onPageChange: handlePageChange
							}}
							statusOptions={statusOptions}
							emptyMessage="No parking rates found"
						/>
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
