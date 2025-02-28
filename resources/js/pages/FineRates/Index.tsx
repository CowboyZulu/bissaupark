import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import { createFineRateColumns } from '@/utils/table-utils';
import { toast } from 'sonner';
import { BreadcrumbItem } from '@/types';

interface FineRatesIndexProps {
	fineRates: {
		data: any[];
		links: any[];
		from: number;
		to: number;
		total: number;
	};
	zones: any[];
	vehicleCategories: any[];
	violationTypes: any[];
	filters: {
		search?: string;
		zone_id?: number;
		vehicle_category_id?: number;
		violation_type_id?: number;
		status?: string;
	};
}

export default function Index({ fineRates, zones, vehicleCategories, violationTypes, filters }: FineRatesIndexProps) {
	const [ isDeleting, setIsDeleting ] = useState<boolean>(false);

	const handleDelete = (id: number) => {
		setIsDeleting(true);

		router.delete(route('fine-rates.destroy', id), {
			onSuccess: () => {
				toast.success('Fine rate deleted successfully');
				setIsDeleting(false);
			},
			onError: () => {
				toast.error('Failed to delete fine rate');
				setIsDeleting(false);
			}
		});
	};

	const columns = createFineRateColumns(handleDelete, isDeleting);

	const breadcrumbs: BreadcrumbItem[] = [
		{
			title: 'Dashboard',
			href: route('dashboard')
		},
		{
			title: 'Fine Rates',
			href: route('fine-rates.index')
		}
	];

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Fine Rates" />

			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-semibold">Fine Rates</h1>
				</div>

				<div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 rounded-xl border">
					<div className="p-4">
						<DataTable
							columns={columns}
							data={fineRates.data}
							searchKey="global"
							searchPlaceholder="Search by area, vehicle category or violation type..."
							createRoute={route('fine-rates.create')}
							createButtonLabel="Create Fine Rate"
							pagination={{
								pageCount: fineRates.links.length - 2,
								pageIndex: 0,
								pageSize: 15,
								total: fineRates.total,
								from: fineRates.from,
								to: fineRates.to,
								links: fineRates.links,
								onPageChange: (page) => {
									router.get(
										route('fine-rates.index'),
										{ page },
										{ preserveState: true, preserveScroll: true }
									);
								}
							}}
							statusOptions={{
								key: 'is_active',
								options: [
									{ label: 'All', value: null },
									{ label: 'Active', value: 'Active' },
									{ label: 'Inactive', value: 'Inactive' }
								]
							}}
							emptyMessage="No fine rates found"
						/>
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
