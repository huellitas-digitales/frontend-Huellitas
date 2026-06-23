'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/shared/lib/axios'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import { Switch } from '@/shared/components/ui/switch'
import { toast } from 'sonner'
import {
  PawPrint,
  ArrowRight,
  User,
  Mail,
  Lock,
  Phone,
  CheckCircle2,
  Heart,
} from 'lucide-react'
import { ImageUploader } from '@/shared/components/ui/image-uploader'

interface Especie { id: number; nombre: string }
interface Raza    { id: number; nombre: string }

export default function RegistroPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Catálogos dinámicos
  const [especies, setEspecies] = useState<Especie[]>([])
  const [razas, setRazas]       = useState<Raza[]>([])
  const [loadingRazas, setLoadingRazas] = useState(false)

  useEffect(() => {
    api.get('/publico/especies')
      .then(r => setEspecies(r.data))
      .catch(() => {/* silencioso — el select quedará vacío */})
  }, [])

  // Datos Formulario
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    celular: '',
    contrasena: '',
    petNombre: '',
    petEspecieId: '',
    petRazaId: '',
    petSexo: '',
    petFechaNacimiento: '',
    petCaracteristicas: '',
    petFotoUrl: '',
    avatar_url: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectEspecie = (value: string) => {
    setFormData((prev) => ({ ...prev, petEspecieId: value, petRazaId: '' }))
    setRazas([])
    if (!value) return
    setLoadingRazas(true)
    api.get(`/publico/razas/${value}`)
      .then(r => setRazas(r.data))
      .catch(() => toast.error('No se pudieron cargar las razas'))
      .finally(() => setLoadingRazas(false))
  }

  const handleSelectRaza = (value: string) => {
    setFormData((prev) => ({ ...prev, petRazaId: value }))
  }

  const handleSelectSexo = (value: string) => {
    setFormData((prev) => ({ ...prev, petSexo: value }))
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nombres || !formData.apellidos || !formData.correo || !formData.contrasena) {
      toast.warning('Por favor completa todos los campos del propietario')
      return
    }
    setStep(2)
  }

  const [esterilizado, setEsterilizado] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.petNombre || !formData.petSexo) {
      toast.warning('El nombre y sexo de la mascota son obligatorios.')
      return
    }

    setIsSubmitting(true)
    try {
      await api.post('/auth/register', {
        nombres:    formData.nombres,
        apellidos:  formData.apellidos,
        email:      formData.correo,
        password:   formData.contrasena,
        telefono:   formData.celular || undefined,
        avatar_url: formData.avatar_url || undefined,
        mascota: {
          nombre:                  formData.petNombre,
          sexo:                    formData.petSexo,
          id_raza_fk:              formData.petRazaId ? Number(formData.petRazaId) : undefined,
          fecha_nacimiento:        formData.petFechaNacimiento || undefined,
          esterilizado:            esterilizado,
          caracteristicas_fisicas: formData.petCaracteristicas || undefined,
          foto_url:                formData.petFotoUrl || undefined,
        },
      })

      toast.success('¡Registro exitoso!', {
        description: 'Tu cuenta y tu mascota fueron creadas. Ahora inicia sesión.'
      })
      router.push('/login')
    } catch (err: any) {
      const msg = err?.response?.data?.message
      toast.error(Array.isArray(msg) ? msg[0] : msg ?? 'Error al crear la cuenta. Intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-background">
      
      {/* COLUMNA IZQUIERDA: DISEÑO PREMIUM Y PROPUESTA DE VALOR */}
      <div className="hidden lg:flex lg:col-span-5 relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
        
        {/* LOGO */}
        <div className="flex items-center gap-2 relative z-10">
          <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <PawPrint className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight">Huellitas Digitales</span>
        </div>

        {/* BENEFICIOS SLIDER O TESTIMONIAL MOCK */}
        <div className="space-y-6 relative z-10">
          <h2 className="text-4xl font-extrabold leading-tight">
            El cuidado más completo para tus mejores amigos.
          </h2>
          <p className="text-white/80 leading-relaxed text-sm">
            Crea tu cuenta hoy y accede al carnet electrónico de tu mascota, reserva turnos 24/7 y obtén notificaciones de vacunas de forma automática.
          </p>

          <div className="space-y-4 pt-6 text-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-white shrink-0" />
              <span>Carnet clínico y vacuna QR único para tu mascota.</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-white shrink-0" />
              <span>Historial de recetas e indicaciones siempre a mano.</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-white shrink-0" />
              <span>Recordatorios de vacunas y desparasitaciones.</span>
            </div>
          </div>
        </div>

        {/* FOOTER IZQUIERDO */}
        <div className="text-xs text-white/60 relative z-10 flex justify-between">
          <span>© 2026 Huellitas Digitales.</span>
          <span className="flex items-center gap-1">
            Hecho con <Heart className="h-3 w-3 fill-white text-white" /> para mascotas.
          </span>
        </div>
      </div>

      {/* COLUMNA DERECHA: FORMULARIO WIZARD */}
      <div className="lg:col-span-7 flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-12 relative">
        <div className="absolute top-8 right-8 text-xs text-muted-foreground">
          ¿Ya eres miembro?{' '}
          <Link href="/login" className="font-bold text-primary hover:underline">
            Inicia Sesión
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto space-y-8 animate-in fade-in duration-500">
          
          {/* CABECERA FORM */}
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Crear una Cuenta</h1>
            <p className="text-xs text-muted-foreground mt-2">
              {step === 1 
                ? 'Paso 1: Completa los datos personales del propietario.' 
                : 'Paso 2: Cuéntanos sobre tu primera mascota.'}
            </p>
          </div>

          {/* PASO 1: DATOS PROPIETARIO */}
          {step === 1 ? (
            <form onSubmit={handleNextStep} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="nombres" className="text-xs font-bold text-muted-foreground">Nombres</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="nombres"
                      name="nombres"
                      placeholder="Juan"
                      value={formData.nombres}
                      onChange={handleChange}
                      className="pl-9 h-11 rounded-xl text-xs"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="apellidos" className="text-xs font-bold text-muted-foreground">Apellidos</Label>
                  <Input
                    id="apellidos"
                    name="apellidos"
                    placeholder="Pérez"
                    value={formData.apellidos}
                    onChange={handleChange}
                    className="h-11 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="correo" className="text-xs font-bold text-muted-foreground">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="correo"
                    name="correo"
                    type="email"
                    placeholder="juan.perez@ejemplo.com"
                    value={formData.correo}
                    onChange={handleChange}
                    className="pl-9 h-11 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="celular" className="text-xs font-bold text-muted-foreground">Celular (Opcional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="celular"
                    name="celular"
                    placeholder="77234567"
                    value={formData.celular}
                    onChange={handleChange}
                    className="pl-9 h-11 rounded-xl text-xs"
                  />
                </div>
              </div>

              <ImageUploader
                label="Foto de perfil (Opcional)"
                placeholder="Seleccionar foto"
                value={formData.avatar_url}
                onChange={(url) => setFormData((prev) => ({ ...prev, avatar_url: url }))}
              />

              <div className="space-y-1.5">
                <Label htmlFor="contrasena" className="text-xs font-bold text-muted-foreground">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contrasena"
                    name="contrasena"
                    type="password"
                    placeholder="••••••••"
                    value={formData.contrasena}
                    onChange={handleChange}
                    className="pl-9 h-11 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-11 rounded-xl font-bold mt-2 shadow-sm bg-gradient-to-r from-primary to-primary/80">
                Siguiente Paso <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>
          ) : (
            
            /* PASO 2: DATOS MASCOTA */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="petNombre" className="text-xs font-bold text-muted-foreground">Nombre de la Mascota</Label>
                <Input
                  id="petNombre"
                  name="petNombre"
                  placeholder="Boby"
                  value={formData.petNombre}
                  onChange={handleChange}
                  className="h-11 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-muted-foreground">Especie</Label>
                  <Select onValueChange={handleSelectEspecie} value={formData.petEspecieId}>
                    <SelectTrigger className="h-11 rounded-xl text-xs">
                      <SelectValue placeholder="Selecciona especie" />
                    </SelectTrigger>
                    <SelectContent>
                      {especies.map(e => (
                        <SelectItem key={e.id} value={String(e.id)}>{e.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-muted-foreground">Sexo</Label>
                  <Select onValueChange={handleSelectSexo} value={formData.petSexo}>
                    <SelectTrigger className="h-11 rounded-xl text-xs">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Macho</SelectItem>
                      <SelectItem value="H">Hembra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-muted-foreground">Raza</Label>
                  <Select
                    onValueChange={handleSelectRaza}
                    value={formData.petRazaId}
                    disabled={!formData.petEspecieId || loadingRazas}
                  >
                    <SelectTrigger className="h-11 rounded-xl text-xs">
                      <SelectValue placeholder={
                        !formData.petEspecieId ? 'Primero elige especie' :
                        loadingRazas ? 'Cargando...' : 'Selecciona raza'
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {razas.map(r => (
                        <SelectItem key={r.id} value={String(r.id)}>{r.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="petFechaNacimiento" className="text-xs font-bold text-muted-foreground">Fecha de Nacimiento</Label>
                  <Input
                    id="petFechaNacimiento"
                    name="petFechaNacimiento"
                    type="date"
                    value={formData.petFechaNacimiento}
                    onChange={handleChange}
                    className="h-11 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Esterilizado toggle */}
              <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                <div>
                  <p className="text-xs font-bold text-foreground">¿Está esterilizado/a?</p>
                  <p className="text-xs text-muted-foreground">Castrado o espayado</p>
                </div>
                <Switch checked={esterilizado} onCheckedChange={setEsterilizado} />
              </div>

              {/* Características físicas */}
              <div className="space-y-1.5">
                <Label htmlFor="petCaracteristicas" className="text-xs font-bold text-muted-foreground">
                  Características físicas <span className="font-normal">(Opcional)</span>
                </Label>
                <Textarea
                  id="petCaracteristicas"
                  name="petCaracteristicas"
                  placeholder="Pelaje dorado, collar rojo, mancha blanca en el pecho..."
                  value={formData.petCaracteristicas}
                  onChange={(e) => setFormData(prev => ({ ...prev, petCaracteristicas: e.target.value }))}
                  className="rounded-xl text-xs resize-none"
                  rows={2}
                />
              </div>

              {/* Foto de la mascota */}
              <ImageUploader
                label="Foto de la mascota (Opcional)"
                placeholder="Seleccionar foto"
                value={formData.petFotoUrl}
                onChange={(url) => setFormData(prev => ({ ...prev, petFotoUrl: url }))}
              />

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="w-1/3 h-11 rounded-xl font-semibold border-border text-xs"
                >
                  Atrás
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 h-11 rounded-xl font-bold bg-primary text-primary-foreground hover:opacity-90 text-xs shadow-sm"
                >
                  {isSubmitting ? 'Creando cuenta...' : 'Registrarse y Completar'}
                </Button>
              </div>
            </form>
          )}

          {/* INDICADOR VISUAL PASOS DERECHO */}
          <div className="flex justify-center gap-2 pt-6">
            <div className={`h-1.5 w-8 rounded-full ${step === 1 ? 'bg-primary' : 'bg-muted'}`} />
            <div className={`h-1.5 w-8 rounded-full ${step === 2 ? 'bg-primary' : 'bg-muted'}`} />
          </div>

        </div>
      </div>

    </div>
  )
}
