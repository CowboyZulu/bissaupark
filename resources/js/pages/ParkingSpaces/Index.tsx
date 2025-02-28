import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { toast } from 'sonner';
import { BreadcrumbItem } from '@/types';
import { Street } from '@/types/vehicle';
import { DataTable } from '@/components/ui/data-table';
import { createParkingSpaceColumns } from '@/utils/table-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { MapPin, Car, Filter, Plus, Search, Map as MapIcon, List, Grid } from 'lucide-react';
import ParkingMap from '@/components/parking/ParkingMap';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HelpCircle, Keyboard } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, Trash } from 'lucide-react';

// Define ParkingSpace interface locally to fix the import error
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
	street: Street;
}

interface ParkingSpacesIndexProps {
	parkingSpaces: {
		data: ParkingSpace[];
		links: any[];
		from: number;
		to: number;
		total: number;
		current_page: number;
		last_page: number;
	};
	streets: Street[];
}

export default function Index({ parkingSpaces, streets = [] }: ParkingSpacesIndexProps) {
	const [ processing, setProcessing ] = useState<number | null>(null);
	const [ viewMode, setViewMode ] = useState<'table' | 'map' | 'cards'>(() => {
		// Try to get the saved preference from localStorage
		if (typeof window !== 'undefined') {
			const savedViewMode = localStorage.getItem('parkingSpacesViewMode');
			if (savedViewMode === 'table' || savedViewMode === 'map' || savedViewMode === 'cards') {
				return savedViewMode;
			}
		}
		return 'table'; // Default to table view
	});
	const [ searchQuery, setSearchQuery ] = useState('');
	const [ selectedStreet, setSelectedStreet ] = useState<string>('all');
	const [ selectedType, setSelectedType ] = useState<string>('all');
	const [ selectedStatus, setSelectedStatus ] = useState<string>('all');
	const [ isFiltering, setIsFiltering ] = useState(false);
	const [ spaceToDelete, setSpaceToDelete ] = useState<number | null>(null);

	const breadcrumbs: BreadcrumbItem[] = [
		{
			title: 'Dashboard',
			href: route('dashboard')
		},
		{
			title: 'Parking Spaces',
			href: route('parking-spaces.index')
		}
	];

	const handleDelete = (id: number) => {
		setProcessing(id);
		router.delete(route('parking-spaces.destroy', id), {
			onSuccess: () => {
				setProcessing(null);
				toast.success('Parking space deleted successfully');
			},
			onError: () => {
				setProcessing(null);
				toast.error('Failed to delete parking space');
			}
		});
	};

	const confirmDelete = (id: number) => {
		setSpaceToDelete(id);
	};

	const columns = createParkingSpaceColumns(handleDelete);

	const handlePageChange = (page: number) => {
		router.visit(route('parking-spaces.index', { page }));
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setIsFiltering(true);
		const params: Record<string, any> = { search: searchQuery };
		
		if (selectedStreet !== 'all') {
			params.street = selectedStreet;
		}
		
		if (selectedType !== 'all') {
			params.type = selectedType;
		}
		
		if (selectedStatus !== 'all') {
			params.status = selectedStatus;
		}
		
		router.visit(route('parking-spaces.index', params), {
			onFinish: () => setIsFiltering(false)
		});
	};

	const getSpaceStatusColor = (space: ParkingSpace) => {
		if (!space.is_active) return 'bg-gray-400';
		if (space.is_handicap) return 'bg-blue-500';
		if (space.is_loading_zone) return 'bg-yellow-500';
		return 'bg-green-500';
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

	const changeViewMode = (mode: 'table' | 'map' | 'cards') => {
		console.log('Changing view mode to:', mode);
		setViewMode(mode);
		
		// Save the preference to localStorage
		if (typeof window !== 'undefined') {
			localStorage.setItem('parkingSpacesViewMode', mode);
		}
	};

	// Add keyboard shortcuts for view switching
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Only respond to keyboard shortcuts if not in an input field
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
				return;
			}
			
			if (e.key === '1' || e.key === 't') {
				changeViewMode('table');
			} else if (e.key === '2' || e.key === 'c') {
				changeViewMode('cards');
			} else if (e.key === '3' || e.key === 'm') {
				changeViewMode('map');
			}
		};
		
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Parking Spaces" />

			<div className="flex h-full flex-1 flex-col gap-4 p-4">
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<h1 className="text-2xl font-semibold">Parking Spaces</h1>
					<div className="flex items-center gap-2">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										size="icon"
										onClick={() => changeViewMode('table')}
										className={viewMode === 'table' ? 'bg-primary text-primary-foreground' : ''}
									>
										<List className="h-4 w-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Table View (Press 1 or T)</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										size="icon"
										onClick={() => changeViewMode('cards')}
										className={viewMode === 'cards' ? 'bg-primary text-primary-foreground' : ''}
									>
										<Grid className="h-4 w-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Card View (Press 2 or C)</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										size="icon"
										onClick={() => changeViewMode('map')}
										className={viewMode === 'map' ? 'bg-primary text-primary-foreground' : ''}
									>
										<MapIcon className="h-4 w-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Map View (Press 3 or M)</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<Button asChild>
							<a href={route('parking-spaces.create')}>
								<Plus className="mr-2 h-4 w-4" />
								Add Parking Space
							</a>
						</Button>
						
						<Dialog>
							<DialogTrigger asChild>
								<Button variant="ghost" size="icon" title="Keyboard Shortcuts">
									<Keyboard className="h-4 w-4" />
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Keyboard Shortcuts</DialogTitle>
									<DialogDescription>
										Use these keyboard shortcuts to navigate quickly
									</DialogDescription>
								</DialogHeader>
								<div className="grid gap-4 py-4">
									<div className="grid grid-cols-2 items-center gap-4">
										<div className="font-medium">Switch to Table View</div>
										<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
											1 or T
										</kbd>
									</div>
									<div className="grid grid-cols-2 items-center gap-4">
										<div className="font-medium">Switch to Card View</div>
										<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
											2 or C
										</kbd>
									</div>
									<div className="grid grid-cols-2 items-center gap-4">
										<div className="font-medium">Switch to Map View</div>
										<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
											3 or M
										</kbd>
									</div>
								</div>
							</DialogContent>
						</Dialog>
					</div>
				</div>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle>Filter Parking Spaces</CardTitle>
						<CardDescription>Filter spaces by number, street, type, or status</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row">
							<div className="relative flex-1">
								<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									type="search"
									placeholder="Search by space number..."
									className="pl-8"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
							<Select value={selectedStreet} onValueChange={setSelectedStreet}>
								<SelectTrigger className="w-full md:w-[180px]">
									<SelectValue placeholder="Select Street" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Streets</SelectItem>
									{streets.map((street) => (
										<SelectItem key={street.id} value={street.id.toString()}>
											{street.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select value={selectedType} onValueChange={setSelectedType}>
								<SelectTrigger className="w-full md:w-[180px]">
									<SelectValue placeholder="Space Type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Types</SelectItem>
									<SelectItem value="parallel">Parallel</SelectItem>
									<SelectItem value="perpendicular">Perpendicular</SelectItem>
									<SelectItem value="angled">Angled</SelectItem>
								</SelectContent>
							</Select>
							<Select value={selectedStatus} onValueChange={setSelectedStatus}>
								<SelectTrigger className="w-full md:w-[180px]">
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Status</SelectItem>
									<SelectItem value="active">Active</SelectItem>
									<SelectItem value="inactive">Inactive</SelectItem>
									<SelectItem value="handicap">Handicap</SelectItem>
									<SelectItem value="loading">Loading Zone</SelectItem>
								</SelectContent>
							</Select>
							<Button type="submit" disabled={isFiltering}>
								{isFiltering ? (
									<>
										<span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
										Filtering...
									</>
								) : (
									<>Filter</>
								)}
							</Button>
						</form>
					</CardContent>
				</Card>

				<div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 rounded-xl border">
					{/* Debug information */}
					<div className="bg-muted p-2 text-xs">
						<p>Current view mode: {viewMode}</p>
						<p>Data count: {parkingSpaces.data?.length || 0}</p>
					</div>
					
					{viewMode === 'table' ? (
						<div className="p-4">
							<DataTable
								columns={columns}
								data={parkingSpaces.data}
								searchKey="space_number"
								searchPlaceholder="Filter parking spaces..."
								pagination={{
									pageCount: parkingSpaces.last_page,
									pageIndex: parkingSpaces.current_page - 1,
									pageSize: parkingSpaces.data.length,
									total: parkingSpaces.total,
									from: parkingSpaces.from,
									to: parkingSpaces.to,
									links: parkingSpaces.links,
									onPageChange: handlePageChange
								}}
								statusOptions={{
									key: 'is_active',
									options: [
										{ label: 'All', value: null },
										{ label: 'Active', value: 'Active' },
										{ label: 'Inactive', value: 'Inactive' }
									]
								}}
								emptyMessage="No parking spaces found"
							/>
						</div>
					) : viewMode === 'map' ? (
						<div className="p-4">
							<div className="mb-4 flex flex-wrap gap-2">
								<div className="flex items-center gap-1">
									<div className="h-3 w-3 rounded-full bg-green-500" />
									<span className="text-xs">Regular</span>
								</div>
								<div className="flex items-center gap-1">
									<div className="h-3 w-3 rounded-full bg-blue-500" />
									<span className="text-xs">Handicap</span>
								</div>
								<div className="flex items-center gap-1">
									<div className="h-3 w-3 rounded-full bg-yellow-500" />
									<span className="text-xs">Loading Zone</span>
								</div>
								<div className="flex items-center gap-1">
									<div className="h-3 w-3 rounded-full bg-gray-400" />
									<span className="text-xs">Inactive</span>
								</div>
							</div>

							<ParkingMap
								parkingSpaces={parkingSpaces.data}
								onEdit={(id) => router.visit(route('parking-spaces.edit', id))}
								onDelete={handleDelete}
							/>
						</div>
					) : viewMode === 'cards' ? (
						<div className="p-4">
							<div className="mb-4 flex flex-wrap gap-2">
								<div className="flex items-center gap-1">
									<div className="h-3 w-3 rounded-full bg-green-500" />
									<span className="text-xs">Regular</span>
								</div>
								<div className="flex items-center gap-1">
									<div className="h-3 w-3 rounded-full bg-blue-500" />
									<span className="text-xs">Handicap</span>
								</div>
								<div className="flex items-center gap-1">
									<div className="h-3 w-3 rounded-full bg-yellow-500" />
									<span className="text-xs">Loading Zone</span>
								</div>
								<div className="flex items-center gap-1">
									<div className="h-3 w-3 rounded-full bg-gray-400" />
									<span className="text-xs">Inactive</span>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{processing ? (
									// Loading skeleton for cards
									Array.from({ length: 6 }).map((_, index) => (
										<div key={`skeleton-${index}`} className="border rounded-lg p-4 shadow-sm">
											<div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
											<div className="space-y-2">
												<div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
												<div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
												<div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
											</div>
											<div className="flex justify-end mt-4 space-x-2">
												<div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
												<div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
											</div>
										</div>
									))
								) : parkingSpaces.data && parkingSpaces.data.length > 0 ? (
									parkingSpaces.data.map(space => (
										<Card key={space.id} className="overflow-hidden">
											<div className={`h-2 w-full ${getSpaceStatusColor(space)}`}></div>
											<CardHeader className="pb-2">
												<div className="flex items-center justify-between">
													<CardTitle className="text-base">
														<span className="mr-2">{space.space_number}</span>
														<Badge variant="outline">{getSpaceTypeIcon(space.type)} {space.type}</Badge>
													</CardTitle>
													<Badge variant={space.is_active ? 'default' : 'destructive'}>
														{space.is_active ? 'Active' : 'Inactive'}
													</Badge>
												</div>
												<CardDescription className="flex items-center gap-1">
													<MapPin className="h-3 w-3" />
													{space.street?.name || 'Unknown Street'}
												</CardDescription>
											</CardHeader>
											<CardContent className="pb-2">
												<div className="flex flex-wrap gap-1">
													{space.is_handicap && (
														<Badge variant="secondary">Handicap</Badge>
													)}
													{space.is_loading_zone && (
														<Badge variant="secondary">Loading Zone</Badge>
													)}
													{space.latitude && space.longitude && (
														<div className="text-xs text-muted-foreground">
															{isNaN(Number(space.latitude)) ? '?' : Number(space.latitude).toFixed(6)}, 
															{isNaN(Number(space.longitude)) ? '?' : Number(space.longitude).toFixed(6)}
														</div>
													)}
												</div>
											</CardContent>
											<div className="flex justify-end gap-2 p-2 pt-0">
												<Button variant="outline" size="sm" asChild>
													<a href={route('parking-spaces.edit', space.id)}>Edit</a>
												</Button>
												<AlertDialog open={spaceToDelete === space.id} onOpenChange={(open: boolean) => {
													if (!open) setSpaceToDelete(null);
												}}>
													<AlertDialogTrigger asChild>
														<Button 
															variant="destructive" 
															size="sm" 
															onClick={() => confirmDelete(space.id)}
															disabled={processing === space.id}
														>
															{processing === space.id ? (
																<>
																	<Loader2 className="mr-2 h-4 w-4 animate-spin" />
																	Deleting...
																</>
															) : (
																<>
																	<Trash className="mr-2 h-4 w-4" />
																	Delete
																</>
															)}
														</Button>
													</AlertDialogTrigger>
													<AlertDialogContent>
														<AlertDialogHeader>
															<AlertDialogTitle>Are you sure?</AlertDialogTitle>
															<AlertDialogDescription>
																This action cannot be undone. This will permanently delete the parking space.
															</AlertDialogDescription>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel>Cancel</AlertDialogCancel>
															<AlertDialogAction onClick={() => handleDelete(space.id)}>Delete</AlertDialogAction>
														</AlertDialogFooter>
													</AlertDialogContent>
												</AlertDialog>
											</div>
										</Card>
									))
								) : (
									<div className="col-span-full flex h-40 items-center justify-center">
										<p className="text-muted-foreground">No parking spaces found</p>
									</div>
								)}
							</div>
						</div>
					) : (
						<div className="p-4 text-center">
							<p>Unknown view mode: {viewMode}</p>
						</div>
					)}
				</div>
			</div>
		</AppLayout>
	);
}
