import OpenAI from "openai";
import config from "@/config";
import logger from "@/utils/logger";

interface WebResource {
  url: string;
  title: string;
}

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

export const getWebResource = async (prompt: string): Promise<WebResource> => {
  let response: WebResource = { url: "", title: "" };

  logger.log("Retrieving assistant");
  const assistant = await openai.beta.assistants.retrieve(
    config.OPENAI_ASSISTANT_ID
  );
  const thread = await openai.beta.threads.create();
  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: prompt,
  });

  logger.log("Running assistant with prompt: ", prompt);
  let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: assistant.id,
  });

  if (run.status === "completed") {
    const messages = await openai.beta.threads.messages.list(run.thread_id);
    const assistantMessage = messages.data.find(
      (message) => message.role === "assistant"
    );

    if (assistantMessage) {
      const jsonMatch =
        assistantMessage.content[0].text.value.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        response = JSON.parse(jsonMatch[0]);
        logger.log("Assistant response: ", response);
      } else {
        logger.error("No JSON found in assistant message");
      }
    } else {
      logger.error("No assistant message found");
    }
  } else {
    logger.error("Assistant run status: ", run.status);
  }

  return response;
};
