export interface MessageQueue {
  publish(topic: string, message: any): Promise<void>;
}
