import { z } from "zod";

const certificateFilterSchema = z.object({
  key: z.string().trim().min(1),
  value: z.union([z.string(), z.number(), z.boolean(), z.null()]).optional(),
});

export const certificatesPageSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
});

export const certificatesSearchSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  filters: z.array(certificateFilterSchema).optional(),
});

export const certificateMutationSchema = z.record(z.string(), z.unknown());
