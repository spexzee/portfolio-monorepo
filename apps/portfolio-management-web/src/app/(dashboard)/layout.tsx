'use client';

import { SidebarProvider, Sidebar, SidebarTrigger, SidebarInset, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from '@/components/ui/sidebar';
import { Home, FileText, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout } = useAuth();

    return (
        <ProtectedRoute>
            <SidebarProvider>
                <Sidebar variant="sidebar" collapsible="icon" className="dark:bg-zinc-900">
                    <SidebarHeader className="p-4">
                        <Link href="/" className="flex items-center gap-2 font-semibold text-lg text-primary dark:text-primary">
                            <Settings className="h-6 w-6" />
                            Spexzee
                        </Link>
                    </SidebarHeader>
                    <SidebarContent className="flex-1">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton tooltip="Dashboard" isActive={true} asChild>
                                    <Link href="/">
                                        <Home />
                                        <span>Dashboard</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton tooltip="Management" asChild>
                                    <Link href="/management">
                                        <Settings />
                                        <span>Management</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton tooltip="Resume" asChild>
                                    <Link href="/resume">
                                        <FileText />
                                        <span>Resume</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarContent>
                    <SidebarFooter className="p-4 border-t">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-sm truncate">{user?.name}</span>
                            <Button variant="ghost" size="icon" onClick={logout} title="Logout">
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </SidebarFooter>
                </Sidebar>

                <SidebarInset className="flex flex-col flex-1">
                    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
                        <div className="md:hidden">
                            <SidebarTrigger />
                        </div>
                        <div className="ml-auto">
                            <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
                        </div>
                    </header>
                    <main className="flex-1 overflow-y-auto p-6">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </ProtectedRoute>
    );
}
