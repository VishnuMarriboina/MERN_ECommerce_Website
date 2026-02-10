const { Watches } = require("../../models/Accessories");

// ✅ GET WATCHES (Admin sees OWN only)

const getWatches = async (req, res) => {
  try {
    let watches;

    if (req.user?.User_Role?.toLowerCase() === "admin") {
      watches = await Watches.find({ addedBy: req.user.userId });
    } else {
      watches = await Watches.find();
    }

    res.status(200).json({
      message: "Watches fetched successfully",
      user: req.user.email,
      data: watches,
    });
  } catch (error) {
    console.error("Error fetching watches:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ ADD WATCH COLLECTION

const addWatchesCollection = async (req, res) => {
  try {
    if (req.user?.User_Role?.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Only admins can add watches" });
    }

    const { brand, movement, watch_type, water_resistance, variants } =
      req.body;

    if (!brand || !movement || !watch_type || !water_resistance) {
      return res.status(400).json({
        message: "Brand, movement, watch_type & water_resistance are required",
      });
    }

    if (!variants || !Array.isArray(variants) || variants.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one variant must be provided" });
    }

    const cleanedVariants = variants.map((v) => ({
      size: v.size,
      strap_material: v.strap_material,
      dial_color: v.dial_color,
      cost: v.cost,
      count: v.count,
      image_url:
        v.image_url && v.image_url.trim() !== ""
          ? v.image_url
          : "No image found",
    }));

    const watch = new Watches({
      brand,
      movement,
      watch_type,
      water_resistance,
      variants: cleanedVariants,
      addedBy: req.user.userId,
    });

    // console.log("watch", watch);

    await watch.save();

    res.status(201).json({
      message: "Watch added successfully",
      data: watch,
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
        .json({ message: "Only admins can add watch variants" });
    }

    const { id: watchId } = req.params;
    const { size, strap_material, dial_color, cost, count, image_url } =
      req.body;

    if (
      !size ||
      !strap_material ||
      !dial_color ||
      cost == undefined ||
      count == undefined
    ) {
      return res.status(400).json({
        message: "Size, strap_material, dial_color, cost & count are required",
      });
    }

    const watch = await Watches.findById(watchId); //Instance of the watch was created
    if (!watch) return res.status(404).json({ message: "Watch not found" });

    const exists = watch.variants.some(
      (v) =>
        v.size === size &&
        v.strap_material === strap_material &&
        v.dial_color.toLowerCase() === dial_color.toLowerCase()
    );

    if (exists) {
      return res.status(400).json({
        message:
          "Variant with same size, strap material, dial color already exists",
      });
    }

    watch.variants.push({
      size,
      strap_material,
      dial_color,
      cost,
      count,
      image_url: image_url?.trim() !== "" ? image_url : "No image found",
    });

    await watch.save();

    res.status(201).json({
      message: "Variant added successfully",
      data: watch,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to add variant" });
  }
};

// ✅ UPDATE VARIANT

const updateVariant = async (req, res) => {
  try {
    if (req.user?.User_Role?.toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can update watch variants" });
    }

    // console.log("req params", req.params);

    const { id: watchId, variantid: variantId } = req.params;
    const { size, strap_material, dial_color, cost, count, image_url } =
      req.body;

    const watch = await Watches.findById(watchId); //Instance of the watch
    if (!watch) return res.status(404).json({ message: "Watch not found" });

    const variant = watch.variants.id(variantId); //subdocument instance of the watch
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    if (size) variant.size = size;
    if (strap_material) variant.strap_material = strap_material;
    if (dial_color) variant.dial_color = dial_color;
    if (count !== undefined) variant.count = count;
    if (cost !== undefined) variant.cost = cost;
    if (image_url !== undefined && image_url.trim() !== "")
      variant.image_url = image_url;

    await watch.save();

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
        .json({ message: "Only admins can delete variants" });
    }

    const { id: watchId, variantid: variantId } = req.params;

    const watch = await Watches.findById(watchId);
    if (!watch) return res.status(404).json({ message: "Watch not found" });

    const variant = watch.variants.id(variantId);
    if (!variant) return res.status(404).json({ message: "Variant not found" });

    variant.deleteOne();
    await watch.save();

    res.status(200).json({ message: "Variant deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete variant" });
  }
};

// UPDATE WATCH MAIN FIELDS

const updateWatch = async (req, res) => {
  try {
    if (req.user?.User_Role?.toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can update watch details" });
    }

    const watchId = req.params.id;

    const updatableFields = [
      "brand",
      "movement",
      "watch_type",
      "water_resistance",
    ];

    const updateData = {};

    updatableFields.forEach((field) => {
      if (req.body[field]) updateData[field] = req.body[field];
    });

    const updatedWatch = await Watches.findByIdAndUpdate(watchId, updateData, {
      new: true,
    });

    if (!updatedWatch)
      return res.status(404).json({ message: "Watch not found" });

    res.status(200).json(updatedWatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ❌ DELETE WATCH

const deleteWatch = async (req, res) => {
  try {
    if (req.user?.User_Role?.toLowerCase() !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can delete watches" });
    }

    const { id } = req.params;

    const watch = await Watches.findById(id);
    if (!watch) return res.status(404).json({ message: "Watch not found" });

    await Watches.findByIdAndDelete(id);

    res.status(200).json({ message: "Watch deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete watch" });
  }
};

module.exports = {
  getWatches,
  addWatchesCollection,
  addVariant,
  updateVariant,
  deleteVariant,
  updateWatch,
  deleteWatch,
};
