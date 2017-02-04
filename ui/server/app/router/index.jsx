import express from 'express';
import main from './main';
import getssl from './getssl';


const router = express.Router();


router.get('/aniwei.proxy-ssl.pem', getssl);
router.get('/', main);

export default router;

