/**
 * Seed script — populates the newShop database with sample data.
 * Run: node seed.js
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/users");
const { Shirts, Tshirts } = require("./models/Cloths");
const { Belts, Watches } = require("./models/Accessories");
const { Shoes, Sandles } = require("./models/FootWears");
const Order = require("./models/orders");

const MONGO_URI = process.env.MDB_URI || "mongodb://localhost:27017/newShop";

/* ─────────────────────────────────────────────
   USERS
───────────────────────────────────────────── */
const usersData = [
  {
    name: "Arjun Sharma",
    email: "arjun.admin@store.com",
    phoneNumber: "9876543210",
    password: "Admin@123",
    User_Role: "Admin",
    age: 32,
    gender: "Male",
    address: "12, MG Road, Bengaluru, Karnataka",
  },
  {
    name: "Sneha Patel",
    email: "sneha.admin@store.com",
    phoneNumber: "9988776655",
    password: "Admin@456",
    User_Role: "Admin",
    age: 28,
    gender: "Female",
    address: "45, Juhu Beach Road, Mumbai, Maharashtra",
  },
  {
    name: "Priya Mehta",
    email: "priya.mehta@gmail.com",
    phoneNumber: "8123456780",
    password: "User@123",
    User_Role: "User",
    age: 25,
    gender: "Female",
    address: "7, Park Street, Kolkata, West Bengal",
  },
  {
    name: "Rahul Verma",
    email: "rahul.verma@gmail.com",
    phoneNumber: "8234567891",
    password: "User@456",
    User_Role: "User",
    age: 30,
    gender: "Male",
    address: "23, Connaught Place, New Delhi",
  },
  {
    name: "Ananya Krishnan",
    email: "ananya.k@gmail.com",
    phoneNumber: "8345678902",
    password: "User@789",
    User_Role: "User",
    age: 22,
    gender: "Female",
    address: "8, Anna Nagar, Chennai, Tamil Nadu",
  },
];

/* ─────────────────────────────────────────────
   SHIRTS
───────────────────────────────────────────── */
const getShirtsData = (adminId) => [
  {
    brand: "Allen Solly",
    type_of_material: "Cotton",
    collar_type: "Spread",
    sleeve_type: "Long Sleeve",
    addedBy: adminId,
    variants: [
      { size: "S", color: "White", fit: "Slim", cost: 1199, count: 20 },
      {
        size: "M",
        color: "White",
        fit: "Regular",
        cost: 1299,
        count: 50,
        image_url:
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
      },
      {
        size: "L",
        color: "Sky Blue",
        fit: "Slim",
        cost: 1399,
        count: 35,
        image_url:
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400",
      },
      { size: "XL", color: "Black", fit: "Loose", cost: 1499, count: 20 },
      {
        size: "XXL",
        color: "Navy Blue",
        fit: "Regular",
        cost: 1549,
        count: 15,
      },
    ],
  },
  {
    brand: "Peter England",
    type_of_material: "Polyester Blend",
    collar_type: "Button-Down",
    sleeve_type: "Short Sleeve",
    addedBy: adminId,
    variants: [
      { size: "S", color: "Olive Green", fit: "Regular", cost: 999, count: 30 },
      {
        size: "M",
        color: "Grey",
        fit: "Slim",
        cost: 1099,
        count: 40,
        image_url:
          "https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?w=400",
      },
      { size: "L", color: "Mustard", fit: "Regular", cost: 1199, count: 25 },
      { size: "XL", color: "White", fit: "Loose", cost: 1249, count: 18 },
    ],
  },
  {
    brand: "Van Heusen",
    type_of_material: "Linen",
    collar_type: "Mandarin",
    sleeve_type: "Long Sleeve",
    addedBy: adminId,
    variants: [
      {
        size: "M",
        color: "Beige",
        fit: "Regular",
        cost: 1799,
        count: 22,
        image_url:
          "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400",
      },
      { size: "L", color: "Light Blue", fit: "Slim", cost: 1899, count: 18 },
      { size: "XL", color: "Off White", fit: "Regular", cost: 1949, count: 12 },
    ],
  },
  {
    brand: "Louis Philippe",
    type_of_material: "Cotton Linen",
    collar_type: "Point",
    sleeve_type: "Long Sleeve",
    addedBy: adminId,
    variants: [
      { size: "S", color: "Charcoal", fit: "Slim", cost: 2299, count: 10 },
      {
        size: "M",
        color: "Charcoal",
        fit: "Slim",
        cost: 2299,
        count: 15,
        image_url:
          "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400",
      },
      { size: "L", color: "Royal Blue", fit: "Regular", cost: 2399, count: 20 },
      { size: "XL", color: "Maroon", fit: "Loose", cost: 2449, count: 8 },
      { size: "XXL", color: "Black", fit: "Regular", cost: 2499, count: 6 },
    ],
  },
  {
    brand: "Zara",
    type_of_material: "Viscose",
    collar_type: "Spread",
    sleeve_type: "Short Sleeve",
    addedBy: adminId,
    variants: [
      { size: "XS", color: "Pink", fit: "Slim", cost: 1599, count: 14 },
      { size: "S", color: "Coral", fit: "Regular", cost: 1599, count: 20 },
      {
        size: "M",
        color: "Teal",
        fit: "Slim",
        cost: 1699,
        count: 30,
        image_url:
          "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400",
      },
      { size: "L", color: "Lavender", fit: "Regular", cost: 1749, count: 18 },
    ],
  },
];

