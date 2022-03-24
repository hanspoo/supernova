import React, { KeyboardEvent } from "react";
import { Button, DatePicker, Input } from "antd";
import { Moment } from "moment";
import TopicExplorer from "../src/components/TopicExplorer";

export default function Topics() {
  const [topic, setTopic] = React.useState("");
  const [date, setDate] = React.useState<Moment | undefined>(undefined);
  const [showingResults, setShowResults] = React.useState(false);
  function onChange(date: any) {
    setDate(date);
  }

  const dataForSubmitAvailable = date && topic;

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      if (dataForSubmitAvailable) setShowResults(true);
    }
  };

  return (
    <>
      <Input.Group compact style={{ marginBottom: "0.5em" }}>
        <DatePicker disabled={showingResults} onChange={onChange} showTime style={{ width: "200px" }} />
        <Input
          placeholder="Topic"
          onChange={(ev: any) => setTopic(ev.target.value)}
          style={{ width: "65%" }}
          onKeyDown={onKeyDown}
          disabled={showingResults}
        />
        <Button
          type="primary"
          disabled={!dataForSubmitAvailable || showingResults}
          onClick={() => setShowResults(true)}
        >
          Enviar
        </Button>
      </Input.Group>
      {showingResults && <TopicExplorer topic={topic} date={date!} cancel={() => setShowResults(false)} />}
    </>
  );
}
