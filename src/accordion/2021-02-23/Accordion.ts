import { waitForAnimationFrame, waitForTransition } from "./util.js";

type Status = "open" | "closed";

export class Accordion {
  #container: HTMLElement;

  constructor(container: HTMLElement) {
    this.#container = container;
  }

  get status(): Status {
    if (this.#container.clientHeight === 0) {
      return "closed";
    }

    return "open";
  }

  async open(): Promise<void> {
    const transition = waitForTransition(this.#container);
    this.#container.style.height = `${this.#container.scrollHeight}px`;
    await transition;
    this.#container.style.height = "auto";
    this.#container.removeAttribute("inert");
  }

  async close(): Promise<void> {
    const transition = waitForTransition(this.#container);
    this.#container.style.height = `${this.#container.scrollHeight}px`;
    await waitForAnimationFrame();
    this.#container.style.height = "0";
    this.#container.setAttribute("inert", "");
    await transition;
  }

  async toggle(): Promise<void> {
    switch (this.status) {
      case "closed": {
        await this.open();
        break;
      }

      case "open": {
        await this.close();
        break;
      }
    }
  }
}