/* ─────────────────────────────────────────────
   T-SHIRTS
───────────────────────────────────────────── */
const getTshirtsData = (adminId) => [
  {
    brand: "H&M",
    type_of_material: "100% Cotton",
    neck_type: "Round Neck",
    sleeve_type: "Short Sleeve",
    design: "Graphic",
    addedBy: adminId,
    variants: [
      { size: "S", color: "Red", fit: "Regular", cost: 699, count: 60 },
      {
        size: "M",
        color: "Black",
        fit: "Slim",
        cost: 749,
        count: 45,
        image_url:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      },
      { size: "L", color: "White", fit: "Loose", cost: 799, count: 30 },
      { size: "XL", color: "Grey", fit: "Regular", cost: 849, count: 25 },
    ],
  },
  {
    brand: "Nike",
    type_of_material: "Dri-FIT Polyester",
    neck_type: "Crew Neck",
    sleeve_type: "Short Sleeve",
    design: "Plain",
    addedBy: adminId,
    variants: [
      {
        size: "S",
        color: "Black",
        fit: "Slim",
        cost: 1299,
        count: 40,
        image_url:
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400",
      },
      { size: "M", color: "Navy Blue", fit: "Regular", cost: 1299, count: 55 },
      { size: "L", color: "White", fit: "Regular", cost: 1299, count: 35 },
      { size: "XL", color: "Red", fit: "Loose", cost: 1399, count: 20 },
    ],
  },
  {
    brand: "Puma",
    type_of_material: "Cotton Blend",
    neck_type: "V-Neck",
    sleeve_type: "Short Sleeve",
    design: "Striped",
    addedBy: adminId,
    variants: [
      { size: "S", color: "Blue & White", fit: "Slim", cost: 899, count: 30 },
      {
        size: "M",
        color: "Black & Yellow",
        fit: "Regular",
        cost: 949,
        count: 40,
        image_url:
          "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=400",
      },
      { size: "L", color: "Red & Grey", fit: "Regular", cost: 999, count: 25 },
      {
        size: "XL",
        color: "Green & White",
        fit: "Loose",
        cost: 1049,
        count: 15,
      },
    ],
  },
  {
    brand: "Levi's",
    type_of_material: "Slub Cotton",
    neck_type: "Polo Neck",
    sleeve_type: "Short Sleeve",
    design: "Plain",
    addedBy: adminId,
    variants: [
      { size: "S", color: "Olive", fit: "Regular", cost: 1199, count: 20 },
      {
        size: "M",
        color: "Rust Orange",
        fit: "Slim",
        cost: 1249,
        count: 30,
        image_url:
          "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400",
      },
      { size: "L", color: "Burgundy", fit: "Regular", cost: 1299, count: 22 },
      {
        size: "XL",
        color: "Forest Green",
        fit: "Loose",
        cost: 1349,
        count: 14,
      },
      { size: "XXL", color: "Black", fit: "Regular", cost: 1399, count: 10 },
    ],
  },
  {
    brand: "Bewakoof",
    type_of_material: "Bio-Wash Cotton",
    neck_type: "Round Neck",
    sleeve_type: "Long Sleeve",
    design: "Printed",
    addedBy: adminId,
    variants: [
      { size: "XS", color: "Yellow", fit: "Regular", cost: 499, count: 50 },
      {
        size: "S",
        color: "Purple",
        fit: "Slim",
        cost: 499,
        count: 40,
        image_url:
          "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400",
      },
      { size: "M", color: "Orange", fit: "Regular", cost: 549, count: 60 },
      { size: "L", color: "Teal", fit: "Loose", cost: 599, count: 35 },
    ],
  },
];

