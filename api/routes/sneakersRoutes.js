const express = require("express");
const router = express.Router();

const { sneakers } = require("../../models");
const querystring = require("querystring");

router.get("/sneakers", async (req, res) => {
  try {
    const { name, brand, color } = req.query;
    const filters = {};
    if (name) {
      filters.name = new RegExp(name, "i");
    }
    if (brand) {
      filters.brand = new RegExp(brand, "i");
    }

    if (color) {
      filters.color = new RegExp(color, "i");
    }

    // const filtersKeys = Object.keys(req.query)
    // if (!filtersKeys.length) {
    //    errorHandler(401, "cannot filter without filter")
    // }

    // filtersKeys.forEach((key) => {
    //   filtersKeys[key] = new RegExp(key, "i");
    // });

    const findSneaker = await sneakers.find(filters);
    res.json(findSneaker);
  } catch (e) {
    console.log(e);
    return "Error";
  }
});

router.get("/sneakers/:id", async (req, res) => {
  try {
    const findSneaker = await sneakers.findById(req.params.id);
    res.json(findSneaker);
  } catch (error) {
    res.status(404).json({ error: "Bad request" });
  }
});

module.exports = router;
