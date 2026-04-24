import React from "react";
import Link from "next/link";
import { ArrowLeft, PawPrint, Plus, Activity } from "lucide-react";

// Componentes de Shadcn que ya tenemos
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

export default function MisMascotasPage() {
  const misMascotas = [
    { id: 1, nombre: "Boby", especie: "Canino", raza: "Golden Retriever", estado: "Sano", edad: "3 años" },
    { id: 2, nombre: "Luna", especie: "Felino", raza: "Siamés", estado: "Tratamiento", edad: "1 año" },
  ];

  return (
    <div className="space-y-8 p-8 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* CABECERA CON NAVEGACIÓN */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-6 rounded-3xl border border-border/50">
        <div>
          {/* ESTE ES EL ENLACE MÁGICO DE NEXT.JS */}
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-2 rounded-xl text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Centro de Comando
            </Button>
          </Link>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <PawPrint className="h-8 w-8 text-primary" />
            Mis Mascotas
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona los perfiles y el historial de tus compañeros peludos.
          </p>
        </div>

        <Button size="lg" className="rounded-2xl shadow-md">
          <Plus className="h-5 w-5 mr-2" /> Nueva Mascota
        </Button>
      </div>

      {/* CUADRÍCULA DE MASCOTAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {misMascotas.map((mascota) => (
          <Card key={mascota.id} className="rounded-3xl border-border/50 hover:shadow-lg transition-all group overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/20 to-chart-1/20 w-full" />
            <CardHeader className="relative pb-2 pt-0">
              <div className="absolute -top-12 left-6 bg-background p-2 rounded-full border-2 border-muted shadow-sm">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{mascota.nombre.charAt(0)}</span>
                </div>
              </div>
              <div className="mt-8 flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{mascota.nombre}</CardTitle>
                  <CardDescription>{mascota.especie} • {mascota.raza}</CardDescription>
                </div>
                <Badge variant={mascota.estado === "Sano" ? "default" : "destructive"} className="rounded-full">
                  {mascota.estado}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <Activity className="h-4 w-4" /> Edad: {mascota.edad}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t border-border/40 p-4">
              {/* OTRO ENLACE: Navegación dinámica (ej. /cliente/mascotas/1) */}
              <Link href={`/cliente/mascotas/${mascota.id}`} className="w-full">
                <Button variant="secondary" className="w-full rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Ver Perfil Clínico
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}