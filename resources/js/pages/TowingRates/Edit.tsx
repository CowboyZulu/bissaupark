import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Zone, VehicleCategory, TowingRate } from '@/types/vehicle';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import TowingRateForm from '@/components/forms/TowingRateForm';

interface EditProps {
	towingRate: TowingRate;
	zones: Zone[];
	vehicleCategories: VehicleCategory[];
}

export default function Edit({ towingRate, zones, vehicleCategories }: EditProps) {
	const [ isSubmitting, setIsSubmitting ] = useState(false);

	const handleSubmit = (data: any) => {
		setIsSubmitting(true);

		router.put(route('towing-rates.update', towingRate.id), data, {
			onSuccess: () => {
				toast.success('Towing rate updated successfully');
				setIsSubmitting(false);
			},
			onError: (errors) => {
				toast.error('Failed to update towing rate');
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
			title: 'Towing Rates',
			href: route('towing-rates.index')
		},
		{
			title: 'Edit',
			href: route('towing-rates.edit', towingRate.id)
		}
	];

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Edit Towing Rate" />

			<div className="flex h-full flex-1 flex-col gap-4 p-4">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-semibold">Edit Towing Rate</h1>
				</div>

				<TowingRateForm
					towingRate={towingRate}
					zones={zones}
					vehicleCategories={vehicleCategories}
					isSubmitting={isSubmitting}
					onSubmit={handleSubmit}
					cancelHref={route('towing-rates.index')}
					submitLabel="Update Towing Rate"
				/>
			</div>
		</AppLayout>
	);
}
