const contentfulConfig = {
  space: process.env["EXPO_PUBLIC_CONTENTFUL_SPACE"],
  environment: process.env["EXPO_PUBLIC_ENVIRONMENT"],
  accessToken: process.env["EXPO_PUBLIC_CONTENTFUL_ACCESS_TOKEN"],
};

const config = {
  CONTENTFUL_CLIENT: contentfulConfig,
  SANITY_TOKEN: process.env["EXPO_PUBLIC_SANITY_TOKEN"],
  WEBVIEW_URI: "https://cancercareinnovationlab.ca",
  QUESTIONS_ENTRY_ID: process.env["EXPO_PUBLIC_QUESTIONS_ENTRY_ID"],

  API_BASE_URL: process.env["EXPO_PUBLIC_API_BASE_URL"],
  UUID_KEY: "DEVICE_UNIQUE_ID",
  RECOMMENDATION_KEY: "RECOMMENDATION_KEY",

  OPENAI_API_KEY: process.env["EXPO_PUBLIC_OPENAI_API_KEY"],
  OPENAI_ASSISTANT_ID: process.env["EXPO_PUBLIC_OPENAI_ASSISTANT_ID"],
};

export default config;
