import * as contentful from "contentful";
import { contentfulConfig } from "../config";

const client = contentful.createClient(contentfulConfig);

export default client;
