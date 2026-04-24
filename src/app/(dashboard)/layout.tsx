"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import { useAuthStore } from "@/shared/store/useAuthStore";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { toast } from "sonner";

import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter
} from "@/shared/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Separator } from "@/shared/components/ui/separator";

import { 
  LayoutDashboard, 
  Dog, 
  Settings, 
  LogOut, 
  User, 
  Syringe, 
  ShieldCheck,
  ClipboardList,
  Users
} from "lucide-react";

const NAV_ITEMS = [
  { title: "Inicio", href: "/admin/dashboard", icon: LayoutDashboard, roles: ["administrador"] },
  { title: "Dashboard Cliente", href: "/cliente/inicio", icon: LayoutDashboard, roles: ["CLIENTE"] },
  { title: "Mis Mascotas", href: "/cliente/mascotas", icon: Dog, roles: ["CLIENTE", "administrador", "veterinario"] },
  { title: "Especies", href: "/admin/catalogos/especies", icon: ShieldCheck, roles: ["administrador"] },
  { title: "Sala de Espera", href: "/vet/agenda", icon: ClipboardList, roles: ["veterinario"] },
  { title: "Inventario", href: "/admin/inventario", icon: Syringe, roles: ["administrador", "caja"] },
  { title: "Personal", href: "/admin/personal", icon: Users, roles: ["administrador"] },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.info("Sesión cerrada correctamente");
    router.push("/login");
  };

  if (!user) return null;

  const userRole = user?.rol?.nombre?.toLowerCase() || "";
  const filteredMenu = NAV_ITEMS.filter(item => item.roles.includes(userRole));

  return (
    <TooltipProvider>
      <SidebarProvider>
        
        <Sidebar variant="inset" className="border-r">
          <SidebarHeader className="h-14 border-b px-6">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-semibold tracking-tight">Huellitas</span>
              <span className="text-xs text-muted-foreground">Vet</span>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="px-3 py-4">
            <SidebarGroup>
              <SidebarGroupLabel className="px-3 text-xs uppercase tracking-wider text-muted-foreground/70 mb-2">
                Navegación
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {filteredMenu.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={pathname === item.href} 
                        tooltip={item.title}
                        className="h-9"
                      >
                        <Link href={item.href} className="flex items-center gap-3 px-3">
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span className="text-sm">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

         
        </Sidebar>

        <div className="flex flex-col flex-1 w-full min-h-screen">
          
          <header className="sticky top-0 z-40 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-full items-center justify-between px-4 lg:px-6">
              
              <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-2" />
                <Separator orientation="vertical" className="h-5" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium leading-none">{user?.nombres || 'Usuario'}</span>
                  <span className="text-xs text-muted-foreground capitalize">{userRole}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <ThemeToggle />
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none">
                    <Avatar className="h-8 w-8 cursor-pointer ring-offset-background transition-shadow hover:ring-2 hover:ring-ring hover:ring-offset-2">
                      <AvatarImage 
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.nombres}`} 
                        alt={user?.nombres} 
                      />
                      <AvatarFallback className="text-xs font-medium">
                        {user?.nombres?.substring(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.nombres}</p>
                        <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </DropdownMenuItem>
                    {userRole === "administrador" && (
                      <DropdownMenuItem className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Ajustes</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 lg:p-6">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}