import { Response } from 'express';
import { FilterQuery } from 'mongoose';
import { Lead, ILead } from '../models/Lead';
import { AuthRequest, PaginationMeta } from '../types';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';

const PAGE_LIMIT = 10;

const buildLeadFilter = (query: AuthRequest['query']): FilterQuery<ILead> => {
  const filter: FilterQuery<ILead> = {};

  if (query.status) {
    filter.status = query.status;
  }
  if (query.source) {
    filter.source = query.source;
  }
  if (query.search && typeof query.search === 'string' && query.search.trim()) {
    const searchRegex = new RegExp(query.search.trim(), 'i');
    filter.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  return filter;
};

export const createLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lead = await Lead.create({
    ...req.body,
    createdBy: req.user!.userId,
  });
  sendSuccess(res, 'Lead created successfully', lead, 201);
});

export const getLeads = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = Number(req.query.page) || 1;
  const sort = req.query.sort === 'oldest' ? 1 : -1;
  const filter = buildLeadFilter(req.query);
  const skip = (page - 1) * PAGE_LIMIT;

  const [leads, total] = await Promise.all([
    Lead.find(filter)
      .sort({ createdAt: sort })
      .skip(skip)
      .limit(PAGE_LIMIT)
      .populate('createdBy', 'name email'),
    Lead.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / PAGE_LIMIT);
  const meta: PaginationMeta = {
    page,
    limit: PAGE_LIMIT,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  sendSuccess(res, 'Leads fetched successfully', leads, 200, meta);
});

export const getLeadById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');
  if (!lead) {
    throw new AppError('Lead not found', 404);
  }
  sendSuccess(res, 'Lead fetched successfully', lead);
});

export const updateLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('createdBy', 'name email');

  if (!lead) {
    throw new AppError('Lead not found', 404);
  }
  sendSuccess(res, 'Lead updated successfully', lead);
});

export const deleteLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) {
    throw new AppError('Lead not found', 404);
  }
  sendSuccess(res, 'Lead deleted successfully');
});

export const exportLeadsCsv = asyncHandler(async (req: AuthRequest, res: Response) => {
  const filter = buildLeadFilter(req.query);
  const sort = req.query.sort === 'oldest' ? 1 : -1;

  const leads = await Lead.find(filter).sort({ createdAt: sort });

  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
  const rows = leads.map((lead) =>
    [
      lead.name,
      lead.email,
      lead.status,
      lead.source,
      lead.createdAt.toISOString(),
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(',')
  );

  const csv = [headers.join(','), ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=leads-export.csv');
  res.status(200).send(csv);
});
