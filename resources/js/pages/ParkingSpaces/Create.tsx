import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Street } from '@/types/vehicle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { BreadcrumbItem } from '@/types';

interface CreateProps {
	streets: Street[];
	googleMapsApiKey: string;
}

export default function Create({ streets, googleMapsApiKey }: CreateProps) {
	const mapRef = useRef<HTMLDivElement>(null);
	const [ map, setMap ] = useState<google.maps.Map | null>(null);
	const [ marker, setMarker ] = useState<google.maps.Marker | null>(null);
	const [ selectedStreet, setSelectedStreet ] = useState<Street | null>(null);
	const [ polyline, setPolyline ] = useState<google.maps.Polyline | null>(null);
	const [ processing, setProcessing ] = useState(false);
	const [ mapsLoaded, setMapsLoaded ] = useState(false);

	const breadcrumbs: BreadcrumbItem[] = [
		{
			title: 'Dashboard',
			href: route('dashboard')
		},
		{
			title: 'Parking Spaces',
			href: route('parking-spaces.index')
		},
		{
			title: 'Create',
			href: route('parking-spaces.create')
		}
	];

	const { data, setData, post, processing: formProcessing, errors } = useForm({
		street_id: '',
		type: 'parallel',
		latitude: '',
		longitude: '',
		is_handicap: false,
		is_loading_zone: false,
		is_active: true
	});

	// Load Google Maps API
	useEffect(() => {
		// Log the API key for debugging (remove in production)
		console.log('Google Maps API Key:', googleMapsApiKey ? 'Present' : 'Missing');
		
		if (!googleMapsApiKey) {
			console.error('Google Maps API key is missing');
			return;
		}
		
		if (window.google?.maps) {
			console.log('Google Maps already loaded');
			setMapsLoaded(true);
			return;
		}

		const script = document.createElement('script');
		script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
		script.async = true;
		script.defer = true;
		script.onload = () => {
			console.log('Google Maps script loaded successfully');
			setMapsLoaded(true);
		};
		script.onerror = (error) => {
			console.error('Error loading Google Maps script:', error);
		};
		document.head.appendChild(script);

		return () => {
			// Clean up script if component unmounts before script loads
			if (document.head.contains(script)) {
				document.head.removeChild(script);
			}
		};
	}, [googleMapsApiKey]);

	// Initialize Google Maps
	useEffect(() => {
		if (!mapsLoaded) {
			console.log('Maps not loaded yet, skipping initialization');
			return;
		}
		
		if (!window.google?.maps) {
			console.error('Google Maps API not available despite mapsLoaded being true');
			return;
		}
		
		if (!mapRef.current) {
			console.error('Map container ref not available');
			return;
		}
		
		console.log('Initializing Google Map');
		
		const initialCenter = { lat: 11.8636, lng: -15.5977 }; // Bissau coordinates
		const mapInstance = new google.maps.Map(mapRef.current, {
			center: initialCenter,
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl: true,
			streetViewControl: true,
			fullscreenControl: true
		});

		console.log('Map instance created');
		setMap(mapInstance);

		// Add click listener to map
		mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
			if (!event.latLng) return;

			const lat = event.latLng.lat();
			const lng = event.latLng.lng();

			setData({
				...data,
				latitude: lat.toString(),
				longitude: lng.toString()
			});

			// Update or create marker
			if (marker) {
				marker.setPosition(event.latLng);
			} else {
				const newMarker = new google.maps.Marker({
					position: event.latLng,
					map: mapInstance,
					draggable: true,
					title: 'Parking Space Location'
				});

				// Add drag end listener to marker
				newMarker.addListener('dragend', () => {
					const position = newMarker.getPosition();
					if (position) {
						setData({
							...data,
							latitude: position.lat().toString(),
							longitude: position.lng().toString()
						});
					}
				});

				setMarker(newMarker);
			}
		});

		return () => {
			// Cleanup
			if (marker) {
				marker.setMap(null);
			}
			if (polyline) {
				polyline.setMap(null);
			}
		};
	}, [mapsLoaded]);

	// Update map when street changes
	useEffect(
		() => {
			if (!map || !data.street_id) return;

			const street = streets.find((s) => s.id.toString() === data.street_id);
			setSelectedStreet(street || null);

			if (street && street.path_coordinates) {
				try {
					// Clear previous polyline
					if (polyline) {
						polyline.setMap(null);
					}

					// Parse path coordinates if they're a string
					const pathCoords =
						typeof street.path_coordinates === 'string'
							? JSON.parse(street.path_coordinates)
							: street.path_coordinates;

					const pathCoordinates = pathCoords
						.map((coord: any) => {
							// Handle different coordinate formats
							if (Array.isArray(coord)) {
								return { lat: coord[0], lng: coord[1] };
							} else if (typeof coord === 'object' && 'lat' in coord && 'lng' in coord) {
								return coord;
							}
							return null;
						})
						.filter(Boolean);

					// Create new polyline
					const newPolyline = new google.maps.Polyline({
						path: pathCoordinates,
						geodesic: true,
						strokeColor: '#FF0000',
						strokeOpacity: 1.0,
						strokeWeight: 3,
						map: map
					});

					setPolyline(newPolyline);

					// Center map on street
					if (pathCoordinates.length > 0) {
						map.setCenter(pathCoordinates[0]);
						map.setZoom(17);
					}
				} catch (error) {
					console.error('Error parsing path coordinates:', error);
				}
			}
		},
		[ data.street_id, map, streets ]
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setProcessing(true);
		post(route('parking-spaces.store'), {
			onSuccess: () => {
				toast.success('Parking space created successfully');
				setProcessing(false);
			},
			onError: () => {
				toast.error('Failed to create parking space');
				setProcessing(false);
			}
		});
	};

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Create Parking Space" />

			<div className="flex h-full flex-1 flex-col gap-4 p-4">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-4">
						<Button variant="outline" size="sm" asChild>
							<Link href={route('parking-spaces.index')}>
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back
							</Link>
						</Button>
						<h1 className="text-2xl font-semibold">Create Parking Space</h1>
					</div>
				</div>

				<div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 rounded-xl border">
					<div className="p-4">
						<form onSubmit={handleSubmit}>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-6">
									<Card>
										<CardHeader>
											<CardTitle>Parking Space Details</CardTitle>
											<CardDescription>
												Enter the details for the new parking space
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="space-y-2">
												<Label htmlFor="street_id">Street</Label>
												<Select
													value={data.street_id}
													onValueChange={(value) => setData('street_id', value)}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select a street" />
													</SelectTrigger>
													<SelectContent>
														{streets.map((street) => (
															<SelectItem key={street.id} value={street.id.toString()}>
																{street.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												{errors.street_id && (
													<p className="text-sm text-red-500">{errors.street_id}</p>
												)}
											</div>

											<div className="space-y-2">
												<Label htmlFor="type">Parking Type</Label>
												<Select
													value={data.type}
													onValueChange={(value) => setData('type', value)}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select parking type" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="parallel">Parallel</SelectItem>
														<SelectItem value="perpendicular">Perpendicular</SelectItem>
														<SelectItem value="angled">Angled</SelectItem>
													</SelectContent>
												</Select>
												{errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
											</div>

											<div className="grid grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor="latitude">Latitude</Label>
													<Input
														id="latitude"
														type="text"
														value={data.latitude}
														onChange={(e) => setData('latitude', e.target.value)}
														placeholder="Click on map"
														readOnly
													/>
													{errors.latitude && (
														<p className="text-sm text-red-500">{errors.latitude}</p>
													)}
												</div>

												<div className="space-y-2">
													<Label htmlFor="longitude">Longitude</Label>
													<Input
														id="longitude"
														type="text"
														value={data.longitude}
														onChange={(e) => setData('longitude', e.target.value)}
														placeholder="Click on map"
														readOnly
													/>
													{errors.longitude && (
														<p className="text-sm text-red-500">{errors.longitude}</p>
													)}
												</div>
											</div>

											<div className="space-y-4">
												<div className="flex items-center space-x-2">
													<Checkbox
														id="is_handicap"
														checked={data.is_handicap}
														onCheckedChange={(checked) =>
															setData('is_handicap', checked as boolean)}
													/>
													<Label htmlFor="is_handicap">Handicap Space</Label>
												</div>
												{errors.is_handicap && (
													<p className="text-sm text-red-500">{errors.is_handicap}</p>
												)}

												<div className="flex items-center space-x-2">
													<Checkbox
														id="is_loading_zone"
														checked={data.is_loading_zone}
														onCheckedChange={(checked) =>
															setData('is_loading_zone', checked as boolean)}
													/>
													<Label htmlFor="is_loading_zone">Loading Zone</Label>
												</div>
												{errors.is_loading_zone && (
													<p className="text-sm text-red-500">{errors.is_loading_zone}</p>
												)}

												<div className="flex items-center space-x-2">
													<Checkbox
														id="is_active"
														checked={data.is_active}
														onCheckedChange={(checked) =>
															setData('is_active', checked as boolean)}
													/>
													<Label htmlFor="is_active">Active</Label>
												</div>
												{errors.is_active && (
													<p className="text-sm text-red-500">{errors.is_active}</p>
												)}
											</div>
										</CardContent>
									</Card>

									<div className="flex justify-end">
										<Button type="submit" disabled={formProcessing || processing}>
											Create Parking Space
										</Button>
									</div>
								</div>

								<Card>
									<CardHeader>
										<CardTitle>Location</CardTitle>
										<CardDescription>
											Click on the map to set the parking space location
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div
											ref={mapRef}
											style={{ height: '500px', width: '100%' }}
											className="rounded-md border"
											id="map"
										/>
										{selectedStreet && (
											<p className="mt-2 text-sm text-gray-500">
												Selected Street: {selectedStreet.name}
											</p>
										)}
									</CardContent>
								</Card>
							</div>
						</form>
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
