/** @link https://qiita.com/suin/items/35c3953254255d24a193 */
declare const _opaqueProperty: unique symbol;

export type State = {
  isOpen: boolean;
  isBusy: boolean;
  [_opaqueProperty]: never;
};

export const createNewContext = (
  initialState?: Omit<State, typeof _opaqueProperty | "isBusy">
): State => {
  return {
    isOpen: false,
    isBusy: false,
    ...initialState,
  } as State;
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

export const update = (state: State) => (action: "open" | "close"): void => {
  switch (action) {
    case "open":
      state.isOpen = true;
      break;

    case "close":
      state.isOpen = false;
      break;

    default:
      const _: never = action;
  }
};
