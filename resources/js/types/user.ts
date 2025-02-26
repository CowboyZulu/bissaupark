export interface Role {
    id: number;
    name: string;
    slug: string;
    description: string | null;
}

export interface Permission {
    id: number;
    name: string;
    slug: string;
    description: string | null;
}

export interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[];
    created_at: string;
    updated_at: string;
}
