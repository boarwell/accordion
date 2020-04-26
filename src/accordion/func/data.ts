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

export const openCore = async (data: T): Promise<void> => {
  await setRealHeight(data);
  await setAutoHeight(data);
};

export const closeCore = async (data: T): Promise<void> => {
  await setRealHeight(data);
  await setZeroHeight(data);
};
