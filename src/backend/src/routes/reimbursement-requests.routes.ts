/*
 * This file is part of NER's FinishLine and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import express from 'express';
import { body } from 'express-validator';
import { intMinZero, isAccount, isDate, nonEmptyString } from '../utils/validation.utils';
import { validateInputs } from '../utils/utils';
import ReimbursementRequestController from '../controllers/reimbursement-requests.controllers';
import multer from 'multer';

const reimbursementRequestsRouter = express.Router();

const upload = multer();

reimbursementRequestsRouter.get('/vendors', ReimbursementRequestController.getAllVendors);

reimbursementRequestsRouter.get('/expense-types', ReimbursementRequestController.getAllExpenseTypes);

reimbursementRequestsRouter.get('/current-user', ReimbursementRequestController.getCurrentUserReimbursementRequests);

reimbursementRequestsRouter.get('/reimbursements/current-user', ReimbursementRequestController.getCurrentUserReimbursements);

reimbursementRequestsRouter.get('/reimbursements', ReimbursementRequestController.getAllReimbursements);

reimbursementRequestsRouter.post(
  '/create',
  isDate(body('dateOfExpense')),
  nonEmptyString(body('vendorId')),
  isAccount(body('account')),
  body('reimbursementProducts').isArray(),
  nonEmptyString(body('reimbursementProducts.*.name')),
  intMinZero(body('reimbursementProducts.*.cost')),
  intMinZero(body('reimbursementProducts.*.wbsNum.carNumber')),
  intMinZero(body('reimbursementProducts.*.wbsNum.projectNumber')),
  intMinZero(body('reimbursementProducts.*.wbsNum.workPackageNumber')),
  nonEmptyString(body('expenseTypeId')),
  intMinZero(body('totalCost')),
  validateInputs,
  ReimbursementRequestController.createReimbursementRequest
);

reimbursementRequestsRouter.get('/', ReimbursementRequestController.getAllReimbursementRequests);

reimbursementRequestsRouter.get('/:requestId', ReimbursementRequestController.getSingleReimbursementRequest);

reimbursementRequestsRouter.post(
  '/:requestId/edit',
  isDate(body('dateOfExpense')),
  nonEmptyString(body('vendorId')),
  isAccount(body('account')),
  body('receiptPictures').isArray(),
  nonEmptyString(body('receiptPictures.*.name')),
  nonEmptyString(body('receiptPictures.*.googleFileId')),
  body('reimbursementProducts').isArray(),
  nonEmptyString(body('reimbursementProducts.*.id').optional()),
  nonEmptyString(body('reimbursementProducts.*.name')),
  intMinZero(body('reimbursementProducts.*.cost')),
  intMinZero(body('reimbursementProducts.*.wbsNum.carNumber')),
  intMinZero(body('reimbursementProducts.*.wbsNum.projectNumber')),
  intMinZero(body('reimbursementProducts.*.wbsNum.workPackageNumber')),
  nonEmptyString(body('expenseTypeId')),
  intMinZero(body('totalCost')),
  validateInputs,
  ReimbursementRequestController.editReimbursementRequest
);

reimbursementRequestsRouter.get('/pending-advisor/list', ReimbursementRequestController.getPendingAdvisorList);

reimbursementRequestsRouter.post(
  '/pending-advisor/send',
  body('saboNumbers').isArray(),
  intMinZero(body('saboNumbers.*')),
  validateInputs,
  ReimbursementRequestController.sendPendingAdvisorList
);

reimbursementRequestsRouter.post(
  '/:requestId/set-sabo-number',
  intMinZero(body('saboNumber')),
  validateInputs,
  ReimbursementRequestController.setSaboNumber
);

reimbursementRequestsRouter.post(
  '/vendors/create',
  nonEmptyString(body('name')),
  validateInputs,
  ReimbursementRequestController.createVendor
);

reimbursementRequestsRouter.post(
  '/expense-types/create',
  nonEmptyString(body('name')),
  intMinZero(body('code')),
  body('allowed').isBoolean(),
  validateInputs,
  ReimbursementRequestController.createExpenseType
);

reimbursementRequestsRouter.post(
  '/:expenseTypeId/expense-types/edit',
  nonEmptyString(body('name')),
  intMinZero(body('code')),
  body('allowed').isBoolean(),
  validateInputs,
  ReimbursementRequestController.editExpenseTypeCode
);

reimbursementRequestsRouter.post(
  '/reimburse',
  intMinZero(body('amount')),
  validateInputs,
  ReimbursementRequestController.reimburseUser
);

reimbursementRequestsRouter.post(
  '/:requestId/upload-receipt',
  upload.single('image'),
  ReimbursementRequestController.uploadReceipt
);

reimbursementRequestsRouter.post('/:requestId/approve', ReimbursementRequestController.approveReimbursementRequest);
reimbursementRequestsRouter.delete('/:requestId/delete', ReimbursementRequestController.deleteReimbursementRequest);

reimbursementRequestsRouter.post(
  '/:requestId/delivered',
  ReimbursementRequestController.markReimbursementRequestAsDelivered
);

reimbursementRequestsRouter.get('/receipt-image/:fileId', ReimbursementRequestController.downloadReceiptImage);

export default reimbursementRequestsRouter;
