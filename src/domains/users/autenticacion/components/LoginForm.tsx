"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Lock, Mail, PawPrint, ShieldCheck, ArrowRight, Activity, Users, HeartPulse } from "lucide-react";
import Image from "next/image";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

// ✨ IMPORTAMOS TU NUEVO HOOK MAESTRO
import { useAuth } from "../hooks/useAuth"; 

const loginSchema = z.object({
  email: z.string().email("Ups! El formato del correo no es válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  // ✨ USAMOS EL HOOK (Él se encarga del router, las cookies, el store y los toasts)
  const { login, loading } = useAuth();

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // ✨ LA FUNCIÓN AHORA ES SÚPER LIMPIA
  const onLogin = async (data: LoginFormValues) => {
    await login(data);
  };

  return (
    // CONTENEDOR PRINCIPAL
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 sm:p-8 font-sans">
      
      <div className="w-full max-w-5xl rounded-2xl overflow-hidden border border-border/50 shadow-2xl flex flex-col lg:flex-row bg-background animate-in fade-in duration-500">
        
        {/* ========================================================= */}
        {/* MITAD IZQUIERDA: IMAGEN VISIBLE Y TEXTO MINIMALISTA       */}
        {/* ========================================================= */}
        <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-zinc-900 p-12 lg:w-1/2 min-h-[620px]">
          
          <div className="absolute inset-0 opacity-60 mix-blend-luminosity hover:opacity-70 transition-opacity duration-1000">
            <Image 
              src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=2070&auto=format&fit=crop"
              alt="Veterinaria Huellitas"
              fill
              className="object-cover scale-105"
              priority
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/30 to-zinc-950/80" />

          <div className="relative z-10 flex items-center text-zinc-300 gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium tracking-wider uppercase">Plataforma Médica Segura</span>
          </div>

          <div className="relative z-10 mt-auto animate-in fade-in slide-in-from-left-8 duration-1000 delay-150 space-y-12">
            <div className="space-y-3">
                <h2 className="text-5xl font-extrabold text-white tracking-tighter leading-[0.95] max-w-sm">
                  Pasión por<br />la salud animal.
                </h2>
                <p className="text-zinc-400 text-lg max-w-xs font-normal">
                  Gestión integral y eficiente para tu clínica veterinaria.
                </p>
            </div>
            
            <div className="grid grid-cols-3 gap-6 text-zinc-400 border-t border-white/10 pt-8 w-fit">
              <div className="flex items-center gap-2.5">
                <HeartPulse className="h-5 w-5 text-primary/80" />
                <div className="flex flex-col">
                    <p className="text-white font-bold text-xl leading-none">5k+</p>
                    <p className="text-[11px] uppercase tracking-wider text-zinc-500">Pacientes</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Activity className="h-5 w-5 text-primary/80" />
                <div className="flex flex-col">
                    <p className="text-white font-bold text-xl leading-none">24h</p>
                    <p className="text-[11px] uppercase tracking-wider text-zinc-500">Servicio</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Users className="h-5 w-5 text-primary/80" />
                <div className="flex flex-col">
                    <p className="text-white font-bold text-xl leading-none">15+</p>
                    <p className="text-[11px] uppercase tracking-wider text-zinc-500">Expertos</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MITAD DERECHA: EL FORMULARIO ORIGINAL                     */}
        {/* ========================================================= */}
        <div className="flex flex-col justify-center px-8 py-12 sm:px-12 lg:px-16 lg:w-1/2">
          <div className="w-full max-w-sm mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
            
            {/* Cabecera del Formulario */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-primary/10 p-2.5 rounded-xl">
                  <PawPrint className="h-8 w-8 text-primary" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-primary">Huellitas</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Bienvenido de nuevo</h1>
              <p className="text-muted-foreground text-sm">
                Ingresa tus credenciales para acceder al sistema integral de gestión veterinaria.
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit(onLogin)} className="space-y-6">
              
              <div className="space-y-4">
                {/* Input Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Correo Electrónico</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="doctora@huellitas.com" 
                      className={`pl-10 h-11 bg-muted/50 border-transparent hover:bg-muted focus:bg-background focus:border-primary transition-all ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      {...register("email")} 
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs font-medium text-destructive animate-in fade-in">{errors.email.message}</p>
                  )}
                </div>

                {/* Input Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
                    <Button variant="link" type="button" className="px-0 font-normal text-xs text-primary hover:text-primary/80">
                      ¿Olvidaste tu clave?
                    </Button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••"
                      className={`pl-10 h-11 bg-muted/50 border-transparent hover:bg-muted focus:bg-background focus:border-primary transition-all ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                      {...register("password")} 
                    />
                  </div>
                  {errors.password && (
                    <p className="text-xs font-medium text-destructive animate-in fade-in">{errors.password.message}</p>
                  )}
                </div>
              </div>

              {/* Botón Submit interactivo */}
              <Button 
                type="submit" 
                className="w-full h-11 text-base font-semibold group transition-all" 
                disabled={loading} // ✨ Usamos el 'loading' de tu hook
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Conectando...
                  </>
                ) : (
                  <>
                    Ingresar al Sistema
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            {/* Footer del Formulario */}
            <div className="text-center text-sm text-muted-foreground pt-4">
              ¿No eres parte del equipo médico?{" "}
              <Button variant="link" className="p-0 font-semibold text-primary">
                Portal de clientes
              </Button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}