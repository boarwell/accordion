import type { Callback, OpenCloseHooks } from './types';

export const createTransitionPromiseOf = (container: HTMLElement) => {
  return new Promise(res => {
    container.addEventListener('transitionend', res, { once: true });
  });
};

export const initOutOfAreaClickHandler = (
  safeAreas: HTMLElement[],
  close: Callback,
  hook?: Pick<OpenCloseHooks, 'beforeClose' | 'afterClose'>
) => {
  const onClick = async (e: Event) => {
    const clickOnSafeArea = safeAreas.some(safeArea =>
      safeArea.contains(e.target as HTMLElement)
    );

    if (clickOnSafeArea) {
      return;
    }
    document.removeEventListener('click', onClick);

    hook?.beforeClose?.();
    await close();
    hook?.afterClose?.();
  };

  document.addEventListener('click', onClick);
};
