export type KafkaSocketEvent = {
  timestamp: string;
  value: string;
};

interface KafkaAuth {
  ca: string;
  host: host;
  port: string;
  mechanism: "scram-sha-512" | "plain";
  username: string;
  password: string;
}
