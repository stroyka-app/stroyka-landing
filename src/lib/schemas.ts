import { z } from "zod";

export const demoFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  company: z.string().min(2, "Company name required").max(200),
  crewSize: z.enum(["1-5", "5-10", "10-25", "25+"]),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(20).optional(),
  challenge: z.string().max(1000).optional(),
  honeypot: z.string().max(0, "Bot detected"),
  // The site language the visitor filled the form in; picks the
  // confirmation email's language.
  locale: z.enum(["en", "es", "ru"]).optional(),
});
