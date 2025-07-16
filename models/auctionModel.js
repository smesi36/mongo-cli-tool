import mongoose from "mongoose";

const auctionItemsSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: { type: String, required: true },
  start_price: { type: Number, required: true },
  reserve_price: { type: Number, required: true },
});

// Add text index for full-text search
auctionItemsSchema.index({ title: "text", description: "text" });

export const AuctionItems = mongoose.model("AuctionItems", auctionItemsSchema);