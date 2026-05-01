const { z } = require("zod");

const createLeadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name is too long"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email")
    .max(200),
  company: z
    .string()
    .trim()
    .max(150, "Company name is too long")
    .optional()
    .or(z.literal("")),
  painPoints: z
    .string()
    .trim()
    .min(10, "Tell us a bit more (at least 10 characters)")
    .max(2000, "Please keep this under 2000 characters"),
  // Honeypot — bots fill it in, humans don't see it.
  // We accept ANY value here so the route can return a fake 201 without tipping off bots.
  // The actual silent-skip logic lives in routes/leads.js.
  website: z.string().max(200).optional(),
});

module.exports = { createLeadSchema };
