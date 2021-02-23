export function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    window.setTimeout(() => {
      resolve();
    }, ms);
  });
}

export function waitForTransition(element: HTMLElement): Promise<void> {
  const transitionDuration = Number(
    window.getComputedStyle(element).transitionDuration
  );

  if (isNaN(transitionDuration)) {
    return Promise.resolve();
  }

  const transitionend = new Promise<void>((resolve) => {
    element.addEventListener(
      "transitionend",
      () => {
        resolve();
      },
      { once: true }
    );
  });

  return Promise.race([transitionend, sleep(transitionDuration)]);
}

export function waitForAnimationFrame(): Promise<void> {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      resolve();
    });
  });
}
