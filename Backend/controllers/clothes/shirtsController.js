const { Shirts: shirt } = require("../../models/Cloths");

// ✅ Get Shirts (role-based filtering)
const getShirts = async (req, res) => {
  try {
    let shirts;
    //console.log("req.user", req.user);

    if (req.user.User_Role?.toLowerCase() === "admin") {
      // Admin → only see their own shirts
      shirts = await shirt.find({ addedBy: req.user.userId });
      //console.log("admin shirts", shirts);
    } else {
      // User → see shirts from all admins
      shirts = await shirt.find();
      //console.log("user shirts", shirts);
    }
    // console.log("shirts", shirts);
    res.status(200).json({
      message: "Shirts fetched successfully",
      user: req.user.email,
      data: shirts,
    });
  } catch (err) {
    console.error("Error fetching shirts:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};

// ✅ Admin: Add new shirt with multiple variants
const addShirts = async (req, res) => {
  try {
    if (req.user.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can add shirts" });
    }

    const { brand, type_of_material, collar_type, sleeve_type, variants } =
      req.body;

    // Required fields check
    if (!brand || !type_of_material || !collar_type || !sleeve_type) {
      return res.status(400).json({
        message: "Brand, material, collar type, and sleeve type are required",
      });
    }

    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one variant must be provided" });
    }

    // ⭐ Clean each variant → image_url default fix
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

    const newShirt = new shirt({
      brand,
      type_of_material,
      collar_type,
      sleeve_type,
      variants: cleanedVariants,
      addedBy: req.user.userId,
    });

    //console.log("newShirt in line 83", newShirt);

    await newShirt.save();

    return res.status(201).json({
      message: "Shirt added successfully",
      data: newShirt,
    });
  } catch (err) {
    console.error("Error adding shirt:", err);
    return res.status(500).json({ message: "Failed to add shirt" });
  }
};

// ✅ Add a NEW variant to a specific shirt
const addVariant = async (req, res) => {
  try {
    const { id: shirtId } = req.params;

    if (req.user.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can add shirts" });
    }

    //console.log("shirtId in add variant", req.params);
    //console.log("id", shirtId);
    const { size, color, fit, cost, count, image_url } = req.body;

    //console.log("body", req.body);

    if (!size || !color || !fit || cost === undefined || count === undefined) {
      return res.status(400).json({
        message: "Size, color, fit, cost & count are required to add a variant",
      });
    }

    // Find shirt
    const shirtData = await shirt.findById(shirtId);

    //console.log("shirtData", shirtData);

    if (!shirtData) {
      return res.status(404).json({ message: "Shirt not found" });
    }

    // Check duplicates → same size + color + fit
    const exists = shirtData.variants.some(
      (v) =>
        v.size === size &&
        v.color.toLowerCase() === color.toLowerCase() &&
        v.fit === fit
    );

    if (exists) {
      return res.status(400).json({
        message: "Variant with same size, color, and fit already exists",
      });
    }

    // Construct new variant
    const newVariant = {
      size,
      color,
      fit,
      cost,
      count,
      image_url: image_url?.trim() !== "" ? image_url : "No image found",
    };

    //console.log("newVariant", newVariant);

    // Push into array
    shirtData.variants.push(newVariant);

    //console.log("shirtData.variants", shirtData.variants);

    await shirtData.save();

    return res.status(201).json({
      message: "Variant added successfully",
      data: shirtData,
    });
  } catch (err) {
    console.error("Error adding variant:", err);
    return res.status(500).json({ message: "Failed to add variant" });
  }
};

// ✅ Update a specific variant inside a specific shirt
const updateVariant = async (req, res) => {
  try {
    if (req.user.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can add shirts" });
    }

    const { id: shirtId, variantid: variantId } = req.params;

    //console.log("params", req.params);
    //console.log("body", req.body);

    //console.log("shirtId", shirtId);
    //console.log("variantId", variantId);

    const { size, color, fit, count, cost, image_url } = req.body;

    // Find the exact shirt
    const shirtData = await shirt.findById(shirtId);

    if (!shirtData) {
      return res.status(404).json({ message: "Shirt not found" });
    }

    // Find the exact variant within the shirt
    const variant = shirtData.variants.id(variantId);

    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    // Update only provided fields
    if (size) variant.size = size;
    if (color) variant.color = color;
    if (fit) variant.fit = fit;
    if (count !== undefined) variant.count = count;
    if (cost !== undefined) variant.cost = cost;
    if (image_url !== undefined && image_url.trim() !== "")
      variant.image_url = image_url;

    await shirtData.save();

    return res.status(200).json({
      message: "Variant updated successfully",
      updatedVariant: variant,
    });
  } catch (err) {
    console.error("Error updating variant:", err);
    return res.status(500).json({ message: "Failed to update variant" });
  }
};

// ✅ Delete a specific variant
const deleteVariant = async (req, res) => {
  try {
    if (req.user.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can add shirts" });
    }

    const { id: shirtId, variantid: variantId } = req.params;

    // Find the exact shirt
    const shirtData = await shirt.findById(shirtId);

    if (!shirtData) {
      return res.status(404).json({ message: "Shirt not found" });
    }

    // Find the variant inside the shirt
    const variant = shirtData.variants.id(variantId);
    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }
    // Delete the variant
    variant.deleteOne();

    await shirtData.save();

    return res.status(200).json({
      message: "Variant deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting variant:", err);
    return res.status(500).json({ message: "Failed to delete variant" });
  }
};

const updateShirts = async (req, res) => {
  try {
    if (req.user.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can add shirts" });
    }
    const shirtId = req.params.id;

    // Validate the shirt ID
    if (!shirtId || !shirtId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid shirt ID format" });
    }

    // Find the shirt
    const existingShirt = await shirt.findById(shirtId);
    if (!existingShirt) {
      return res.status(404).json({ message: "Shirt not found" });
    }

    // Fields that can be updated
    const updatableFields = [
      "size",
      "color",
      "type_of_material",
      "cost",
      "brand",
      "collar_type",
      "sleeve_type",
      "fit",
      "image_url",
    ];
    // console.log("req.body in add shirt page update shirt", req.body);
    // Build update object dynamically
    const updateData = {};
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Handle `count` logic
    if (req.body.count !== undefined) {
      let countValue = req.body.count;

      // Convert to number if string
      if (typeof countValue === "string") {
        countValue = parseInt(countValue, 10);
      }

      if (isNaN(countValue)) {
        return res
          .status(400)
          .json({ message: "Invalid count: must be a number" });
      }

      if (countValue < 0 && Math.abs(countValue) > existingShirt.count) {
        return res.status(400).json({
          message: `Cannot decrement count by ${Math.abs(countValue)}, only ${
            existingShirt.count
          } in stock`,
        });
      }

      // Use $inc for increment/decrement
      updateData.$inc = { count: countValue };
    }

    const updateOptions = {
      new: true,
      runValidators: true,
    };

    const updatedShirt = await shirt.findByIdAndUpdate(
      shirtId,
      updateData,
      updateOptions
    );

    res.status(200).json({
      message: "Shirt updated successfully",
      updatedShirt,
    });
  } catch (err) {
    console.error("Error updating shirt:", err);
  }
};

// ✅ Buy Shirt (for both roles)
const buyShirts = async (req, res) => {
  try {
    const shirtId = req.params.id;
    const shirts = await shirt.findById(shirtId);

    if (!shirts) {
      return res.status(404).json({ message: "Shirt not found" });
    }

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
    const fields = [
      "brand",
      "size",
      "color",
      "type_of_material",
      "cost",
      "collar_type",
      "sleeve_type",
      "fit",
    ];

    const query = fields.reduce((acc, field) => {
      if (req.body[field]) {
        acc[field] = [
          "size",
          "brand",
          "color",
          "type_of_material",
          "cost",
          "collar_type",
          "sleeve_type",
          "fit",
        ].includes(field)
          ? { $regex: new RegExp(req.body[field], "i") }
          : req.body[field];
      }
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
      return res.status(403).json({
        message: "Only admins can delete shirts",
      });
    }

    const deletedShirt = await shirt.findByIdAndDelete(req.params.id);

    // If shirt not found
    if (!deletedShirt) {
      return res.status(404).json({
        message: "Shirt not found",
      });
    }

    return res.status(200).json({
      message: "Shirt deleted successfully",
      // data: deletedShirt,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getShirts,
  addShirts,
  updateShirts,
  deleteShirts,
  filterShirts,
  buyShirts,
  updateVariant,
  deleteVariant,
  addVariant,
};