/* ─────────────────────────────────────────────
   BELTS
───────────────────────────────────────────── */
const getBeltsData = (adminId) => [
  {
    brand: "Woodland",
    type_of_material: "Genuine Leather",
    buckle_type: "Brass",
    width: "1.25 inches",
    addedBy: adminId,
    variants: [
      {
        size: "30",
        color: "Brown",
        cost: 999,
        count: 25,
        image_url:
          "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400",
      },
      { size: "32", color: "Black", cost: 999, count: 30 },
      { size: "34", color: "Tan", cost: 1099, count: 20 },
      { size: "36", color: "Brown", cost: 1099, count: 12 },
    ],
  },
  {
    brand: "Lee",
    type_of_material: "PU Leather",
    buckle_type: "Steel",
    width: "1.5 inches",
    addedBy: adminId,
    variants: [
      { size: "28", color: "Black", cost: 699, count: 35 },
      {
        size: "30",
        color: "Dark Brown",
        cost: 749,
        count: 28,
        image_url:
          "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400",
      },
      { size: "32", color: "Navy Blue", cost: 749, count: 22 },
      { size: "34", color: "Black", cost: 799, count: 18 },
    ],
  },
  {
    brand: "Tommy Hilfiger",
    type_of_material: "Full-Grain Leather",
    buckle_type: "Alloy",
    width: "1.25 inches",
    addedBy: adminId,
    variants: [
      {
        size: "30",
        color: "Black",
        cost: 2499,
        count: 10,
        image_url:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
      },
      { size: "32", color: "Cognac", cost: 2499, count: 15 },
      { size: "34", color: "Dark Brown", cost: 2699, count: 12 },
      { size: "36", color: "Black", cost: 2699, count: 8 },
    ],
  },
  {
    brand: "UCB",
    type_of_material: "Canvas",
    buckle_type: "Zinc",
    width: "1 inches",
    addedBy: adminId,
    variants: [
      { size: "28", color: "Khaki", cost: 599, count: 40 },
      {
        size: "30",
        color: "Olive",
        cost: 599,
        count: 35,
        image_url:
          "https://images.unsplash.com/photo-1571945192237-4734538052a9?w=400",
      },
      { size: "32", color: "Grey", cost: 649, count: 30 },
      { size: "34", color: "Denim", cost: 649, count: 20 },
    ],
  },
];

/* ─────────────────────────────────────────────
   WATCHES
───────────────────────────────────────────── */
const getWatchesData = (adminId) => [
  {
    brand: "Titan",
    watch_type: "Analog",
    movement: "Quartz",
    water_resistance: "50m",
    addedBy: adminId,
    variants: [
      {
        size: "42mm",
        strap_material: "Leather",
        dial_color: "Black",
        cost: 4999,
        count: 20,
        image_url:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      },
      {
        size: "40mm",
        strap_material: "Metal",
        dial_color: "Silver",
        cost: 5999,
        count: 15,
      },
      {
        size: "44mm",
        strap_material: "Silicone",
        dial_color: "Blue",
        cost: 3999,
        count: 25,
      },
    ],
  },
  {
    brand: "Casio",
    watch_type: "Digital",
    movement: "Quartz",
    water_resistance: "100m",
    addedBy: adminId,
    variants: [
      {
        size: "42mm",
        strap_material: "Rubber",
        dial_color: "Black",
        cost: 2999,
        count: 35,
        image_url:
          "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400",
      },
      {
        size: "44mm",
        strap_material: "Rubber",
        dial_color: "Grey",
        cost: 3299,
        count: 28,
      },
      {
        size: "46mm",
        strap_material: "Nylon",
        dial_color: "Olive",
        cost: 3599,
        count: 20,
      },
    ],
  },
  {
    brand: "Fossil",
    watch_type: "Analog",
    movement: "Automatic",
    water_resistance: "50m",
    addedBy: adminId,
    variants: [
      {
        size: "42mm",
        strap_material: "Leather",
        dial_color: "Brown",
        cost: 12999,
        count: 8,
        image_url:
          "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400",
      },
      {
        size: "44mm",
        strap_material: "Metal",
        dial_color: "Gold",
        cost: 14999,
        count: 6,
      },
      {
        size: "40mm",
        strap_material: "Leather",
        dial_color: "Cream",
        cost: 11999,
        count: 10,
      },
    ],
  },
  {
    brand: "Apple",
    watch_type: "Smart",
    movement: "Quartz",
    water_resistance: "50m",
    addedBy: adminId,
    variants: [
      {
        size: "40mm",
        strap_material: "Silicone",
        dial_color: "Midnight",
        cost: 41900,
        count: 12,
        image_url:
          "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400",
      },
      {
        size: "44mm",
        strap_material: "Silicone",
        dial_color: "Starlight",
        cost: 41900,
        count: 10,
      },
      {
        size: "46mm",
        strap_material: "Nylon",
        dial_color: "Black",
        cost: 44900,
        count: 8,
      },
    ],
  },
  {
    brand: "Seiko",
    watch_type: "Analog",
    movement: "Solar",
    water_resistance: "100m",
    addedBy: adminId,
    variants: [
      {
        size: "42mm",
        strap_material: "Metal",
        dial_color: "Navy Blue",
        cost: 18999,
        count: 7,
        image_url:
          "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400",
      },
      {
        size: "44mm",
        strap_material: "Metal",
        dial_color: "Black",
        cost: 19999,
        count: 5,
      },
    ],
  },
];

