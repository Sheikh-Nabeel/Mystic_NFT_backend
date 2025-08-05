 
import mongoose, { Schema } from "mongoose";

const referralProfitLogSchema = new Schema({
  uplineUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  downlineUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
  reservationId: { type: Schema.Types.ObjectId, ref: "Reservation", required: true },
  date: { type: Date, required: true },
  teamType: { type: String, enum: ["A", "B", "C"], required: true },
  profit: Number,
  percentage: Number,
  commission: Number
}, { timestamps: true });

export const ReferralProfitLog = mongoose.model("ReferralProfitLog", referralProfitLogSchema);
