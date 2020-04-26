export type State = {
  isOpen: boolean;
  isBusy: boolean;
};

// TODO: 戻りはResultみたいな型がよかったけどとりあえず
export const lock = (state: State): boolean => {
  if (state.isBusy) {
    return false;
  }

  state.isBusy = true;
  return true;
};

// TODO: 戻りはResultみたいな型がよかったけどとりあえず
export const free = (state: State): boolean => {
  if (state.isBusy) {
    state.isBusy = false;
    return true;
  }

  return false;
};
