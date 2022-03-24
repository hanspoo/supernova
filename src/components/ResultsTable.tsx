import React from "react";
import moment from "moment";

import { Table } from "antd";
import { KafkaSocketEvent } from "../types";
import { capitalize } from "../utils";

export type CustomMessage = {
  date: string;
  ts: string;
  value: string;
};

// eslint-disable-next-line react/prop-types
const columns = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Payload",
    dataIndex: "value",
    key: "value",
    render: (text: string) => (
      <pre
        style={{
          whiteSpace: "pre-wrap",
          fontSize: "0.9em",

          width: "800px",
          overflow: "auto",
        }}
      >
        {text}
      </pre>
    ),
  },
];

export interface TableArgs {
  list: CustomMessage[];
  q: string;
}

export function CustomTimedTable({ list, q }: TableArgs) {
  if (list.length === 0) return <p>Waiting for events...</p>;

  const regex = q ? new RegExp(q, "im") : undefined;
  console.log("regex", q);

  const groups = list
    .filter((m) => (regex ? regex.test(m.value) : true))
    .sort((a, b) => {
      return parseFloat(b.ts) - parseFloat(a.ts);
    })
    .reduce((accumulator: Record<string, Array<any>>, customMesage) => {
      const date = capitalize(
        moment
          .unix(parseFloat(customMesage.ts) / 1000)
          .format("dddd, D MMMM")
          .toLowerCase()
      );

      if (!accumulator[date]) {
        accumulator[date] = [];
      }
      accumulator[date].push(customMesage);
      return accumulator;
    }, {});

  return (
    <>
      {Object.keys(groups).map((date) => (
        <CustomTable key={date} date={date} list={groups[date]} columns={columns} />
      ))}
    </>
  );
}

type CustomTableProps = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  list: object[];
  columns: Array<unknown>;
  date: string;
};
// eslint-disable-next-line react/prop-types
export function CustomTable({ list, columns, date }: CustomTableProps) {
  const col = columns as any;
  return (
    <>
      <h4>
        {date}, {list.length} event{list.length !== 1 && "s"}
      </h4>
      <Table dataSource={list} columns={col} />
    </>
  );
}

export function prepareMessage(msg: KafkaSocketEvent): CustomMessage {
  // console.log("typeof", typeof msg.value);

  // console.log("msg.value", msg.value);

  const m: CustomMessage = {
    value: msg.value,
    date: moment
      .unix(parseFloat(msg.timestamp) / 1000)
      .format("h:mm A")
      .toLowerCase(),
    ts: msg.timestamp,
  };
  return m;
}
