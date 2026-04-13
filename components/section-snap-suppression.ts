/**
 * SectionSnap listens for low scroll velocity and triggers a second Lenis scrollTo
 * to "snap" sections. That fights anchor navigation (different element + offset),
 * which feels like scroll → pause → scroll again. Suppress snap while nav scroll runs
 * and briefly after it finishes.
 */
let suppressUntil = 0;

export function beginAnchorScrollSuppression() {
  suppressUntil = Date.now() + 5000;
}

export function endAnchorScrollSuppression() {
  suppressUntil = Date.now() + 900;
}

export function isSectionSnapSuppressed() {
  return Date.now() < suppressUntil;
}
