import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import controller from '../controllers/accountController.js';

const router = express.Router();

router.use(authMiddleware);

//customer access only
router.post('/transfer', controller.createTransfer);
router.post('/debit', controller.createTransaction('D'));
router.post('/credit', controller.createTransaction('C'));
router.get('/balance', controller.findOne(false));
router.get('/details', controller.findDetails(false));
router.get('/summary/daily', controller.findSummary('D', false));
router.get('/summary/monthly', controller.findSummary('M', false));
router.get('/summary/yearly', controller.findSummary('Y', false));

//worker access only
router.post('/register', controller.createOne);
router.get('/customer/balance', controller.findOne(true));
router.get('/customer/details', controller.findDetails(true));
router.get('/customer/summary/daily', controller.findSummary('D', true));
router.get('/customer/summary/monthly', controller.findSummary('M', true));
router.get('/customer/summary/yearly', controller.findSummary('Y', true));
router.get('/list', controller.findAll());
router.get('/list/PF', controller.findAll('PF'));
router.get('/list/PJ', controller.findAll('PJ'));
router.get('/total', controller.findTotalAccounts());
router.get('/total/PF', controller.findTotalAccounts('PF'));
router.get('/total/PJ', controller.findTotalAccounts('PJ'));
router.get('/total/daily', controller.findTotalTransactions('D'));
router.get('/total/monthly', controller.findTotalTransactions('M'));
router.get('/total/yearly', controller.findTotalTransactions('Y'));
router.get('/total/daily/PF', controller.findTotalTransactions('D', 'PF'));
router.get('/total/monthly/PF', controller.findTotalTransactions('M', 'PF'));
router.get('/total/yearly/PF', controller.findTotalTransactions('Y', 'PF'));
router.get('/total/daily/PJ', controller.findTotalTransactions('D', 'PJ'));
router.get('/total/monthly/PJ', controller.findTotalTransactions('M', 'PJ'));
router.get('/total/yearly/PJ', controller.findTotalTransactions('Y', 'PJ'));

export { router as accountRouter };
