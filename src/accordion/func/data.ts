/** データ型 */
export type T = Readonly<{
  dom: HTMLElement;
  transitionDurationMS: number;
}>;

export const createNewData = (dom: HTMLElement): T => {
  const computedStyle = window.getComputedStyle(dom);
  const transitionDurationMS =
    parseFloat(computedStyle.transitionDuration) * 1000;

  return {
    dom,
    transitionDurationMS: isNaN(transitionDurationMS)
      ? 0
      : transitionDurationMS,
  };
};

const waitTransition = async (data: T): Promise<unknown> => {
  const transition = new Promise((res: () => void) => {
    data.dom.addEventListener("transitionend", res, { once: true });
  });

  const timeout = new Promise((res) =>
    setTimeout(res, data.transitionDurationMS)
  );

  return Promise.race([transition, timeout]);
};

const setRealHeight = async (data: T): Promise<void> => {
  data.dom.style.height = `${data.dom.scrollHeight}px`;
};

const setAutoHeight = async (data: T): Promise<void> => {
  data.dom.style.height = "auto";
};

const setZeroHeight = async (data: T): Promise<void> => {
  data.dom.style.height = "0px";
};

export const openCore = async (data: T): Promise<void> => {
  const transition = waitTransition(data);
  await setRealHeight(data);
  await transition;
  await setAutoHeight(data);
};

export const closeCore = async (data: T): Promise<void> => {
  await setRealHeight(data);
  // autoから実数値になるのを少し待つ必要がある
  await new Promise((res) => setTimeout(res, 50));
  const transition = waitTransition(data);
  await setZeroHeight(data);
  await transition;
};
