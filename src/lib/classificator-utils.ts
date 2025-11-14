import { User } from "@/interfaces/interfaces";
import { getAICompletion } from "./ai-utils";

/*
our new categories -"schedule-server",
  "schedule-multiple-servers",
  "unschedule-server",
  "view-server",
  "view-multiple-servers",
  "view-backend-health",
  "view-server-orders",
  "view-order-by-id",
  "global-pause-on",
  "global-pause-off",
  "create-change-request",
  "update-change-request",
  "view-change-request",
  "miscellaneous",
*/
export async function classifyMessage(
  userMessage: string,
  user: User,
): Promise<string> {
  const classificatorMessage: string = `You are Linux Ops message classificator. you receive a message from a user and you need to classify it into one of the following categories:
  - schedule-server
  - schedule-multiple-servers
  - unschedule-server
  - view-server
  - view-multiple-servers
  - view-backend-health
  - view-server-orders // If user asks about patches, prechecks, postchecks, it is also orders.
  - view-order-by-id
  - global-pause-on
  - global-pause-off
  - create-change-request
  - update-change-request
  - view-change-request
  - miscellaneous - if they question is about what can you do - it is miscellaneous
  The user message is: "${userMessage}".
  Please return the category as a single string without any additional text or formatting. If the message does not fit any of the categories, return "miscellaneous".
  info about the user: ${JSON.stringify(user)}.
    `;
  return await getAICompletion(classificatorMessage, "gpt351106");
}

export async function executeAction(
  prevMessages: any[],
  messageCategory: string,
  user: User,
  messageText: string,
) {
  // redo switch now when category is a string and dint use that fucking enum, just make messagecategory ==
  switch (messageCategory) {
    case "global-pause-on":
      return "Global pause is currently not implemented. Please contact support for assistance.";
    case "global-pause-off":
      return "Global pause is currently not implemented. Please contact support for assistance.";
    case "create-change-request":
      return "Create Change request functionality is currently not implemented. Please contact support for assistance.";
    case "update-change-request":
      return "Update Change request functionality is currently not implemented. Please contact support for assistance.";
    case "miscellaneous":
      console.warn(
        "Message classified as miscellaneous. No specific action defined.",
      );

      return await getAICompletion(
        `The user message is "${messageText}". Please provide a general response or action for this message. if they ask what you can do, tell them you can do following: You are DCBI Automation agent to help with following things:
                - schedule-server - schedule automatic patching for your linux machine
                - schedule-multiple-servers 
                - unschedule-server 
                - view-server
                - view-multiple-servers
                - view-backend-health
                - view-server-orders // If user asks about patches, prechecks, postchecks, it is also orders.
                - view-order-by-id
                - global-pause-on
                - global-pause-off
                - create-change-request
                - update-change-request
                - view-change-request
                - miscellaneous - if they question is about what can you do - it is miscellaneous this is user: ${JSON.stringify(
                  user,
                )}`,
        "gpt351106",
      );
    default:
      console.warn("Message could not be classified.");
      return await getAICompletion(
        `The user message is "${messageText}". Please provide a general response or action for this message.`,
        "gpt351106",
      );
  }
}
