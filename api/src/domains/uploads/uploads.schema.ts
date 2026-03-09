import { z } from "zod";

export const uploadFileSchema = z.object({
  file: z.custom<File>((value) => value instanceof File && value.size > 0, {
    message: "File is required",
  }),
});
