import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { ClampingRate, VehicleCategory } from '@/types/vehicle';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import ClampingRateForm from '@/components/forms/ClampingRateForm';

interface EditProps {
	clampingRate: ClampingRate;
	vehicleCategories: VehicleCategory[];
}

export default function Edit({ clampingRate, vehicleCategories }: EditProps) {
	const [ isSubmitting, setIsSubmitting ] = useState(false);

	const handleSubmit = (data: any) => {
		setIsSubmitting(true);

		router.put(route('clamping-rates.update', clampingRate.id), data, {
			onSuccess: () => {
				toast.success('Clamping rate updated successfully');
				setIsSubmitting(false);
			},
			onError: (errors) => {
				toast.error('Failed to update clamping rate');
				setIsSubmitting(false);
				console.error(errors);
			}
		});
	};

	const breadcrumbs: BreadcrumbItem[] = [
		{
			title: 'Dashboard',
			href: route('dashboard')
		},
		{
			title: 'Clamping Rates',
			href: route('clamping-rates.index')
		},
		{
			title: 'Edit',
			href: route('clamping-rates.edit', clampingRate.id)
		}
	];

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Edit Clamping Rate" />

			<div className="flex h-full flex-1 flex-col gap-4 p-4">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-semibold">Edit Clamping Rate</h1>
				</div>

				<ClampingRateForm
					clampingRate={clampingRate}
					vehicleCategories={vehicleCategories}
					isSubmitting={isSubmitting}
					onSubmit={handleSubmit}
					cancelHref={route('clamping-rates.index')}
					submitLabel="Update Clamping Rate"
				/>
			</div>
		</AppLayout>
	);
}
