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

  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL,
  UUID_KEY: "DEVICE_UNIQUE_ID",
  RECOMMENDATION_KEY: "RECOMMENDATION_KEY",
};

export default config;
