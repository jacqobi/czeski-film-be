import axios from "axios";
import { getAICompletion } from "./ai-utils";
import { User } from "@/interfaces/interfaces";

export async function machineViewAction(
  user: User,
  message: string,
  prevMessages: any[],
) {
  const apiUrl = "http://OUR_BACKEND"; // Adjust the URL if necessary
  const promptForQueryParams = `Based on the user message, provide the values of the following query parameters for the API call if they are mentioned in the message - cursor, hostnamePartial, env, isScheduled, currentStatus, noPagination. If not mentioned, use null or appropriate default values. User message: "${message}". Previous messages: ${prevMessages}. hostnamePartial is important. if someone asks for servers which start with or anything like this, when they contain name substringm you fill in this field, hostnamePartial. only return strictly JSON object with query parameters, e.g. {"hostnamePartial": "apth", "env": "DEV,TUC,TUD,PROD", "isScheduled": null, "currentStatus": "In_PROGRESS"}. be careful as currentStatus is actually an enum -  SCHEDULED, IN_PROGRESS, COMPLETED, FAILED, SKIP. only return JSON object with query parameters, nothing else.`;
  const queryParams = await getAICompletion(promptForQueryParams, "gpt351106");
  const apiParams: Record<string, any> = {
    cursor: queryParams.cursor || null,
    hostnamePartial: queryParams.hostnamePartial || null,
    env: "DEV,TUC,TUD,PROD",
    isScheduled: queryParams.isScheduled || null,
    currentStatus: queryParams.currentStatus || null,
    noPagination: queryParams.noPagination || false,
  };

  try {
    const response = await axios.get(apiUrl, { params: apiParams });
    console.log("Linux servers fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching Linux servers:", error);
    return null;
  }
}
