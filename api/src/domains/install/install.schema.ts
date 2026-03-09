import { z } from "zod";

const bootstrapUserSchema = z
  .object({
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    repeatPassword: z.string().min(1, "Repeat password is required"),
  })
  .refine((value) => value.password === value.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  });

const bootstrapSettingsSchema = z.object({
  parishName: z.string().min(1, "Parish name is required"),
  headerLine1: z.string().min(1, "Header line 1 is required"),
  headerLine2: z.string().min(1, "Header line 2 is required"),
  headerLine3: z.string().min(1, "Header line 3 is required"),
  headerLine4: z.string().min(1, "Header line 4 is required"),
  headerLine5: z.string().min(1, "Header line 5 is required"),
  headerLine6: z.string().min(1, "Header line 6 is required"),
  currentPriest: z.string().min(1, "Current priest is required"),
  currentPriestSignature: z.string().optional(),
  pdfImageLeft: z.string().optional(),
  pdfImageRight: z.string().optional(),
});

export const installBootstrapSchema = z.object({
  sampleData: z.boolean(),
  seedSample: z.boolean(),
  user: bootstrapUserSchema,
  settings: bootstrapSettingsSchema,
});
