import { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Zone, VehicleCategory, ParkingRate } from '@/types/vehicle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

interface EditProps {
    parkingRate: ParkingRate;
    zones: Zone[];
    vehicleCategories: VehicleCategory[];
}

export default function Edit({ parkingRate, zones, vehicleCategories }: EditProps) {
    const [showTimeRange, setShowTimeRange] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        zone_id: parkingRate.zone_id.toString(),
        vehicle_category_id: parkingRate.vehicle_category_id.toString(),
        rate_type: parkingRate.rate_type as 'hourly' | 'daily' | 'monthly',
        amount: parkingRate.amount.toString(),
        start_time: parkingRate.start_time || '',
        end_time: parkingRate.end_time || '',
        is_weekend_rate: parkingRate.is_weekend_rate,
        is_holiday_rate: parkingRate.is_holiday_rate,
        is_active: parkingRate.is_active
    });

    useEffect(() => {
        setShowTimeRange(data.rate_type === 'hourly');
    }, []);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard')
        },
        {
            title: 'Parking Rates',
            href: route('parking-rates.index')
        },
        {
            title: 'Edit',
            href: route('parking-rates.edit', parkingRate.id)
        }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('parking-rates.update', parkingRate.id), {
            onSuccess: () => {
                toast.success('Parking rate updated successfully');
            },
            onError: (errors) => {
                console.error(errors);
                toast.error('Failed to update parking rate');
            }
        });
    };

    const handleRateTypeChange = (value: 'hourly' | 'daily' | 'monthly') => {
        setData('rate_type', value);
        setShowTimeRange(value === 'hourly');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Parking Rate" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="max-w-3xl mx-auto w-full">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Parking Rate</CardTitle>
                            <CardDescription>
                                Update the parking rate for a specific zone and vehicle category
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="zone_id">Zone</Label>
                                        <Select
                                            value={data.zone_id}
                                            onValueChange={(value) => setData('zone_id', value)}
                                        >
                                            <SelectTrigger id="zone_id">
                                                <SelectValue placeholder="Select a zone" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {zones.map((zone) => (
                                                    <SelectItem key={zone.id} value={String(zone.id)}>
                                                        {zone.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.zone_id && (
                                            <p className="text-sm text-red-500">{errors.zone_id}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="vehicle_category_id">Vehicle Category</Label>
                                        <Select
                                            value={data.vehicle_category_id}
                                            onValueChange={(value) => setData('vehicle_category_id', value)}
                                        >
                                            <SelectTrigger id="vehicle_category_id">
                                                <SelectValue placeholder="Select a vehicle category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {vehicleCategories.map((category) => (
                                                    <SelectItem key={category.id} value={String(category.id)}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.vehicle_category_id && (
                                            <p className="text-sm text-red-500">{errors.vehicle_category_id}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="rate_type">Rate Type</Label>
                                        <Select
                                            value={data.rate_type}
                                            onValueChange={handleRateTypeChange}
                                        >
                                            <SelectTrigger id="rate_type">
                                                <SelectValue placeholder="Select rate type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="hourly">Hourly</SelectItem>
                                                <SelectItem value="daily">Daily</SelectItem>
                                                <SelectItem value="monthly">Monthly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.rate_type && (
                                            <p className="text-sm text-red-500">{errors.rate_type}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Amount</Label>
                                        <Input
                                            id="amount"
                                            type="number"
                                            step="0.01"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', e.target.value)}
                                            placeholder="0.00"
                                        />
                                        {errors.amount && (
                                            <p className="text-sm text-red-500">{errors.amount}</p>
                                        )}
                                    </div>

                                    {showTimeRange && (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="start_time">Start Time</Label>
                                                <Input
                                                    id="start_time"
                                                    type="time"
                                                    value={data.start_time}
                                                    onChange={(e) => setData('start_time', e.target.value)}
                                                />
                                                {errors.start_time && (
                                                    <p className="text-sm text-red-500">{errors.start_time}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="end_time">End Time</Label>
                                                <Input
                                                    id="end_time"
                                                    type="time"
                                                    value={data.end_time}
                                                    onChange={(e) => setData('end_time', e.target.value)}
                                                />
                                                {errors.end_time && (
                                                    <p className="text-sm text-red-500">{errors.end_time}</p>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="is_weekend_rate"
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                checked={data.is_weekend_rate}
                                                onChange={() => setData('is_weekend_rate', !data.is_weekend_rate)}
                                            />
                                        </div>
                                        <Label htmlFor="is_weekend_rate">Weekend Rate</Label>
                                        {errors.is_weekend_rate && (
                                            <p className="text-sm text-red-500">{errors.is_weekend_rate}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="is_holiday_rate"
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                checked={data.is_holiday_rate}
                                                onChange={() => setData('is_holiday_rate', !data.is_holiday_rate)}
                                            />
                                        </div>
                                        <Label htmlFor="is_holiday_rate">Holiday Rate</Label>
                                        {errors.is_holiday_rate && (
                                            <p className="text-sm text-red-500">{errors.is_holiday_rate}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="is_active"
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                checked={data.is_active}
                                                onChange={() => setData('is_active', !data.is_active)}
                                            />
                                        </div>
                                        <Label htmlFor="is_active">Active</Label>
                                        {errors.is_active && (
                                            <p className="text-sm text-red-500">{errors.is_active}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        Update Rate
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 