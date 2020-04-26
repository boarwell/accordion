/** データ型 */
type T = Readonly<{
  dom: HTMLElement;
}>;

const waitTransition = async (data: T): Promise<void> => {
  // TODO: domがtransitionプロパティを持っていないときの処理
  return new Promise((res: () => void) => {
    data.dom.addEventListener("transitionend", res, { once: true });
  });
};

const setRealHeight = async (data: T): Promise<void> => {
  const promise = waitTransition(data);
  data.dom.style.height = `${data.dom.scrollHeight}px`;
  await promise;
};

const setAutoHeight = async (data: T): Promise<void> => {
  data.dom.style.height = "auto";
};

const setZeroHeight = async (data: T): Promise<void> => {
  const promise = waitTransition(data);
  data.dom.style.height = "0px";
  await promise;
};

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
const open_ = (context: State) => async (data: T): Promise<void> => {
  const lockHasSucceeded = lock(context);
  if (!lockHasSucceeded) {
    return;
  }

  if (context.isOpen) {
    free(context);
    return;
  }

  await setRealHeight(data);
  await setAutoHeight(data);
  context.isOpen = true;
  free(context);
};

const close_ = (context: State) => async (data: T): Promise<void> => {
  const lockHasSucceeded = lock(context);
  if (!lockHasSucceeded) {
    return;
  }

  if (!context.isOpen) {
    free(context);
    return;
  }

  await setRealHeight(data);
  await setZeroHeight(data);
  context.isOpen = false;
  free(context);
};
