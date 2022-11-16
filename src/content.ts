import constants, { HoverStyle } from "./utils/constants";
import { getAll, set } from "./utils/storage";

type State = {
  applicationEnabled: boolean;
  metaPressed: boolean;
  helperPressed: boolean;
}

let state: State = {
  applicationEnabled: false,
  metaPressed: false,
  helperPressed: false,
}

const getNodePath = (hoverObj: HTMLElement) => {
  const path = []; // To save the path of the node element that need to get to the root element
  let node = hoverObj;
  console.log(node, 'node');
  const root = document.body;
  while (node !== root) {
    const parent = node.parentElement;
    console.log(parent, 'parent');
    if (!parent) break;
    const children = Array.from(parent.children);
    const nodeIndex = children.indexOf(node);
    console.log(path, 'path')
    path.push(nodeIndex);
    console.log(path, 'path after')
    node = parent;
  }
  return path.reverse();
}

const getElementByPath = (path: number[]) => {
  let elem: any = document.body;
  for (let index of path) {
    elem = elem.children[index];
  }
  return elem;
}

const onMaskClick = async (e: MouseEvent) => {
  console.log(e, 'event');
  const hoverObject = document.elementsFromPoint(e.clientX, e.clientY)[1];
  const path = getNodePath(hoverObject as HTMLElement);
  const html = (hoverObject as HTMLElement).outerHTML;
  await set({ html, path, url: window.location.href, name: 'test' });
  console.log(await getAll());
  console.log(getElementByPath(path).outerHTML === html);
}

const onKeyDown = (e: KeyboardEvent, state: State): State => {
  let newState = { ...state };
  if (e.key === constants.COMMAND_KEY) newState = { ...state, metaPressed: true };
  if (e.key === constants.HELPER_KEY) newState = { ...state, helperPressed: true };
  if (newState.metaPressed && newState.helperPressed) {
    const hoverMask = document.getElementById(constants.HOVER_ID);
    if (state.applicationEnabled && hoverMask) {
      hoverMask.parentElement?.removeChild(hoverMask);
    }
    newState = { ...state, applicationEnabled: !state.applicationEnabled };
  }
  return newState;
}

const onKeyUp = (e: KeyboardEvent, state: State): State => {
  if (e.key === constants.COMMAND_KEY) return { ...state, metaPressed: false };
  if (e.key === constants.HELPER_KEY) return { ...state, helperPressed: false };
  return state;
}

const createMask = (target: Element) => {
  const rect = target.getBoundingClientRect();
  const hoverMask = document.createElement('div');
  hoverMask.id = constants.HOVER_ID;
  for (const obj in constants.HOVER_STYLE) {
    // TODO: discover wtf is going on here
    hoverMask.style[obj as keyof HoverStyle] = constants.HOVER_STYLE[obj as keyof HoverStyle]
  }
  hoverMask.style.top = `${rect.top + scrollY}px`;
  hoverMask.style.left = `${rect.left + scrollX}px`;
  hoverMask.style.width = `${rect.width}px`;
  hoverMask.style.height = `${rect.height}px`;
  document.body.appendChild(hoverMask);
  hoverMask.addEventListener('click', onMaskClick)
}

const resizeMask = (target: Element, mask: HTMLElement) => {
  const rect = target.getBoundingClientRect();

  mask.style.top = `${rect.top + scrollY}px`;
  mask.style.left = `${rect.left + scrollX}px`;

  mask.style.width = `${rect.width}px`;
  mask.style.height = `${rect.height}px`;
}

const handleElementUnderMouse = (e: MouseEvent, applicationEnabled: boolean) => {
  if (!applicationEnabled) return;
  const hoverObject = document.elementsFromPoint(e.clientX, e.clientY)[1];
  const previousMask = document.getElementById(constants.HOVER_ID);
  if (previousMask) {
    resizeMask(hoverObject, previousMask);
  } else {
    createMask(hoverObject);
  }
}

document.addEventListener('mousemove', (e) => handleElementUnderMouse(e, state.applicationEnabled));
document.addEventListener('keydown', (e) => state = onKeyDown(e, state));
document.addEventListener('keyup', (e) => state = onKeyUp(e, state));
