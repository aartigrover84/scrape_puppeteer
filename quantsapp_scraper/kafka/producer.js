const { Kafka } = require('kafkajs')

/*Required connection configs for Kafka producer, consumer, and admin */
bootstrap_servers="pkc-41p56.asia-south1.gcp.confluent.cloud:9092"



// This creates a client instance that is configured to connect to the Kafka broker provided by
// the environment variable KAFKA_BOOTSTRAP_SERVER
const kafka = new Kafka({
  clientId: 'qa-topic',
  brokers: [bootstrap_servers],
  ssl: true,
  logLevel: 2,
  sasl: {
    mechanism: 'plain',
    username: 'D67Z37OBAVHDKKK5',
    password: 'DFIQ2JpbkrX4bWZMe+EM9/TVIRjeG9JnZxjOoLuw13yY11gJPG9bafOh/ZOwLyAx'
  }
})

const producer = kafka.producer()
producer.on('producer.connect', () => {
  console.log(`KafkaProvider: connected`);
});

producer.on('producer.disconnect', () => {
    console.log(`KafkaProvider: could not connect`);
});

producer.on('producer.network.request_timeout', (payload) => {
    console.log(`KafkaProvider: request timeout ${payload.clientId}`);
  });

  const run_producer = async () => {
    // Producing
    await producer.connect()
  
    /*Consuming
    await consumer.connect()
    await consumer.subscribe({ topic: 'topic_trades', fromBeginning: true })
  
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          partition,
          offset: message.offset,
          value: message.value.toString(),
        })
      },
    })*/
  }
  
  run_producer().catch(console.error)
  

module.exports = producer
