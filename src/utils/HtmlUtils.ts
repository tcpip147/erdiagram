export const closest = (element: HTMLElement, className: string) => {
  let parent: HTMLElement | null = element;
  while (parent != null) {
    if (parent.classList.contains(className)) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
};
