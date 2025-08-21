import User from "../models/User.js";
import Store from "../models/Store.js";
import Rating from "../models/Rating.js";
import bcrypt from "bcrypt";

export const addUser = async (req, res) => {
  try {
    console.log(req.body);

    const { name, email, password, address, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    //create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role,
    });

    if (!user) {
      return res.status(400).json({ message: "User not created" });
    }

    res.json({ message: "User added successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    const store = new Store({ name, email, address, owner: ownerId });
    await store.save();
    res.json({ message: "Store added successfully", store });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const dashboardStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const storesCount = await Store.countDocuments();
    const ratingsCount = await Rating.countDocuments();
    res.json({ usersCount, storesCount, ratingsCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStores = async (req, res) => {
  try {
    // Populate owner info
    const stores = await Store.find().populate("owner", "name email");

    // Calculate average rating & total ratings for each store
    const storesWithRatings = await Promise.all(
      stores.map(async (store) => {
        const ratings = await Rating.find({ store: store._id });
        const totalRatings = ratings.length;
        const averageRating =
          totalRatings > 0
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
            : 0;
        return { ...store._doc, averageRating, totalRatings };
      })
    );

    res.json(storesWithRatings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRatingsCount = async (req, res) => {
  try {
    const count = await Rating.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
