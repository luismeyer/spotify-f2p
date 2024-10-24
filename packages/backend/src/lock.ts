import type { UserData } from "@spotify-f2p/aws";

export function isUserLocked({ lockedAt }: UserData) {
  if (!lockedAt) {
    return false;
  }

  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  return lockedAt >= oneHourAgo;
}
