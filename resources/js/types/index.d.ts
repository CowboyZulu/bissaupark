export interface Zone {
    id: number;
    name: string;
    code: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Street {
    id: number;
    zone_id: number;
    name: string;
    code: string;
    path_coordinates: string | any[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
    zone?: Zone;
}

export interface ParkingSpace {
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
    street: Street;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
}

export interface PageProps {
    [key: string]: any;
}

export interface BreadcrumbItem {
    title: string;
    href?: string;
    active?: boolean;
} 