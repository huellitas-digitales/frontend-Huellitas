"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCrud } from "@/shared/hooks/useCrud";
import { speciesService } from "../services/especies.service";
import { Especie } from "../../pets/pets.types";
import { especieSchema, EspecieFormData } from "@/shared/lib/validation-schemas";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";

export function SpeciesManager() {
  // ✨ CAMBIO 1: Agregamos el queryKey 'especies' y quitamos 'fetchAll'
  const { data: especies, loading, createItem, deleteItem, updateItem } = useCrud<Especie>(speciesService, 'especies');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EspecieFormData>({
    resolver: zodResolver(especieSchema)
  });

  // ✨ CAMBIO 2: ¡Eliminamos el useEffect por completo! React Query se encarga.

  const handleEditClick = (especie: Especie) => {
    setEditingId(especie.id);
    reset({ nombre: especie.nombre });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: EspecieFormData) => {
    try {
      if (editingId) {
        // ✨ CAMBIO 3: Pasamos el ID y la data como un solo objeto
        await updateItem({ id: editingId, data });
      } else {
        await createItem(data);
      }
      cerrarModal();
    } catch (error) {
      // Error manejado globalmente por Axios y el useCrud
    }
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    reset({ nombre: "" });
  };

  return (
    <div className="p-6 space-y-6">
      {/* ... Cabecera y Modal quedan EXACTAMENTE IGUAL ... */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Especies</h2>
        <Dialog open={isModalOpen} onOpenChange={(open) => {
          if (!open) cerrarModal();
          else setIsModalOpen(true);
        }}>
          <DialogTrigger asChild>
            <Button onClick={cerrarModal}>+ Nueva Especie</Button>
          </DialogTrigger>
          <DialogContent>
            {/* ... Formulario exacto al tuyo ... */}
          </DialogContent>
        </Dialog>
      </div>

      {loading && especies.length === 0 ? (
        <p>Cargando catálogo...</p>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {especies.map((especie) => (
                <TableRow key={especie.id}>
                  <TableCell>{especie.id}</TableCell>
                  <TableCell className="font-medium">{especie.nombre}</TableCell>
                  <TableCell className="space-x-2">
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditClick(especie)}
                    >
                      Actualizar
                    </Button>

                    {/* ✨ CAMBIO 4: deleteItem solo necesita el ID */}
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteItem(especie.id)}
                    >
                      Eliminar
                    </Button>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}