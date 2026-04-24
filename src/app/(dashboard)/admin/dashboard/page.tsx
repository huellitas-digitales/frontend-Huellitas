"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, Clock, Activity, Users, Plus, 
  Search, PawPrint, Bell, MoreVertical, Download, 
  FileText, CheckCircle2, AlertCircle, HeartPulse, 
  Syringe, Bone, TrendingUp, TrendingDown, Stethoscope, 
  ChevronRight, Filter, Settings, ShieldAlert
} from "lucide-react";

// 🦸‍♀️ SUPERPODERES
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { 
  Area, AreaChart, Bar, BarChart, CartesianGrid, 
  XAxis, YAxis, ResponsiveContainer, Line, LineChart, Tooltip as RechartsTooltip
} from "recharts";

// 🛠️ COMPONENTES SHADCN
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import { Calendar } from "@/shared/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { Separator } from "@/shared/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/components/ui/sheet";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/components/ui/chart";

// --- 1. ESQUEMA CLÍNICO AVANZADO (ZOD) ---
const pacienteSchema = z.object({
  nombreMascota: z.string().min(2, "Mínimo 2 caracteres"),
  especie: z.string().min(1, "Requerido"),
  raza: z.string().min(2, "Requerido"),
  edad: z.coerce.number().min(0, "Edad inválida"),
  peso: z.coerce.number().min(0.1, "Peso inválido"),
  sintomas: z.string().min(10, "Describe detalladamente los síntomas (min 10 caracteres)"),
  nivelUrgencia: z.string().min(1, "Selecciona un nivel"),
  requiereAislamiento: z.boolean().default(false),
});

// --- 2. MEGA BASE DE DATOS SIMULADA ---
const ingresosData = [
  { mes: "Ene", ingresos: 4500, gastos: 3200 }, { mes: "Feb", ingresos: 5200, gastos: 3100 },
  { mes: "Mar", ingresos: 4800, gastos: 3500 }, { mes: "Abr", ingresos: 6100, gastos: 3800 },
  { mes: "May", ingresos: 5900, gastos: 4000 }, { mes: "Jun", ingresos: 7200, gastos: 4200 },
];

const atencionesSemana = [
  { dia: "Lun", consultas: 24, cirugias: 3 }, { dia: "Mar", consultas: 18, cirugias: 5 },
  { dia: "Mié", consultas: 29, cirugias: 2 }, { dia: "Jue", consultas: 22, cirugias: 4 },
  { dia: "Vie", consultas: 35, cirugias: 6 }, { dia: "Sáb", consultas: 45, cirugias: 8 },
  { dia: "Dom", consultas: 15, cirugias: 1 },
];

const pacientesCriticos = [
  { id: "URG-01", nombre: "Max", especie: "Canino", dueño: "Roberto C.", estado: "Estable", temp: "38.5°C", hr: "110 bpm", avatar: "M" },
  { id: "URG-02", nombre: "Luna", especie: "Felino", dueño: "Ana S.", estado: "Crítico", temp: "40.1°C", hr: "160 bpm", avatar: "L" },
  { id: "URG-03", nombre: "Zeus", especie: "Canino", dueño: "Carlos M.", estado: "Observación", temp: "39.0°C", hr: "95 bpm", avatar: "Z" },
  { id: "URG-04", nombre: "Milo", especie: "Felino", dueño: "Elena R.", estado: "Recuperación", temp: "38.2°C", hr: "120 bpm", avatar: "M" },
];

// Configuración de colores para los gráficos
const chartConfigIngresos = { ingresos: { label: "Ingresos (Bs)", color: "hsl(var(--chart-1))" }, gastos: { label: "Gastos (Bs)", color: "hsl(var(--destructive))" } };
const chartConfigAtenciones = { consultas: { label: "Consultas", color: "hsl(var(--primary))" }, cirugias: { label: "Cirugías", color: "hsl(var(--chart-2))" } };

