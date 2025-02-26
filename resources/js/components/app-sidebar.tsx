import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Car, Folder, LayoutGrid, TriangleAlert, Users, Map, ParkingSquare } from 'lucide-react';
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
        icon: Users,
    },
    {
        title: 'Vehicle Categories',
        url: '/vehicle-categories',
        icon: Users,
    },
    {
        title: 'Drivers',
        url: '/drivers',
        icon: Car,
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
        icon: Map,
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
