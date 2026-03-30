import { Queue } from 'bullmq';
import { MessageQueue } from '../../core/ports/MessageQueue';

export class BullMessageQueue implements MessageQueue {
  private queue: Queue;

  constructor(queueName: string, redisUrl: string) {
    this.queue = new Queue(queueName, {
      connection: {
        url: redisUrl,
      },
    });
  }

  public async publish(topic: string, message: any): Promise<void> {
    console.log(`[MessageQueue] Publishing message to topic ${topic}`, message);
    await this.queue.add(topic, message);
    console.log(`[MessageQueue] Confirmation Email simulated for message:`, message);
  }
}
