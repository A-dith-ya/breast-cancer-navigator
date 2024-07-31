import * as contentful from "contentful";
import config from "../config";

const client = contentful.createClient(config.CONTENTFUL_CLIENT);

export default client;
