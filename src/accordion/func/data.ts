/** データ型 */
export type T = Readonly<{
  dom: HTMLElement;
}>;

const waitTransition = async (data: T): Promise<void> => {
  // TODO: domがtransitionプロパティを持っていないときの処理
  return new Promise((res: () => void) => {
    data.dom.addEventListener("transitionend", res, { once: true });
  });
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
