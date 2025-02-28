import { type Permission } from '@/types/user';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Lock } from 'lucide-react';

interface PermissionBadgeProps {
    permission: Permission;
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
    showIcon?: boolean;
    showTooltip?: boolean;
}

export function PermissionBadge({
    permission,
    variant = 'default',
    showIcon = true,
    showTooltip = true
}: PermissionBadgeProps) {
    if (showTooltip && permission.description) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Badge variant={variant} className="mr-1 mb-1">
                            {showIcon && <Lock className="h-3 w-3 mr-1" />}
                            {permission.name}
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{permission.description}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return (
        <Badge variant={variant} className="mr-1 mb-1">
            {showIcon && <Lock className="h-3 w-3 mr-1" />}
            {permission.name}
        </Badge>
    );
}

interface PermissionBadgeListProps {
    permissions: Permission[];
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
    showIcon?: boolean;
    showTooltip?: boolean;
    maxDisplay?: number;
}

export function PermissionBadgeList({
    permissions,
    variant = 'default',
    showIcon = true,
    showTooltip = true,
    maxDisplay = 0
}: PermissionBadgeListProps) {
    const displayPermissions = maxDisplay > 0 ? permissions.slice(0, maxDisplay) : permissions;
    const remainingCount = maxDisplay > 0 ? permissions.length - maxDisplay : 0;

    return (
        <div className="flex flex-wrap">
            {displayPermissions.map(permission => (
                <PermissionBadge
                    key={permission.id}
                    permission={permission}
                    variant={variant}
                    showIcon={showIcon}
                    showTooltip={showTooltip}
                />
            ))}
            {remainingCount > 0 && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Badge variant="outline" className="mr-1 mb-1">
                                +{remainingCount} more
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            <div className="max-w-xs">
                                {permissions.slice(maxDisplay).map(permission => (
                                    <div key={permission.id} className="mb-1">
                                        <span className="font-semibold">{permission.name}</span>
                                        {permission.description && (
                                            <span className="text-xs block text-muted-foreground">
                                                {permission.description}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
    );
} 