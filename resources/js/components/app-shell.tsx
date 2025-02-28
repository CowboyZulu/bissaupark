import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from 'sonner';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, className, variant = 'header', ...props }: AppShellProps) {
    const [isOpen, setIsOpen] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('sidebar') !== 'false' : true));

    const handleSidebarChange = (open: boolean) => {
        setIsOpen(open);

        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebar', String(open));
        }
    };

    if (variant === 'header') {
        return (
            <>
                <div className={cn('flex min-h-screen w-full flex-col', className)} {...props}>
                    {children}
                </div>
                <Toaster />
            </>
        );
    }

    return (
        <>
            <SidebarProvider defaultOpen={isOpen} open={isOpen} onOpenChange={handleSidebarChange}>
                <div
                    className={cn(
                        'flex min-h-screen w-full flex-col',
                        variant === 'sidebar' && 'flex-row w-full',
                        className,
                    )}
                    {...props}
                >
                    {children}
                </div>
            </SidebarProvider>
            <Toaster />
        </>
    );
}
