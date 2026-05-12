const { Sandles: Sandals } = require("../../models/FootWears");

const getSandals = async (req, res) => {
  try {
    let sandals;
    if (req.user?.User_Role?.toLowerCase() === "admin") {
      sandals = await Sandals.find({ addedBy: req.user.userId });
    } else {
      sandals = await Sandals.find();
    }
    res.status(200).json({ message: "Sandals fetched successfully", user: req.user.email, data: sandals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addSandalsCollection = async (req, res) => {
  try {
    if (req.user?.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can add sandals" });
    }
    const { brand, type_of_material, sole_type, strap_type, color, variants } = req.body;

    if (!brand || !type_of_material || !sole_type || !strap_type || !color) {
      return res.status(400).json({ message: "Brand, material, sandal type, and sole type are required" });
    }
    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({ message: "At least one variant required" });
    }

    const cleanedVariants = variants.map((v) => ({
      size: v.size, cost: v.cost, count: v.count, sandal_type: v.sandal_type, heel_height: v.heel_height,
      image_url: v.image_url && v.image_url.trim() !== "" ? v.image_url : "No image found",
    }));

    const sandals = new Sandals({ brand, type_of_material, sole_type, strap_type, color, variants: cleanedVariants, addedBy: req.user.userId });
    const newSandals = await sandals.save();
    res.status(201).json(newSandals);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addVariant = async (req, res) => {
  try {
    if (req.user?.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can add variants" });
    }
    const { id: sandalsId } = req.params;
    const { size, color, cost, sandal_type, heel_height, count, image_url } = req.body;

    const sandals = await Sandals.findById(sandalsId);
    if (!sandals) return res.status(404).json({ message: "Sandals not found" });

    const exists = sandals.variants.some(
      (v) => v.size === size && v.color?.toLowerCase() === color?.toLowerCase() && v.sandal_type === sandal_type && v.heel_height === heel_height
    );
    if (exists) return res.status(400).json({ message: "Variant already exists for this size and color" });

    sandals.variants.push({ size, color, cost, count, sandal_type, heel_height, image_url: image_url?.trim() ? image_url : "No image found" });
    await sandals.save();
    res.status(201).json({ message: "Variant added successfully", data: sandals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateVariant = async (req, res) => {
  try {
    if (req.user?.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can update variants" });
    }
    const { id: sandalsId, variantid: variantId } = req.params;
    const sandals = await Sandals.findById(sandalsId);
    if (!sandals) return res.status(404).json({ message: "Sandals not found" });

    const variant = sandals.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    const { size, color, cost, count, image_url, thumbnail_url } = req.body;
    if (size) variant.size = size;
    if (color) variant.color = color;
    if (cost !== undefined) variant.cost = cost;
    if (count !== undefined) variant.count = count;
    if (image_url !== undefined && image_url.trim() !== "") variant.image_url = image_url;
    if (thumbnail_url !== undefined && thumbnail_url.trim() !== "") variant.thumbnail_url = thumbnail_url;

    await sandals.save();
    res.status(200).json({ message: "Variant updated successfully", updatedVariant: variant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteVariant = async (req, res) => {
  try {
    if (req.user?.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can delete variants" });
    }
    const { id: sandalsId, variantid: variantId } = req.params;
    const sandals = await Sandals.findById(sandalsId);
    if (!sandals) return res.status(404).json({ message: "Sandals not found" });

    const variant = sandals.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    variant.deleteOne();
    await sandals.save();
    res.status(200).json({ message: "Variant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSandals = async (req, res) => {
  try {
    if (req.user?.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can update sandals" });
    }
    const sandalsId = req.params.id;
    const updatable = ["brand", "type_of_material", "sandal_type", "sole_type", "strap_type", "heel_height"];
    const data = {};
    updatable.forEach((field) => { if (req.body[field]) data[field] = req.body[field]; });

    const updatedSandals = await Sandals.findByIdAndUpdate(sandalsId, data, { new: true });
    if (!updatedSandals) return res.status(404).json({ message: "Sandals not found" });
    res.json(updatedSandals);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteSandals = async (req, res) => {
  try {
    if (req.user?.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can delete sandals" });
    }
    const { id } = req.params;
    const sandals = await Sandals.findById(id);
    if (!sandals) return res.status(404).json({ message: "Not found" });
    await Sandals.findByIdAndDelete(id);
    res.status(200).json({ message: "Sandals deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete sandals" });
  }
};

module.exports = { getSandals, addSandalsCollection, addVariant, updateVariant, deleteVariant, updateSandals, deleteSandals };
