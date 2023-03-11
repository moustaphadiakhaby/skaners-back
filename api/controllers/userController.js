const { users, skans, pictures } = require("../../models");
const { sneakers } = require("../../models");
const ObjectID = require("mongoose").Types.ObjectId;
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

//// User Profile Handling \\\\\\\
module.exports.updateUser = async (req, res) => {
  const { id: userId } = req.params;
  if (!ObjectID.isValid(userId)) throw `ID unknown: ${userId}`;
  const userUpdatedValues = req.body;
  try {
    const user = await users.findByIdAndUpdate(
      userId,
      { ...userUpdatedValues },
      { new: true }
    );
    res.status(200).json({ message: "Successfully updated.", user });
  } catch (e) {
    throw { message: e };
  }
};

module.exports.userInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await users.findById(id);
    if (user) {
      res.status(200).json(user);
    }
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await users.deleteOne({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Successfully deleted." });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.allUsers = async (req, res) => {
  try {
    const usersList = await users.find();
    return res.status(200).json(usersList);
  } catch (e) {
    console.log(e);
    return "Error";
  }
};

//// Favorites Handling \\\\\\\

module.exports.likeSneaker = async (req, res) => {
  try {
    const { userId, sneakerId } = req.body;

    if (!userId || !sneakerId) {
      throw "missing params";
    }
    const user = await users.findById(userId);
    if (!user) {
      throw `no user found for this id: ${userId}`;
    }
    const newFav = await sneakers.findById(sneakerId);
    if (!sneakerId) {
      throw new Error({ code: 401, message: "This pictuce no longer exist" });
    }

    if (sneakerId) {
      user.sneakers.map((sneaker) => {
        if (JSON.stringify(sneaker._id) === JSON.stringify(sneakerId)) {
          const error = new Error("already in favs");
          error.code = 403;
          throw error;
        }
      });
    }
    user.sneakers.push(newFav);
    await user.save();
    return res
      .status(200)
      .json(`${sneakerId} bas been added to ${user.userName} favorites`);
  } catch (err) {
    console.log(err.message);
    res.status(err.code).json({ error: err.message });
  }
};

module.exports.unlikeSneaker = async (req, res) => {
  try {
    const { userId, sneakerId } = req.body;
    if (!userId || !sneakerId) {
      throw "missing params";
    }
    const user = await users.findById(userId);

    if (!user) {
      throw `no user found for this id`;
    }
    const newTab = [...user.sneakers];
    user.sneakers.map((sneaker, index) => {
      if (JSON.stringify(sneaker._id) === JSON.stringify(sneakerId)) {
        newTab.splice(index, 1);
      }
    });
    user.sneakers = newTab;
    await user.save();
    return res
      .status(200)
      .json(`${sneakerId} bas been removed from ${user.userName} favorites`);
  } catch (e) {
    res.status(400).json(e);
  }
};

const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

module.exports.addSkan = async (req, res) => {
  try {
    const { userId } = req.body;
    const { picture } = req.files;
    const user = await users.findById(userId);
    if (!user) {
      const error = new Error("Any user find with this Id");
      error.code = 403;
      throw error;
    } else {
      const result = await cloudinary.uploader.upload(
        convertToBase64(picture),
        {
          folder: `Skaners/user/${user.email}`,
        }
      );
      const skan = await skans.create({
        cloudinary: result,
        pictureUrl: result.secure_url,
        userId,
      });
      res.status(201).json({ skan });
    }
  } catch (err) {
    res.status(err.code).json({ error: err.message });
  }
};

module.exports.deleteSkan = async (req, res) => {
  const skanId = req.params.id;
  try {
    const skan = await skans.findById(skanId);

    await cloudinary.uploader.destroy(
      skan.cloudinary.public_id,
      function (error, result) {
        console.log("file upload", result, error);
      }
    );

    await skans.deleteOne({ _id: skanId }).exec();

    res.status(200).json({ message: "Successfully deleted." });
  } catch (e) {
    return "Error";
  }
};

module.exports.likeSkan = async (req, res) => {
  try {
    const { userId, skanId } = req.body;

    if (!userId || !skanId) {
      throw "missing params";
    }
    const user = await users.findById(userId);
    if (!user) {
      throw `no user found for this id: ${userId}`;
    }
    const newFav = await skans.findById(skanId);
    if (!skanId) {
      throw new Error({ code: 401, message: "This pictuce no longer exist" });
    }

    // const errorHandler = ({ code, message }) => {
    // console.error(message);
    //   const error = new Error(message);
    //   error.code = code;
    //   return error;
    // };

    if (skanId) {
      user.skans.map((skan) => {
        if (JSON.stringify(skan._id) === JSON.stringify(skanId)) {
          const error = new Error("already in favs");
          error.code = 403;
          throw error;
        }
      });
    }
    user.skans.push(newFav);
    await user.save();
    return res
      .status(200)
      .json(`${skanId} bas been added to ${user.userName} favorites`);
  } catch (err) {
    console.log(err.message);
    res.status(err.code).json({ error: err.message });
  }
};

module.exports.unlikeSkan = async (req, res) => {
  try {
    const { userId, skanId } = req.body;
    if (!userId || !skanId) {
      throw "missing params";
    }
    const user = await users.findById(userId);

    if (!user) {
      throw `no user found for this id`;
    }
    const newTab = [...user.skans];
    user.skans.map((skan, index) => {
      if (JSON.stringify(skan._id) === JSON.stringify(skanId)) {
        newTab.splice(index, 1);
      }
    });
    user.skans = newTab;
    await user.save();
    return res
      .status(200)
      .json(`${skanId} bas been removed from ${user.userName} favorites`);
  } catch (e) {
    res.status(400).json(e);
  }
};

module.exports.likePictures = async (req, res) => {
  try {
    const { userId, pictureId } = req.body;

    if (!userId || !pictureId) {
      throw "missing params";
    }
    const user = await users.findById(userId);
    if (!user) {
      throw `no user found for this id: ${userId}`;
    }
    const newFav = await pictures.findById(pictureId);
    if (!pictureId) {
      throw new Error({ code: 401, message: "This pictuce no longer exist" });
    }

    if (pictureId) {
      user.likes.map((picture) => {
        if (JSON.stringify(picture._id) === JSON.stringify(pictureId)) {
          const error = new Error("already in favs");
          error.code = 403;
          throw error;
        }
      });
    }
    user.likes.push(newFav);
    await user.save();
    return res
      .status(200)
      .json(`${pictureId} bas been added to ${user.userName} favorites`);
  } catch (err) {
    console.log(err.message);
    res.status(err.code).json({ error: err.message });
  }
};

module.exports.unlikePictures = async (req, res) => {
  try {
    const { userId, pictureId } = req.body;
    if (!userId || !pictureId) {
      throw "missing params";
    }
    const user = await users.findById(userId);

    if (!user) {
      throw `no user found for this id`;
    }
    const newTab = [...user.likes];
    user.likes.map((picture, index) => {
      if (JSON.stringify(picture._id) === JSON.stringify(pictureId)) {
        newTab.splice(index, 1);
      }
    });
    user.likes = newTab;
    await user.save();
    return res
      .status(200)
      .json(`${pictureId} bas been removed from ${user.userName} favorites`);
  } catch (e) {
    res.status(400).json(e);
  }
};

// TODO Error syntax on all routes
