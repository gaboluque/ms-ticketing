import { Publisher, OrderCancelledEvent, Subjects } from "@gluque/node-utils";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}