import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Zone, VehicleCategory, ViolationType, FineRate } from '@/types/vehicle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Define the schema for form validation
const formSchema = z.object({
	zone_id: z.string().min(1, { message: 'Area is required' }),
	vehicle_category_id: z.string().min(1, { message: 'Vehicle category is required' }),
	violation_type_id: z.string().min(1, { message: 'Violation type is required' }),
	amount: z
		.string()
		.min(1, { message: 'Amount is required' })
		.refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
			message: 'Amount must be a positive number'
		}),
	is_active: z.boolean().default(true)
});

// Define the type for form values
type FormValues = z.infer<typeof formSchema>;

interface FineRateFormProps {
	fineRate?: FineRate;
	zones: Zone[];
	vehicleCategories: VehicleCategory[];
	violationTypes: ViolationType[];
	isSubmitting: boolean;
	onSubmit: (data: FormValues) => void;
	cancelHref: string;
	submitLabel: string;
}

export default function FineRateForm({
	fineRate,
	zones,
	vehicleCategories,
	violationTypes,
	isSubmitting,
	onSubmit,
	cancelHref,
	submitLabel
}: FineRateFormProps) {
	// Initialize the form with default values or existing fineRate data
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: fineRate
			? {
					zone_id: fineRate.zone_id.toString(),
					vehicle_category_id: fineRate.vehicle_category_id.toString(),
					violation_type_id: fineRate.violation_type_id.toString(),
					amount: fineRate.amount.toString(),
					is_active: fineRate.is_active
				}
			: {
					zone_id: '',
					vehicle_category_id: '',
					violation_type_id: '',
					amount: '',
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
						<CardTitle>Fine Rate Details</CardTitle>
						<CardDescription>
							{fineRate ? 'Edit' : 'Create'} a fine rate for a specific area, vehicle category, and
							violation type.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="zone_id"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Area</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select an area" />
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
								name="violation_type_id"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Violation Type</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a violation type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{violationTypes.map((type) => (
													<SelectItem key={type.id} value={type.id.toString()}>
														{type.name}
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
								name="amount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Amount</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												min="0"
												placeholder="Enter amount"
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
