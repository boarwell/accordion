export class Accordion {
  dom: HTMLElement;
  isOpen: boolean;
  isBusy = false;

  constructor(dom: HTMLElement, isOpen = false) {
    this.dom = dom;
    this.isOpen = isOpen;
  }

  /** transitionendを待つためのプロミス */
  private waitTransition() {
    return new Promise(res => {
      this.dom.addEventListener('transitionend', res, { once: true });
    });
  }

  /**
   * 高さに実数値をセットする
   *
   * auto -> 0px はtransitionが効かないので
   */
  private setRealHeight() {
    this.dom.style.height = `${this.dom.scrollHeight}px`;
  }

  /** 高さを0にする */
  private setZeroHeight() {
    this.dom.style.height = '0px';
  }

  /**
   * 高さをautoに
   *
   * アコーディオンが入れ子になっているときなど、
   * 高さがあとから変わるときのために指定する必要がある
   */
  private setAutoHeight() {
    this.dom.style.height = 'auto';
  }

  async open() {
    if (this.isBusy) {
      return;
    }

    this.isBusy = true;
    const transitionPromise = this.waitTransition();
    this.setRealHeight();
    await transitionPromise;
    this.setAutoHeight();
    this.isOpen = true;
    this.isBusy = false;
  }

  async close() {
    if (this.isBusy) {
      return;
    }

    this.isBusy = true;
    const transitionPromise = this.waitTransition();
    this.setRealHeight();
    // 高さが実数値に変わるのをちょっとだけ待つ必要がある
    await new Promise(res => setTimeout(res, 10));
    this.setZeroHeight();
    await transitionPromise;
    this.isOpen = false;
    this.isBusy = false;
  }

  async toggle() {
    if (this.isOpen) {
      await this.close();
      return;
    }

    await this.open();
  }
}

export const init = () => {
  const triggers: HTMLElement[] = Array.from(
    document.querySelectorAll('[data-accordion-trigger]')
  );

  for (const trigger of triggers) {
    const id = trigger.getAttribute('data-accordion-trigger')!;
    const container: HTMLElement | null = document.querySelector(
      `[data-accordion-container="${id}"]`
    );
    if (container === null) {
      continue;
    }
    const isOpen = container.hasAttribute('data-accordion-open');
    const accordion = new Accordion(container, isOpen);
    trigger.addEventListener('click', accordion.toggle.bind(accordion));
  }
};
