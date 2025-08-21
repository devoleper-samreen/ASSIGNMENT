import Store from "../models/Store.js";
import Rating from "../models/Rating.js";

export const getStores = async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const rateStore = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    let existingRating = await Rating.findOne({ user: userId, store: storeId });
    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
    } else {
      const newRating = new Rating({ user: userId, store: storeId, rating });
      await newRating.save();
    }

    res.json({ message: "Rating submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
