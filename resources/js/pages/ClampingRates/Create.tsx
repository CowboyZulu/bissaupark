import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { VehicleCategory } from '@/types/vehicle';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import ClampingRateForm from '@/components/forms/ClampingRateForm';

interface CreateProps {
	vehicleCategories: VehicleCategory[];
}

export default function Create({ vehicleCategories }: CreateProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = (data: any) => {
		setIsSubmitting(true);

		router.post(route('clamping-rates.store'), data, {
			onSuccess: () => {
				toast.success('Clamping rate created successfully');
				setIsSubmitting(false);
			},
			onError: (errors) => {
				toast.error('Failed to create clamping rate');
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
			title: 'Create',
			href: route('clamping-rates.create')
		}
	];

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Create Clamping Rate" />

			<div className="flex h-full flex-1 flex-col gap-4 p-4">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-semibold">Create Clamping Rate</h1>
				</div>

				<ClampingRateForm
					vehicleCategories={vehicleCategories}
					isSubmitting={isSubmitting}
					onSubmit={handleSubmit}
					cancelHref={route('clamping-rates.index')}
					submitLabel="Create Clamping Rate"
				/>
			</div>
		</AppLayout>
	);
}
