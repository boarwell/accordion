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

const createTransitionPromiseOf = (container: HTMLElement) => {
  return new Promise(res => {
    container.addEventListener('transitionend', res, { once: true });
  });
};

const createAccordionOpen = (container: HTMLElement) => async () => {
  const transition = createTransitionPromiseOf(container);
  container.style.height = `${container.scrollHeight}px`;
  await transition;
  container.style.height = 'auto';
  container.removeAttribute('aria-hidden');
};

const createAccordionClose = (container: HTMLElement) => async () => {
  const transition = createTransitionPromiseOf(container);
  container.style.height = `${container.scrollHeight}px`;
  await new Promise(res => setTimeout(res, 50));
  container.style.height = '0px';
  await transition;
  container.setAttribute('aria-hidden', 'true');
};

const initAccordion = (container: HTMLElement): OpenCloseControls => {
  return {
    open: createAccordionOpen(container),
    close: createAccordionClose(container)
  };
};

const createOnClickHandler = (
  controls: OpenCloseControls,
  hook?: OpenCloseHooks
) => {
  let state: 'open' | 'closed' = 'closed';
  let isBusy = false;
  const { open, close } = controls;

  const onClick = async () => {
    if (isBusy) {
      return;
    }

    isBusy = true;
    if (state === 'open') {
      await hook?.beforeClose?.();
      await close();
      await hook?.afterClose?.();
      state = 'closed';
    } else {
      await hook?.beforeOpen?.();
      await open();
      await hook?.afterOpen?.();
      state = 'open';
    }
    isBusy = false;
  };

  return onClick;
};

const initOutOfAreaClickHandler = (
  safeAreas: HTMLElement[],
  close: Callback
) => {
  const onClick = async (e: Event) => {
    const clickOnSafeArea = safeAreas.some(safeArea =>
      safeArea.contains(e.target as HTMLElement)
    );

    if (clickOnSafeArea) {
      return;
    }
    document.removeEventListener('click', onClick);
    await close();
  };

  document.addEventListener('click', onClick);
};

const main = () => {
  const trigger = document.querySelector('.js-trigger') as HTMLElement;
  const container = document.querySelector('.js-container')! as HTMLElement;
  const accordionControls = initAccordion(container);
  trigger?.addEventListener(
    'click',
    createOnClickHandler(accordionControls, {
      afterOpen: async () => {
        initOutOfAreaClickHandler(
          [trigger, container],
          accordionControls.close
        );
      }
    })
  );
};
