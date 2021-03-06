import mongoose from "mongoose";

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

export interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema<TicketDoc, TicketModel, {}, {}>({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  userId: {
    type: String,
    required: true,
  }
});

ticketSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

ticketSchema.statics.build = (attrs: TicketAttrs) => new Ticket(attrs);

export const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);