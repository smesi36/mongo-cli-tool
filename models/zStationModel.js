import mongoose from "mongoose";

// Define a nested schema for fuel
const fuelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  short_name: { type: String, required: true },
  price: { type: Number, required: true },
  lastUpdated: { type: String, required: true },
});

// Define a schema for opening hours
const openingHoursSchema = new mongoose.Schema({
  monday_to_friday: { type: String, required: true },
  saturday: { type: String, required: true },
  sunday: { type: String, required: true },
  is_24_7: { type: Boolean, required: true },
});

// Define the main ZStation schema
const zStationSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, default: "Retail" },
  is_active: { type: Boolean, required: true },

  location: {
    address: { type: String, required: true },
    suburb: { type: String },
    city: { type: String, required: true },
    region: { type: String, required: true },
    postcode: { type: String },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
  },

  fuels: { type: [fuelSchema], default: [] },

  services: { type: [String], default: [] },

  opening_hours: { type: openingHoursSchema, required: true },
  is_open_now: { type: Boolean, default: false },

  pay_at_pump_247: { type: Boolean, default: false },
  phone: { type: String, default: "" },

  lastUpdated: { type: String, required: true },
});

export const ZStation = mongoose.model("ZStation", zStationSchema, "stations");
