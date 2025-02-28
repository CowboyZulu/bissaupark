import { Link } from '@inertiajs/react';
import { Zone, VehicleCategory, TowingRate } from '@/types/vehicle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Define the schema for form validation
const formSchema = z.object({
	zone_id: z.string().min(1, { message: 'Zone is required' }),
	vehicle_category_id: z.string().min(1, { message: 'Vehicle category is required' }),
	service_fee: z
		.string()
		.min(1, { message: 'Service fee is required' })
		.refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
			message: 'Service fee must be a positive number'
		}),
	fine_amount: z
		.string()
		.min(1, { message: 'Fine amount is required' })
		.refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
			message: 'Fine amount must be a positive number'
		}),
	daily_storage_fee: z
		.string()
		.min(1, { message: 'Daily storage fee is required' })
		.refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
			message: 'Daily storage fee must be a positive number'
		}),
	is_active: z.boolean().default(true)
});

// Define the type for form values
type FormValues = z.infer<typeof formSchema>;

interface TowingRateFormProps {
	towingRate?: TowingRate;
	zones: Zone[];
	vehicleCategories: VehicleCategory[];
	isSubmitting: boolean;
	onSubmit: (data: FormValues) => void;
	cancelHref: string;
	submitLabel: string;
}

export default function TowingRateForm({
	towingRate,
	zones,
	vehicleCategories,
	isSubmitting,
	onSubmit,
	cancelHref,
	submitLabel
}: TowingRateFormProps) {
	// Initialize the form with default values or existing towingRate data
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: towingRate
			? {
					zone_id: towingRate.zone_id.toString(),
					vehicle_category_id: towingRate.vehicle_category_id.toString(),
					service_fee: towingRate.service_fee.toString(),
					fine_amount: towingRate.fine_amount.toString(),
					daily_storage_fee: towingRate.daily_storage_fee.toString(),
					is_active: towingRate.is_active
				}
			: {
					zone_id: '',
					vehicle_category_id: '',
					service_fee: '',
					fine_amount: '',
					daily_storage_fee: '',
					is_active: true
				}
	});

	const handleFormSubmit = (data: FormValues) => {
		onSubmit(data);
	};

	return (
		<Card>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleFormSubmit)}>
					<CardHeader>
						<CardTitle>Towing Rate Details</CardTitle>
						<CardDescription>
							{towingRate ? 'Edit' : 'Create'} a towing rate for a specific zone and vehicle category.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="zone_id"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Zone</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a zone" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{zones.map((zone) => (
													<SelectItem key={zone.id} value={zone.id.toString()}>
														{zone.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="vehicle_category_id"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Vehicle Category</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a vehicle category" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{vehicleCategories.map((category) => (
													<SelectItem key={category.id} value={category.id.toString()}>
														{category.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="service_fee"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Service Fee</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												min="0"
												placeholder="Enter service fee"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="fine_amount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Fine Amount</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												min="0"
												placeholder="Enter fine amount"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="daily_storage_fee"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Daily Storage Fee</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												min="0"
												placeholder="Enter daily storage fee"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="is_active"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center space-x-2 space-y-0">
									<FormControl>
										<Switch checked={field.value} onCheckedChange={field.onChange} />
									</FormControl>
									<FormLabel>Active</FormLabel>
								</FormItem>
							)}
						/>
					</CardContent>
					<CardFooter className="flex justify-between">
						<Button variant="outline" type="button" asChild>
							<Link href={cancelHref}>Cancel</Link>
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? 'Submitting...' : submitLabel}
						</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	);
}
