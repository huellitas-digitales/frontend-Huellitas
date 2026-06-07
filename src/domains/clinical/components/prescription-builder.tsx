"use client";

import React, { useState, useMemo } from "react";
import { FileText, Plus, Trash2, Search, X, Package } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import { toast } from "sonner";

interface Medicamento {
  id: string;
  nombre: string;
  stock?: number;
  unidad?: string;
  requiereReceta?: boolean;
  categoria?: string;
}

interface PrescriptionBuilderProps {
  receta: any[];
  onAddMedicamento: (med: any) => void;
  onEliminarMedicamento: (id: string) => void;
  medicamentosStock: Medicamento[];
  disabled?: boolean;
}

export function PrescriptionBuilder({
  receta,
  onAddMedicamento,
  onEliminarMedicamento,
  medicamentosStock,
  disabled = false,
}: PrescriptionBuilderProps) {
  const [busqueda, setBusqueda] = useState("");
  const [tabActivo, setTabActivo] = useState("Todos");
  const [selectedMed, setSelectedMed] = useState<Medicamento | null>(null);
  const [dosis, setDosis] = useState("");
  const [frecuencia, setFrecuencia] = useState("");
  const [duracionDias, setDuracionDias] = useState("");

  // Categorías únicas
  const categorias = useMemo(() => {
    const cats = Array.from(new Set(medicamentosStock.map(m => m.categoria ?? "Otros")));
    return ["Todos", ...cats.sort()];
  }, [medicamentosStock]);

  // Filtrado por búsqueda + tab
  const productosFiltrados = useMemo(() => {
    return medicamentosStock.filter(m => {
      const matchBusqueda = m.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const matchTab = tabActivo === "Todos" || (m.categoria ?? "Otros") === tabActivo;
      return matchBusqueda && matchTab;
    });
  }, [medicamentosStock, busqueda, tabActivo]);

  const handleSeleccionar = (med: Medicamento) => {
    if (disabled) return;
    setSelectedMed(med);
    setDosis("");
    setFrecuencia("");
    setDuracionDias("");
  };

  const handleAdd = () => {
    if (!selectedMed || !dosis || !frecuencia || !duracionDias) {
      toast.error("Completa todos los campos del medicamento");
      return;
    }
    const days = parseInt(duracionDias, 10);
    if (isNaN(days) || days <= 0) {
      toast.error("La duración debe ser mayor a 0 días");
      return;
    }
    onAddMedicamento({
      id: Math.random().toString(),
      id_producto: selectedMed.id,
      medicamento_texto: selectedMed.nombre,
      dosis,
      frecuencia,
      duracion_dias: days,
    });
    setSelectedMed(null);
    setDosis("");
    setFrecuencia("");
    setDuracionDias("");
    toast.success(`${selectedMed.nombre} agregado a la receta`);
  };

  return (
    <Card className="rounded-3xl border-border/50 shadow-sm">
      <CardHeader className="pb-3 border-b border-border/40 bg-muted/10">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" /> Receta de Medicamentos
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">

        {/* BUSCADOR */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setTabActivo("Todos"); }}
            disabled={disabled}
            className="pl-9 h-9 rounded-xl bg-muted/20 text-sm"
          />
          {busqueda && (
            <button onClick={() => setBusqueda("")} className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* TABS DE CATEGORÍAS */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => { setTabActivo(cat); setBusqueda(""); }}
              disabled={disabled}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                tabActivo === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/20 text-muted-foreground border-border/40 hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GRID DE PRODUCTOS */}
        <div className="max-h-48 overflow-y-auto pr-1">
          {productosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
              <Package className="h-8 w-8 opacity-20" />
              <p className="text-xs">Sin productos disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {productosFiltrados.map(m => {
                const isSelected = selectedMed?.id === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => handleSeleccionar(m)}
                    disabled={disabled}
                    className={`text-left p-2.5 rounded-xl border transition-all hover:-translate-y-0.5 ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border/40 bg-card/30 hover:border-primary/30 hover:bg-muted/10"
                    }`}
                  >
                    <p className="text-xs font-semibold text-foreground leading-snug truncate">{m.nombre}</p>
                    <div className="flex items-center justify-between mt-1 gap-1">
                      <span className="text-[10px] text-muted-foreground">
                        Stock: <span className={m.stock && m.stock <= 5 ? "text-destructive font-bold" : ""}>{m.stock ?? 0}</span> {m.unidad ?? ""}
                      </span>
                      {m.requiereReceta && (
                        <span className="text-[9px] bg-destructive/10 text-destructive border border-destructive/20 px-1 rounded font-bold">
                          Rx
                        </span>
                      )}
                    </div>
                    {m.categoria && (
                      <p className="text-[9px] text-muted-foreground/60 mt-0.5 truncate">{m.categoria}</p>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* FORMULARIO DE DOSIS — aparece al seleccionar */}
        {selectedMed && (
          <div className="space-y-3 p-3 bg-primary/5 rounded-2xl border border-primary/20">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-primary truncate flex-1">{selectedMed.nombre}</p>
              <button onClick={() => setSelectedMed(null)} className="text-muted-foreground hover:text-foreground ml-2">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Dosis</Label>
                <Input
                  placeholder="1 comp."
                  value={dosis}
                  onChange={(e) => setDosis(e.target.value)}
                  disabled={disabled}
                  className="bg-background h-9 rounded-xl text-xs px-2"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Frecuencia</Label>
                <Input
                  placeholder="c/12h"
                  value={frecuencia}
                  onChange={(e) => setFrecuencia(e.target.value)}
                  disabled={disabled}
                  className="bg-background h-9 rounded-xl text-xs px-2"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground">Días</Label>
                <Input
                  type="number"
                  placeholder="5"
                  min="1"
                  value={duracionDias}
                  onChange={(e) => setDuracionDias(e.target.value)}
                  disabled={disabled}
                  className="bg-background h-9 rounded-xl text-xs px-2"
                />
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              className="w-full h-8 rounded-xl text-xs font-semibold"
              onClick={handleAdd}
              disabled={disabled}
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Agregar a receta
            </Button>
          </div>
        )}

        {/* RECETA ACTUAL */}
        {receta.length > 0 && (
          <div className="space-y-1.5 border-t border-border/40 pt-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Receta actual ({receta.length})
            </p>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {receta.map((r) => (
                <div key={r.id} className="flex items-center justify-between bg-card/40 border border-border/30 p-2.5 rounded-xl gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{r.medicamento_texto}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {r.dosis} · {r.frecuencia} · {r.duracion_dias} días
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive rounded-lg shrink-0"
                    onClick={() => onEliminarMedicamento(r.id)}
                    disabled={disabled}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {receta.length === 0 && !selectedMed && (
          <p className="text-xs text-muted-foreground text-center py-2">
            Sin medicamentos recetados aún
          </p>
        )}

      </CardContent>
    </Card>
  );
}
