import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { TowingRate } from '@/types/vehicle';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { DataTable } from '@/components/ui/data-table';
import { createTowingRateColumns } from '@/utils/table-utils';

interface TowingRatesIndexProps {
	towingRates: {
		data: TowingRate[];
		links: any[];
		from: number;
		to: number;
		total: number;
		current_page: number;
		last_page: number;
	};
}

export default function Index({ towingRates }: TowingRatesIndexProps) {
	const [ isDeleting, setIsDeleting ] = useState(false);

	// Handle delete
	const handleDelete = (id: number) => {
		if (confirm('Are you sure you want to delete this towing rate?')) {
			setIsDeleting(true);
			router.delete(route('towing-rates.destroy', id), {
				onSuccess: () => {
					toast.success('Towing rate deleted successfully');
					setIsDeleting(false);
				},
				onError: (errors) => {
					toast.error(errors.message || 'Failed to delete towing rate');
					setIsDeleting(false);
				}
			});
		}
	};

	// Generate columns
	const columns = createTowingRateColumns(handleDelete, isDeleting);

	// Breadcrumbs
	const breadcrumbs: BreadcrumbItem[] = [
		{
			title: 'Dashboard',
			href: route('dashboard')
		},
		{
			title: 'Towing Rates',
			href: route('towing-rates.index')
		}
	];

	// Handle page change
	const handlePageChange = (page: number) => {
		router.visit(route('towing-rates.index', { page }));
	};

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Towing Rates" />

			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-semibold">Towing Rates</h1>
				</div>

				<DataTable
					columns={columns}
					data={towingRates.data}
					searchKey="zone.name"
					searchPlaceholder="Search by zone or vehicle category..."
					createRoute={route('towing-rates.create')}
					createButtonLabel="Create Towing Rate"
					pagination={{
						pageCount: towingRates.last_page,
						pageIndex: towingRates.current_page - 1,
						pageSize: towingRates.data.length,
						total: towingRates.total,
						from: towingRates.from,
						to: towingRates.to,
						links: towingRates.links,
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
					emptyMessage="No towing rates found"
				/>
			</div>
		</AppLayout>
	);
}
