import express from 'express';
import main from './main';
import plugin from './plugin';


const router = express.Router();

router.get('/', main);
router.get('/midway/:name', plugin);

export default router;

