import type { T } from "./data.js";
import { openCore, closeCore } from "./data.js";

import type { State } from "./state.js";
import { lock, free, update } from "./state.js";

// TODO: フックを実装
export const open_ = (context: State) => async (data: T): Promise<void> => {
  const lockHasSucceeded = lock(context);
  if (!lockHasSucceeded) {
    return;
  }

  if (context.isOpen) {
    free(context);
    return;
  }

  await openCore(data);
  update(context)("open");
  free(context);
};

export const close_ = (context: State) => async (data: T): Promise<void> => {
  const lockHasSucceeded = lock(context);
  if (!lockHasSucceeded) {
    return;
  }

  if (!context.isOpen) {
    free(context);
    return;
  }

  await closeCore(data);
  update(context)("close");
  free(context);
};
