export interface VehicleCategory {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface Driver {
    id: number;
    license_number: string;
    first_name: string;
    last_name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    license_expiry: string;
    created_at: string;
    updated_at: string;
    full_name?: string;
}

export interface Vehicle {
    id: number;
    plate_number: string;
    category_id: number;
    model: string;
    make: string;
    color: string;
    driver_id: number | null;
    created_at: string;
    updated_at: string;
    category?: VehicleCategory;
    driver?: Driver;
}

export interface ViolationType {
    id: number;
    name: string;
    code: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Zone {
    id: number;
    name: string;
    code: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
} 