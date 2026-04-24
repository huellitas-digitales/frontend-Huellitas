import React from "react";
import PublicNavbar from "@/shared/components/layout/PublicNavbar";
import Footer from "@/shared/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // min-h-screen asegura que la página ocupe al menos el 100% del alto de la pantalla
    // flex y flex-col permiten que el contenido principal empuje al Footer hacia abajo
    <div className="flex min-h-screen flex-col bg-background">
      
      {/* 1. NAVEGACIÓN PRINCIPAL */}
      <PublicNavbar />
      
      {/* 2. CONTENIDO DINÁMICO (Aquí se inyectará page.tsx de Inicio, Servicios, etc.) */}
      {/* flex-1 hace que esta sección crezca y ocupe todo el espacio disponible */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* 3. PIE DE PÁGINA */}
      <Footer />
      
    </div>
  );
}