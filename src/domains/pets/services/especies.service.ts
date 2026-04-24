import { createCrudService } from "@/shared/lib/base.service";
import { Especie } from "../../pets/pets.types";

export const speciesService = createCrudService<Especie>('/especies');