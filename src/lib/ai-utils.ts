import { ChatMessage } from "@/interfaces/interfaces";
import axios from "axios";
import * as fs from "fs";
import * as https from "https";

const username = "ga2mavq";
const passw = "If1@Tf3$Bn5^Tp7*";
const client_id = "bbb92095-7878-40d9-bddf-bac7fa61296a";
const client_secret = "4c9ce8b8-2ecc-493c-bb8f-f3142b8f740e";
const deployment_id = "gpt351106";

const post_fields = new URLSearchParams({
  grant_type: "password",
  client_id: client_id,
  client_secret: client_secret,
  username: username,
  password: passw,
});

export async function getAICompletion(
  input:
    | string
    | { role: string; content: string; id?: string }[]
    | ChatMessage[],
  deploymentId: string = deployment_id,
) {
  try {
    let payload;

    if (typeof input === "string") {
      payload = { message: input, deployment_id: deploymentId };
    } else if (Array.isArray(input)) {
      payload = { messages: input, deployment_id: deploymentId };
    } else {
      throw new Error(
        "Invalid input format. Expected a string or an array of messages.",
      );
    }

    const response: any = await axios.post(
      "http://OUR_BACKEND/completion",
      payload,
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    if (!response.data) {
      console.log("Response from server:3", response);
      throw new Error("Invalid response format");
    }

    console.log("Response from server:4", response.data);
    return response.data.completion;
  } catch (error) {
    console.error("Error fetching assistant message:", error);
    throw error;
  }
}
