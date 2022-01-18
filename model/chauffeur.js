const mongoose = require("mongoose");

const chauffeurSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  CIN: {
    type: String,
    required: true,
    min: 6,
    max: 8,
  },
  permis:{
    type:String,
    required:true,
    min:6,
    max:8,
  },
  truck: {
    type: String,
    required: true,
    default: "voiture" | "miniCamion" | "camion",
  },
  livraisons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Livraison",
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("chauffeur", chauffeurSchema);
