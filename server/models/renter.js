import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const renterSchema = new Schema({
  name: { type: String, required: true },
  money: { type: Number, default: 0 },
  apartment: { type: mongoose.Schema.ObjectId, ref: 'Apartment' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Renter', renterSchema);
