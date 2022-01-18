const mongoose = require("mongoose");

const livraisonSchema = new mongoose.Schema({
  dateLivraison: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  kg: {
    type: Number,
    required: true,
    min: 6,
    max: 255,
  },
  from: {
    type:String,
    required:true,
    min:2,
    max:200,
  },
  to: {
    type:String,
    required:true,
    min:2,
    max:200,
  },
  estimatedDistance: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
    min: 6,
    max: 255,
    default:
      "Europe" | "Afrique" | "Asie" | "Amerique" | "Australie" | "Nationale",
  },
  montant: {
    type: Number,
    required: true,
    min: 1,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    required: true,
    min: 2,
    max: 255,
    default: "voiture" | "miniCamion" | "camion" | "avion",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("livraison", livraisonSchema);
