const router = require("express").Router();
const Livraison = require("../model/Livraison");
const Chauffeur = require("../model/Chauffeur");
const { livraisonValidation } = require("../validations/livraisonValidation");
const JWT = require("jsonwebtoken");
const fetch = require("cross-fetch");

router.post("/", async (req, res) => {
  const { error } = livraisonValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //get id of user from token
  const token = req.header("Authorization").split(" ")[1];
  if (!token) return res.status(401).send("Access denied. No token provided.");
  try {
    const verified = JWT.verify(token, process.env.TOKEN_SECRET, {
      expiresIn: "10h",
    });

    let montant = 0;
    if (+req.body.kg > 3) {
      montant = +req.body.kg * 40;
    } else {
      montant = +req.body.kg * 5;
    }

    const estimatedDistance = await fetch(
      `https://www.distance24.org/route.json?stops=${req.body.from}|${req.body.to}`
    )
      .then((res) => res.json())
      .then((json) => json.distance);

    console.log(estimatedDistance);

    const livraison = new Livraison({
      dateLivraison: req.body.dateLivraison,
      kg: req.body.kg,
      direction: req.body.direction,
      type: +req.body.kg > 15 ? "camion" : "voiture",
      montant: montant,
      from: req.body.from,
      to: req.body.to,
      estimatedDistance: estimatedDistance,
      from: req.body.from,
      to: req.body.to,
      createdBy: verified._id,
    });

    try {
      const savedLivraison = await livraison.save();
      res.status(200).send({
        success: 1,
        livraison: {
          _id: savedLivraison._id,
          dateLivraison: savedLivraison.dateLivraison,
          kg: savedLivraison.kg,
          direction: savedLivraison.direction,
          type: savedLivraison.type,
          montant: savedLivraison.montant,
          from: savedLivraison.from,
          to: savedLivraison.to,
          estimatedDistance: savedLivraison.estimatedDistance,
          createdBy: savedLivraison.createdBy,
        },
      });
    } catch (err) {
      res.status(400).send(err);
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const livraisons = await Livraison.find();
    res.status(200).send(livraisons);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/:truck", async (req, res) => {
  try {
    const livraisons = await Livraison.find({ type: req.params.truck });
    res.status(200).send(livraisons);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/", async (req, res) => {
  try {
    const livraison = await Livraison.findByIdAndDelete(req.body._id);
    //delete from all chauffeur
    const chauffeurs = await Chauffeur.find();
    chauffeurs.forEach(async (chauffeur) => {
      const index = chauffeur.livraisons.indexOf(livraison._id);
      if (index > -1) {
        chauffeur.livraisons.splice(index, 1);
        await chauffeur.save();
      }
    });
    res.status(200).send({
      success: 1,
      livraison: livraison,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/all", async (req, res) => {

  //delete from all chauffeur
  const chauffeurs = await Chauffeur.find();
  chauffeurs.forEach(async (chauffeur) => {
    chauffeur.livraisons = [];
    await chauffeur.save();
  });
  try {
    const livraison = await Livraison.deleteMany();
    res.status(200).send({
      success: 1,
      message: "All livraisons deleted",
    });
  } catch (err) {
    res.status(400).send({
      success: 0,
      message: "Error deleting all livraisons",
      error: err,
    });
  }
});

module.exports = router;
