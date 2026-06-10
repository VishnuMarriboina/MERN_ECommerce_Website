/**
 * Seed script — populates the database using the unified GenericProduct model.
 * Run from the Backend folder: node seed.js
 */

const bcrypt  = require("bcryptjs");
const dotenv  = require("dotenv");
dotenv.config({ path: ".env.shared" });

const User                = require("./services/auth-service/src/models/user.model");
const { GenericProduct }  = require("./services/product-service/src/models/generic.model");
const { CategorySchemaModel } = require("./services/product-service/src/models/categorySchema.model");
const Order               = require("./services/order-service/src/models/order.model");

const MONGO_URI = process.env.MDB_URI || "mongodb://localhost:27017/newShop";

/* ─── Users ─────────────────────────────────────────────────────── */
const usersData = [
  { name:"Arjun Sharma",   email:"arjun.admin@store.com", phoneNumber:"9876543210", password:"Admin@123", User_Role:"Admin", age:32, gender:"Male",   address:"12, MG Road, Bengaluru, Karnataka" },
  { name:"Sneha Patel",    email:"sneha.admin@store.com", phoneNumber:"9988776655", password:"Admin@456", User_Role:"Admin", age:28, gender:"Female", address:"45, Juhu Beach Road, Mumbai, Maharashtra" },
  { name:"Priya Mehta",    email:"priya.mehta@gmail.com", phoneNumber:"8123456780", password:"User@123",  User_Role:"User",  age:25, gender:"Female", address:"7, Park Street, Kolkata, West Bengal" },
  { name:"Rahul Verma",    email:"rahul.verma@gmail.com", phoneNumber:"8234567891", password:"User@456",  User_Role:"User",  age:30, gender:"Male",   address:"23, Connaught Place, New Delhi" },
  { name:"Ananya Krishnan",email:"ananya.k@gmail.com",    phoneNumber:"8345678902", password:"User@789",  User_Role:"User",  age:22, gender:"Female", address:"8, Anna Nagar, Chennai, Tamil Nadu" },
];

/* ─── Category Schemas ───────────────────────────────────────────── */
const categorySchemas = [
  {
    categoryName: "Shirts",
    fields: [
      { name:"type_of_material", label:"Material",     type:"text",   required:true  },
      { name:"collar_type",      label:"Collar Type",  type:"select", required:true,  options:["Spread","Point","Button-Down","Mandarin"] },
      { name:"sleeve_type",      label:"Sleeve Type",  type:"select", required:true,  options:["Short Sleeve","Long Sleeve","Sleeveless"] },
    ],
    variantFields: [
      { name:"size",  label:"Size",  type:"select", required:true,  options:["XS","S","M","L","XL","XXL"] },
      { name:"color", label:"Color", type:"text",   required:true  },
      { name:"fit",   label:"Fit",   type:"select", required:true,  options:["Regular","Slim","Loose"] },
    ],
  },
  {
    categoryName: "Tshirts",
    fields: [
      { name:"type_of_material", label:"Material",    type:"text",   required:true  },
      { name:"neck_type",        label:"Neck Type",   type:"select", required:true,  options:["Round Neck","V-Neck","Polo Neck","Crew Neck"] },
      { name:"sleeve_type",      label:"Sleeve Type", type:"select", required:true,  options:["Short Sleeve","Long Sleeve","Sleeveless"] },
      { name:"design",           label:"Design",      type:"select", required:true,  options:["Plain","Printed","Striped","Graphic"] },
    ],
    variantFields: [
      { name:"size",  label:"Size",  type:"select", required:true, options:["XS","S","M","L","XL","XXL"] },
      { name:"color", label:"Color", type:"text",   required:true },
      { name:"fit",   label:"Fit",   type:"select", required:true, options:["Regular","Slim","Loose"] },
    ],
  },
  {
    categoryName: "Belts",
    fields: [
      { name:"type_of_material", label:"Material",     type:"text",   required:true  },
      { name:"buckle_type",      label:"Buckle Type",  type:"select", required:true,  options:["Brass","Steel","Alloy","Plastic","Zinc"] },
      { name:"width",            label:"Width",        type:"text",   required:false, placeholder:"e.g. 1.25 inches" },
    ],
    variantFields: [
      { name:"size",  label:"Size",  type:"select", required:true,  options:["26","28","30","32","34","36"] },
      { name:"color", label:"Color", type:"text",   required:true },
    ],
  },
  {
    categoryName: "Watches",
    fields: [
      { name:"watch_type",       label:"Watch Type",       type:"select", required:true,  options:["Analog","Digital","Smart"] },
      { name:"movement",         label:"Movement",         type:"select", required:true,  options:["Quartz","Automatic","Mechanical","Solar"] },
      { name:"water_resistance", label:"Water Resistance", type:"text",   required:false, placeholder:"e.g. 50m" },
    ],
    variantFields: [
      { name:"size",          label:"Case Size",      type:"select", required:true,  options:["38mm","40mm","42mm","44mm","46mm"] },
      { name:"strap_material",label:"Strap Material", type:"select", required:true,  options:["Leather","Metal","Rubber","Silicone","Nylon","Plastic"] },
      { name:"dial_color",    label:"Dial Color",     type:"text",   required:true },
    ],
  },
  {
    categoryName: "Shoes",
    fields: [
      { name:"type_of_material", label:"Material",   type:"select", required:true,  options:["Leather","Synthetic","Canvas","Mesh","Rubber","Foam"] },
      { name:"sole_type",        label:"Sole Type",  type:"select", required:true,  options:["Rubber","Foam","Air","PU","TPU"] },
      { name:"color",            label:"Color",      type:"text",   required:true  },
    ],
    variantFields: [
      { name:"size",        label:"Size",        type:"select", required:true,  options:["6","7","8","9","10","11","12"] },
      { name:"shoe_type",   label:"Shoe Type",   type:"select", required:true,  options:["Sneaker","Running Shoes","Canvas Shoes"] },
      { name:"lacing_type", label:"Lacing Type", type:"select", required:false, options:["Lace-Up","Slip-On","Velcro"] },
    ],
  },
  {
    categoryName: "Sandals",
    fields: [
      { name:"type_of_material", label:"Material",    type:"select", required:true,  options:["Leather","Synthetic","Canvas","Mesh","Rubber","Foam"] },
      { name:"sole_type",        label:"Sole Type",   type:"select", required:true,  options:["Rubber","Foam","Air","PU","TPU"] },
      { name:"strap_type",       label:"Strap Type",  type:"select", required:false, options:["Leather","Synthetic","Canvas","Mesh","Rubber","Foam"] },
      { name:"color",            label:"Color",       type:"text",   required:true  },
    ],
    variantFields: [
      { name:"size",        label:"Size",        type:"select", required:true,  options:["6","7","8","9","10","11","12"] },
      { name:"sandal_type", label:"Sandal Type", type:"select", required:true,  options:["Sandals","Slippers"] },
      { name:"heel_height", label:"Heel Height", type:"select", required:false, options:["Low","Medium","High"] },
    ],
  },
];

