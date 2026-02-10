const { Tshirts } = require("../../models/Cloths");

// ✅ GET ALL TSHIRTS (Admin sees own only)

const getTshirts = async (req, res) => {
  try {
    let tshirts;

    if (req.user?.User_Role?.toLowerCase() === "admin") {
      tshirts = await Tshirts.find({ addedBy: req.user.userId });
    } else {
      tshirts = await Tshirts.find();
    }

    res.status(200).json({
      message: "Tshirts fetched successfully",
      user: req.user.email,
      data: tshirts,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

// ✅ ADD TSHIRT COLLECTION

const addTshirt = async (req, res) => {
  try {
    if (req.user?.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can add shirts" });
    }

    const {
      brand,
      type_of_material,
      neck_type,
      sleeve_type,
      design,
      variants,
    } = req.body;

    if (!brand || !type_of_material || !neck_type || !sleeve_type || !design) {
      return res.status(400).json({
        message:
          "Brand, material, neck type, design and sleeve type are required",
      });
    }

    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one variant must be provided" });
    }

    const cleanedVariants = variants.map((v) => ({
      size: v.size,
      color: v.color,
      fit: v.fit,
      cost: v.cost,
      count: v.count,
      image_url:
        v.image_url && v.image_url.trim() !== ""
          ? v.image_url
          : "No image found",
    }));

    const tshirts = new Tshirts({
      brand,
      type_of_material,
      neck_type,
      sleeve_type,
      design,
      variants: cleanedVariants,
      addedBy: req.user.userId,
    });

    // console.log("in the tshirt controller 419", tshirts);

    await tshirts.save();

    res.status(201).json({
      message: "Tshirt added successfully",
      data: tshirts,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ ADD VARIANT

const addVariant = async (req, res) => {
  try {
    if (req.user.User_Role?.toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can add tshirtsvariants" });
    }
    const { id: tshirtId } = req.params;
    const { size, color, fit, cost, count, image_url } = req.body;

    if (!size || !color || !fit || cost === undefined || count === undefined) {
      return res.status(400).json({
        message: "Size, color, fit, cost & count are required",
      });
    }

    const tshirt = await Tshirts.findById(tshirtId);
    if (!tshirt) return res.status(404).json({ message: "Tshirt not found" });

    const exists = tshirt.variants.some(
      (v) =>
        v.size === size &&
        v.color.toLowerCase() === color.toLowerCase() &&
        v.fit === fit
    );

    if (exists) {
      return res.status(400).json({
        message: "Variant with same size, color, fit already exists",
      });
    }

    tshirt.variants.push({
      size,
      color,
      fit,
      cost,
      count,
      image_url: image_url?.trim() !== "" ? image_url : "No image found",
    });

    await tshirt.save();

    res.status(201).json({
      message: "Variant added successfully",
      data: tshirt,
    });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ message: "Failed to add variant" });
  }
};

// ✅ UPDATE VARIANT

const updateVariant = async (req, res) => {
  try {
    if (req.user?.User_Role?.toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can update TshirtsVariants" });
    }

    const { id: tshirtId, variantid: variantId } = req.params;
    const { size, color, fit, count, cost, image_url } = req.body;

    const tshirt = await Tshirts.findById(tshirtId);
    if (!tshirt) return res.status(404).json({ message: "Tshirt not found" });

    const variant = tshirt.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    if (size) variant.size = size;
    if (color) variant.color = color;
    if (fit) variant.fit = fit;
    if (count !== undefined) variant.count = count;
    if (cost !== undefined) variant.cost = cost;
    if (image_url !== undefined && image_url.trim() !== "")
      variant.image_url = image_url;

    await tshirt.save();

    res.status(200).json({
      message: "Variant updated successfully",
      updatedVariant: variant,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update variant" });
  }
};

// ❌ DELETE VARIANT

const deleteVariant = async (req, res) => {
  try {
    if (req.user?.User_Role?.toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can delete tshirtsVariants" });
    }

    const { id: tshirtId, variantid: variantId } = req.params;

    const tshirt = await Tshirts.findById(tshirtId);
    if (!tshirt) return res.status(404).json({ message: "Tshirt not found" });

    const variant = tshirt.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    variant.deleteOne();
    await tshirt.save();

    res.status(200).json({
      message: "Variant deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete variant" });
  }
};

// 🆕 ✅ DELETE TSHIRT (New API)

const deleteTshirt = async (req, res) => {
  try {
    if (req.user?.User_Role?.toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can delete tshirts" });
    }
    const { id } = req.params;

    const tshirt = await Tshirts.findById(id);
    if (!tshirt) {
      return res.status(404).json({ message: "Tshirt not found" });
    }

    await Tshirts.findByIdAndDelete(id);

    res.status(200).json({
      message: "Tshirt deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete Tshirt" });
  }
};

// UPDATE TSHIRT (Main fields)

const updateTshirt = async (req, res) => {
  try {
    if (req.user?.User_Role?.toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can update Tshirts" });
    }
    const tshirtId = req.params.id;

    // console.log("req.body", req.body);
    // console.log("req.params", req.params);

    const updatableFields = [
      "brand",
      "size",
      "color",
      "type_of_material",
      "cost",
      "neck_type",
      "sleeve_type",
      "fit",
      "design",
      "image_url",
    ];

    const updateData = {};
    updatableFields.forEach((field) => {
      if (req.body[field]) updateData[field] = req.body[field];
    });

    const updatedTshirt = await Tshirts.findByIdAndUpdate(
      tshirtId,
      updateData,
      { new: true }
    );

    if (!updatedTshirt)
      return res.status(404).json({ message: "Tshirt not found" });

    res.status(200).json({
      message: "Tshirt updated successfully",
      data: updatedTshirt,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getTshirts,
  addTshirt,
  addVariant,
  updateVariant,
  deleteVariant,
  deleteTshirt,
  updateTshirt,
};
