import { useState } from 'react';
import { type Permission } from '@/types/user';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';

interface PermissionSelectProps {
    permissions: Permission[];
    selectedPermissions: number[];
    onChange: (selectedIds: number[]) => void;
    label?: string;
    description?: string;
}

export function PermissionSelect({
    permissions,
    selectedPermissions,
    onChange,
    label = 'Permissions',
    description = 'Select the permissions to assign'
}: PermissionSelectProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPermissions = permissions.filter(permission => 
        permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (permission.description && permission.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleTogglePermission = (permissionId: number) => {
        if (selectedPermissions.includes(permissionId)) {
            onChange(selectedPermissions.filter(id => id !== permissionId));
        } else {
            onChange([...selectedPermissions, permissionId]);
        }
    };

    const handleSelectAll = () => {
        if (filteredPermissions.length === selectedPermissions.length) {
            // If all are selected, deselect all
            onChange([]);
        } else {
            // Otherwise, select all filtered permissions
            const allFilteredIds = filteredPermissions.map(p => p.id);
            onChange(allFilteredIds);
        }
    };

    const areAllFilteredSelected = filteredPermissions.length > 0 && 
        filteredPermissions.every(p => selectedPermissions.includes(p.id));

    return (
        <Card>
            <CardHeader>
                <CardTitle>{label}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search permissions..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <Checkbox 
                            id="select-all" 
                            checked={areAllFilteredSelected}
                            onCheckedChange={handleSelectAll}
                        />
                        <Label htmlFor="select-all">
                            {areAllFilteredSelected ? 'Deselect All' : 'Select All'}
                        </Label>
                    </div>
                    
                    <ScrollArea className="h-[300px] rounded-md border p-4">
                        <div className="space-y-4">
                            {filteredPermissions.length > 0 ? (
                                filteredPermissions.map(permission => (
                                    <div key={permission.id} className="flex items-start space-x-2">
                                        <Checkbox 
                                            id={`permission-${permission.id}`}
                                            checked={selectedPermissions.includes(permission.id)}
                                            onCheckedChange={() => handleTogglePermission(permission.id)}
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <Label htmlFor={`permission-${permission.id}`} className="font-medium">
                                                {permission.name}
                                            </Label>
                                            {permission.description && (
                                                <p className="text-sm text-muted-foreground">
                                                    {permission.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-muted-foreground">No permissions found</p>
                            )}
                        </div>
                    </ScrollArea>
                    
                    <div className="text-sm text-muted-foreground">
                        {selectedPermissions.length} of {permissions.length} permissions selected
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 