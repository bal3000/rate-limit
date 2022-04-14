import { TokenBucket } from '../token-bucket';

describe('token bucket', () => {
  it('should allow a request when there are tokens', () => {
    const config = [
      {
        route: 'GET /take',
        burst: 10,
        sustained: 6,
      },
    ];

    const bucket = new TokenBucket(config);

    const { success, tokensRemaining } = bucket.take(config[0].route);
    expect(success).toBe(true);
    expect(tokensRemaining).toBe(9);

    const { success: success2, tokensRemaining: tokensRemaining2 } =
      bucket.take(config[0].route);
    expect(success2).toBe(true);
    expect(tokensRemaining2).toBe(8);
  });

  it('should not allow a request when there are no tokens', () => {
    const config = [
      {
        route: 'GET /take',
        burst: 1,
        sustained: 6,
      },
    ];

    const bucket = new TokenBucket(config);

    const { success, tokensRemaining } = bucket.take(config[0].route);
    expect(success).toBe(true);
    expect(tokensRemaining).toBe(0);

    const { success: success2, tokensRemaining: tokensRemaining2 } =
      bucket.take(config[0].route);
    expect(success2).toBe(false);
    expect(tokensRemaining2).toBe(0);
  });

  it('should readd 1 token after the least possible time', async () => {
    const config = [
      {
        route: 'GET /take',
        burst: 10,
        sustained: 30, // should be 1 token every 2 secs
      },
    ];

    const bucket = new TokenBucket(config);

    const { success, tokensRemaining } = bucket.take(config[0].route);
    expect(success).toBe(true);
    expect(tokensRemaining).toBe(9);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const { success: success2, tokensRemaining: tokensRemaining2 } =
      bucket.take(config[0].route);
    expect(success2).toBe(true);
    expect(tokensRemaining2).toBe(9);
  });
});