/* ─────────────────────────────────────────────
   SHOES
───────────────────────────────────────────── */
const getShoesData = (adminId) => [
  {
    brand: "Nike",
    type_of_material: "Mesh",
    sole_type: "Rubber",
    color: "White",
    addedBy: adminId,
    variants: [
      {
        size: "7",
        shoe_type: "Running Shoes",
        lacing_type: "Lace-Up",
        cost: 5999,
        count: 30,
        image_url:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      },
      {
        size: "8",
        shoe_type: "Sneaker",
        lacing_type: "Slip-On",
        cost: 6499,
        count: 25,
      },
      {
        size: "9",
        shoe_type: "Running Shoes",
        lacing_type: "Lace-Up",
        cost: 5999,
        count: 20,
      },
      {
        size: "10",
        shoe_type: "Canvas Shoes",
        lacing_type: "Lace-Up",
        cost: 4999,
        count: 15,
      },
    ],
  },
  {
    brand: "Adidas",
    type_of_material: "Synthetic",
    sole_type: "Rubber",
    color: "Black",
    addedBy: adminId,
    variants: [
      {
        size: "7",
        shoe_type: "Sneaker",
        lacing_type: "Lace-Up",
        cost: 5499,
        count: 28,
        image_url:
          "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400",
      },
      {
        size: "8",
        shoe_type: "Running Shoes",
        lacing_type: "Lace-Up",
        cost: 5999,
        count: 32,
      },
      {
        size: "9",
        shoe_type: "Sneaker",
        lacing_type: "Velcro",
        cost: 5499,
        count: 18,
      },
      {
        size: "10",
        shoe_type: "Running Shoes",
        lacing_type: "Lace-Up",
        cost: 6299,
        count: 14,
      },
      {
        size: "11",
        shoe_type: "Sneaker",
        lacing_type: "Lace-Up",
        cost: 5499,
        count: 10,
      },
    ],
  },
  {
    brand: "Puma",
    type_of_material: "Canvas",
    sole_type: "Foam",
    color: "Navy Blue",
    addedBy: adminId,
    variants: [
      {
        size: "6",
        shoe_type: "Canvas Shoes",
        lacing_type: "Slip-On",
        cost: 3299,
        count: 40,
        image_url:
          "https://images.unsplash.com/photo-1465453869711-7e174808ace9?w=400",
      },
      {
        size: "7",
        shoe_type: "Sneaker",
        lacing_type: "Lace-Up",
        cost: 3799,
        count: 35,
      },
      {
        size: "8",
        shoe_type: "Canvas Shoes",
        lacing_type: "Slip-On",
        cost: 3299,
        count: 28,
      },
      {
        size: "9",
        shoe_type: "Sneaker",
        lacing_type: "Lace-Up",
        cost: 3999,
        count: 20,
      },
    ],
  },
  {
    brand: "Woodland",
    type_of_material: "Leather",
    sole_type: "TPU",
    color: "Brown",
    addedBy: adminId,
    variants: [
      {
        size: "7",
        shoe_type: "Sneaker",
        lacing_type: "Lace-Up",
        cost: 4999,
        count: 15,
        image_url:
          "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400",
      },
      {
        size: "8",
        shoe_type: "Sneaker",
        lacing_type: "Lace-Up",
        cost: 4999,
        count: 18,
      },
      {
        size: "9",
        shoe_type: "Sneaker",
        lacing_type: "Lace-Up",
        cost: 5199,
        count: 12,
      },
      {
        size: "10",
        shoe_type: "Sneaker",
        lacing_type: "Lace-Up",
        cost: 5199,
        count: 8,
      },
    ],
  },
  {
    brand: "Bata",
    type_of_material: "Synthetic",
    sole_type: "PU",
    color: "Black",
    addedBy: adminId,
    variants: [
      {
        size: "6",
        shoe_type: "Canvas Shoes",
        lacing_type: "Slip-On",
        cost: 1499,
        count: 50,
      },
      {
        size: "7",
        shoe_type: "Canvas Shoes",
        lacing_type: "Slip-On",
        cost: 1499,
        count: 45,
        image_url:
          "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400",
      },
      {
        size: "8",
        shoe_type: "Sneaker",
        lacing_type: "Lace-Up",
        cost: 1799,
        count: 40,
      },
      {
        size: "9",
        shoe_type: "Sneaker",
        lacing_type: "Lace-Up",
        cost: 1799,
        count: 30,
      },
      {
        size: "10",
        shoe_type: "Canvas Shoes",
        lacing_type: "Velcro",
        cost: 1599,
        count: 20,
      },
    ],
  },
];

