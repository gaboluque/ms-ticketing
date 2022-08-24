import { Publisher, OrderCreatedEvent, Subjects } from "@gluque/node-utils";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}