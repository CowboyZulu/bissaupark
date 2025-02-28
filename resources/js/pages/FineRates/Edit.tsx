import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Zone, VehicleCategory, ViolationType, FineRate } from '@/types/vehicle';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import FineRateForm from '@/components/forms/FineRateForm';

interface EditProps {
	fineRate: FineRate;
	zones: Zone[];
	vehicleCategories: VehicleCategory[];
	violationTypes: ViolationType[];
}

export default function Edit({ fineRate, zones, vehicleCategories, violationTypes }: EditProps) {
	const [ isSubmitting, setIsSubmitting ] = useState(false);

	const handleSubmit = (data: any) => {
		setIsSubmitting(true);

		router.put(route('fine-rates.update', fineRate.id), data, {
			onSuccess: () => {
				toast.success('Fine rate updated successfully');
				setIsSubmitting(false);
			},
			onError: (errors) => {
				toast.error('Failed to update fine rate');
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
			title: 'Fine Rates',
			href: route('fine-rates.index')
		},
		{
			title: 'Edit',
			href: route('fine-rates.edit', fineRate.id)
		}
	];

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Edit Fine Rate" />

			<div className="flex h-full flex-1 flex-col gap-4 p-4">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-semibold">Edit Fine Rate</h1>
				</div>

				<FineRateForm
					fineRate={fineRate}
					zones={zones}
					vehicleCategories={vehicleCategories}
					violationTypes={violationTypes}
					isSubmitting={isSubmitting}
					onSubmit={handleSubmit}
					cancelHref={route('fine-rates.index')}
					submitLabel="Update Fine Rate"
				/>
			</div>
		</AppLayout>
	);
}
