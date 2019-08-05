import { Router } from 'express';

import authenticationMiddleware from '../middlewares/authentication.middleware';
import { login } from '../services/auth.service';

const router = Router();

router.post('/login', authenticationMiddleware, (req, res, next) => {
  login(req.user)
    .then(data => res.send(data))
    .catch(next);
});

export default router;
