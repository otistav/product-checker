export type ObservableTarget = {
  [name: string]: {
    html: string;
    path: string;
    url: string;
  }
}

export type SetParameters = {
  html: string;
  path: string;
  url: string;
  name: string;
}