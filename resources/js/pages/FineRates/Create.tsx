import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Zone, VehicleCategory, ViolationType } from '@/types/vehicle';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import FineRateForm from '@/components/forms/FineRateForm';

interface CreateProps {
	zones: Zone[];
	vehicleCategories: VehicleCategory[];
	violationTypes: ViolationType[];
}

export default function Create({ zones, vehicleCategories, violationTypes }: CreateProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = (data: any) => {
		setIsSubmitting(true);

		router.post(route('fine-rates.store'), data, {
			onSuccess: () => {
				toast.success('Fine rate created successfully');
				setIsSubmitting(false);
			},
			onError: (errors) => {
				toast.error('Failed to create fine rate');
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
			title: 'Create',
			href: route('fine-rates.create')
		}
	];

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Create Fine Rate" />

			<div className="flex h-full flex-1 flex-col gap-4 p-4">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-semibold">Create Fine Rate</h1>
				</div>

				<FineRateForm
					zones={zones}
					vehicleCategories={vehicleCategories}
					violationTypes={violationTypes}
					isSubmitting={isSubmitting}
					onSubmit={handleSubmit}
					cancelHref={route('fine-rates.index')}
					submitLabel="Create Fine Rate"
				/>
			</div>
		</AppLayout>
	);
}
