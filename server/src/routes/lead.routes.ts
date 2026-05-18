import { Router } from 'express';
import {
  createLead,
  deleteLead,
  exportLeadsCsv,
  getLeadById,
  getLeads,
  updateLead,
} from '../controllers/lead.controller';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import {
  createLeadSchema,
  leadQuerySchema,
  updateLeadSchema,
} from '../validators/lead.validator';

const router = Router();

router.use(protect);

router.get('/', validate(leadQuerySchema, 'query'), getLeads);
router.get('/export', validate(leadQuerySchema, 'query'), exportLeadsCsv);
router.get('/:id', getLeadById);
router.post('/', validate(createLeadSchema), createLead);
router.put('/:id', validate(updateLeadSchema), updateLead);
router.delete('/:id', authorize('admin'), deleteLead);

export default router;
