#!/usr/bin/env node
var amqp = require('amqplib/callback_api')
const webSocketServer = require('websocket').server;
const http = require('http');

const webSocketsServerPort = 8000;
const server = http.createServer();
server.listen(webSocketsServerPort);
const wsServer = new webSocketServer({
  httpServer: server
});

wsServer.on('request', function (request) {
  let connectionWS = request.accept(null, request.origin);

  amqp.connect('amqps://xooyhwpl:E8_xDXT7sOUC_JP_-hCLMNxxgwVg6wpw@rat.rmq2.cloudamqp.com/xooyhwpl',
    function (error0, connection) {
      if (error0) {
        throw error0
      }
      connection.createChannel(function (error1, channel) {
        if (error1) {
          throw error1
        }

        var queue = 'Model/DocumentOcr'

        channel.assertQueue(queue, {
          durable: false,
          exclusive: false,
          autoDelete: true,
          arguments: null
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue)

        channel.consume(queue, async function (msg) {
          console.log(" [x] Received %s", msg.content.toString())
          const parsedJSON = await JSON.parse(msg.content)
          connectionWS.sendUTF(parsedJSON.IdDocument)
        }, {
          noAck: true
        })
      })
    }
  )
});