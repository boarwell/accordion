import { Callback } from './types';
import { initAccordion } from './accordion/closure';
import { initDropdown } from './dropdown/closure';

const triggerA = document.querySelector('.trigger-a') as HTMLElement;
const containerA = document.querySelector('.container-a') as HTMLElement;
const dropdownA = initDropdown(containerA);

const triggerB = document.querySelector('.trigger-b') as HTMLElement;
const containerB = document.querySelector('.container-b') as HTMLElement;
const dropdownB = initDropdown(containerB);

const accordionContainer = document.querySelector(
  '.accordion-container'
) as HTMLElement;
const accordion = initAccordion(accordionContainer);

type State =
  | {
      name: 'open';
      close: Callback;
    }
  | { name: 'closed' };

const main = () => {
  let state: State = { name: 'closed' };

  triggerA.addEventListener('click', async () => {
    if (state.name === 'closed') {
      await dropdownA.open();
      await accordion.open();
      state = { name: 'open', close: dropdownA.close };
      return;
    }

    // 自分が開いていたので自分を閉じてアコーディオンも閉じる
    if (state.close === dropdownA.close) {
      await accordion.close();
      await dropdownA.close();
    } else {
      await Promise.all([dropdownA.open(), dropdownB.close()]);
      state = { name: 'open', close: dropdownA.close };
    }
  });
};