/* ─── Product seed data (generic format) ────────────────────────── */
const getProductsData = (admin1Id, admin2Id) => ({

  Shirts: [
    { name:"Allen Solly Long Sleeve Shirt",   brand:"Allen Solly",    addedBy:admin1Id, attributes:{ type_of_material:"Cotton",           collar_type:"Spread",      sleeve_type:"Long Sleeve"  }, variants:[{ attributes:{ size:"S",  color:"White",     fit:"Slim"    }, cost:1199, count:20 }, { attributes:{ size:"M",  color:"White",     fit:"Regular" }, cost:1299, count:50, image_url:"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400" }, { attributes:{ size:"L",  color:"Sky Blue",  fit:"Slim"    }, cost:1399, count:35, image_url:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400" }, { attributes:{ size:"XL", color:"Black",     fit:"Loose"   }, cost:1499, count:20 }, { attributes:{ size:"XXL",color:"Navy Blue", fit:"Regular" }, cost:1549, count:15 }] },
    { name:"Peter England Short Sleeve Shirt", brand:"Peter England",  addedBy:admin1Id, attributes:{ type_of_material:"Polyester Blend",   collar_type:"Button-Down", sleeve_type:"Short Sleeve" }, variants:[{ attributes:{ size:"S",  color:"Olive Green",fit:"Regular" }, cost:999,  count:30 }, { attributes:{ size:"M",  color:"Grey",      fit:"Slim"    }, cost:1099, count:40, image_url:"https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?w=400" }, { attributes:{ size:"L",  color:"Mustard",   fit:"Regular" }, cost:1199, count:25 }, { attributes:{ size:"XL", color:"White",     fit:"Loose"   }, cost:1249, count:18 }] },
    { name:"Van Heusen Mandarin Linen Shirt",  brand:"Van Heusen",     addedBy:admin1Id, attributes:{ type_of_material:"Linen",            collar_type:"Mandarin",    sleeve_type:"Long Sleeve"  }, variants:[{ attributes:{ size:"M",  color:"Beige",     fit:"Regular" }, cost:1799, count:22, image_url:"https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400" }, { attributes:{ size:"L",  color:"Light Blue", fit:"Slim"   }, cost:1899, count:18 }, { attributes:{ size:"XL", color:"Off White", fit:"Regular" }, cost:1949, count:12 }] },
    { name:"Louis Philippe Point Collar Shirt", brand:"Louis Philippe", addedBy:admin2Id, attributes:{ type_of_material:"Cotton Linen",     collar_type:"Point",       sleeve_type:"Long Sleeve"  }, variants:[{ attributes:{ size:"S",  color:"Charcoal",  fit:"Slim"    }, cost:2299, count:10 }, { attributes:{ size:"M",  color:"Charcoal",  fit:"Slim"    }, cost:2299, count:15, image_url:"https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400" }, { attributes:{ size:"L",  color:"Royal Blue",fit:"Regular" }, cost:2399, count:20 }, { attributes:{ size:"XL", color:"Maroon",    fit:"Loose"   }, cost:2449, count:8  }, { attributes:{ size:"XXL",color:"Black",     fit:"Regular" }, cost:2499, count:6  }] },
    { name:"Zara Viscose Short Sleeve Shirt",   brand:"Zara",           addedBy:admin2Id, attributes:{ type_of_material:"Viscose",          collar_type:"Spread",      sleeve_type:"Short Sleeve" }, variants:[{ attributes:{ size:"XS", color:"Pink",      fit:"Slim"    }, cost:1599, count:14 }, { attributes:{ size:"S",  color:"Coral",     fit:"Regular" }, cost:1599, count:20 }, { attributes:{ size:"M",  color:"Teal",      fit:"Slim"    }, cost:1699, count:30, image_url:"https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400" }, { attributes:{ size:"L",  color:"Lavender",  fit:"Regular" }, cost:1749, count:18 }] },
  ],

  Tshirts: [
    { name:"H&M Graphic Round Neck Tshirt",    brand:"H&M",      addedBy:admin1Id, attributes:{ type_of_material:"100% Cotton",       neck_type:"Round Neck", sleeve_type:"Short Sleeve", design:"Graphic" }, variants:[{ attributes:{ size:"S", color:"Red",          fit:"Regular" }, cost:699,  count:60 }, { attributes:{ size:"M", color:"Black",        fit:"Slim"    }, cost:749,  count:45, image_url:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400" }, { attributes:{ size:"L", color:"White",        fit:"Loose"   }, cost:799,  count:30 }, { attributes:{ size:"XL",color:"Grey",         fit:"Regular" }, cost:849,  count:25 }] },
    { name:"Nike Crew Neck Plain Tshirt",       brand:"Nike",     addedBy:admin1Id, attributes:{ type_of_material:"Dri-FIT Polyester", neck_type:"Crew Neck",  sleeve_type:"Short Sleeve", design:"Plain"   }, variants:[{ attributes:{ size:"S", color:"Black",        fit:"Slim"    }, cost:1299, count:40, image_url:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400" }, { attributes:{ size:"M", color:"Navy Blue",    fit:"Regular" }, cost:1299, count:55 }, { attributes:{ size:"L", color:"White",        fit:"Regular" }, cost:1299, count:35 }, { attributes:{ size:"XL",color:"Red",          fit:"Loose"   }, cost:1399, count:20 }] },
    { name:"Puma V-Neck Striped Tshirt",        brand:"Puma",     addedBy:admin1Id, attributes:{ type_of_material:"Cotton Blend",      neck_type:"V-Neck",     sleeve_type:"Short Sleeve", design:"Striped" }, variants:[{ attributes:{ size:"S", color:"Blue & White",  fit:"Slim"   }, cost:899,  count:30 }, { attributes:{ size:"M", color:"Black & Yellow",fit:"Regular"}, cost:949,  count:40, image_url:"https://images.unsplash.com/photo-1554568218-0f1715e72254?w=400" }, { attributes:{ size:"L", color:"Red & Grey",   fit:"Regular" }, cost:999,  count:25 }, { attributes:{ size:"XL",color:"Green & White",fit:"Loose"   }, cost:1049, count:15 }] },
    { name:"Levi's Polo Neck Plain Tshirt",     brand:"Levi's",   addedBy:admin2Id, attributes:{ type_of_material:"Slub Cotton",       neck_type:"Polo Neck",  sleeve_type:"Short Sleeve", design:"Plain"   }, variants:[{ attributes:{ size:"S", color:"Olive",        fit:"Regular" }, cost:1199, count:20 }, { attributes:{ size:"M", color:"Rust Orange",  fit:"Slim"    }, cost:1249, count:30, image_url:"https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400" }, { attributes:{ size:"L", color:"Burgundy",     fit:"Regular" }, cost:1299, count:22 }, { attributes:{ size:"XL",color:"Forest Green", fit:"Loose"   }, cost:1349, count:14 }, { attributes:{ size:"XXL",color:"Black",       fit:"Regular" }, cost:1399, count:10 }] },
    { name:"Bewakoof Round Neck Printed Tshirt",brand:"Bewakoof", addedBy:admin2Id, attributes:{ type_of_material:"Bio-Wash Cotton",   neck_type:"Round Neck", sleeve_type:"Long Sleeve",  design:"Printed" }, variants:[{ attributes:{ size:"XS",color:"Yellow",       fit:"Regular" }, cost:499,  count:50 }, { attributes:{ size:"S", color:"Purple",       fit:"Slim"    }, cost:499,  count:40, image_url:"https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400" }, { attributes:{ size:"M", color:"Orange",       fit:"Regular" }, cost:549,  count:60 }, { attributes:{ size:"L", color:"Teal",         fit:"Loose"   }, cost:599,  count:35 }] },
  ],

  Belts: [
    { name:"Woodland Brass Genuine Leather Belt",    brand:"Woodland",        addedBy:admin1Id, attributes:{ type_of_material:"Genuine Leather",   buckle_type:"Brass", width:"1.25 inches" }, variants:[{ attributes:{ size:"30", color:"Brown" }, cost:999,  count:25, image_url:"https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400" }, { attributes:{ size:"32", color:"Black" }, cost:999,  count:30 }, { attributes:{ size:"34", color:"Tan"   }, cost:1099, count:20 }, { attributes:{ size:"36", color:"Brown" }, cost:1099, count:12 }] },
    { name:"Lee Steel PU Leather Belt",              brand:"Lee",             addedBy:admin1Id, attributes:{ type_of_material:"PU Leather",        buckle_type:"Steel", width:"1.5 inches"  }, variants:[{ attributes:{ size:"28", color:"Black"      }, cost:699, count:35 }, { attributes:{ size:"30", color:"Dark Brown" }, cost:749, count:28, image_url:"https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400" }, { attributes:{ size:"32", color:"Navy Blue" }, cost:749, count:22 }, { attributes:{ size:"34", color:"Black" }, cost:799, count:18 }] },
    { name:"Tommy Hilfiger Alloy Full-Grain Belt",   brand:"Tommy Hilfiger",  addedBy:admin2Id, attributes:{ type_of_material:"Full-Grain Leather", buckle_type:"Alloy", width:"1.25 inches" }, variants:[{ attributes:{ size:"30", color:"Black"      }, cost:2499, count:10, image_url:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400" }, { attributes:{ size:"32", color:"Cognac"     }, cost:2499, count:15 }, { attributes:{ size:"34", color:"Dark Brown" }, cost:2699, count:12 }, { attributes:{ size:"36", color:"Black" }, cost:2699, count:8 }] },
    { name:"UCB Zinc Canvas Belt",                   brand:"UCB",             addedBy:admin2Id, attributes:{ type_of_material:"Canvas",            buckle_type:"Zinc",  width:"1 inches"    }, variants:[{ attributes:{ size:"28", color:"Khaki" }, cost:599, count:40 }, { attributes:{ size:"30", color:"Olive" }, cost:599, count:35, image_url:"https://images.unsplash.com/photo-1571945192237-4734538052a9?w=400" }, { attributes:{ size:"32", color:"Grey"  }, cost:649, count:30 }, { attributes:{ size:"34", color:"Denim" }, cost:649, count:20 }] },
  ],

  Watches: [
    { name:"Titan Quartz Analog Watch",   brand:"Titan",   addedBy:admin1Id, attributes:{ watch_type:"Analog",  movement:"Quartz",    water_resistance:"50m"  }, variants:[{ attributes:{ size:"42mm", strap_material:"Leather",  dial_color:"Black"  }, cost:4999,  count:20, image_url:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" }, { attributes:{ size:"40mm", strap_material:"Metal",    dial_color:"Silver" }, cost:5999,  count:15 }, { attributes:{ size:"44mm", strap_material:"Silicone", dial_color:"Blue"   }, cost:3999,  count:25 }] },
    { name:"Casio Quartz Digital Watch",  brand:"Casio",   addedBy:admin1Id, attributes:{ watch_type:"Digital", movement:"Quartz",    water_resistance:"100m" }, variants:[{ attributes:{ size:"42mm", strap_material:"Rubber",   dial_color:"Black"  }, cost:2999,  count:35, image_url:"https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400" }, { attributes:{ size:"44mm", strap_material:"Rubber",   dial_color:"Grey"   }, cost:3299,  count:28 }, { attributes:{ size:"46mm", strap_material:"Nylon",    dial_color:"Olive"  }, cost:3599,  count:20 }] },
    { name:"Fossil Automatic Analog Watch",brand:"Fossil",  addedBy:admin1Id, attributes:{ watch_type:"Analog",  movement:"Automatic", water_resistance:"50m"  }, variants:[{ attributes:{ size:"42mm", strap_material:"Leather",  dial_color:"Brown"  }, cost:12999, count:8,  image_url:"https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400" }, { attributes:{ size:"44mm", strap_material:"Metal",    dial_color:"Gold"   }, cost:14999, count:6  }, { attributes:{ size:"40mm", strap_material:"Leather",  dial_color:"Cream"  }, cost:11999, count:10 }] },
    { name:"Apple Smart Watch",           brand:"Apple",   addedBy:admin2Id, attributes:{ watch_type:"Smart",   movement:"Quartz",    water_resistance:"50m"  }, variants:[{ attributes:{ size:"40mm", strap_material:"Silicone", dial_color:"Midnight"  }, cost:41900, count:12, image_url:"https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400" }, { attributes:{ size:"44mm", strap_material:"Silicone", dial_color:"Starlight" }, cost:41900, count:10 }, { attributes:{ size:"46mm", strap_material:"Nylon",    dial_color:"Black"     }, cost:44900, count:8  }] },
    { name:"Seiko Solar Analog Watch",    brand:"Seiko",   addedBy:admin2Id, attributes:{ watch_type:"Analog",  movement:"Solar",     water_resistance:"100m" }, variants:[{ attributes:{ size:"42mm", strap_material:"Metal", dial_color:"Navy Blue" }, cost:18999, count:7, image_url:"https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400" }, { attributes:{ size:"44mm", strap_material:"Metal", dial_color:"Black" }, cost:19999, count:5 }] },
  ],

  Shoes: [
    { name:"Nike Mesh Running Shoes",     brand:"Nike",     addedBy:admin1Id, attributes:{ type_of_material:"Mesh",      sole_type:"Rubber", color:"White"     }, variants:[{ attributes:{ size:"7",  shoe_type:"Running Shoes", lacing_type:"Lace-Up" }, cost:5999, count:30, image_url:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" }, { attributes:{ size:"8",  shoe_type:"Sneaker",       lacing_type:"Slip-On" }, cost:6499, count:25 }, { attributes:{ size:"9",  shoe_type:"Running Shoes", lacing_type:"Lace-Up" }, cost:5999, count:20 }, { attributes:{ size:"10", shoe_type:"Canvas Shoes",  lacing_type:"Lace-Up" }, cost:4999, count:15 }] },
    { name:"Adidas Synthetic Sneakers",   brand:"Adidas",   addedBy:admin1Id, attributes:{ type_of_material:"Synthetic", sole_type:"Rubber", color:"Black"     }, variants:[{ attributes:{ size:"7",  shoe_type:"Sneaker",       lacing_type:"Lace-Up" }, cost:5499, count:28, image_url:"https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400" }, { attributes:{ size:"8",  shoe_type:"Running Shoes", lacing_type:"Lace-Up" }, cost:5999, count:32 }, { attributes:{ size:"9",  shoe_type:"Sneaker",       lacing_type:"Velcro"  }, cost:5499, count:18 }, { attributes:{ size:"10", shoe_type:"Running Shoes", lacing_type:"Lace-Up" }, cost:6299, count:14 }, { attributes:{ size:"11", shoe_type:"Sneaker",       lacing_type:"Lace-Up" }, cost:5499, count:10 }] },
    { name:"Puma Canvas Slip-On Shoes",   brand:"Puma",     addedBy:admin2Id, attributes:{ type_of_material:"Canvas",    sole_type:"Foam",   color:"Navy Blue" }, variants:[{ attributes:{ size:"6", shoe_type:"Canvas Shoes", lacing_type:"Slip-On" }, cost:3299, count:40, image_url:"https://images.unsplash.com/photo-1465453869711-7e174808ace9?w=400" }, { attributes:{ size:"7", shoe_type:"Sneaker",      lacing_type:"Lace-Up" }, cost:3799, count:35 }, { attributes:{ size:"8", shoe_type:"Canvas Shoes", lacing_type:"Slip-On" }, cost:3299, count:28 }, { attributes:{ size:"9", shoe_type:"Sneaker",      lacing_type:"Lace-Up" }, cost:3999, count:20 }] },
    { name:"Woodland Leather Sneakers",   brand:"Woodland", addedBy:admin2Id, attributes:{ type_of_material:"Leather",   sole_type:"TPU",    color:"Brown"     }, variants:[{ attributes:{ size:"7", shoe_type:"Sneaker", lacing_type:"Lace-Up" }, cost:4999, count:15, image_url:"https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400" }, { attributes:{ size:"8", shoe_type:"Sneaker", lacing_type:"Lace-Up" }, cost:4999, count:18 }, { attributes:{ size:"9", shoe_type:"Sneaker", lacing_type:"Lace-Up" }, cost:5199, count:12 }, { attributes:{ size:"10",shoe_type:"Sneaker", lacing_type:"Lace-Up" }, cost:5199, count:8  }] },
    { name:"Bata Synthetic Canvas Shoes", brand:"Bata",     addedBy:admin2Id, attributes:{ type_of_material:"Synthetic", sole_type:"PU",     color:"Black"     }, variants:[{ attributes:{ size:"6", shoe_type:"Canvas Shoes", lacing_type:"Slip-On" }, cost:1499, count:50 }, { attributes:{ size:"7", shoe_type:"Canvas Shoes", lacing_type:"Slip-On" }, cost:1499, count:45, image_url:"https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400" }, { attributes:{ size:"8", shoe_type:"Sneaker",      lacing_type:"Lace-Up" }, cost:1799, count:40 }, { attributes:{ size:"9", shoe_type:"Sneaker",      lacing_type:"Lace-Up" }, cost:1799, count:30 }, { attributes:{ size:"10",shoe_type:"Canvas Shoes", lacing_type:"Velcro"  }, cost:1599, count:20 }] },
  ],

  Sandals: [
    { name:"Bata Leather Brown Sandals",    brand:"Bata",     addedBy:admin1Id, attributes:{ type_of_material:"Leather",   sole_type:"Rubber", strap_type:"Leather",   color:"Brown" }, variants:[{ attributes:{ size:"6", sandal_type:"Sandals",  heel_height:"Low"    }, cost:1299, count:40, image_url:"https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400" }, { attributes:{ size:"7", sandal_type:"Slippers", heel_height:"Low"    }, cost:799,  count:55 }, { attributes:{ size:"8", sandal_type:"Sandals",  heel_height:"Medium" }, cost:1499, count:30 }, { attributes:{ size:"9", sandal_type:"Slippers", heel_height:"Low"    }, cost:899,  count:35 }] },
    { name:"Puma Synthetic Black Slippers", brand:"Puma",     addedBy:admin1Id, attributes:{ type_of_material:"Synthetic", sole_type:"Foam",   strap_type:"Synthetic", color:"Black" }, variants:[{ attributes:{ size:"7",  sandal_type:"Slippers", heel_height:"Low" }, cost:1299, count:50, image_url:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400" }, { attributes:{ size:"8",  sandal_type:"Slippers", heel_height:"Low" }, cost:1299, count:45 }, { attributes:{ size:"9",  sandal_type:"Sandals",  heel_height:"Low" }, cost:1799, count:30 }, { attributes:{ size:"10", sandal_type:"Slippers", heel_height:"Low" }, cost:1399, count:25 }] },
    { name:"Relaxo Foam Blue Slippers",     brand:"Relaxo",   addedBy:admin1Id, attributes:{ type_of_material:"Foam",      sole_type:"Foam",   strap_type:"Foam",      color:"Blue"  }, variants:[{ attributes:{ size:"6", sandal_type:"Slippers", heel_height:"Low" }, cost:299, count:80 }, { attributes:{ size:"7", sandal_type:"Slippers", heel_height:"Low" }, cost:299, count:75, image_url:"https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400" }, { attributes:{ size:"8", sandal_type:"Slippers", heel_height:"Low" }, cost:349, count:60 }, { attributes:{ size:"9", sandal_type:"Slippers", heel_height:"Low" }, cost:349, count:50 }, { attributes:{ size:"10",sandal_type:"Slippers", heel_height:"Low" }, cost:399, count:40 }] },
    { name:"Woodland Leather Tan Sandals",  brand:"Woodland", addedBy:admin2Id, attributes:{ type_of_material:"Leather",   sole_type:"Rubber", strap_type:"Leather",   color:"Tan"   }, variants:[{ attributes:{ size:"7", sandal_type:"Sandals", heel_height:"Low"    }, cost:2499, count:20, image_url:"https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=400" }, { attributes:{ size:"8", sandal_type:"Sandals", heel_height:"Medium" }, cost:2699, count:15 }, { attributes:{ size:"9", sandal_type:"Sandals", heel_height:"High"   }, cost:2899, count:10 }] },
    { name:"Crocs Rubber White Slippers",   brand:"Crocs",    addedBy:admin2Id, attributes:{ type_of_material:"Rubber",    sole_type:"Foam",   strap_type:"Rubber",    color:"White" }, variants:[{ attributes:{ size:"6", sandal_type:"Slippers", heel_height:"Low" }, cost:2999, count:30, image_url:"https://images.unsplash.com/photo-1560343776-97e7d202ff0e?w=400" }, { attributes:{ size:"7", sandal_type:"Sandals",  heel_height:"Low" }, cost:3499, count:25 }, { attributes:{ size:"8", sandal_type:"Slippers", heel_height:"Low" }, cost:2999, count:28 }, { attributes:{ size:"9", sandal_type:"Sandals",  heel_height:"Low" }, cost:3499, count:18 }, { attributes:{ size:"10",sandal_type:"Slippers", heel_height:"Low" }, cost:3099, count:15 }] },
  ],
});

/* ─── Helpers ────────────────────────────────────────────────────── */
async function insertIfNew(Model, naturalKey, doc) {
  const exists = await Model.findOne(naturalKey);
  if (exists) return { status: "skipped", doc: exists };
  const created = await Model.create(doc);
  return { status: "inserted", doc: created };
}

const makeHistory = (status, baseDate) => {
  const history = [{ from: "Placed", to: "Pending", changedAt: baseDate }];
  const flow = ["Pending", "Confirmed", "Shipped", "Delivered"];
  const idx = flow.indexOf(status);
  for (let i = 0; i < idx; i++) {
    history.push({ from: flow[i], to: flow[i+1], changedAt: new Date(baseDate.getTime() + (i+1)*24*60*60*1000) });
  }
  if (status === "Cancelled") {
    history.push({ from: "Pending", to: "Cancelled", changedAt: new Date(baseDate.getTime() + 2*60*60*1000) });
  }
  return history;
};

/* ─── Main ───────────────────────────────────────────────────────── */
async function seed() {
  const allModels = [User, GenericProduct, CategorySchemaModel, Order];
  const mongooseInstances = [...new Set(allModels.map(m => m.db.base))];
  await Promise.all(mongooseInstances.map(m => m.connect(MONGO_URI)));
  console.log(`✅ Connected to MongoDB: ${MONGO_URI}`);

  const stats = { users:{inserted:0,skipped:0}, schemas:{inserted:0,skipped:0}, products:{inserted:0,skipped:0}, orders:{inserted:0,skipped:0} };

  /* ── Users ── */
  let admin1, admin2;
  for (const u of usersData) {
    const exists = await User.findOne({ email: u.email });
    if (exists) {
      console.log(`⏭️  Skipped user: ${u.email}`);
      stats.users.skipped++;
      if (u.email === "arjun.admin@store.com") admin1 = exists;
      if (u.email === "sneha.admin@store.com") admin2 = exists;
    } else {
      const hashed = await bcrypt.hash(u.password, 10);
      const user = new User({ ...u, password: hashed });
      await user.save();
      console.log(`👤 Inserted user: ${u.name} (${u.User_Role})`);
      stats.users.inserted++;
      if (u.email === "arjun.admin@store.com") admin1 = user;
      if (u.email === "sneha.admin@store.com") admin2 = user;
    }
  }

  /* ── Category Schemas ── */
  for (const schema of categorySchemas) {
    const exists = await CategorySchemaModel.findOne({ categoryName: schema.categoryName });
    if (exists) {
      console.log(`⏭️  Skipped schema: ${schema.categoryName}`);
      stats.schemas.skipped++;
    } else {
      await CategorySchemaModel.create({ ...schema, createdBy: admin1._id });
      console.log(`🏗️  Inserted schema: ${schema.categoryName}`);
      stats.schemas.inserted++;
    }
  }

  /* ── Products ── */
  const productsData = getProductsData(admin1._id, admin2._id);
  const insertedProducts = {};

  for (const [category, products] of Object.entries(productsData)) {
    insertedProducts[category] = [];
    for (const p of products) {
      const r = await insertIfNew(
        GenericProduct,
        { brand: p.brand, name: p.name, category },
        { ...p, category }
      );
      insertedProducts[category].push(r.doc);
      const icon = { Shirts:"👔", Tshirts:"👕", Belts:"🔗", Watches:"⌚", Shoes:"👟", Sandals:"🩴" }[category] || "📦";
      console.log(`${icon} ${r.status === "inserted" ? "Inserted" : "Skipped "} ${category}: ${p.brand}`);
      stats.products[r.status === "inserted" ? "inserted" : "skipped"]++;
    }
  }

  /* ── Orders ── */
  console.log("\n📦 Seeding orders...");
  const [priya, rahul, ananya] = await Promise.all([
    User.findOne({ email: "priya.mehta@gmail.com" }),
    User.findOne({ email: "rahul.verma@gmail.com" }),
    User.findOne({ email: "ananya.k@gmail.com" }),
  ]);

  const shirt   = insertedProducts.Shirts[0];
  const tshirt  = insertedProducts.Tshirts[1];
  const belt    = insertedProducts.Belts[0];
  const watch   = insertedProducts.Watches[0];
  const shoe    = insertedProducts.Shoes[0];
  const sandal  = insertedProducts.Sandals[0];

  const makeItem = (product, variantIndex, qty = 1) => {
    const variant = product.variants[variantIndex];
    return {
      productId:    product._id.toString(),
      variantId:    variant._id.toString(),
      productModel: "generic",
      addedBy:      product.addedBy.toString(),
      quantity:     qty,
      price:        variant.cost,
      details:      { brand: product.brand, name: product.name, category: product.category, ...Object.fromEntries(variant.attributes || new Map()) },
    };
  };

  const ordersToSeed = [
    { userId:priya._id,  paymentType:"Online", paymentMode:"UPI",         status:"Delivered", orderedDate:new Date("2025-12-10"), items:[makeItem(shirt,0,1), makeItem(belt,1,1)] },
    { userId:priya._id,  paymentType:"Online", paymentMode:"NetBanking",   status:"Shipped",   orderedDate:new Date("2026-01-15"), items:[makeItem(watch,0,1)] },
    { userId:priya._id,  paymentType:"COD",    paymentMode:null,           status:"Cancelled", orderedDate:new Date("2026-02-05"), items:[makeItem(shoe,0,2)] },
    { userId:rahul._id,  paymentType:"Online", paymentMode:"CreditCard",   status:"Confirmed", orderedDate:new Date("2026-02-20"), items:[makeItem(tshirt,1,2), makeItem(sandal,0,1)] },
    { userId:rahul._id,  paymentType:"COD",    paymentMode:null,           status:"Delivered", orderedDate:new Date("2025-11-28"), items:[makeItem(shoe,1,1)] },
    { userId:rahul._id,  paymentType:"Online", paymentMode:"UPI",          status:"Pending",   orderedDate:new Date("2026-03-25"), items:[makeItem(belt,2,1), makeItem(watch,1,1)] },
    { userId:ananya._id, paymentType:"Online", paymentMode:"UPI",          status:"Delivered", orderedDate:new Date("2025-10-18"), items:[makeItem(shirt,1,1), makeItem(tshirt,0,2)] },
    { userId:ananya._id, paymentType:"COD",    paymentMode:null,           status:"Shipped",   orderedDate:new Date("2026-03-10"), items:[makeItem(sandal,1,1), makeItem(sandal,2,1)] },
    { userId:ananya._id, paymentType:"Online", paymentMode:"CreditCard",   status:"Confirmed", orderedDate:new Date("2026-03-22"), items:[makeItem(watch,2,1)] },
  ];

  for (const orderData of ordersToSeed) {
    const exists = await Order.findOne({ userId: orderData.userId, orderedDate: orderData.orderedDate });
    if (exists) {
      console.log(`⏭️  Skipped order for userId ${orderData.userId}`);
      stats.orders.skipped++;
      continue;
    }
    const totalAmount = orderData.items.reduce((s, i) => s + i.price * i.quantity, 0);
    await Order.create({ ...orderData, totalAmount, history: makeHistory(orderData.status, orderData.orderedDate) });
    console.log(`📦 Inserted order: [${orderData.status}] ₹${totalAmount}`);
    stats.orders.inserted++;
  }

  /* ── Summary ── */
  console.log("\n✅ Seed complete!");
  console.log("─────────────────────────────────────────");
  console.log("Collection   Inserted   Skipped");
  console.log("─────────────────────────────────────────");
  for (const [name, s] of Object.entries(stats)) {
    console.log(`${name.padEnd(12)} ${String(s.inserted).padEnd(10)} ${s.skipped}`);
  }
  console.log("─────────────────────────────────────────");
  console.log("\n🔑 Credentials:");
  console.log("  Admin 1 → arjun.admin@store.com  / Admin@123");
  console.log("  Admin 2 → sneha.admin@store.com  / Admin@456");
  console.log("  User 1  → priya.mehta@gmail.com  / User@123");
  console.log("  User 2  → rahul.verma@gmail.com  / User@456");
  console.log("  User 3  → ananya.k@gmail.com     / User@789");

  await Promise.all(mongooseInstances.map(m => m.disconnect()));
  console.log("\n🔌 Disconnected from MongoDB");
}

seed().catch(err => { console.error("❌ Seed failed:", err.message); process.exit(1); });
