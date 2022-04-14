import { RateLimitSettings } from '../models/rate-limit-settings';

interface LimitSettings {
  burst: number;
  sustained: number;
  tokens: number;
}

export class TokenBucket {
  private limits: Record<string, LimitSettings> = {};

  constructor(private readonly settings: RateLimitSettings[]) {
    for (const setting of settings) {
      this.limits[setting.route] = {
        burst: setting.burst,
        sustained: setting.sustained,
        tokens: setting.burst,
      };

      const interval = (60 / setting.sustained) * 1000;

      setInterval(() => {
        const limit = this.limits[setting.route];
        if (!limit) {
          return;
        }
        if (limit.tokens < limit.burst) {
          console.log('adding token');
          limit.tokens += 1;
        }
      }, interval);
    }
  }

  take(route: string): { success: boolean; tokensRemaining: number } {
    const limit = this.limits[route];
    if (!limit) {
      return { success: false, tokensRemaining: 0 };
    }

    if (limit.tokens === 0) {
      return { success: false, tokensRemaining: limit.tokens };
    }

    limit.tokens -= 1;
    return { success: true, tokensRemaining: limit.tokens };
  }
}
