# Supernova

Generic, simple kafka web client app.

Display/consume kafka events in real-time using web sockets

## run locally

```
git clone https://github.com/hanspoo/supernova
cd supernova/
yarn install
yarn dev
```

## Technologies

This project is built with:

### Nextjs

The framework (React + node)

#### Typescript

Language

### Antd

UI CSS Kit

### kafkajs

Kafka client

Of course, everything can be done better, and i will appreciate your pull/merge requests.

## Broker configuration

The broker host and port are expected to be present in a .env file.

Defaults are:

BROKER_HOST=broker
BROKER_PORT=9092

In order to run in the compose the confluent, the default broker host is process.env.BROKER or "broker".

## Docker

Image build:
docker build -t hanspoo/supernova:1.0 .

Image available at:
https://hub.docker.com/repository/docker/hanspoo/supernova
