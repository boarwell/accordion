import type { T } from "./data.js";
import { openCore, closeCore } from "./data.js";

import type { State } from "./state.js";
import { lock, free, update, createNewContext } from "./state.js";

import type { Hooks } from "./hook.js";

export const open_ = (context: State, hooks?: Hooks) => async (
  data: T
): Promise<void> => {
  const lockHasSucceeded = lock(context);
  if (!lockHasSucceeded) {
    return;
  }

  if (context.isOpen) {
    free(context);
    return;
  }

  await hooks?.beforeOpen?.(context, data);
  await openCore(data);
  update(context)("open");
  await hooks?.afterOpen?.(context, data);
  free(context);
};

export const close_ = (context: State, hooks?: Hooks) => async (
  data: T
): Promise<void> => {
  const lockHasSucceeded = lock(context);
  if (!lockHasSucceeded) {
    return;
  }

  if (!context.isOpen) {
    free(context);
    return;
  }

  await hooks?.beforeClose?.(context, data);
  await closeCore(data);
  update(context)("close");
  await hooks?.afterClose?.(context, data);
  free(context);
};

export const toggle = (context: State, hooks?: Hooks) => async (
  data: T
): Promise<void> => {
  if (context.isBusy) {
    return;
  }

  if (context.isOpen) {
    close_(context, hooks)(data);
    return;
  }

  open_(context, hooks)(data);
};

export const init = () => {
  const triggers: HTMLElement[] = Array.from(
    document.querySelectorAll("[data-accordion-trigger")
  );

  for (const trigger of triggers) {
    // querySelectorでこの属性を指定しているので!
    const id = trigger.getAttribute("data-accordion-trigger")!;
    const container = document.querySelector(
      `[data-accordion-container="${id}"]`
    );

    if (container === null) {
      console.warn(`data-accordion-container="${id}"の要素がない`);
      continue;
    }
    const isOpen = container.hasAttribute("data-accordion-open");
    const context = createNewContext({ isOpen });
    const data: T = { dom: container as HTMLElement };
    trigger.addEventListener("click", () => toggle(context)(data));
  }
};
