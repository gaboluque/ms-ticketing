import mongoose, { Model, Document } from "mongoose";
import { Order } from "./order";
import { OrderStatus } from "@gluque/node-utils";

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends Document {
  title: string;
  price: number;

  isReserved(): Promise<boolean>;
}

interface TicketModel extends Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

ticketSchema.statics.build = ({ id, ...attrs }: TicketAttrs) => {
  return new Ticket({ _id: id, ...attrs });
}

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: { $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete] }
  });
  return !!existingOrder;
}

export const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);