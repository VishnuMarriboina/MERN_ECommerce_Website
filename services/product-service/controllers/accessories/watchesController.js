const { Watches } = require("../../models/Accessories");

const getWatches = async (req, res) => {
  try {
    const filter = req.user?.User_Role?.toLowerCase() === "admin" ? { addedBy: req.user.userId } : {};
    const watches = await Watches.find(filter);
    res.status(200).json({ message: "Watches fetched successfully", user: req.user.email, data: watches });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const addWatchesCollection = async (req, res) => {
  try {
    if (req.user?.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can add watches" });
    }
    const { brand, movement, watch_type, water_resistance, variants } = req.body;

    if (!brand || !movement || !watch_type || !water_resistance) {
      return res.status(400).json({ message: "Brand, movement, watch_type & water_resistance are required" });
    }
    if (!Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({ message: "At least one variant is required" });
    }

    const watch = await Watches.create({
      brand, movement, watch_type, water_resistance,
      variants: variants.map((v) => ({
        size: v.size, strap_material: v.strap_material, dial_color: v.dial_color,
        cost: v.cost, count: v.count, image_url: v.image_url?.trim() || "No image found",
      })),
      addedBy: req.user.userId,
    });
    res.status(201).json({ message: "Watch added successfully", data: watch });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addVariant = async (req, res) => {
  try {
    if (req.user.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can add variants" });
    }
    const { id: watchId } = req.params;
    const { size, strap_material, dial_color, cost, count, image_url } = req.body;

    if (!size || !strap_material || !dial_color || cost == null || count == null) {
      return res.status(400).json({ message: "Size, strap_material, dial_color, cost & count are required" });
    }

    const result = await Watches.updateOne(
      {
        _id: watchId, addedBy: req.user.userId,
        variants: { $not: { $elemMatch: { size, strap_material, dial_color: { $regex: `^${dial_color}$`, $options: "i" } } } },
      },
      { $push: { variants: { size, strap_material, dial_color, cost, count, image_url: image_url?.trim() || "No image found" } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: "Variant already exists or watch not found" });
    }
    res.status(201).json({ message: "Variant added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to add variant" });
  }
};

const updateVariant = async (req, res) => {
  try {
    if (req.user?.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can update variants" });
    }
    const { id: watchId, variantid: variantId } = req.params;
    const updateFields = {};
    ["size", "strap_material", "dial_color", "cost", "count", "image_url"].forEach((field) => {
      if (req.body[field] !== undefined) updateFields[`variants.$.${field}`] = req.body[field];
    });

    const updatedWatch = await Watches.findOneAndUpdate(
      { _id: watchId, addedBy: req.user.userId, "variants._id": variantId },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedWatch) return res.status(404).json({ message: "Watch or variant not found" });
    res.status(200).json({ message: "Variant updated successfully", updatedVariant: updatedWatch });
  } catch (err) {
    res.status(500).json({ message: "Failed to update variant" });
  }
};

const deleteVariant = async (req, res) => {
  try {
    if (req.user?.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can delete variants" });
    }
    const { id: watchId, variantid: variantId } = req.params;
    const result = await Watches.updateOne(
      { _id: watchId, addedBy: req.user.userId },
      { $pull: { variants: { _id: variantId } } }
    );
    if (result.modifiedCount === 0) return res.status(404).json({ message: "Variant not found" });
    res.status(200).json({ message: "Variant deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete variant" });
  }
};

const updateWatch = async (req, res) => {
  try {
    if (req.user?.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can update watches" });
    }
    const { id } = req.params;
    const updateData = {};
    ["brand", "movement", "watch_type", "water_resistance"].forEach((field) => {
      if (req.body[field]) updateData[field] = req.body[field];
    });

    const updatedWatch = await Watches.findOneAndUpdate({ _id: id, addedBy: req.user.userId }, updateData, { new: true });
    if (!updatedWatch) return res.status(404).json({ message: "Watch not found" });
    res.status(200).json(updatedWatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteWatch = async (req, res) => {
  try {
    if (req.user?.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can delete watches" });
    }
    const { id } = req.params;
    const deleted = await Watches.findOneAndDelete({ _id: id, addedBy: req.user.userId });
    if (!deleted) return res.status(404).json({ message: "Watch not found" });
    res.status(200).json({ message: "Watch deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete watch" });
  }
};

module.exports = { getWatches, addWatchesCollection, addVariant, updateVariant, deleteVariant, updateWatch, deleteWatch };
