import path from "path";

import { Kafka, KafkaMessage } from "kafkajs";
import fs from "fs";

import { KafkaAuth } from "../types";
import { randomBytes } from "crypto";

export default class KafkaConsumer {
  callback: (message: KafkaMessage) => void;
  kafkaAuth: KafkaAuth;
  topic: string;
  timestamp: number;
  connectionReady: () => void;
  kafkaError: (msg: string) => void;

  constructor(
    timestamp: number,
    kafkaAuth: KafkaAuth,
    topic: string,
    callback: (s: KafkaMessage) => void,
    connectionReady: () => void,
    kafkaError: (msg: string) => void
  ) {
    this.callback = callback;
    this.kafkaAuth = kafkaAuth;
    this.topic = topic;
    this.timestamp = timestamp;
    this.connectionReady = connectionReady;
    this.kafkaError = kafkaError;

    const { ca, host, port, username, password } = kafkaAuth;
    // if (!ca) throw Error("CA inválido");
    if (!host) throw Error("Invalid host");
    if (!port) throw Error("Invalid port");
    // if (!username) throw Error("Usuario inválido");
    // if (!password) throw Error("Contraseña inválida");
  }

  async run() {
    const { ca, host, port, mechanism, username, password } = this.kafkaAuth;

    const caContent = readCa(ca);

    const bootstrapBroker = `${host}:${port}`;
    console.log(`connecting to ${bootstrapBroker}`);

    const kafka = new Kafka({
      clientId: "switch-topic-explorer",
      brokers: [bootstrapBroker],
      // ssl: {
      //   rejectUnauthorized: false,
      //   // cert: [caContent],
      // },
      // sasl: {
      //   mechanism: mechanism,
      //   username: username,
      //   password: password,
      // },
    });

    const groupId = "test-consumer-group-" + randomBytes(16).toString("base64");

    try {
      const consumer = kafka.consumer({ groupId });
      await consumer.connect();
      const admin = kafka.admin();

      const partitions = await admin.fetchTopicOffsetsByTimestamp(this.topic, this.timestamp);

      await consumer.subscribe({ topic: this.topic });

      await admin.setOffsets({
        groupId,
        topic: this.topic,
        partitions,
      });

      this.connectionReady();

      await consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
          this.callback(message);
        },
      });
    } catch (error: any) {
      this.kafkaError(error + "");
    }
  }
}

function readCa(file: string): string {
  if (!file) return "";
  const arch = path.join(file);
  try {
    return fs.readFileSync(arch).toString("utf-8");
  } catch (error: any) {
    throw Error(`Archivo "${arch}" no encontrado`);
  }
}
