import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validate-request';
import { TokenBucket } from '../rate-limit/token-bucket';

export function takeRouter(bucket: TokenBucket) {
  const router = express.Router();

  router.post(
    '/take',
    [body('route').isString().notEmpty()],
    validateRequest,
    (req: Request, res: Response) => {
      const { route } = req.body;
      const { success, tokensRemaining } = bucket.take(route);

      if (!success) {
        res
          .status(429)
          .send(`429 Too Many Requests. ${tokensRemaining} tokens remaining.`);
        return;
      }

      res.status(200).send({ tokensRemaining });
    }
  );

  return router;
}
