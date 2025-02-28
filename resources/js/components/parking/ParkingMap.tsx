import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

// Define custom marker icons
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

// Map center adjustment component
function MapCenterAdjust({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface ParkingSpace {
  id: number;
  street_id: number;
  space_number: string;
  type: 'parallel' | 'perpendicular' | 'angled';
  latitude: number;
  longitude: number;
  is_handicap: boolean;
  is_loading_zone: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  street?: {
    id: number;
    name: string;
  };
}

interface ParkingMapProps {
  parkingSpaces: ParkingSpace[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function ParkingMap({ parkingSpaces, onEdit, onDelete }: ParkingMapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([12.1657, -15.1125]); // Default to Bissau coordinates
  const [mapZoom, setMapZoom] = useState(15);

  // Fix Leaflet icon issues
  useEffect(() => {
    // Only run this code on the client side
    if (typeof window !== 'undefined') {
      // Fix Leaflet's icon paths
      // @ts-ignore - Leaflet types don't include _getIconUrl but it exists at runtime
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });
    }
  }, []);

  useEffect(() => {
    // If we have parking spaces with coordinates, center the map on the first one
    if (parkingSpaces.length > 0) {
      const spacesWithCoords = parkingSpaces.filter(
        space => space.latitude && space.longitude
      );
      
      if (spacesWithCoords.length > 0) {
        const firstSpace = spacesWithCoords[0];
        setMapCenter([firstSpace.latitude, firstSpace.longitude]);
      }
    }
  }, [parkingSpaces]);

  const getSpaceIcon = (space: ParkingSpace) => {
    if (!space.is_active) return createCustomIcon('#9CA3AF'); // gray
    if (space.is_handicap) return createCustomIcon('#3B82F6'); // blue
    if (space.is_loading_zone) return createCustomIcon('#EAB308'); // yellow
    return createCustomIcon('#22C55E'); // green
  };

  const getSpaceTypeIcon = (type: string) => {
    switch (type) {
      case 'parallel':
        return '⟺';
      case 'perpendicular':
        return '⊥';
      case 'angled':
        return '∠';
      default:
        return '⊥';
    }
  };

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapCenterAdjust center={mapCenter} zoom={mapZoom} />
        
        {parkingSpaces.map(space => {
          // Only show markers for spaces with coordinates
          if (!space.latitude || !space.longitude) return null;
          
          return (
            <Marker
              key={space.id}
              position={[space.latitude, space.longitude]}
              icon={getSpaceIcon(space)}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="font-medium">
                      Space {space.space_number}
                    </div>
                    <Badge variant={space.is_active ? 'default' : 'destructive'}>
                      {space.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="mb-2 text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {space.street?.name || 'Unknown Street'}
                  </div>
                  
                  <div className="mb-2 flex flex-wrap gap-1">
                    <Badge variant="outline">
                      {getSpaceTypeIcon(space.type)} {space.type}
                    </Badge>
                    {space.is_handicap && (
                      <Badge variant="secondary">Handicap</Badge>
                    )}
                    {space.is_loading_zone && (
                      <Badge variant="secondary">Loading Zone</Badge>
                    )}
                  </div>
                  
                  <div className="mt-3 flex justify-end gap-2">
                    {onEdit && (
                      <Button variant="outline" size="sm" onClick={() => onEdit(space.id)}>
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button variant="destructive" size="sm" onClick={() => onDelete(space.id)}>
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
} 