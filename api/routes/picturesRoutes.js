const express = require("express");
const router = express.Router();

const { pictures } = require("../../models");

router.get("/pictures", async (req, res) => {
  try {
    const findPicture = await pictures.find();
    res.json(findPicture);
  } catch (e) {
    console.log(e);
    return "Error";
  }
});

module.exports = router;
