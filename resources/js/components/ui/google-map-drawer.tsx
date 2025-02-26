import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface GoogleMapDrawerProps {
    apiKey: string;
    initialCoordinates?: Array<{lat: number, lng: number}>;
    onPathChange: (coordinates: Array<{lat: number, lng: number}>, startPoint: {lat: number, lng: number}, endPoint: {lat: number, lng: number}) => void;
    height?: string;
    width?: string;
    center?: {lat: number, lng: number};
    zoom?: number;
}

export function GoogleMapDrawer({
    apiKey,
    initialCoordinates,
    onPathChange,
    height = '400px',
    width = '100%',
    center = { lat: 11.8636, lng: -15.5977 }, // Default center (Bissau, Guinea-Bissau)
    zoom = 14
}: GoogleMapDrawerProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [polyline, setPolyline] = useState<google.maps.Polyline | null>(null);
    const [drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(null);

    useEffect(() => {
        const loader = new Loader({
            apiKey,
            version: 'weekly',
            libraries: ['drawing', 'places']
        });

        loader.load().then(() => {
            if (mapRef.current) {
                const mapInstance = new google.maps.Map(mapRef.current, {
                    center,
                    zoom,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    streetViewControl: false,
                });
                setMap(mapInstance);

                // Initialize polyline with existing coordinates if provided
                const polylineInstance = new google.maps.Polyline({
                    path: initialCoordinates || [],
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                    editable: true,
                    draggable: true,
                    map: mapInstance
                });
                setPolyline(polylineInstance);

                // Initialize drawing manager
                const drawingManagerInstance = new google.maps.drawing.DrawingManager({
                    drawingMode: initialCoordinates?.length ? null : google.maps.drawing.OverlayType.POLYLINE,
                    drawingControl: true,
                    drawingControlOptions: {
                        position: google.maps.ControlPosition.TOP_CENTER,
                        drawingModes: [google.maps.drawing.OverlayType.POLYLINE]
                    },
                    polylineOptions: {
                        strokeColor: '#FF0000',
                        strokeOpacity: 1.0,
                        strokeWeight: 2,
                        editable: true,
                        draggable: true
                    }
                });
                drawingManagerInstance.setMap(mapInstance);
                setDrawingManager(drawingManagerInstance);

                // Add event listener for when a polyline is completed
                google.maps.event.addListener(drawingManagerInstance, 'polylinecomplete', (newPolyline: google.maps.Polyline) => {
                    // Remove the old polyline if it exists
                    if (polylineInstance) {
                        polylineInstance.setMap(null);
                    }
                    
                    // Set the new polyline
                    setPolyline(newPolyline);
                    
                    // Switch drawing mode off after drawing is complete
                    drawingManagerInstance.setDrawingMode(null);
                    
                    // Add path change listener to the new polyline
                    addPathChangeListener(newPolyline);
                    
                    // Trigger initial path change
                    const path = newPolyline.getPath();
                    const coordinates = Array.from({ length: path.getLength() }, (_, i) => {
                        const point = path.getAt(i);
                        return { lat: point.lat(), lng: point.lng() };
                    });
                    
                    if (coordinates.length > 0) {
                        const startPoint = coordinates[0];
                        const endPoint = coordinates[coordinates.length - 1];
                        onPathChange(coordinates, startPoint, endPoint);
                    }
                });

                // If we have initial coordinates, add path change listener to the initial polyline
                if (initialCoordinates?.length && polylineInstance) {
                    addPathChangeListener(polylineInstance);
                }
            }
        });

        return () => {
            // Clean up
            if (polyline) {
                polyline.setMap(null);
            }
            if (drawingManager) {
                drawingManager.setMap(null);
            }
        };
    }, [apiKey]);

    // Function to add path change listener to a polyline
    const addPathChangeListener = (polylineInstance: google.maps.Polyline) => {
        google.maps.event.addListener(polylineInstance.getPath(), 'set_at', () => {
            updatePath(polylineInstance);
        });
        google.maps.event.addListener(polylineInstance.getPath(), 'insert_at', () => {
            updatePath(polylineInstance);
        });
        google.maps.event.addListener(polylineInstance.getPath(), 'remove_at', () => {
            updatePath(polylineInstance);
        });
        google.maps.event.addListener(polylineInstance, 'dragend', () => {
            updatePath(polylineInstance);
        });
    };

    // Function to update path coordinates
    const updatePath = (polylineInstance: google.maps.Polyline) => {
        const path = polylineInstance.getPath();
        const coordinates = Array.from({ length: path.getLength() }, (_, i) => {
            const point = path.getAt(i);
            return { lat: point.lat(), lng: point.lng() };
        });
        
        if (coordinates.length > 0) {
            const startPoint = coordinates[0];
            const endPoint = coordinates[coordinates.length - 1];
            onPathChange(coordinates, startPoint, endPoint);
        }
    };

    // Function to clear the current polyline
    const clearPolyline = () => {
        if (polyline) {
            polyline.setMap(null);
            setPolyline(null);
        }
        if (drawingManager) {
            drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
        }
        onPathChange([], { lat: 0, lng: 0 }, { lat: 0, lng: 0 });
    };

    return (
        <div className="relative">
            <div ref={mapRef} style={{ height, width }} className="rounded-md border border-gray-300" />
            <button
                type="button"
                onClick={clearPolyline}
                className="absolute top-2 right-2 bg-white p-2 rounded-md shadow-md text-sm"
            >
                Clear Path
            </button>
        </div>
    );
} 