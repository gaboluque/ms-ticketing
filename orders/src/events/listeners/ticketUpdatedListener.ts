import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketUpdatedEvent } from "@gluque/node-utils";
import { QUEUE_GROUP_NAME } from "./queueGroupName";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { id, title, price } = data;
    const ticket = await Ticket.findById(id);
    if (!ticket) throw new Error("Ticket not found");

    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}