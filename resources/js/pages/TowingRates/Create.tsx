import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Zone, VehicleCategory } from '@/types/vehicle';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import TowingRateForm from '@/components/forms/TowingRateForm';

interface CreateProps {
	zones: Zone[];
	vehicleCategories: VehicleCategory[];
}

export default function Create({ zones, vehicleCategories }: CreateProps) {
	const [ isSubmitting, setIsSubmitting ] = useState(false);

	const handleSubmit = (data: any) => {
		setIsSubmitting(true);

		router.post(route('towing-rates.store'), data, {
			onSuccess: () => {
				toast.success('Towing rate created successfully');
				setIsSubmitting(false);
			},
			onError: (errors) => {
				toast.error('Failed to create towing rate');
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
			title: 'Create',
			href: route('towing-rates.create')
		}
	];

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Create Towing Rate" />

			<div className="flex h-full flex-1 flex-col gap-4 p-4">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-semibold">Create Towing Rate</h1>
				</div>

				<TowingRateForm
					zones={zones}
					vehicleCategories={vehicleCategories}
					isSubmitting={isSubmitting}
					onSubmit={handleSubmit}
					cancelHref={route('towing-rates.index')}
					submitLabel="Create Towing Rate"
				/>
			</div>
		</AppLayout>
	);
}
