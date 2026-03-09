import type { ZodType } from "zod";

export type InferSchema<T extends ZodType> = T["_output"];
