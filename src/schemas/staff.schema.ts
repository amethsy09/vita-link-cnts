import { z } from "zod";

export const staffSchema = z.object({
  firstName: z.string().min(2, "Prénom trop court"),
  lastName: z.string().min(2, "Nom trop court"),

  email: z.string().email("Email invalide"),

  phone: z
    .string()
    .min(9, "Numéro trop court")
    .regex(/^\+?[0-9]+$/, "Numéro invalide"),

  password: z.string().min(6, "6 caractères minimum"),

  isStructureAdmin: z.boolean(),
});

export type StaffFormData = z.infer<typeof staffSchema>;