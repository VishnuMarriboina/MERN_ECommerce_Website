const { Shirts: shirt } = require("../../models/Cloths");

const getShirts = async (req, res) => {
  try {
    let shirts;
    if (req.user.User_Role?.toLowerCase() === "admin") {
      shirts = await shirt.find({ addedBy: req.user.userId });
    } else {
      shirts = await shirt.find();
    }
    res.status(200).json({ message: "Shirts fetched successfully", user: req.user.email, data: shirts });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  }
};

const addShirts = async (req, res) => {
  try {
    if (req.user.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can add shirts" });
    }
    const { brand, type_of_material, collar_type, sleeve_type, variants } = req.body;

    if (!brand || !type_of_material || !collar_type || !sleeve_type) {
      return res.status(400).json({ message: "Brand, material, collar type, and sleeve type are required" });
    }
    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({ message: "At least one variant must be provided" });
    }

    const cleanedVariants = variants.map((v) => ({
      size: v.size, color: v.color, fit: v.fit, cost: v.cost, count: v.count,
      image_url: v.image_url && v.image_url.trim() !== "" ? v.image_url : "No image found",
    }));

    const newShirt = new shirt({ brand, type_of_material, collar_type, sleeve_type, variants: cleanedVariants, addedBy: req.user.userId });
    await newShirt.save();
    return res.status(201).json({ message: "Shirt added successfully", data: newShirt });
  } catch (err) {
    return res.status(500).json({ message: "Failed to add shirt" });
  }
};

const addVariant = async (req, res) => {
  try {
    const { id: shirtId } = req.params;
    if (req.user.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can add variants" });
    }
    const { size, color, fit, cost, count, image_url } = req.body;
    if (!size || !color || !fit || cost === undefined || count === undefined) {
      return res.status(400).json({ message: "Size, color, fit, cost & count are required" });
    }
    const shirtData = await shirt.findById(shirtId);
    if (!shirtData) return res.status(404).json({ message: "Shirt not found" });

    const exists = shirtData.variants.some(
      (v) => v.size === size && v.color.toLowerCase() === color.toLowerCase() && v.fit === fit
    );
    if (exists) return res.status(400).json({ message: "Variant with same size, color, and fit already exists" });

    shirtData.variants.push({ size, color, fit, cost, count, image_url: image_url?.trim() !== "" ? image_url : "No image found" });
    await shirtData.save();
    return res.status(201).json({ message: "Variant added successfully", data: shirtData });
  } catch (err) {
    return res.status(500).json({ message: "Failed to add variant" });
  }
};

const updateVariant = async (req, res) => {
  try {
    if (req.user.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can update variants" });
    }
    const { id: shirtId, variantid: variantId } = req.params;
    const { size, color, fit, count, cost, image_url } = req.body;

    const shirtData = await shirt.findById(shirtId);
    if (!shirtData) return res.status(404).json({ message: "Shirt not found" });

    const variant = shirtData.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    if (size) variant.size = size;
    if (color) variant.color = color;
    if (fit) variant.fit = fit;
    if (count !== undefined) variant.count = count;
    if (cost !== undefined) variant.cost = cost;
    if (image_url !== undefined && image_url.trim() !== "") variant.image_url = image_url;

    await shirtData.save();
    return res.status(200).json({ message: "Variant updated successfully", updatedVariant: variant });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update variant" });
  }
};

const deleteVariant = async (req, res) => {
  try {
    if (req.user.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can delete variants" });
    }
    const { id: shirtId, variantid: variantId } = req.params;
    const shirtData = await shirt.findById(shirtId);
    if (!shirtData) return res.status(404).json({ message: "Shirt not found" });

    const variant = shirtData.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    variant.deleteOne();
    await shirtData.save();
    return res.status(200).json({ message: "Variant deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete variant" });
  }
};

const updateShirts = async (req, res) => {
  try {
    if (req.user.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can update shirts" });
    }
    const shirtId = req.params.id;
    if (!shirtId || !shirtId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid shirt ID format" });
    }
    const existingShirt = await shirt.findById(shirtId);
    if (!existingShirt) return res.status(404).json({ message: "Shirt not found" });

    const updatableFields = ["size", "color", "type_of_material", "cost", "brand", "collar_type", "sleeve_type", "fit", "image_url"];
    const updateData = {};
    updatableFields.forEach((field) => { if (req.body[field] !== undefined) updateData[field] = req.body[field]; });

    const updatedShirt = await shirt.findByIdAndUpdate(shirtId, updateData, { new: true, runValidators: true });
    res.status(200).json({ message: "Shirt updated successfully", updatedShirt });
  } catch (err) {
    res.status(500).json({ message: "Failed to update shirt" });
  }
};

const buyShirts = async (req, res) => {
  try {
    const shirtId = req.params.id;
    const shirts = await shirt.findById(shirtId);
    if (!shirts) return res.status(404).json({ message: "Shirt not found" });
    if (shirts.count > 0) {
      shirts.count -= 1;
      await shirts.save();
      res.status(200).json({ message: "Shirt bought successfully" });
    } else {
      res.status(400).json({ message: "Shirt is out of stock" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const filterShirts = async (req, res) => {
  try {
    const fields = ["brand", "size", "color", "type_of_material", "cost", "collar_type", "sleeve_type", "fit"];
    const query = fields.reduce((acc, field) => {
      if (req.body[field]) acc[field] = { $regex: new RegExp(req.body[field], "i") };
      return acc;
    }, {});
    const shirts = await shirt.find(query);
    res.status(200).json(shirts);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteShirts = async (req, res) => {
  try {
    if (req.user.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can delete shirts" });
    }
    const deletedShirt = await shirt.findByIdAndDelete(req.params.id);
    if (!deletedShirt) return res.status(404).json({ message: "Shirt not found" });
    return res.status(200).json({ message: "Shirt deleted successfully" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = { getShirts, addShirts, updateShirts, deleteShirts, filterShirts, buyShirts, updateVariant, deleteVariant, addVariant };
