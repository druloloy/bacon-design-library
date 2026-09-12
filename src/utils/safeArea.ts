import type { EdgeInsets } from '../types/insets';

/**
 * Safe-area insets, with a graceful fallback.
 *
 * ENGINEERING DECISION: `react-native-safe-area-context` is an *optional* peer dependency. It is
 * the right way to get insets and almost every RN app already has it, but a design system should
 * not hard-fail an app that does not. When the module is absent this returns zeroes, which is the
 * correct answer on a device without a notch and a survivable one everywhere else.
 *
 * The require is deliberately lazy and guarded so bundlers that resolve statically do not turn a
 * missing optional dependency into a build error.
 */

const ZERO: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 };

type InsetsHook = () => EdgeInsets;

let cachedHook: InsetsHook | null = null;
let resolved = false;

function loadHook(): InsetsHook | null {
  if (resolved) return cachedHook;
  resolved = true;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('react-native-safe-area-context') as { useSafeAreaInsets?: InsetsHook };
    cachedHook = typeof mod.useSafeAreaInsets === 'function' ? mod.useSafeAreaInsets : null;
  } catch {
    cachedHook = null;
  }
  return cachedHook;
}

export function useSafeAreaInsets(): EdgeInsets {
  const hook = loadHook();
  // The branch is stable for the lifetime of the bundle: the module either resolves at startup
  // or never does, so the hook count cannot change between renders.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return hook ? hook() : ZERO;
}

export function hasSafeAreaContext(): boolean {
  return loadHook() !== null;
}
