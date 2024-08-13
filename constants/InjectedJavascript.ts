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
  let contact = document.querySelector('h3');
  if (contact) {
    contact.scrollIntoView();
  }
true; // note: this is required, or you'll sometimes get silent failures
`;

const EXAMPLE_USER_SCROLL = `
  const style = document.createElement('style');
  style.innerHTML = \`
    .highlight {
      background-color: yellow;
      transition: background-color 0.5s ease;
    }
    \`;
  document.head.appendChild(style);

  let elements = Array.from(document.querySelectorAll("span.ou-accordion-label"));
  let element = elements.find((element) =>
    element.textContent
      .toLowerCase()
      .includes("All Info On Breast Cancer".toLowerCase())
  );

  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    element.click();

    setTimeout(() => {
      const accessiblityButton = document.querySelector(
        ".pojo-a11y-toolbar-link.pojo-a11y-toolbar-toggle-link"
      );
      if (accessiblityButton) {
        accessiblityButton.click();
        setTimeout(() => {
          accessiblityButton.click();
        }, 2000);
      }
    }, 500);

    setTimeout(() => {
      const learnMoreLinkIds = [
        "link_text-815-78",
        "link_text-822-78",
        "link_text-828-78",
        "link_text-834-78",
        "link_text-840-78",
      ];
      let i = 0;

      function scrollNextLink() {
        if (i < learnMoreLinkIds.length) {
          let link = document.getElementById(learnMoreLinkIds[i]);
          if (link) {
            link.scrollIntoView({ behavior: "smooth", block: "center" });
            link.classList.add("highlight");
            setTimeout(() => {
              link.classList.remove("highlight");
            }, 1000);
          }
          i = (i + 1) % learnMoreLinkIds.length;
          setTimeout(scrollNextLink, 2000);
        }
      }

      scrollNextLink();
    }, 1000);
  }
true; // note: this is required, or you'll sometimes get silent failures
`;

export { SCROLL_TO_SYMPTOM, SCROLL_TO_CONTACT, EXAMPLE_USER_SCROLL };
