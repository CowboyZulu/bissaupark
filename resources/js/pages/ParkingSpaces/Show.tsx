import React, { useEffect, useRef, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit } from 'lucide-react';
import { ParkingSpace, BreadcrumbItem } from '@/types';

interface ShowProps {
	parkingSpace: ParkingSpace;
	googleMapsApiKey: string;
}

export default function Show({ parkingSpace, googleMapsApiKey }: ShowProps) {
	const mapRef = useRef<HTMLDivElement>(null);
	const [ map, setMap ] = useState<google.maps.Map | null>(null);
	const [ marker, setMarker ] = useState<google.maps.Marker | null>(null);
	const [ polyline, setPolyline ] = useState<google.maps.Polyline | null>(null);
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
			title: parkingSpace.space_number,
			href: route('parking-spaces.show', parkingSpace.id)
		}
	];

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
		
		const parkingLocation = {
			lat: parseFloat(parkingSpace.latitude.toString()),
			lng: parseFloat(parkingSpace.longitude.toString())
		};

		const mapInstance = new google.maps.Map(mapRef.current, {
			center: parkingLocation,
			zoom: 18,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl: true,
			streetViewControl: true,
			fullscreenControl: true
		});

		console.log('Map instance created');
		setMap(mapInstance);

		// Create marker for parking space
		const parkingMarker = new google.maps.Marker({
			position: parkingLocation,
			map: mapInstance,
			title: `Parking Space ${parkingSpace.space_number}`,
			icon: {
				path: google.maps.SymbolPath.CIRCLE,
				scale: 8,
				fillColor: parkingSpace.is_handicap ? '#1E88E5' : parkingSpace.is_loading_zone ? '#FFC107' : '#4CAF50',
				fillOpacity: 1,
				strokeWeight: 2,
				strokeColor: '#FFFFFF'
			}
		});

		// Add info window to marker
		const infoWindow = new google.maps.InfoWindow({
			content: `
        <div style="padding: 8px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold;">${parkingSpace.space_number}</h3>
          <p style="margin: 0 0 4px 0;">Street: ${parkingSpace.street.name}</p>
          <p style="margin: 0 0 4px 0;">Type: ${getTypeLabel(parkingSpace.type)}</p>
          ${parkingSpace.is_handicap ? '<p style="margin: 0 0 4px 0; color: #1E88E5;">Handicap Space</p>' : ''}
          ${parkingSpace.is_loading_zone ? '<p style="margin: 0 0 4px 0; color: #FFC107;">Loading Zone</p>' : ''}
        </div>
      `
		});

		parkingMarker.addListener('click', () => {
			infoWindow.open(mapInstance, parkingMarker);
		});

		setMarker(parkingMarker);

		// Draw street polyline if available
		if (parkingSpace.street && parkingSpace.street.path_coordinates) {
			try {
				const path = JSON.parse(parkingSpace.street.path_coordinates);
				const pathCoordinates = path.map((coord: [number, number]) => ({
					lat: coord[0],
					lng: coord[1]
				}));

				const streetPolyline = new google.maps.Polyline({
					path: pathCoordinates,
					geodesic: true,
					strokeColor: '#FF0000',
					strokeOpacity: 1.0,
					strokeWeight: 3,
					map: mapInstance
				});

				setPolyline(streetPolyline);
			} catch (error) {
				console.error('Error parsing path coordinates:', error);
			}
		}

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

	const getTypeLabel = (type: string) => {
		switch (type) {
			case 'parallel':
				return 'Parallel';
			case 'perpendicular':
				return 'Perpendicular';
			case 'angled':
				return 'Angled';
			default:
				return type;
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title={`Parking Space: ${parkingSpace.space_number}`} />

			<div className="flex h-full flex-1 flex-col gap-4 p-4">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-4">
						<Button variant="outline" size="sm" asChild>
							<Link href={route('parking-spaces.index')}>
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back
							</Link>
						</Button>
						<h1 className="text-2xl font-semibold">Parking Space: {parkingSpace.space_number}</h1>
						<Badge variant="outline">{getTypeLabel(parkingSpace.type)}</Badge>
						{parkingSpace.is_active ? (
							<Badge className="bg-green-500">Active</Badge>
						) : (
							<Badge variant="destructive">Inactive</Badge>
						)}
						{parkingSpace.is_handicap && <Badge className="bg-blue-500">Handicap</Badge>}
						{parkingSpace.is_loading_zone && <Badge className="bg-yellow-500">Loading Zone</Badge>}
					</div>
					<Button variant="outline" size="sm" asChild>
						<Link href={route('parking-spaces.edit', parkingSpace.id)}>
							<Edit className="mr-2 h-4 w-4" />
							Edit
						</Link>
					</Button>
				</div>

				<div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 rounded-xl border">
					<div className="p-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
							<div>
								<h2 className="text-lg font-medium mb-2">Parking Space Details</h2>
								<div className="space-y-2">
									<div>
										<span className="font-medium">Space Number:</span> {parkingSpace.space_number}
									</div>
									<div>
										<span className="font-medium">Street:</span> {parkingSpace.street.name}
									</div>
									<div>
										<span className="font-medium">Type:</span> {getTypeLabel(parkingSpace.type)}
									</div>
									<div>
										<span className="font-medium">Created:</span>{' '}
										{formatDate(parkingSpace.created_at)}
									</div>
									<div>
										<span className="font-medium">Last Updated:</span>{' '}
										{formatDate(parkingSpace.updated_at)}
									</div>
								</div>
							</div>
							<div>
								<h2 className="text-lg font-medium mb-2">Location Details</h2>
								<div className="space-y-2">
									<div>
										<span className="font-medium">Latitude:</span> {parkingSpace.latitude}
									</div>
									<div>
										<span className="font-medium">Longitude:</span> {parkingSpace.longitude}
									</div>
									<div>
										<span className="font-medium">Special Features:</span>
										<div className="mt-1 flex gap-2">
											{parkingSpace.is_handicap && (
												<Badge className="bg-blue-500">Handicap</Badge>
											)}
											{parkingSpace.is_loading_zone && (
												<Badge className="bg-yellow-500">Loading Zone</Badge>
											)}
											{!parkingSpace.is_handicap &&
											!parkingSpace.is_loading_zone && <span>None</span>}
										</div>
									</div>
									<div>
										<span className="font-medium">Status:</span>
										<div className="mt-1">
											{parkingSpace.is_active ? (
												<Badge className="bg-green-500">Active</Badge>
											) : (
												<Badge variant="destructive">Inactive</Badge>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>

						<h2 className="text-lg font-medium mb-2">Parking Space Location</h2>
						<div className="mb-2 text-sm text-gray-500">Click on the marker for more details.</div>
						<div
							ref={mapRef}
							style={{ height: '500px', width: '100%' }}
							className="rounded-md border border-gray-300"
						/>
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
