import { createClient } from "@sanity/client"
import config from "../config"

export const client = createClient({
   projectId: "zg5kpt37", 
   dataset: "production", 
   apiVersion: "2024-03-11",
   token: config.SANITY_TOKEN,
   // Set to `true` for production environments
   useCdn: false, 
})