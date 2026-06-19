const requests = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
) {
  const now = Date.now();
  const record = requests.get(key);

  if (!record || record.resetAt < now) {
    requests.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      success: true,
      remaining: limit - 1,
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
    };
  }

  record.count += 1;

  return {
    success: true,
    remaining: limit - record.count,
  };
}