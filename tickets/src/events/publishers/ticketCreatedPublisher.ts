import { TicketCreatedEvent, Subjects, Publisher } from "@gluque/node-utils";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}