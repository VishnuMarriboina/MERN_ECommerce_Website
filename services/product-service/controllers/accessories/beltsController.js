const { Belts } = require("../../models/Accessories");

const getBelts = async (req, res) => {
  try {
    let belts;
    if (req.user?.User_Role?.toLowerCase() === "admin") {
      belts = await Belts.find({ addedBy: req.user.userId });
    } else {
      belts = await Belts.find();
    }
    res.status(200).json({ message: "Belts fetched successfully", user: req.user.email, data: belts });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
};

const addBeltCollection = async (req, res) => {
  try {
    if (req.user?.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can add belts" });
    }
    const { brand, type_of_material, buckle_type, width, variants } = req.body;

    if (!brand || !type_of_material || !buckle_type || !width) {
      return res.status(400).json({ message: "Brand, material, buckle_type and width are required" });
    }
    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({ message: "At least one variant must be provided" });
    }

    const cleanedVariants = variants.map((v) => ({
      size: v.size, color: v.color, cost: v.cost, count: v.count,
      image_url: v.image_url && v.image_url.trim() !== "" ? v.image_url : "No image found",
    }));

    const newBelt = new Belts({ brand, type_of_material, buckle_type, width, variants: cleanedVariants, addedBy: req.user.userId });
    const savedBelt = await newBelt.save();
    res.status(201).json({ message: "Belt collection added successfully", data: savedBelt });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const addVariant = async (req, res) => {
  try {
    if (req.user?.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can add belt variants" });
    }
    const { id: beltId } = req.params;
    const { size, color, cost, count, image_url } = req.body;

    if (!size || !color || cost == undefined || count == undefined) {
      return res.status(400).json({ message: "Size, color, cost and count are required" });
    }

    const belt = await Belts.findById(beltId);
    if (!belt) return res.status(404).json({ message: "Belt not found" });

    const exists = belt.variants.some((v) => v.size === size && v.color.toLowerCase() === color.toLowerCase());
    if (exists) return res.status(400).json({ message: "Variant with same size & color already exists" });

    belt.variants.push({ size, color, cost, count, image_url: image_url?.trim() !== "" ? image_url : "No image found" });
    await belt.save();
    res.status(201).json({ message: "Variant added successfully", data: belt });
  } catch (err) {
    res.status(500).json({ message: "Failed to add variant" });
  }
};

const updateVariant = async (req, res) => {
  try {
    if (req.user?.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can update belt variants" });
    }
    const { id: beltId, variantid: variantId } = req.params;
    const { size, color, cost, count, image_url } = req.body;

    const belt = await Belts.findById(beltId);
    if (!belt) return res.status(404).json({ message: "Belt not found" });

    const variant = belt.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    if (size) variant.size = size;
    if (color) variant.color = color;
    if (count !== undefined) variant.count = count;
    if (cost !== undefined) variant.cost = cost;
    if (image_url !== undefined && image_url.trim() !== "") variant.image_url = image_url;

    await belt.save();
    res.status(200).json({ message: "Variant updated successfully", updatedVariant: variant });
  } catch (err) {
    res.status(500).json({ message: "Failed to update variant" });
  }
};

const deleteVariant = async (req, res) => {
  try {
    if (req.user?.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can delete variants" });
    }
    const { id: beltId, variantid: variantId } = req.params;
    const belt = await Belts.findById(beltId);
    if (!belt) return res.status(404).json({ message: "Belt not found" });

    const variant = belt.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    variant.deleteOne();
    await belt.save();
    res.status(200).json({ message: "Variant deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete variant" });
  }
};

const updateBelt = async (req, res) => {
  try {
    if (req.user?.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can update belts" });
    }
    const beltId = req.params.id;
    const updatableFields = ["brand", "type_of_material", "buckle_type", "width"];
    const updateData = {};
    updatableFields.forEach((field) => { if (req.body[field]) updateData[field] = req.body[field]; });

    const updatedBelt = await Belts.findByIdAndUpdate(beltId, updateData, { new: true });
    if (!updatedBelt) return res.status(404).json({ message: "Belt not found" });
    res.status(200).json(updatedBelt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteBelt = async (req, res) => {
  try {
    if (req.user?.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can delete belts" });
    }
    const { id } = req.params;
    const belt = await Belts.findById(id);
    if (!belt) return res.status(404).json({ message: "Belt not found" });
    await Belts.findByIdAndDelete(id);
    res.status(200).json({ message: "Belt deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete belt" });
  }
};

module.exports = { getBelts, addBeltCollection, addVariant, updateVariant, deleteVariant, updateBelt, deleteBelt };