/* ─────────────────────────────────────────────
   SANDALS
───────────────────────────────────────────── */
const getSandalsData = (adminId) => [
  {
    brand: "Bata",
    type_of_material: "Leather",
    color: "Brown",
    sole_type: "Rubber",
    strap_type: "Leather",
    addedBy: adminId,
    variants: [
      {
        size: "6",
        sandal_type: "Sandals",
        heel_height: "Low",
        cost: 1299,
        count: 40,
        image_url:
          "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400",
      },
      {
        size: "7",
        sandal_type: "Slippers",
        heel_height: "Low",
        cost: 799,
        count: 55,
      },
      {
        size: "8",
        sandal_type: "Sandals",
        heel_height: "Medium",
        cost: 1499,
        count: 30,
      },
      {
        size: "9",
        sandal_type: "Slippers",
        heel_height: "Low",
        cost: 899,
        count: 35,
      },
    ],
  },
  {
    brand: "Puma",
    type_of_material: "Synthetic",
    color: "Black",
    sole_type: "Foam",
    strap_type: "Synthetic",
    addedBy: adminId,
    variants: [
      {
        size: "7",
        sandal_type: "Slippers",
        heel_height: "Low",
        cost: 1299,
        count: 50,
        image_url:
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
      },
      {
        size: "8",
        sandal_type: "Slippers",
        heel_height: "Low",
        cost: 1299,
        count: 45,
      },
      {
        size: "9",
        sandal_type: "Sandals",
        heel_height: "Low",
        cost: 1799,
        count: 30,
      },
      {
        size: "10",
        sandal_type: "Slippers",
        heel_height: "Low",
        cost: 1399,
        count: 25,
      },
    ],
  },
  {
    brand: "Relaxo",
    type_of_material: "Foam",
    color: "Blue",
    sole_type: "Foam",
    strap_type: "Foam",
    addedBy: adminId,
    variants: [
      {
        size: "6",
        sandal_type: "Slippers",
        heel_height: "Low",
        cost: 299,
        count: 80,
      },
      {
        size: "7",
        sandal_type: "Slippers",
        heel_height: "Low",
        cost: 299,
        count: 75,
        image_url:
          "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400",
      },
      {
        size: "8",
        sandal_type: "Slippers",
        heel_height: "Low",
        cost: 349,
        count: 60,
      },
      {
        size: "9",
        sandal_type: "Slippers",
        heel_height: "Low",
        cost: 349,
        count: 50,
      },
      {
        size: "10",
        sandal_type: "Slippers",
        heel_height: "Low",
        cost: 399,
        count: 40,
      },
    ],
  },
  {
    brand: "Woodland",
    type_of_material: "Leather",
    color: "Tan",
    sole_type: "Rubber",
    strap_type: "Leather",
    addedBy: adminId,
    variants: [
      {
        size: "7",
        sandal_type: "Sandals",
        heel_height: "Low",
        cost: 2499,
        count: 20,
        image_url:
          "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=400",
      },
      {
        size: "8",
        sandal_type: "Sandals",
        heel_height: "Medium",
        cost: 2699,
        count: 15,
      },
      {
        size: "9",
        sandal_type: "Sandals",
        heel_height: "High",
        cost: 2899,
        count: 10,
      },
    ],
  },
  {
    brand: "Crocs",
    type_of_material: "Rubber",
    color: "White",
    sole_type: "Foam",
    strap_type: "Rubber",
    addedBy: adminId,
    variants: [
      {
        size: "6",
        sandal_type: "Slippers",
        heel_height: "Low",
        cost: 2999,
        count: 30,
        image_url:
          "https://images.unsplash.com/photo-1560343776-97e7d202ff0e?w=400",
      },
      {
        size: "7",
        sandal_type: "Sandals",
        heel_height: "Low",
        cost: 3499,
        count: 25,
      },
      {
        size: "8",
        sandal_type: "Slippers",
        heel_height: "Low",
        cost: 2999,
        count: 28,
      },
      {
        size: "9",
        sandal_type: "Sandals",
        heel_height: "Low",
        cost: 3499,
        count: 18,
      },
      {
        size: "10",
        sandal_type: "Slippers",
        heel_height: "Low",
        cost: 3099,
        count: 15,
      },
    ],
  },
];

