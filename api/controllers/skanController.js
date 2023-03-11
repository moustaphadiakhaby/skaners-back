const { skans } = require("../../models");

module.exports.allSkans = async (req, res) => {
  try {
    const skansList = await skans.find();
    return res.status(200).json(skansList);
  } catch (e) {
    return "Error";
  }
};

// module.exports.deleteSkan = async (req, res) => {
//   const skanId = req.params.id;
//   try {
//     await skans.findByIdAndDelete(skanId).exec();
//     res.status(200).json({ message: "Successfully deleted." });
//   } catch (e) {
//     return "Error";
//   }
// };

//TODO delete picture from cloudinary
