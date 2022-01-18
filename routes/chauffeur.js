const router = require("express").Router();
const Chauffeur = require("../model/Chauffeur");
const Livraison = require("../model/Livraison");
const {
  chauffeurValidation,
  assignValidation,
} = require("../validations/chauffeurValidation");
const JWT = require("jsonwebtoken");

router.post("/", async (req, res) => {
  //validation
  const { error } = chauffeurValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if CIN already exists
  const chauffeurExist = await Chauffeur.findOne({ CIN: req.body.CIN });
  if (chauffeurExist) return res.status(400).send("CIN already exists");

  //create new chauffeur
  const chauffeur = new Chauffeur({
    fullName: req.body.fullName,
    CIN: req.body.CIN,
    permis: req.body.permis,
    truck: req.body.truck,
  });

  try {
    //save chauffeur
    const savedChauffeur = await chauffeur.save();
    res.status(201).send(savedChauffeur);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const chauffeurs = await Chauffeur.find();
    res.send(chauffeurs);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.patch("/newLivraison", async (req, res) => {
  //validation
  const { error } = assignValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const chauffeur = await Chauffeur.findOneAndUpdate(
      { _id: req.body.chauffeurId },
      { $push: { livraisons: req.body.livraisonId } }
    );
    try {
      const newChauffeur = await Chauffeur.findOne({
        _id: req.body.chauffeurId,
      });
      res.statusMessage(200).send(newChauffeur);
    } catch (err) {
      res.status(500).send(err);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/calculateKm", async (req, res) => {
  try {
    const chauffeur = await Chauffeur.findOne({ _id: req.body.chauffeurId });
    const livraisons = chauffeur.livraisons;
    const allLivraisons = [];
    let totalKm = 0;
    for (let i = 0; i < livraisons.length; i++) {
      const livraison = await Livraison.findOne({ _id: livraisons[i] });
      allLivraisons.push(livraison);
      totalKm += +livraison.estimatedDistance;
    }

    const percentage = [
      {
        km: 1000,
        percentage: 0.15,
      },
      {
        km: 2000,
        percentage: 0.22,
      },
      {
        km: 2500,
        percentage: 0.3,
      },
    ];

    let totalPercentage = 0;

    if (totalKm > 2500) {
      allLivraisons.forEach((livraison) => {
        totalPercentage += +livraison.montant * percentage[2].percentage;
      });
      res.status(200).send({
        totalKm: totalKm,
        comission: totalPercentage + " DH",
      });
      return;
    }

    if (totalKm > 2000) {
      allLivraisons.forEach((livraison) => {
        totalPercentage += +livraison.montant * percentage[1].percentage;
      });
      res.status(200).send({
        totalKm: totalKm,
        comission: totalPercentage + " DH"
      });
      return;

    }

    if (totalKm > 1000) {
      allLivraisons.forEach((livraison) => {
        totalPercentage += +livraison.montant * percentage[0].percentage;
      });
      res.status(200).send({
        totalKm: totalKm,
        comission: totalPercentage + " DH"
      });
      return;
    }

    res.status(200).send({
      totalKm: totalKm,
      comission: totalPercentage + " DH"
    });

  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
