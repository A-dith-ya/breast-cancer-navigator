const contentfulConfig = {
  space: process.env.CONTENTFUL_SPACE,
  environment: process.env.CONTENTFUL_ENVIRONMENT,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
};

const config = {
  CONTENTFUL_CLIENT: contentfulConfig,
  SANITY_TOKEN: process.env.SANITY_TOKEN,
  WEBVIEW_URI: "https://cancercareinnovationlab.ca",
  QUESTIONS_ENTRY_ID: process.env.QUESTIONS_ENTRY_ID,
};

export default config;
