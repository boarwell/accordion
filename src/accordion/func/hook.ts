import type { T } from "./data.js";
import type { State } from "./state.js";

export type HookFunction = (context: State, data: T) => Promise<unknown>;

export type Hooks = Partial<{
  beforeOpen: HookFunction;
  afterOpen: HookFunction;
  beforeClose: HookFunction;
  afterClose: HookFunction;
}>;
