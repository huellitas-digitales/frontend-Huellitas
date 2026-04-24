import React from "react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { ArrowRight, HeartPulse, ShieldCheck, Clock, Stethoscope, PawPrint } from "lucide-react";

export default function LandingPage() {
  const benefits = [
    {
      title: "Emergencias 24/7",
      description: "Estamos siempre listos para atender cualquier urgencia a cualquier hora del día.",
      icon: <Clock className="h-6 w-6" />,
    },
    {
      title: "Especialistas",
      description: "Equipo médico altamente capacitado en múltiples ramas de la veterinaria.",
      icon: <Stethoscope className="h-6 w-6" />,
    },
    {
      title: "Laboratorio Propio",
      description: "Resultados rápidos y precisos para diagnósticos oportunos sin salir de la clínica.",
      icon: <HeartPulse className="h-6 w-6" />,
    },
    {
      title: "Planes de Salud",
      description: "Programas preventivos diseñados a la medida de la edad y raza de tu compañero.",
      icon: <ShieldCheck className="h-6 w-6" />,
    },
  ];

  return (
    <div className="flex flex-col w-full">
      
      {/* 🌟 HERO SECTION */}
      <section className="relative w-full py-20 md:py-32 overflow-hidden bg-muted/10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto px-4 md:px-8 text-center flex flex-col items-center">
          
          {/* USANDO BADGE DE SHADCN */}
          <Badge variant="secondary" className="mb-8 px-4 py-1.5 text-sm">
            <PawPrint className="mr-2 h-4 w-4" />
            La mejor clínica veterinaria de la ciudad
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl text-foreground mb-6">
            Cuidamos a tu mejor amigo como si fuera <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">nuestra propia familia</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Medicina veterinaria de vanguardia con un toque humano. Urgencias 24/7, especialistas apasionados y tecnología de punta para la salud de tu mascota.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link href="/registro">
                Agendar Cita <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
              <Link href="/servicios">Conocer Servicios</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 🏥 SECCIÓN DE BENEFICIOS (USANDO CARDS) */}
      <section className="w-full py-20 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Atención de Primera Clase</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Todo lo que tu mascota necesita en un solo lugar, con instalaciones modernas y diseñadas para su comodidad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="flex flex-col items-center text-center border-border/50 hover:shadow-md transition-all hover:-translate-y-1 bg-card">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 text-primary mx-auto">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 CALL TO ACTION */}
      <section className="w-full py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
        
        <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">¿Listo para darle la mejor atención?</h2>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Únete a las cientos de familias que ya confían la salud de sus peludos en nuestras manos.
          </p>
          <Button size="lg" variant="secondary" className="h-12 px-8 text-base font-semibold text-primary hover:bg-white" asChild>
            <Link href="/registro">
              Crear Cuenta y Agendar
            </Link>
          </Button>
        </div>
      </section>

    </div>
  );
}