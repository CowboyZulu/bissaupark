import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Street } from '@/types/vehicle';
import { Head, Link } from '@inertiajs/react';
import { Edit, ArrowLeft } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface Props {
    street: Street;
    googleMapsApiKey: string;
}

export default function Show({ street, googleMapsApiKey }: Props) {
    const mapRef = useRef<HTMLDivElement>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
        {
            title: 'Streets',
            href: route('streets.index'),
        },
        {
            title: street.name,
            href: route('streets.show', street.id),
        },
    ];

    useEffect(() => {
        if (!street.path_coordinates || street.path_coordinates.length === 0) {
            return;
        }

        const loader = new Loader({
            apiKey: googleMapsApiKey,
            version: 'weekly',
        });

        loader.load().then(() => {
            if (mapRef.current) {
                // Find center of the path
                let bounds = new google.maps.LatLngBounds();
                const coordinates = street.path_coordinates || [];
                coordinates.forEach(coord => {
                    bounds.extend(new google.maps.LatLng(coord.lat, coord.lng));
                });

                const map = new google.maps.Map(mapRef.current, {
                    center: bounds.getCenter(),
                    zoom: 14,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    streetViewControl: false,
                });

                // Fit map to bounds
                map.fitBounds(bounds);

                // Create polyline
                const polyline = new google.maps.Polyline({
                    path: coordinates,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                    map: map
                });

                // Add info window for the polyline
                const infoWindow = new google.maps.InfoWindow();
                
                // Add click listener to the polyline
                google.maps.event.addListener(polyline, 'click', (event: google.maps.PolyMouseEvent) => {
                    const content = `
                        <div>
                            <h3 style="font-weight: bold; margin-bottom: 5px;">${street.name}</h3>
                            <p><strong>Type:</strong> ${street.type === 'main' ? 'Main Street' : 'Cross Street'}</p>
                            <p><strong>Code:</strong> ${street.code}</p>
                            <p><strong>Zone:</strong> ${street.zone?.name || 'N/A'}</p>
                            <p><strong>Points:</strong> ${coordinates.length}</p>
                        </div>
                    `;
                    infoWindow.setContent(content);
                    infoWindow.setPosition(event.latLng);
                    infoWindow.open(map);
                });

                // Get start and end points
                const startPoint = coordinates[0];
                const endPoint = coordinates[coordinates.length - 1];

                // Add markers for start and end points
                if (startPoint) {
                    const startMarker = new google.maps.Marker({
                        position: { lat: startPoint.lat, lng: startPoint.lng },
                        map: map,
                        title: 'Start Point',
                        label: 'S',
                        animation: google.maps.Animation.DROP
                    });
                    
                    // Add info window for start marker
                    const startInfoWindow = new google.maps.InfoWindow({
                        content: `
                            <div>
                                <h3 style="font-weight: bold; margin-bottom: 5px;">Start Point</h3>
                                <p><strong>Latitude:</strong> ${startPoint.lat.toFixed(6)}</p>
                                <p><strong>Longitude:</strong> ${startPoint.lng.toFixed(6)}</p>
                            </div>
                        `
                    });
                    
                    startMarker.addListener('click', () => {
                        startInfoWindow.open(map, startMarker);
                    });
                }

                if (endPoint) {
                    const endMarker = new google.maps.Marker({
                        position: { lat: endPoint.lat, lng: endPoint.lng },
                        map: map,
                        title: 'End Point',
                        label: 'E',
                        animation: google.maps.Animation.DROP
                    });
                    
                    // Add info window for end marker
                    const endInfoWindow = new google.maps.InfoWindow({
                        content: `
                            <div>
                                <h3 style="font-weight: bold; margin-bottom: 5px;">End Point</h3>
                                <p><strong>Latitude:</strong> ${endPoint.lat.toFixed(6)}</p>
                                <p><strong>Longitude:</strong> ${endPoint.lng.toFixed(6)}</p>
                            </div>
                        `
                    });
                    
                    endMarker.addListener('click', () => {
                        endInfoWindow.open(map, endMarker);
                    });
                }
            }
        });
    }, [street, googleMapsApiKey]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Street: ${street.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('streets.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-semibold">{street.name}</h1>
                        <span className={`inline-block px-2 py-1 rounded text-xs ${street.type === 'main' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                            {street.type === 'main' ? 'Main Street' : 'Cross Street'}
                        </span>
                        <span className={`inline-block px-2 py-1 rounded text-xs ${street.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {street.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={route('streets.edit', street.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 rounded-xl border">
                    <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h2 className="text-lg font-medium mb-2">Street Details</h2>
                                <div className="space-y-2">
                                    <div>
                                        <span className="font-medium">Code:</span> {street.code}
                                    </div>
                                    <div>
                                        <span className="font-medium">Zone:</span> {street.zone?.name || 'N/A'}
                                    </div>
                                    <div>
                                        <span className="font-medium">Created:</span> {new Date(street.created_at).toLocaleDateString()}
                                    </div>
                                    <div>
                                        <span className="font-medium">Last Updated:</span> {new Date(street.updated_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-lg font-medium mb-2">Location Details</h2>
                                <div className="space-y-2">
                                    <div>
                                        <span className="font-medium">Start Point:</span> {
                                            (typeof street.start_latitude === 'number' && typeof street.start_longitude === 'number') 
                                            ? `${street.start_latitude.toFixed(6)}, ${street.start_longitude.toFixed(6)}`
                                            : (street.path_coordinates && street.path_coordinates.length > 0)
                                            ? `${street.path_coordinates[0].lat.toFixed(6)}, ${street.path_coordinates[0].lng.toFixed(6)}`
                                            : 'N/A, N/A'
                                        }
                                    </div>
                                    <div>
                                        <span className="font-medium">End Point:</span> {
                                            (typeof street.end_latitude === 'number' && typeof street.end_longitude === 'number')
                                            ? `${street.end_latitude.toFixed(6)}, ${street.end_longitude.toFixed(6)}`
                                            : (street.path_coordinates && street.path_coordinates.length > 0)
                                            ? `${street.path_coordinates[street.path_coordinates.length - 1].lat.toFixed(6)}, ${street.path_coordinates[street.path_coordinates.length - 1].lng.toFixed(6)}`
                                            : 'N/A, N/A'
                                        }
                                    </div>
                                    <div>
                                        <span className="font-medium">Path Points:</span> {street.path_coordinates?.length || 0}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h2 className="text-lg font-medium mb-2">Street Map</h2>
                        {street.path_coordinates && street.path_coordinates.length > 0 ? (
                            <div className="mb-2 text-sm text-gray-500">Click on the street path or markers for more details.</div>
                        ) : null}
                        {street.path_coordinates && street.path_coordinates.length > 0 ? (
                            <div ref={mapRef} style={{ height: '500px', width: '100%' }} className="rounded-md border border-gray-300" />
                        ) : (
                            <div className="p-4 bg-gray-100 rounded-md text-center">
                                No map data available for this street.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 