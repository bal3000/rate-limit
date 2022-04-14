import express from 'express';
import 'express-async-errors';
import { TokenBucket } from './rate-limit/token-bucket';
import { takeRouter } from './routes/take';

function serve(bucket: TokenBucket) {
  const app = express();
  app.use(express.json());

  app.use(takeRouter(bucket));

  app.all('*', (req, res) => {
    res.status(404).send('404 Not Found');
  });

  return app;
}

export default serve;
