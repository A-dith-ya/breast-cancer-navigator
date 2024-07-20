const scrollToSymptom = (item: string) => `
let elements = Array.from(document.querySelectorAll('span.ou-accordion-label'));
let element = elements.find(element => element.textContent.toLowerCase().includes('${item}'.toLowerCase()));
if (element) {
  element.scrollIntoView();
  element.click();
}
true; // note: this is required, or you'll sometimes get silent failures
`;

export { scrollToSymptom };
