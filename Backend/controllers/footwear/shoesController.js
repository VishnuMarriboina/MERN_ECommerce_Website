const { Shoes } = require("../../models/FootWears");

// GET SHOES

const getShoes = async (req, res) => {
  try {
    let shoes;

    if (req.user?.User_Role?.toLowerCase() === "admin") {
      shoes = await Shoes.find({ addedBy: req.user.userId });
    } else {
      shoes = await Shoes.find();
    }

    return res.status(200).json({
      message: "Shoes fetched successfully",
      data: shoes,
    });
  } catch (error) {
    console.error("Error fetching shoes:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//

// ADD SHOES COLLECTION (ADMIN)

const addShoesCollection = async (req, res) => {
  try {
    if (req.user?.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can add shoes" });
    }

    const { brand, type_of_material, sole_type, color, variants } = req.body;

    if (!brand || !type_of_material || !sole_type || !color) {
      return res.status(400).json({
        message:
          "Brand, material, shoe type, and sole type are required fields",
      });
    }

    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one variant is required" });
    }

    const cleanedVariants = variants.map((v) => ({
      size: v.size,
      cost: v.cost,
      count: v.count,
      shoe_type: v.shoe_type,
      lacing_type: v.lacing_type,
      image_url: v.image_url?.trim() || "No image found",
    }));

    const shoe = new Shoes({
      brand,
      type_of_material,
      sole_type,
      color,
      variants: cleanedVariants,
      addedBy: req.user.userId,
    });

    const saved = await shoe.save();

    return res.status(201).json({
      message: "Shoe collection added successfully",
      data: saved,
    });
  } catch (error) {
    console.error("Error adding shoes:", error);
    return res.status(400).json({ message: error.message });
  }
};

// ADD VARIANT

const addVariantold = async (req, res) => {
  try {
    const shoeId = req.params.id;
    const { size, cost, count, shoe_type, lacing_type, image_url } = req.body;

    const shoe = await Shoes.findById(shoeId);
    if (!shoe) return res.status(404).json({ message: "Shoe not found" });

    shoe.variants.push({
      size,
      cost,
      count,
      shoe_type,
      lacing_type,
      image_url: image_url?.trim() || "No image found",
    });

    await shoe.save();

    return res.status(200).json({
      message: "Variant added successfully",
      data: shoe,
    });
  } catch (error) {
    console.error("Error adding variant:", error);
    return res.status(400).json({ message: error.message });
  }
};

const addVariant = async (req, res) => {
  try {
    const shoeId = req.params.id;
    const { size, cost, count, shoe_type, lacing_type, image_url } = req.body;

    const shoe = await Shoes.findById(shoeId);
    if (!shoe) {
      return res.status(404).json({ message: "Shoe not found" });
    }

    // 🔍 Check if same variant already exists
    const exists = shoe.variants.some(
      (v) =>
        v.size === size &&
        v.shoe_type === shoe_type &&
        v.lacing_type === lacing_type
    );

    if (exists) {
      return res.status(400).json({
        message:
          "Variant already exists with same size, shoe type and lacing type",
      });
    }

    // Add new variant
    shoe.variants.push({
      size,
      cost,
      count,
      shoe_type,
      lacing_type,
      image_url: image_url?.trim() || "No image found",
    });

    await shoe.save();

    return res.status(200).json({
      message: "Variant added successfully",
      data: shoe,
    });
  } catch (error) {
    console.error("Error adding variant:", error);
    return res.status(400).json({ message: error.message });
  }
};

// UPDATE VARIANT

const updateVariant = async (req, res) => {
  try {
    // console.log("request body",req.body);
    // console.log("request params",req.params);
    const shoeId = req.params.id;
    const variantId = req.params.variantid;

    const shoe = await Shoes.findById(shoeId);
    if (!shoe) return res.status(404).json({ message: "Shoe not found" });

    const variant = shoe.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    Object.assign(variant, req.body);

    await shoe.save();

    return res.status(200).json({
      message: "Variant updated successfully",
      data: shoe,
    });
  } catch (error) {
    console.error("Error updating variant:", error);
    return res.status(400).json({ message: error.message });
  }
};

// DELETE VARIANT

const deleteVariantold = async (req, res) => {
  try {
    const shoeId = req.params.id;
    const variantId = req.params.variantId;


    //console.log("params", req.params);

    //console.log("delete variant was triggred", shoeId, variantId);

    const shoe = await Shoes.findById(shoeId);
    if (!shoe) return res.status(404).json({ message: "Shoe not found" });

    shoe.variants = shoe.variants.filter((v) => v._id.toString() !== variantId);

    // console.log("shoe.variants", shoe);

    await shoe.save();

    return res.status(200).json({
      message: "Variant deleted successfully",
      data: shoe,
    });
  } catch (error) {
    console.error("Error deleting variant:", error);
    return res.status(400).json({ message: error.message });
  }
};


const deleteVariant = async (req, res) => {
  try {
    const shoeId = req.params.id;
    const variantId = req.params.variantid;


    // console.log("params", req.params);

    const shoe = await Shoes.findById(shoeId);
    if (!shoe) {
      return res.status(404).json({ message: "Shoe not found" });
    }

    // Check if variant exists
    const variantExists = shoe.variants.some(
      (v) => v._id.toString() === variantId
    );

    if (!variantExists) {
      return res.status(400).json({
        message: "Variant not found for the given variantId",
      });
    }

    // Delete variant
    shoe.variants = shoe.variants.filter(
      (v) => v._id.toString() !== variantId
    );

    await shoe.save();

    return res.status(200).json({
      message: "Variant deleted successfully",
      data: shoe,
    });
  } catch (error) {
    console.error("Error deleting variant:", error);
    return res.status(400).json({ message: error.message });
  }
};


// UPDATE SHOES

const updateShoes = async (req, res) => {
  try {
    const shoeId = req.params.id;

    const updated = await Shoes.findByIdAndUpdate(shoeId, req.body, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: "Shoe not found" });

    return res.status(200).json({
      message: "Shoe updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating shoes:", error);
    return res.status(400).json({ message: error.message });
  }
};

// DELETE SHOES

const deleteShoes = async (req, res) => {
  try {
    const shoeId = req.params.id;

    const deleted = await Shoes.findByIdAndDelete(shoeId);
    if (!deleted) return res.status(404).json({ message: "Shoe not found" });

    return res.status(200).json({
      message: "Shoe deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting shoes:", error);
    return res.status(500).json({ message: error.message });
  }
};

// EXPORTS

module.exports = {
  getShoes,
  addShoesCollection,
  addVariant,
  updateVariant,
  deleteVariant,
  updateShoes,
  deleteShoes,
};