export default function UltimatePremiumDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCargando, setIsCargando] = useState(true);
  const [modalRegistro, setModalRegistro] = useState(false);

  // Efecto de carga inicial majestuoso
  useEffect(() => {
    const timer = setTimeout(() => setIsCargando(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Inicialización del Mega Formulario
  type PacienteFormValues = z.infer<typeof pacienteSchema>;

  const form = useForm<PacienteFormValues>({
    resolver: zodResolver(pacienteSchema) as Resolver<PacienteFormValues>,
    defaultValues: { nombreMascota: "", especie: "", raza: "", edad: 0, peso: 0, sintomas: "", nivelUrgencia: "", requiereAislamiento: false },
  });

  function onGuardarPaciente(values: PacienteFormValues) {
    console.log("Datos clínicos:", values);
    if (values.nivelUrgencia === "rojo") {
      toast.error("¡CÓDIGO ROJO ACTIVADO!", {
        description: `Equipo de trauma requerido para ${values.nombreMascota} (${values.especie}). Peso: ${values.peso}kg.`,
        icon: <ShieldAlert className="h-6 w-6 text-white" />,
        className: "bg-destructive text-destructive-foreground border-none",
        duration: 8000,
      });
    } else {
      toast.success("Expediente Clínico Creado", {
        description: `Paciente ${values.nombreMascota} ingresado a triaje exitosamente.`,
        icon: <CheckCircle2 className="h-5 w-5" />,
      });
    }
    setModalRegistro(false);
    form.reset();
  }

  if (isCargando) {
    return (
      <div className="flex flex-col space-y-8 p-8 min-h-screen">
        <div className="flex justify-between"><Skeleton className="h-12 w-[300px] rounded-lg" /><Skeleton className="h-12 w-[200px] rounded-full" /></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6"><Skeleton className="h-32 rounded-xl" /><Skeleton className="h-32 rounded-xl" /><Skeleton className="h-32 rounded-xl" /><Skeleton className="h-32 rounded-xl" /></div>
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in zoom-in-95 duration-700">
      
      {/* ========================================================================= */}
      {/* HEADER: Texto con Gradientes y Acciones Rápidas                           */}
      {/* ========================================================================= */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-card/50 p-6 rounded-3xl border border-border/50 backdrop-blur-sm shadow-sm">
        <div>
          <Badge variant="outline" className="mb-2 bg-primary/10 text-primary border-primary/20">Clínica Huellitas v2.0</Badge>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent pb-1">
            Centro de Comando
          </h1>
          <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
            Monitoreo en tiempo real de signos vitales, flujo de caja y agenda quirúrgica. Todo bajo tu control.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          <div className="relative flex-1 xl:w-72 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input placeholder="Buscar paciente, ID, o dueño..." className="pl-11 py-6 rounded-2xl bg-background/80 shadow-inner text-base" />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 relative hover:bg-primary/10 transition-colors">
                <Bell className="h-6 w-6 text-foreground" />
                <span className="absolute top-2 right-2 h-3 w-3 rounded-full bg-destructive animate-ping opacity-75"></span>
                <span className="absolute top-2 right-2 h-3 w-3 rounded-full bg-destructive"></span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
              <SheetHeader><SheetTitle className="text-2xl">Centro de Alertas</SheetTitle><SheetDescription>Actualizaciones críticas del hospital.</SheetDescription></SheetHeader>
              <div className="mt-8 space-y-6">
                <div className="flex gap-4 p-4 bg-destructive/10 rounded-xl border border-destructive/20">
                  <HeartPulse className="h-8 w-8 text-destructive shrink-0" />
                  <div><h4 className="font-bold text-destructive">Signos vitales anómalos</h4><p className="text-sm text-muted-foreground mt-1">El paciente "Luna" (Canil 4) presenta taquicardia severa.</p></div>
                </div>
                <div className="flex gap-4 p-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
                  <Syringe className="h-8 w-8 text-orange-500 shrink-0" />
                  <div><h4 className="font-bold text-orange-500">Stock Crítico: Propofol</h4><p className="text-sm text-muted-foreground mt-1">Quedan menos de 3 viales en el inventario de farmacia.</p></div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TABS SISTEMA DE NAVEGACIÓN PROFUNDA                                       */}
      {/* ========================================================================= */}
      <Tabs defaultValue="uci" className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <TabsList className="h-14 bg-muted/50 p-1 rounded-2xl w-full md:w-auto overflow-x-auto justify-start">
            <TabsTrigger value="uci" className="rounded-xl px-6 text-base data-[state=active]:bg-background data-[state=active]:shadow-md transition-all"><HeartPulse className="w-4 h-4 mr-2"/> UCI & Urgencias</TabsTrigger>
            <TabsTrigger value="clinica" className="rounded-xl px-6 text-base data-[state=active]:bg-background data-[state=active]:shadow-md transition-all"><Stethoscope className="w-4 h-4 mr-2"/> Gestión Clínica</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-xl px-6 text-base data-[state=active]:bg-background data-[state=active]:shadow-md transition-all"><Activity className="w-4 h-4 mr-2"/> Analytics</TabsTrigger>
          </TabsList>

          {/* MEGA FORMULARIO DE INGRESO */}
          <Dialog open={modalRegistro} onOpenChange={setModalRegistro}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-2xl h-14 px-8 text-base shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300 w-full md:w-auto">
                <Plus className="h-5 w-5 mr-2" /> Ingreso de Paciente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] rounded-3xl p-0 overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-chart-1 p-6 text-primary-foreground">
                <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-white"><Stethoscope className="h-6 w-6" /> Hoja de Ingreso Médico</DialogTitle>
                <DialogDescription className="text-primary-foreground/80 mt-2 text-base">Registro riguroso para nuevo expediente clínico.</DialogDescription>
              </div>
              
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <form onSubmit={form.handleSubmit(onGuardarPaciente)} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">Nombre del Paciente</Label>
                      <Input placeholder="Ej. Apolo" {...form.register("nombreMascota")} className="h-12 rounded-xl bg-muted/50 focus:bg-background transition-colors" />
                      {form.formState.errors.nombreMascota && <p className="text-sm text-destructive">{form.formState.errors.nombreMascota.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">Especie</Label>
                      <Controller name="especie" control={form.control} render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="h-12 rounded-xl bg-muted/50"><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="canino">Canino 🐕</SelectItem>
                            <SelectItem value="felino">Felino 🐈</SelectItem>
                            <SelectItem value="ave">Ave 🦜</SelectItem>
                            <SelectItem value="exotico">Animal Exótico 🦎</SelectItem>
                          </SelectContent>
                        </Select>
                      )} />
                      {form.formState.errors.especie && <p className="text-sm text-destructive">{form.formState.errors.especie.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">Raza</Label>
                      <Input {...form.register("raza")} className="h-12 rounded-xl" placeholder="Ej. Golden Retriever" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">Edad (Años)</Label>
                      <Input type="number" step="0.1" {...form.register("edad")} className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">Peso (Kg)</Label>
                      <Input type="number" step="0.1" {...form.register("peso")} className="h-12 rounded-xl" />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">Síntomas / Motivo de Consulta</Label>
                    <textarea 
                      {...form.register("sintomas")} 
                      className="flex min-h-[120px] w-full rounded-xl border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:bg-background transition-colors resize-none"
                      placeholder="Describa el cuadro clínico presentado por el propietario..."
                    />
                    {form.formState.errors.sintomas && <p className="text-sm text-destructive">{form.formState.errors.sintomas.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-secondary/30 p-4 rounded-2xl border border-border">
                    <div className="space-y-2">
                      <Label className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">Triage (Nivel de Urgencia)</Label>
                      <Controller name="nivelUrgencia" control={form.control} render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="h-12 rounded-xl border-none shadow-sm"><SelectValue placeholder="Evaluar urgencia..." /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="verde"><span className="flex items-center text-green-600"><div className="w-2 h-2 rounded-full bg-green-600 mr-2"/>Verde (No Urgente)</span></SelectItem>
                            <SelectItem value="amarillo"><span className="flex items-center text-orange-500"><div className="w-2 h-2 rounded-full bg-orange-500 mr-2"/>Amarillo (Urgencia Menor)</span></SelectItem>
                            <SelectItem value="rojo"><span className="flex items-center text-destructive font-bold"><div className="w-2 h-2 rounded-full bg-destructive mr-2"/>Rojo (Emergencia Vital)</span></SelectItem>
                          </SelectContent>
                        </Select>
                      )} />
                    </div>
                    <div className="flex items-center space-x-3 pt-6">
                      <Controller name="requiereAislamiento" control={form.control} render={({ field }) => (
                        <Checkbox id="aislamiento" checked={field.value} onCheckedChange={field.onChange} className="h-6 w-6 rounded-md border-orange-500 data-[state=checked]:bg-orange-500" />
                      )} />
                      <Label htmlFor="aislamiento" className="text-sm font-medium cursor-pointer">Requerir Aislamiento Infeccioso</Label>
                    </div>
                  </div>

                  <DialogFooter className="pt-6">
                    <Button type="button" variant="ghost" className="rounded-xl h-12 px-6" onClick={() => setModalRegistro(false)}>Cancelar</Button>
                    <Button type="submit" className="rounded-xl h-12 px-8 text-base shadow-md">Registrar Ingreso</Button>
                  </DialogFooter>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: SALA DE URGENCIAS Y CARTAS 3D                                      */}
        {/* ========================================================================= */}
        <TabsContent value="uci" className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2"><HeartPulse className="h-6 w-6 text-destructive"/> Pacientes en UCI (Unidad de Cuidados Intensivos)</h2>
            <Badge variant="destructive" className="px-4 py-1.5 text-sm animate-pulse rounded-full">4 Críticos</Badge>
          </div>

          {/* Carrusel Horizontal simulado con Grid CSS para tarjetas 3D */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {pacientesCriticos.map((paciente) => (
              <Card key={paciente.id} className="relative overflow-hidden group hover:-translate-y-2 hover:shadow-2xl hover:shadow-destructive/20 transition-all duration-500 border-border/50 rounded-3xl cursor-pointer">
                <div className={`absolute top-0 left-0 w-full h-1.5 ${paciente.estado === 'Crítico' ? 'bg-destructive' : paciente.estado === 'Estable' ? 'bg-green-500' : 'bg-orange-500'}`} />
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                        <AvatarFallback className={paciente.estado === 'Crítico' ? 'bg-destructive/10 text-destructive' : ''}>{paciente.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl">{paciente.nombre}</CardTitle>
                        <CardDescription>{paciente.especie}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className={`rounded-full ${paciente.estado === 'Crítico' ? 'text-destructive border-destructive bg-destructive/5' : ''}`}>{paciente.id}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="bg-muted/30 rounded-2xl p-4 space-y-3 mt-2 border border-border/50">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground flex items-center gap-1.5"><HeartPulse className="h-4 w-4"/> Frec. Cardíaca</span>
                      <span className="font-mono font-bold">{paciente.hr}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground flex items-center gap-1.5"><Activity className="h-4 w-4"/> Temperatura</span>
                      <span className="font-mono font-bold">{paciente.temp}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="secondary" className="w-full rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Ver Monitor Vital <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Separator className="my-8" />

          {/* Estadísticas Rápidas de Hoy - Estilo Flotante */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Consultas Hoy", value: "42", desc: "+15% vs ayer", icon: Users, color: "text-blue-500" },
              { title: "Cirugías Activas", value: "3", desc: "Quirófano 1 y 2", icon: Syringe, color: "text-purple-500" },
              { title: "Rayos X", value: "12", desc: "4 pendientes", icon: Bone, color: "text-teal-500" },
              { title: "Tasa de Alta", value: "94%", desc: "Excelente", icon: TrendingUp, color: "text-green-500" },
            ].map((stat, i) => (
              <Card key={i} className="bg-card/40 backdrop-blur-md border-none shadow-sm hover:bg-card/80 transition-colors rounded-3xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-xl bg-muted/50 ${stat.color}`}><stat.icon className="h-5 w-5" /></div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">{stat.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 2: GESTIÓN CLÍNICA (Tabla y Agenda)                                   */}
        {/* ========================================================================= */}
        <TabsContent value="clinica" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Tabla Compleja Ocupa 2/3 */}
            <Card className="xl:col-span-2 rounded-3xl border-border/50 shadow-md overflow-hidden">
              <CardHeader className="bg-muted/20 border-b border-border/40 pb-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl">Directorio de Pacientes</CardTitle>
                    <CardDescription>Base de datos clínica unificada.</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl"><Filter className="h-4 w-4 mr-2" /> Filtrar</Button>
                    <Button variant="outline" size="sm" className="rounded-xl"><Download className="h-4 w-4 mr-2" /> Exportar</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent border-b-border/40">
                      <TableHead className="py-4 px-6 font-semibold">Expediente</TableHead>
                      <TableHead className="font-semibold">Propietario</TableHead>
                      <TableHead className="font-semibold">Última Visita</TableHead>
                      <TableHead className="font-semibold">Estado de Cuenta</TableHead>
                      <TableHead className="text-right px-6 font-semibold">Opciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <TableRow key={i} className="hover:bg-muted/40 transition-colors border-b-border/40 group">
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {['B', 'T', 'K', 'S', 'R'][i]}
                            </div>
                            <div>
                              <p className="font-bold text-foreground">{'Bella, Toby, Kiara, Simba, Rocky'.split(', ')[i]}</p>
                              <p className="text-xs text-muted-foreground">#EXP-00{i+1} • {['Canino', 'Canino', 'Felino', 'Felino', 'Canino'][i]}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-medium">{'Familia Gómez, Sr. Torres, Ana Vega, Luis M., Carlos D.'.split(', ')[i]}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="rounded-lg bg-secondary/50 font-normal">Hace {i+1} días</Badge>
                        </TableCell>
                        <TableCell>
                          {i % 2 === 0 ? <span className="flex items-center text-green-500 text-sm font-medium"><CheckCircle2 className="h-4 w-4 mr-1"/> Al día</span> : <span className="flex items-center text-orange-500 text-sm font-medium"><AlertCircle className="h-4 w-4 mr-1"/> Saldo Bs. 150</span>}
                        </TableCell>
                        <TableCell className="text-right px-6">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical className="h-5 w-5" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-2xl">
                              <DropdownMenuLabel>Acciones Médicas</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="rounded-xl cursor-pointer"><FileText className="mr-2 h-4 w-4" /> Historia Clínica</DropdownMenuItem>
                              <DropdownMenuItem className="rounded-xl cursor-pointer"><Syringe className="mr-2 h-4 w-4" /> Nueva Vacuna</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="bg-muted/10 p-4 border-t border-border/40 flex justify-between items-center text-sm text-muted-foreground">
                <span>Mostrando 5 de 1,248 pacientes</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled className="rounded-lg">Anterior</Button>
                  <Button variant="outline" size="sm" className="rounded-lg">Siguiente</Button>
                </div>
              </CardFooter>
            </Card>

            {/* Calendario Ocupa 1/3 */}
            <Card className="rounded-3xl border-border/50 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2"><CalendarIcon className="h-5 w-5 text-primary"/> Agenda Quirúrgica</CardTitle>
                <CardDescription>Selecciona fecha para ver programación.</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-2xl border border-border shadow-inner p-4 w-full max-w-[300px]" />
              </CardContent>
              <Separator />
              <div className="p-6 space-y-4">
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Próximos Procedimientos</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-xl">
                    <div className="bg-chart-2/20 p-2 rounded-lg"><Clock className="h-5 w-5 text-chart-2" /></div>
                    <div className="flex-1"><p className="text-sm font-bold">14:00 - Esterilización</p><p className="text-xs text-muted-foreground">Mila (Felino) • Quirófano 1</p></div>
                  </div>
                  <div className="flex items-center gap-3 bg-muted/30 p-3 rounded-xl">
                    <div className="bg-primary/20 p-2 rounded-lg"><Clock className="h-5 w-5 text-primary" /></div>
                    <div className="flex-1"><p className="text-sm font-bold">16:30 - Limpieza Dental</p><p className="text-xs text-muted-foreground">Boby (Canino) • Quirófano 2</p></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 3: ANALYTICS Y GRÁFICOS (RECHARTS)                                    */}
        {/* ========================================================================= */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Gráfico 1: Flujo de Caja (Area Chart) */}
            <Card className="rounded-3xl border-border/50 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl">Salud Financiera</CardTitle>
                <CardDescription>Comparativa Ingresos vs Gastos Mensuales (Bs)</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfigIngresos} className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ingresosData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-ingresos)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--color-ingresos)" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-gastos)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--color-gastos)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="gastos" stroke="var(--color-gastos)" fillOpacity={1} fill="url(#colorGastos)" strokeWidth={3} />
                      <Area type="monotone" dataKey="ingresos" stroke="var(--color-ingresos)" fillOpacity={1} fill="url(#colorIngresos)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Gráfico 2: Rendimiento Operativo (Bar Chart) */}
            <Card className="rounded-3xl border-border/50 shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl">Flujo de Pacientes Semanal</CardTitle>
                <CardDescription>Consultas vs Procedimientos Quirúrgicos</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfigAtenciones} className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={atencionesSemana} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} />
                      <ChartTooltip cursor={{fill: 'hsl(var(--muted)/0.5)'}} content={<ChartTooltipContent />} />
                      <Bar dataKey="consultas" fill="var(--color-consultas)" radius={[4, 4, 0, 0]} barSize={20} />
                      <Bar dataKey="cirugias" fill="var(--color-cirugias)" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}