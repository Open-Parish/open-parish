import { z } from "zod";
import { isFileValue } from "../../shared/utils/typeGuards";

const fileSchema = z.custom<File>((value) => isFileValue(value), {
  message: "Invalid file upload",
});

const optionalFileField = z
  .union([fileSchema, z.string(), z.undefined()])
  .optional();

export const settingsFormSchema = z.object({
  parishName: z.string().optional(),
  headerLine1: z.string().optional(),
  headerLine2: z.string().optional(),
  headerLine3: z.string().optional(),
  headerLine4: z.string().optional(),
  headerLine5: z.string().optional(),
  headerLine6: z.string().optional(),
  currentPriest: z.string().optional(),
  currentPriestSignature: optionalFileField,
  pdfImageLeft: optionalFileField,
  pdfImageRight: optionalFileField,
  logo: optionalFileField,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "currentPassword is required"),
  newPassword: z.string().min(1, "newPassword is required"),
});
