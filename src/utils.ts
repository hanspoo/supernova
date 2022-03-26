import { KafkaAuth } from "./types";

export default function envKafkaAuth(): KafkaAuth {
  return {
    ca: "",
    bootstrapServer: process.env.BOOTSTRAP_SERVER || "broker:9092",
    mechanism: "plain",
    username: "",
    password: "",
  };
}

export function capitalize(frase: string): string {
  const words = frase.split(/\s+/g);

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1).toLowerCase();
  }

  return words.join(" ");
}
