import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import controller from '../controllers/userController.js';
import { uploadPDF } from '../libs/fileManager.js';

const router = express.Router();

router.use(authMiddleware);
//user or customer access only
router.get('/details', controller.findById);
router.put('/register', controller.updateOne);
router.patch('/email', controller.setEmail);
router.patch('/mobile', controller.setMobilePhone);
router.patch('/landline', controller.setFixedPhone);
router.delete('/delete', controller.deleteOne);

//non-customer user access only
router.patch('/name', controller.setName);
router.patch('/file', uploadPDF.single('file'), controller.setFile);

//worker access only
router.get('/details/:CPForCNPJ', controller.findOne);
router.get('/list', controller.findAll());
router.get('/list/PJ', controller.findAll('PJ'));
router.get('/list/PF', controller.findAll('PF'));
router.get('/list/worker', controller.findAll('worker'));
router.get('/list/unchecked', controller.findAll('unchecked'));
router.patch('/worker', controller.setWorker(true));
router.patch('/worker/revoke', controller.setWorker(false));

export { router as userRouter };
