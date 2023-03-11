const ObjectID = require("mongoose").Types.ObjectId;
const { users, skans } = require("../../models");

module.exports.checkSkan = async (req, res) => {
  const { skanId, sneakerName, description, linkUrl } = req.body;

  if (!ObjectID.isValid(skanId)) throw `ID unknown: ${skanId}`;
  try {
    const skan = await skans.findById(skanId);

    const user = await users.findById(skan.userId);

    skan.isChecked = true;
    const newTab = [...user.skans];

    skan.sneakerName = sneakerName;
    skan.description = description;
    skan.linkUrl = linkUrl;

    newTab.push(skan);

    user.skans = newTab;
    await skan.save();
    await user.save();
    res.json("ok");
  } catch (e) {
    res.json("pas OK");
  }
};
