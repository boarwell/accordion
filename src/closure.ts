type Callback = () => Promise<unknown>;

interface OpenCloseControls {
  open: Callback;
  close: Callback;
}

interface OpenCloseHooks {
  beforeClose?: Callback;
  afterClose?: Callback;
  beforeOpen?: Callback;
  afterOpen?: Callback;
}

const initAccordion = (container: HTMLElement): OpenCloseControls => {
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

const createOnClickHandler = (
  controls: OpenCloseControls,
  hook?: OpenCloseHooks
) => {
  let state: { name: 'open' } | { name: 'closed' } = { name: 'closed' };
  let isBusy = false;
  const { open, close } = controls;

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
  const accordionControls = initAccordion(container as HTMLElement);
  trigger?.addEventListener('click', createOnClickHandler(accordionControls));
};
