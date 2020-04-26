import type { T } from "./data.js";
import { openCore, closeCore } from "./data.js";

import type { State } from "./state.js";
import { lock, free, update } from "./state.js";

import type { Hooks } from "./hook.js";

export const open_ = (context: State, hooks?: Hooks) => async (
  data: T
): Promise<void> => {
  const lockHasSucceeded = lock(context);
  if (!lockHasSucceeded) {
    return;
  }

  if (context.isOpen) {
    free(context);
    return;
  }

  await hooks?.beforeOpen?.(context, data);
  await openCore(data);
  update(context)("open");
  await hooks?.afterOpen?.(context, data);
  free(context);
};

export const close_ = (context: State, hooks?: Hooks) => async (
  data: T
): Promise<void> => {
  const lockHasSucceeded = lock(context);
  if (!lockHasSucceeded) {
    return;
  }

  if (!context.isOpen) {
    free(context);
    return;
  }

  await hooks?.beforeClose?.(context, data);
  await closeCore(data);
  update(context)("close");
  await hooks?.afterClose?.(context, data);
  free(context);
};
