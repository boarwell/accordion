import type { T } from "./data.js";
import { openCore, closeCore } from "./data.js";

type State = {
  isOpen: boolean;
  isBusy: boolean;
};

// TODO: 戻りはResultみたいな型がよかったけどとりあえず
const lock = (state: State): boolean => {
  if (state.isBusy) {
    return false;
  }

  state.isBusy = true;
  return true;
};

// TODO: 戻りはResultみたいな型がよかったけどとりあえず
const free = (state: State): boolean => {
  if (state.isBusy) {
    state.isBusy = false;
    return true;
  }

  return false;
};

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
  context.isOpen = true;
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
  context.isOpen = false;
  free(context);
};
