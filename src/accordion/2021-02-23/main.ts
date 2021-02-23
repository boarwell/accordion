import { Accordion } from "./Accordion";

const TRIGGER_ATTRIBUTE = "data-accordion-trigger";
const CONTAINER_ATTRIBUTE = "data-accordion-container";

function* getTriggers(): Generator<HTMLElement, void> {
  const triggers = document.querySelectorAll(`[${TRIGGER_ATTRIBUTE}]`);

  for (const trigger of triggers) {
    yield trigger as HTMLElement;
  }
}

function getContainerOf(trigger: HTMLElement): HTMLElement | null {
  const id = trigger.getAttribute(CONTAINER_ATTRIBUTE);
  if (id == null) {
    return null;
  }

  const container = document.querySelector(`[${CONTAINER_ATTRIBUTE}="${id}"]`);
  return container as HTMLElement | null;
}

export function main() {
  for (const trigger of getTriggers()) {
    const container = getContainerOf(trigger);

    if (container == null) {
      continue;
    }

    const accordion = new Accordion(container);

    trigger.addEventListener("click", () => {
      accordion.toggle();
    });
  }
}

main();