/* ─────────────────────────────────────────────
   HELPER — insert only if no match found
   naturalKey: object of fields that together
   identify "same product" (acts like a unique key)
───────────────────────────────────────────── */
async function insertIfNew(Model, naturalKey, doc) {
  const exists = await Model.findOne(naturalKey);
  if (exists) return "skipped";
  await Model.create(doc);
  return "inserted";
}

/* ─────────────────────────────────────────────
   MAIN SEED FUNCTION
───────────────────────────────────────────── */
async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB:", MONGO_URI);

  const stats = {
    users: { inserted: 0, skipped: 0 },
    shirts: { inserted: 0, skipped: 0 },
    tshirts: { inserted: 0, skipped: 0 },
    belts: { inserted: 0, skipped: 0 },
    watches: { inserted: 0, skipped: 0 },
    shoes: { inserted: 0, skipped: 0 },
    sandals: { inserted: 0, skipped: 0 },
    orders: { inserted: 0, skipped: 0 },
  };

  // ── Users — email is the natural unique key ──
  let admin1 = await User.findOne({ email: "arjun.admin@store.com" });
  let admin2 = await User.findOne({ email: "sneha.admin@store.com" });

  for (const u of usersData) {
    const exists = await User.findOne({ email: u.email });
    if (exists) {
      console.log(`⏭️  Skipped user (already exists): ${u.email}`);
      stats.users.skipped++;
      // capture admin refs even if they already exist
      if (u.email === "arjun.admin@store.com") admin1 = exists;
      if (u.email === "sneha.admin@store.com") admin2 = exists;
    } else {
      const hashed = await bcrypt.hash(u.password, 10);
      const user = new User({ ...u, password: hashed });
      await user.save(); // triggers phone normalization hook
      console.log(`👤 Inserted user: ${u.name} (${u.User_Role})`);
      stats.users.inserted++;
      if (u.email === "arjun.admin@store.com") admin1 = user;
      if (u.email === "sneha.admin@store.com") admin2 = user;
    }
  }

  // ── Shirts — natural key: brand + collar_type + sleeve_type ──
  const allShirts = getShirtsData(admin1._id);
  const shirtsWithAdmin = [
    ...allShirts.slice(0, 3),
    ...allShirts.slice(3).map((s) => ({ ...s, addedBy: admin2._id })),
  ];
  for (const doc of shirtsWithAdmin) {
    const result = await insertIfNew(
      Shirts,
      {
        brand: doc.brand,
        collar_type: doc.collar_type,
        sleeve_type: doc.sleeve_type,
      },
      doc,
    );
    stats.shirts[result]++;
    console.log(
      `👔 ${result === "inserted" ? "Inserted" : "Skipped "} shirt: ${doc.brand} (${doc.collar_type}, ${doc.sleeve_type})`,
    );
  }

  // ── T-Shirts — natural key: brand + neck_type + design ──
  const allTshirts = getTshirtsData(admin1._id);
  const tshirtsWithAdmin = [
    ...allTshirts.slice(0, 3),
    ...allTshirts.slice(3).map((t) => ({ ...t, addedBy: admin2._id })),
  ];
  for (const doc of tshirtsWithAdmin) {
    const result = await insertIfNew(
      Tshirts,
      { brand: doc.brand, neck_type: doc.neck_type, design: doc.design },
      doc,
    );
    stats.tshirts[result]++;
    console.log(
      `👕 ${result === "inserted" ? "Inserted" : "Skipped "} tshirt: ${doc.brand} (${doc.neck_type}, ${doc.design})`,
    );
  }

  // ── Belts — natural key: brand + buckle_type + width ──
  const allBelts = getBeltsData(admin1._id).map((b, i) =>
    i >= 2 ? { ...b, addedBy: admin2._id } : b,
  );
  for (const doc of allBelts) {
    const result = await insertIfNew(
      Belts,
      { brand: doc.brand, buckle_type: doc.buckle_type, width: doc.width },
      doc,
    );
    stats.belts[result]++;
    console.log(
      `🔗 ${result === "inserted" ? "Inserted" : "Skipped "} belt: ${doc.brand} (${doc.buckle_type})`,
    );
  }

  // ── Watches — natural key: brand + watch_type + movement ──
  const allWatches = getWatchesData(admin1._id).map((w, i) =>
    i >= 2 ? { ...w, addedBy: admin2._id } : w,
  );
  for (const doc of allWatches) {
    const result = await insertIfNew(
      Watches,
      { brand: doc.brand, watch_type: doc.watch_type, movement: doc.movement },
      doc,
    );
    stats.watches[result]++;
    console.log(
      `⌚ ${result === "inserted" ? "Inserted" : "Skipped "} watch: ${doc.brand} (${doc.watch_type}, ${doc.movement})`,
    );
  }

  // ── Shoes — natural key: brand + type_of_material + color ──
  const allShoes = getShoesData(admin1._id).map((s, i) =>
    i >= 2 ? { ...s, addedBy: admin2._id } : s,
  );
  for (const doc of allShoes) {
    const result = await insertIfNew(
      Shoes,
      {
        brand: doc.brand,
        type_of_material: doc.type_of_material,
        color: doc.color,
      },
      doc,
    );
    stats.shoes[result]++;
    console.log(
      `👟 ${result === "inserted" ? "Inserted" : "Skipped "} shoe: ${doc.brand} (${doc.color})`,
    );
  }

  // ── Sandals — natural key: brand + type_of_material + color + sole_type ──
  const allSandals = getSandalsData(admin1._id).map((s, i) =>
    i >= 3 ? { ...s, addedBy: admin2._id } : s,
  );
  for (const doc of allSandals) {
    const result = await insertIfNew(
      Sandles,
      {
        brand: doc.brand,
        type_of_material: doc.type_of_material,
        color: doc.color,
        sole_type: doc.sole_type,
      },
      doc,
    );
    stats.sandals[result]++;
    console.log(
      `🩴 ${result === "inserted" ? "Inserted" : "Skipped "} sandal: ${doc.brand} (${doc.color})`,
    );
  }

  // ── Orders — built from real DB IDs ──
  console.log("\n📦 Seeding orders...");
  const [priya, rahul, ananya] = await Promise.all([
    User.findOne({ email: "priya.mehta@gmail.com" }),
    User.findOne({ email: "rahul.verma@gmail.com" }),
    User.findOne({ email: "ananya.k@gmail.com" }),
  ]);

  // fetch one doc from each category to get real _id + variantId
  const [shirt, tshirt, belt, watch, shoe, sandal] = await Promise.all([
    Shirts.findOne({ brand: "Allen Solly" }),
    Tshirts.findOne({ brand: "Nike" }),
    Belts.findOne({ brand: "Woodland" }),
    Watches.findOne({ brand: "Titan" }),
    Shoes.findOne({ brand: "Nike" }),
    Sandles.findOne({ brand: "Bata" }),
  ]);

  // helper — build a single order item from a product doc + variant index
  const makeItem = (product, variantIndex, productModel, qty = 1) => {
    const variant = product.variants[variantIndex];
    const details = { ...product.toObject(), ...variant.toObject() };
    delete details.variants;
    delete details.__v;
    return {
      productId: product._id.toString(),
      variantId: variant._id.toString(),
      productModel,
      addedBy: product.addedBy.toString(),
      quantity: qty,
      price: variant.cost,
      details,
    };
  };

  // helper — build history array based on final status
  const makeHistory = (status, baseDate) => {
    const history = [{ from: "Placed", to: "Pending", changedAt: baseDate }];
    const flow = ["Pending", "Confirmed", "Shipped", "Delivered"];
    const idx = flow.indexOf(status);
    for (let i = 0; i < idx; i++) {
      history.push({
        from: flow[i],
        to: flow[i + 1],
        changedAt: new Date(baseDate.getTime() + (i + 1) * 24 * 60 * 60 * 1000),
      });
    }
    if (status === "Cancelled") {
      history.push({
        from: "Pending",
        to: "Cancelled",
        changedAt: new Date(baseDate.getTime() + 2 * 60 * 60 * 1000),
      });
    }
    return history;
  };

  const ordersToSeed = [
    // Priya — Delivered order (shirt + belt)
    {
      userId: priya._id,
      paymentType: "Online",
      paymentMode: "UPI",
      status: "Delivered",
      orderedDate: new Date("2025-12-10"),
      items: [
        makeItem(shirt, 0, "shirt", 1), // Allen Solly shirt, variant 0
        makeItem(belt, 1, "belt", 1), // Woodland belt, variant 1
      ],
    },
    // Priya — Shipped order (watch)
    {
      userId: priya._id,
      paymentType: "Online",
      paymentMode: "NetBanking",
      status: "Shipped",
      orderedDate: new Date("2026-01-15"),
      items: [
        makeItem(watch, 0, "watch", 1), // Titan watch, variant 0
      ],
    },
    // Priya — Cancelled order
    {
      userId: priya._id,
      paymentType: "COD",
      paymentMode: null,
      status: "Cancelled",
      orderedDate: new Date("2026-02-05"),
      items: [
        makeItem(shoe, 0, "shoe", 2), // Nike shoe, variant 0, qty 2
      ],
    },
    // Rahul — Confirmed order (tshirt + sandal)
    {
      userId: rahul._id,
      paymentType: "Online",
      paymentMode: "CreditCard",
      status: "Confirmed",
      orderedDate: new Date("2026-02-20"),
      items: [
        makeItem(tshirt, 1, "tshirt", 2), // Nike tshirt, variant 1, qty 2
        makeItem(sandal, 0, "sandal", 1), // Bata sandal, variant 0
      ],
    },
    // Rahul — Delivered order (shoes)
    {
      userId: rahul._id,
      paymentType: "COD",
      paymentMode: null,
      status: "Delivered",
      orderedDate: new Date("2025-11-28"),
      items: [
        makeItem(shoe, 1, "shoe", 1), // Nike shoe, variant 1
      ],
    },
    // Rahul — Pending order (belt + watch)
    {
      userId: rahul._id,
      paymentType: "Online",
      paymentMode: "UPI",
      status: "Pending",
      orderedDate: new Date("2026-03-25"),
      items: [
        makeItem(belt, 2, "belt", 1), // Woodland belt, variant 2
        makeItem(watch, 1, "watch", 1), // Titan watch, variant 1
      ],
    },
    // Ananya — Delivered order (shirt + tshirt)
    {
      userId: ananya._id,
      paymentType: "Online",
      paymentMode: "UPI",
      status: "Delivered",
      orderedDate: new Date("2025-10-18"),
      items: [
        makeItem(shirt, 1, "shirt", 1), // Allen Solly shirt, variant 1
        makeItem(tshirt, 0, "tshirt", 2), // Nike tshirt, variant 0, qty 2
      ],
    },
    // Ananya — Shipped order (sandals)
    {
      userId: ananya._id,
      paymentType: "COD",
      paymentMode: null,
      status: "Shipped",
      orderedDate: new Date("2026-03-10"),
      items: [
        makeItem(sandal, 1, "sandal", 1), // Bata sandal, variant 1
        makeItem(sandal, 2, "sandal", 1), // Bata sandal, variant 2
      ],
    },
    // Ananya — Confirmed order (watch)
    {
      userId: ananya._id,
      paymentType: "Online",
      paymentMode: "CreditCard",
      status: "Confirmed",
      orderedDate: new Date("2026-03-22"),
      items: [
        makeItem(watch, 2, "watch", 1), // Titan watch, variant 2
      ],
    },
  ];

  for (const orderData of ordersToSeed) {
    // natural key: same userId + same orderedDate = same order
    const exists = await Order.findOne({
      userId: orderData.userId,
      orderedDate: orderData.orderedDate,
    });

    if (exists) {
      console.log(
        `⏭️  Skipped order: ${orderData.status} order for userId ${orderData.userId}`,
      );
      stats.orders.skipped++;
      continue;
    }

    const totalAmount = orderData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    await Order.create({
      ...orderData,
      totalAmount,
      history: makeHistory(orderData.status, orderData.orderedDate),
    });

    console.log(
      `📦 Inserted order: [${orderData.status}] for userId ${orderData.userId} — ₹${totalAmount}`,
    );
    stats.orders.inserted++;
  }

  // ── Summary ──
  console.log("\n✅ Seed complete!");
  console.log("─────────────────────────────────────────────────");
  console.log("Collection   Inserted   Skipped (already existed)");
  console.log("─────────────────────────────────────────────────");
  for (const [name, s] of Object.entries(stats)) {
    console.log(
      `${name.padEnd(12)} ${String(s.inserted).padEnd(10)} ${s.skipped}`,
    );
  }
  console.log("─────────────────────────────────────────────────");
  console.log("\n🔑 Seed credentials (only if newly inserted):");
  console.log("  Admin 1 → arjun.admin@store.com   / Admin@123");
  console.log("  Admin 2 → sneha.admin@store.com   / Admin@456");
  console.log("  User 1  → priya.mehta@gmail.com   / User@123");
  console.log("  User 2  → rahul.verma@gmail.com   / User@456");
  console.log("  User 3  → ananya.k@gmail.com      / User@789");

  await mongoose.disconnect();
  console.log("\n🔌 Disconnected from MongoDB");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  mongoose.disconnect();
  process.exit(1);
});
