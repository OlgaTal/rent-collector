import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const apartmentSchema = new Schema({
  name: { type: String, required: true },
  sqrft: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  floor: { type: Number, required: true },
  rent: { type: Number, required: true },
  renter: { type: String, default: 'vacant' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Apartment', apartmentSchema);
