import { z } from "zod";

export const authSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    repeatPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((v) => v.newPassword === v.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  });
