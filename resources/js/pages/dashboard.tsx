import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, Car, DollarSign, ParkingSquare, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import * as RechartsPrimitive from "recharts";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Sample data for charts
const parkingData = [
    { name: 'Mon', value: 120 },
    { name: 'Tue', value: 150 },
    { name: 'Wed', value: 180 },
    { name: 'Thu', value: 145 },
    { name: 'Fri', value: 190 },
    { name: 'Sat', value: 210 },
    { name: 'Sun', value: 95 },
];

const revenueData = [
    { name: 'Mon', value: 2400 },
    { name: 'Tue', value: 1398 },
    { name: 'Wed', value: 9800 },
    { name: 'Thu', value: 3908 },
    { name: 'Fri', value: 4800 },
    { name: 'Sat', value: 3800 },
    { name: 'Sun', value: 4300 },
];

// Sample data for recent activities
const recentActivities = [
    { id: 1, type: 'Parking', vehicle: 'ABC-123', location: 'Zone A, Space 12', time: '10:30 AM', status: 'Active' },
    { id: 2, type: 'Payment', vehicle: 'XYZ-789', location: 'Zone B, Space 5', time: '09:45 AM', status: 'Completed' },
    { id: 3, type: 'Violation', vehicle: 'DEF-456', location: 'Zone C, Space 8', time: '11:15 AM', status: 'Pending' },
    { id: 4, type: 'Towing', vehicle: 'GHI-789', location: 'Zone A, Space 3', time: '08:20 AM', status: 'Completed' },
    { id: 5, type: 'Parking', vehicle: 'JKL-012', location: 'Zone D, Space 15', time: '12:05 PM', status: 'Active' },
];

// Chart config for colors
const chartConfig = {
    parking: {
        label: "Parking Sessions",
        color: "hsl(var(--chart-1))"
    },
    revenue: {
        label: "Revenue",
        color: "hsl(var(--chart-2))"
    }
};

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$45,231.89</div>
                            <p className="text-xs text-muted-foreground">
                                +20.1% from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Parking</CardTitle>
                            <ParkingSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">245</div>
                            <p className="text-xs text-muted-foreground">
                                +12.5% from last week
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Violations</CardTitle>
                            <TriangleAlert className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">32</div>
                            <p className="text-xs text-muted-foreground">
                                -4.1% from yesterday
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Registered Vehicles</CardTitle>
                            <Car className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1,324</div>
                            <p className="text-xs text-muted-foreground">
                                +5.2% from last month
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Weekly Parking Activity</CardTitle>
                            <CardDescription>
                                Number of parking sessions per day
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                            <ChartContainer config={chartConfig}>
                                <RechartsPrimitive.BarChart data={parkingData}>
                                    <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
                                    <RechartsPrimitive.XAxis dataKey="name" />
                                    <RechartsPrimitive.YAxis />
                                    <RechartsPrimitive.Tooltip content={<ChartTooltipContent />} />
                                    <RechartsPrimitive.Bar 
                                        dataKey="value" 
                                        name="parking"
                                        fill="hsl(var(--chart-1))" 
                                        radius={[4, 4, 0, 0]} 
                                    />
                                </RechartsPrimitive.BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue Trend</CardTitle>
                            <CardDescription>
                                Daily revenue for the past week
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                            <ChartContainer config={chartConfig}>
                                <RechartsPrimitive.LineChart data={revenueData}>
                                    <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
                                    <RechartsPrimitive.XAxis dataKey="name" />
                                    <RechartsPrimitive.YAxis />
                                    <RechartsPrimitive.Tooltip content={<ChartTooltipContent />} />
                                    <RechartsPrimitive.Area 
                                        type="monotone" 
                                        dataKey="value" 
                                        name="revenue"
                                        stroke="hsl(var(--chart-2))" 
                                        fill="hsl(var(--chart-2))" 
                                        fillOpacity={0.2}
                                        strokeWidth={2} 
                                    />
                                </RechartsPrimitive.LineChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Recent Activity</CardTitle>
                            <Button variant="outline" size="sm">
                                View All
                                <ArrowUpRight className="ml-1 h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Vehicle</TableHead>
                                    <TableHead className="hidden md:table-cell">Location</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentActivities.map((activity) => (
                                    <TableRow key={activity.id}>
                                        <TableCell>{activity.type}</TableCell>
                                        <TableCell>{activity.vehicle}</TableCell>
                                        <TableCell className="hidden md:table-cell">{activity.location}</TableCell>
                                        <TableCell>{activity.time}</TableCell>
                                        <TableCell>
                                            <Badge 
                                                variant={
                                                    activity.status === 'Active' ? 'default' : 
                                                    activity.status === 'Completed' ? 'secondary' : 'destructive'
                                                }
                                            >
                                                {activity.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
