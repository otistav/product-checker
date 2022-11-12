import constants, { HoverStyle } from "./utils/constants";

const onMaskClick = (e: MouseEvent) => {
  console.log(e, 'event');
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

document.addEventListener('mousemove', (e) => handleElementUnderMouse(e, true));

