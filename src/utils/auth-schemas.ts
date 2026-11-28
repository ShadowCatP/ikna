import { z } from 'zod';

export type AuthMode = 'signIn' | 'signUp' | 'forgot';
export type AuthStep = 1 | 2;

export const emailSchema = z
  .string()
  .trim()
  .pipe(z.email('Enter a valid email address'));
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long');

export function getAuthSchema(mode: AuthMode, step: AuthStep) {
  return z.object({
    email: emailSchema,
    password: mode === 'forgot' ? z.string() : passwordSchema,
    name:
      mode === 'signUp' && step === 2
        ? z.string().trim().max(30, 'Use at most 30 characters')
        : z.string(),
  });
}

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine(({ password, confirm }) => password === confirm, {
    message: "Passwords don't match",
    path: ['confirm'],
  });
