import fs from 'fs';
import { resolve } from 'path';

import serve from './app';
import { RateLimitSettings } from './models/rate-limit-settings';
import { TokenBucket } from './rate-limit/token-bucket';

const config = JSON.parse(
  fs.readFileSync(resolve(__dirname, './config.json'), 'utf8')
) as {
  settings: RateLimitSettings[];
};

const bucket = new TokenBucket(config.settings);

const app = serve(bucket);

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
