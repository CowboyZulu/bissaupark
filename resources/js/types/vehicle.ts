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

export interface Street {
    id: number;
    type: 'main' | 'cross';
    name: string;
    code: string;
    zone_id: number | null;
    is_active: boolean;
    start_latitude: number | null;
    end_latitude: number | null;
    start_longitude: number | null;
    end_longitude: number | null;
    path_coordinates: Array<{lat: number, lng: number}> | null;
    created_at: string;
    updated_at: string;
    zone?: Zone;
}

export interface ParkingRate {
    id: number;
    zone_id: number;
    vehicle_category_id: number;
    rate_type: 'hourly' | 'daily' | 'monthly';
    amount: number;
    start_time: string | null;
    end_time: string | null;
    is_weekend_rate: boolean;
    is_holiday_rate: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    zone?: Zone;
    vehicleCategory?: VehicleCategory;
}

export interface FineRate {
    id: number;
    zone_id: number;
    vehicle_category_id: number;
    violation_type_id: number;
    amount: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    zone?: Zone;
    vehicleCategory?: VehicleCategory;
    violationType?: ViolationType;
}

export interface ClampingRate {
    id: number;
    vehicle_category_id: number;
    amount: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    vehicleCategory?: VehicleCategory;
}

export interface TowingRate {
    id: number;
    zone_id: number;
    vehicle_category_id: number;
    service_fee: number;
    fine_amount: number;
    daily_storage_fee: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    zone?: Zone;
    vehicleCategory?: VehicleCategory;
} 