import { z } from "zod";
import { isFileValue } from "../../shared/utils/typeGuards";

export const uploadFileSchema = z.object({
  file: z.custom<File>((value) => isFileValue(value) && value.size > 0, {
    message: "File is required",
  }),
});
