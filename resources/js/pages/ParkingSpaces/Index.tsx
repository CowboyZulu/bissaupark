import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	PaginationEllipsis
} from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Eye, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { BreadcrumbItem } from '@/types';
import { Street } from '@/types/vehicle';

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
}

export default function Index({ parkingSpaces }: ParkingSpacesIndexProps) {
	const [ processing, setProcessing ] = useState<number | null>(null);

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
		if (confirm('Are you sure you want to delete this parking space?')) {
			setProcessing(id);
			router.delete(route('parking-spaces.destroy', id), {
				onSuccess: () => {
					toast.success('Parking space deleted successfully');
					setProcessing(null);
				},
				onError: () => {
					toast.error('Failed to delete parking space');
					setProcessing(null);
				}
			});
		}
	};

	const getTypeLabel = (type: string) => {
		switch (type) {
			case 'parallel':
				return 'Parallel';
			case 'perpendicular':
				return 'Perpendicular';
			case 'angled':
				return 'Angled';
			default:
				return type;
		}
	};

	// Helper function to render pagination links
	const renderPaginationLinks = () => {
		// Check if we have pagination data
		if (!parkingSpaces.links || parkingSpaces.links.length <= 3) return null;
		
		// Make sure we have current_page and last_page
		const currentPage = parkingSpaces.current_page || parseInt(parkingSpaces.links.find(link => link.active)?.label || '1');
		const lastPage = parkingSpaces.last_page || parkingSpaces.links.length - 2;
		
		// Determine which page numbers to show
		let pagesToShow = [];
		
		// Always show first page, last page, current page, and pages adjacent to current
		if (lastPage <= 5) {
			// If 5 or fewer pages, show all
			pagesToShow = Array.from({ length: lastPage }, (_, i) => i + 1);
		} else {
			// Always include page 1
			pagesToShow.push(1);
			
			// Add ellipsis if needed before middle pages
			if (currentPage > 3) {
				pagesToShow.push(-1); // -1 represents ellipsis
			}
			
			// Add pages around current page
			for (let i = Math.max(2, currentPage - 1); i <= Math.min(lastPage - 1, currentPage + 1); i++) {
				pagesToShow.push(i);
			}
			
			// Add ellipsis if needed after middle pages
			if (currentPage < lastPage - 2) {
				pagesToShow.push(-2); // -2 represents ellipsis
			}
			
			// Always include last page if not already included
			if (lastPage > 1) {
				pagesToShow.push(lastPage);
			}
		}
		
		return (
			<Pagination>
				<PaginationContent>
					{/* Previous Page Link */}
					<PaginationItem>
						<PaginationPrevious 
							href={parkingSpaces.links[0].url || '#'} 
							className={!parkingSpaces.links[0].url ? 'pointer-events-none opacity-50' : ''}
						/>
					</PaginationItem>
					
					{/* Page Number Links */}
					{pagesToShow.map((page, index) => {
						if (page < 0) {
							// Render ellipsis
							return (
								<PaginationItem key={`ellipsis-${index}`}>
									<PaginationEllipsis />
								</PaginationItem>
							);
						}
						
						// Find the corresponding link in the links array
						const pageLink = parkingSpaces.links.find(link => 
							link.label === page.toString() || 
							link.label === page.toString()
						);
						
						return (
							<PaginationItem key={page}>
								<PaginationLink 
									href={pageLink?.url || `?page=${page}`}
									isActive={currentPage === page}
								>
									{page}
								</PaginationLink>
							</PaginationItem>
						);
					})}
					
					{/* Next Page Link */}
					<PaginationItem>
						<PaginationNext 
							href={parkingSpaces.links[parkingSpaces.links.length - 1].url || '#'} 
							className={!parkingSpaces.links[parkingSpaces.links.length - 1].url ? 'pointer-events-none opacity-50' : ''}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		);
	};

	// For debugging - log the pagination data
	console.log('Pagination Data:', {
		links: parkingSpaces.links,
		current_page: parkingSpaces.current_page,
		last_page: parkingSpaces.last_page
	});

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Parking Spaces" />

			<div className="flex h-full flex-1 flex-col gap-4 p-4">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-semibold">Parking Spaces</h1>
					<Button asChild>
						<Link href={route('parking-spaces.create')}>
							<Plus className="mr-2 h-4 w-4" />
							Add Parking Space
						</Link>
					</Button>
				</div>

				<div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 rounded-xl border">
					<div className="p-4">
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Space Number</TableHead>
										<TableHead>Street</TableHead>
										<TableHead>Type</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Special</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{parkingSpaces.data.length === 0 ? (
										<TableRow>
											<TableCell colSpan={6} className="text-center py-4">
												No parking spaces found
											</TableCell>
										</TableRow>
									) : (
										parkingSpaces.data.map((parkingSpace) => (
											<TableRow key={parkingSpace.id}>
												<TableCell className="font-medium">
													{parkingSpace.space_number}
												</TableCell>
												<TableCell>{parkingSpace.street.name}</TableCell>
												<TableCell>
													<Badge variant="outline">{getTypeLabel(parkingSpace.type)}</Badge>
												</TableCell>
												<TableCell>
													{parkingSpace.is_active ? (
														<Badge className="bg-green-500">Active</Badge>
													) : (
														<Badge variant="destructive">Inactive</Badge>
													)}
												</TableCell>
												<TableCell>
													{parkingSpace.is_handicap && (
														<Badge className="mr-1 bg-blue-500">Handicap</Badge>
													)}
													{parkingSpace.is_loading_zone && (
														<Badge className="bg-yellow-500">Loading</Badge>
													)}
												</TableCell>
												<TableCell className="text-right">
													<div className="flex justify-end gap-2">
														<Button variant="outline" size="sm" asChild>
															<Link href={route('parking-spaces.show', parkingSpace.id)}>
																<Eye className="h-4 w-4" />
															</Link>
														</Button>
														<Button variant="outline" size="sm" asChild>
															<Link href={route('parking-spaces.edit', parkingSpace.id)}>
																<Pencil className="h-4 w-4" />
															</Link>
														</Button>
														<Button
															variant="outline"
															size="sm"
															onClick={() => handleDelete(parkingSpace.id)}
															disabled={processing === parkingSpace.id}
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
							<div className="mt-4">
								{/* Directly render pagination for testing */}
								{parkingSpaces.links && parkingSpaces.links.length > 0 ? (
									<Pagination>
										<PaginationContent>
											{/* Previous Page Link */}
											<PaginationItem>
												<PaginationPrevious 
													href={parkingSpaces.links[0].url || '#'} 
													className={!parkingSpaces.links[0].url ? 'pointer-events-none opacity-50' : ''}
												/>
											</PaginationItem>
											
											{/* Page Number Links */}
											{parkingSpaces.links.slice(1, -1).map((link, i) => (
												<PaginationItem key={i}>
													<PaginationLink 
														href={link.url || '#'} 
														isActive={link.active}
														className={!link.url ? 'pointer-events-none opacity-50' : ''}
													>
														{link.label.replace(/&laquo;|&raquo;/g, '')}
													</PaginationLink>
												</PaginationItem>
											))}
											
											{/* Next Page Link */}
											<PaginationItem>
												<PaginationNext 
													href={parkingSpaces.links[parkingSpaces.links.length - 1].url || '#'} 
													className={!parkingSpaces.links[parkingSpaces.links.length - 1].url ? 'pointer-events-none opacity-50' : ''}
												/>
											</PaginationItem>
										</PaginationContent>
									</Pagination>
								) : (
									<div className="text-center text-gray-500">No pagination links available</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
