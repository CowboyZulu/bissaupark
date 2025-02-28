import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Car, Folder, LayoutGrid, TriangleAlert, Users, Map, ParkingSquare, SquarePercent, User, Truck, Key, LandPlot, Receipt, Lock, Truck as TruckIcon } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'User Management',
        url: '/users',
        icon: Users,
    },
    {
        title: 'Roles',
        url: '/roles',
        icon: Key,
    },
    {
        title: 'Vehicle Categories',
        url: '/vehicle-categories',
        icon: Truck,
    },
    {
        title: 'Drivers',
        url: '/drivers',
        icon: User,
    },
    {
        title: 'Vehicles',
        url: '/vehicles',
        icon: Car,
    },
    {
        title: 'Violation Types',
        url: '/violation-types',
        icon: TriangleAlert,
    },
    {
        title: 'Zones',
        url: '/zones',
        icon: LandPlot,
    },
    {
        title: 'Streets',
        url: '/streets',
        icon: Map,
    },
    {
        title: 'Parking Spaces',
        url: '/parking-spaces',
        icon: ParkingSquare,
    },
    {
        title: 'Parking Rates',
        url: '/parking-rates',
        icon: SquarePercent,
    },
    {
        title: 'Fine Rates',
        url: '/fine-rates',
        icon: Receipt,
    },
    {
        title: 'Clamping Rates',
        url: '/clamping-rates',
        icon: Lock,
    },
    {
        title: 'Towing Rates',
        url: '/towing-rates',
        icon: TruckIcon,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        url: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        url: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
