import { z } from 'zod';

const leadStatusEnum = z.enum(['New', 'Contacted', 'Qualified', 'Lost']);
const leadSourceEnum = z.enum(['Website', 'Instagram', 'Referral']);

export const createLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  status: leadStatusEnum.optional(),
  source: leadSourceEnum,
});

export const updateLeadSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  status: leadStatusEnum.optional(),
  source: leadSourceEnum.optional(),
});

export const leadQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  status: leadStatusEnum.optional(),
  source: leadSourceEnum.optional(),
  search: z.string().optional(),
  sort: z.enum(['latest', 'oldest']).default('latest'),
});
