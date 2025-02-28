import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { toast } from 'sonner';
import { BreadcrumbItem } from '@/types';
import { Street } from '@/types/vehicle';
import { DataTable } from '@/components/ui/data-table';
import { createParkingSpaceColumns } from '@/utils/table-utils';

// Define ParkingSpace interface locally to fix the import error
interface ParkingSpace {
	id: number;
	street_id: number;
	space_number: string;
	type: 'parallel' | 'perpendicular' | 'angled';
	latitude: number;
	longitude: number;
	is_handicap: boolean;
	is_loading_zone: boolean;
	is_active: boolean;
	created_at: string;
	updated_at: string;
	street: Street;
}

interface ParkingSpacesIndexProps {
	parkingSpaces: {
		data: ParkingSpace[];
		links: any[];
		from: number;
		to: number;
		total: number;
		current_page: number;
		last_page: number;
	};
}

export default function Index({ parkingSpaces }: ParkingSpacesIndexProps) {
	const [ processing, setProcessing ] = useState<number | null>(null);

	const breadcrumbs: BreadcrumbItem[] = [
		{
			title: 'Dashboard',
			href: route('dashboard')
		},
		{
			title: 'Parking Spaces',
			href: route('parking-spaces.index')
		}
	];

	const handleDelete = (id: number) => {
		if (confirm('Are you sure you want to delete this parking space?')) {
			setProcessing(id);
			router.delete(route('parking-spaces.destroy', id), {
				onSuccess: () => {
					toast.success('Parking space deleted successfully');
					setProcessing(null);
				},
				onError: () => {
					toast.error('Failed to delete parking space');
					setProcessing(null);
				}
			});
		}
	};

	const columns = createParkingSpaceColumns(handleDelete);

	const handlePageChange = (page: number) => {
		router.visit(route('parking-spaces.index', { page }));
	};

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Parking Spaces" />

			<div className="flex h-full flex-1 flex-col gap-4 p-4">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-semibold">Parking Spaces</h1>
				</div>

				<div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 rounded-xl border">
					<div className="p-4">
						<DataTable
							columns={columns}
							data={parkingSpaces.data}
							searchKey="space_number"
							searchPlaceholder="Filter parking spaces..."
							createRoute={route('parking-spaces.create')}
							createButtonLabel="Add Parking Space"
							pagination={{
								pageCount: parkingSpaces.last_page,
								pageIndex: parkingSpaces.current_page - 1,
								pageSize: parkingSpaces.data.length,
								total: parkingSpaces.total,
								from: parkingSpaces.from,
								to: parkingSpaces.to,
								links: parkingSpaces.links,
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
							emptyMessage="No parking spaces found"
						/>
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
