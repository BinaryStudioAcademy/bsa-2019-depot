import { Router } from 'express';

import authenticationMiddleware from '../middlewares/authentication.middleware';
import { googleMiddleware, googleCallbackMiddleware } from '../middlewares/google-authentication.middleware';
import registrationMiddleware from '../middlewares/registration.middleware';
import { login, register } from '../services/auth.service';

const router = Router();

router.post('/login', authenticationMiddleware, (req, res, next) => {
  login(req.user)
    .then(data => res.send(data))
    .catch(next);
});

router.get('/google', googleMiddleware);

router.get('/google/callback', googleCallbackMiddleware, (req, res, next) => {
  login(req.user)
    .then(data => res.send(data))
    .catch(next);
});

router.post('/register', registrationMiddleware, (req, res, next) => {
  register(req.user)
    .then(data => res.send(data))
    .catch(next);
});

export default router;
