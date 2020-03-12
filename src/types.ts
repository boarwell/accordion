export type Callback = () => Promise<unknown>;

export interface OpenCloseControls {
  open: Callback;
  close: Callback;
}

export interface OpenCloseHooks {
  beforeClose?: Callback;
  afterClose?: Callback;
  beforeOpen?: Callback;
  afterOpen?: Callback;
}
