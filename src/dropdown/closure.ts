import type { OpenCloseControls } from '../types';
import { createTransitionPromiseOf } from '../util';

const createDropdownOpen = (container: HTMLElement) => async () => {
  const transition = createTransitionPromiseOf(container);
  container.removeAttribute('aria-hidden');
  await transition;
};

const createDropdownClose = (container: HTMLElement) => async () => {
  const transition = createTransitionPromiseOf(container);
  container.setAttribute('aria-hidden', 'true');
  await transition;
};

export const initDropdown = (container: HTMLElement): OpenCloseControls => {
  return {
    open: createDropdownOpen(container),
    close: createDropdownClose(container)
  };
};
