import { Publisher, Subjects, TicketUpdatedEvent } from "@gluque/node-utils";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}