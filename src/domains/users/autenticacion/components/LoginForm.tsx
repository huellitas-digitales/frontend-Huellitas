"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Lock, Mail, ArrowRight, PawPrint, Heart, Shield, Stethoscope } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useAuth } from "../hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Formato de correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});
type LoginFormValues = z.infer<typeof loginSchema>;

const features = [
  { icon: Stethoscope, text: "Historias clínicas digitales" },
  { icon: Shield,      text: "Placas QR de emergencia"     },
  { icon: Heart,       text: "Atención veterinaria 24/7"   },
];

export function LoginForm() {
  const { login, loading } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="min-h-screen flex bg-background">

      {/* ── PANEL IZQUIERDO — imagen ── */}
      <div className="hidden lg:flex flex-col w-[55%] relative overflow-hidden">

        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1400&q=85"
            alt="Huellitas — Veterinaria"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
        </div>

        {/* Contenido sobre la imagen */}
        <div className="relative z-10 flex flex-col h-full p-12">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <PawPrint className="h-5 w-5 text-primary" />
            <span className="text-white font-bold text-lg tracking-tight">Huellitas</span>
          </div>

          {/* Texto inferior */}
          <div className="mt-auto">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-white/50 mb-4">
              Sistema de gestión veterinaria
            </p>
            <h2 className="text-5xl font-black text-white tracking-tighter leading-[0.95] mb-6">
              Cuidamos a<br />tus mejores<br />amigos.
            </h2>

            {/* Features */}
            <div className="space-y-3">
              {features.map((f) => (
                <div key={f.text} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center shrink-0">
                    <f.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm text-white/70 font-medium">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── PANEL DERECHO — formulario ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm space-y-8">

          {/* Logo mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            <PawPrint className="h-5 w-5 text-primary" />
            <span className="font-bold text-primary text-lg">Huellitas</span>
          </div>

          <div>
            <h1 className="text-3xl font-black tracking-tighter mb-1">Bienvenido de vuelta</h1>
            <p className="text-muted-foreground text-sm">Ingresa tus credenciales para continuar.</p>
          </div>

          <form onSubmit={handleSubmit((d) => login(d))} className="space-y-5">

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="doctor@huellitas.com"
                  className={`pl-9 h-11 ${errors.email ? "border-destructive" : ""}`}
                  {...register("email")} />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
                <button type="button" className="text-xs text-primary hover:underline">¿Olvidaste tu clave?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••"
                  className={`pl-9 h-11 ${errors.password ? "border-destructive" : ""}`}
                  {...register("password")} />
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full h-11 rounded-full font-semibold group" disabled={loading}>
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Conectando...</>
              ) : (
                <>Ingresar al sistema <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            ¿No eres del equipo?{" "}
            <Link href="/" className="text-primary font-semibold hover:underline">Portal de clientes</Link>
          </p>
        </div>
      </div>

    </div>
  );
}
