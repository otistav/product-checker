import { ObservableTarget } from "../types";

export const getAll = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['targets'], data => resolve(data.targets ? JSON.parse(data.targets) : {}));
  });
};

export const set = async (data: any): Promise<any> => {
  let targetObj: any = await getAll();
  console.log(targetObj);
  console.log(data, 'data');
  let targets = targetObj.targets ? JSON.parse(targetObj.targets) : {};
  targets[data.name] = { ...data };
  delete targets[data.name].name;
  return new Promise<void>((resolve, reject) => {
    chrome.storage.local.set({ targets: JSON.stringify(targets) }, () => resolve());
    // });
  })
}