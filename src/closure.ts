const initAccordion = (container: HTMLElement) => {
  const createTransitionPromise = () => {
    return new Promise(res => {
      container.addEventListener('transitionend', res, { once: true });
    });
  };

  const open = async () => {
    const transition = createTransitionPromise();
    container.style.height = `${container.scrollHeight}px`;
    await transition;
    container.style.height = 'auto';
    container.removeAttribute('aria-hidden');
  };

  const close = async () => {
    const transition = createTransitionPromise();
    container.style.height = `${container.scrollHeight}px`;
    await new Promise(res => setTimeout(res, 50));
    container.style.height = '0px';
    await transition;
    container.setAttribute('aria-hidden', 'true');
  };

  return { open, close };
};

type Callback = () => Promise<unknown>;

// TODO: container ではなく open(), close()を外から渡したら
// ドロップダウンでもアコーディオンでもタブでもなんでもいけそうな気がする
const createOnClickHandler = (
  container: HTMLElement,
  hook?: {
    beforeClose?: Callback;
    afterClose?: Callback;
    beforeOpen?: Callback;
    afterOpen?: Callback;
  }
) => {
  let state: { name: 'open' } | { name: 'closed' } = { name: 'closed' };
  let isBusy = false;
  const { open, close } = initAccordion(container as HTMLElement);

  const onClick = async () => {
    if (isBusy) {
      return;
    }

    isBusy = true;
    if (state.name === 'open') {
      await hook?.beforeClose?.();
      await close();
      await hook?.afterClose?.();
      state = { name: 'closed' };
    } else {
      await hook?.beforeOpen?.();
      await open();
      await hook?.afterOpen?.();
      state = { name: 'open' };
    }
    isBusy = false;
  };

  return onClick;
};

const main = () => {
  const trigger = document.querySelector('.js-trigger');
  const container = document.querySelector('.js-container')!;
  trigger?.addEventListener(
    'click',
    createOnClickHandler(container as HTMLElement)
  );
};
