import React from "react";
import { useEffect } from "react";
import io, { Socket } from "socket.io-client";

import { Alert, Button, Input, Spin } from "antd";
import { CloseCircleFilled, PauseCircleFilled, SyncOutlined } from "@ant-design/icons";

import { CustomMessage, CustomTimedTable, prepareMessage } from "./ResultsTable";
import { Moment } from "moment";
import { KafkaSocketEvent } from "../types";

type Props = {
  topic: string;
  date: Moment;
  cancel: () => void;
};

const TopicExplorer = ({ topic, date, cancel }: Props) => {
  const [connectionReady, setConnectionReady] = React.useState(false);
  const [error, setError] = React.useState("");
  const [running, setRunning] = React.useState(true);
  const [q, setSearch] = React.useState("");
  const [list, setList] = React.useState<Array<CustomMessage>>([]);
  const [socket, setSocket] = React.useState<Socket>();

  useEffect(() => {
    fetch(`/api/kafka-web-socket?topic=` + topic + "&date=" + (date ? date.toISOString() : ""), {}).finally(() => {
      const sock = io();
      setSocket(sock);

      sock.on("connect", () => {
        console.log("connect");
      });
      sock.on("error", (error: string) => {
        setError(error);
      });

      sock.on("connection-ready", () => {
        console.log("Recibido connection-ready ****");

        setConnectionReady(true);
      });

      sock.on("kafka-record", (data: string) => {
        if (!running) return;

        const msg: KafkaSocketEvent = JSON.parse(data) as KafkaSocketEvent;

        const m = [prepareMessage(msg)];
        setList((list) => m.concat(list));
      });

      sock.on("a user connected", () => {
        console.log("a user connected");
      });

      sock.on("disconnect", () => {
        console.log("disconnect");
      });
    });
  }, [topic, date, running]);

  console.log("hay " + list.length);
  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      socket.emit("stop");
    }
    setRunning(false);
  };

  function downloadTxtFile() {
    const element = document.createElement("a");
    const inputElement = document.getElementById("myInput") as HTMLInputElement;
    const file = new Blob([inputElement.value], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `${topic}.tsv`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  const asString = list.map((l) => `${l.ts}\t${l.value}`).join("\n");

  return (
    <>
      <Input.Group compact style={{ marginBottom: "1em" }}>
        <Button disabled={!running} icon={<PauseCircleFilled />} onClick={disconnect}>
          Stop
        </Button>
        <Button icon={<CloseCircleFilled />} onClick={cancel}>
          Cancel
        </Button>
        <Input
          style={{ width: "50%" }}
          placeholder="Search results..."
          allowClear
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={downloadTxtFile} type="primary" disabled={list.length === 0 || running}>
          Download
        </Button>
        {running && <Spin size="small" style={{ marginLeft: "1em" }} />}
      </Input.Group>
      <input type="hidden" id="myInput" value={asString} />
      {!connectionReady && <p>Connecting to kafka...</p>}
      {error && <Alert message="Error" description={error} type="error" showIcon />}
      {connectionReady && <CustomTimedTable list={list} q={q} />}
    </>
  );
};

export default TopicExplorer;
