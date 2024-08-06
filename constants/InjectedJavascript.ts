const SCROLL_TO_SYMPTOM = (item: string) => `
  let elements = Array.from(document.querySelectorAll('span.ou-accordion-label'));
  let element = elements.find(element => element.textContent.toLowerCase().includes('${item}'.toLowerCase()));
  if (element) {
    element.scrollIntoView();
    element.click();
  }

  const scrollHandler = () => {
    element.scrollIntoView();
  };

  const touchHandler = () => {
    window.removeEventListener('scroll', scrollHandler);
    window.removeEventListener('touchstart', touchHandler);
  };

  window.addEventListener('scroll', scrollHandler);
  window.addEventListener('touchstart', touchHandler);
true; // note: this is required, or you'll sometimes get silent failures
`;

const SCROLL_TO_CONTACT = `
  let element = document.querySelector('h3');
  if (element) {
    element.scrollIntoView();
  }
`;

export { SCROLL_TO_SYMPTOM, SCROLL_TO_CONTACT };
