// 📍 Ubicación: src/app/(dashboard)/admin/catalogos/page.tsx

import { SpeciesManager } from "@/domains/pets/components/Modal-Especies";

export default function CatalogosPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Catálogos del Sistema</h1>
        <p className="text-slate-500">Administra las opciones maestras de la veterinaria.</p>
      </div>

      {/* ¡AQUÍ ESTÁS SIRVIENDO EL PLATO QUE COCINASTE EN EL DOMINIO! */}
      <SpeciesManager />
      
      {/* En el futuro, aquí debajo podrías poner <RazasManager /> o <VacunasManager /> */}
    </div>
  );
}