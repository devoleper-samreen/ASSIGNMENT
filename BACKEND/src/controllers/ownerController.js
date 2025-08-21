import Store from "../models/Store.js";
import Rating from "../models/Rating.js";

export const getOwnerStores = async (req, res) => {
  try {
    console.log(req.user);

    const ownerId = req.user.id;
    const stores = await Store.find({ owner: ownerId });
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStoreRatings = async (req, res) => {
  try {
    const { storeId } = req.params;
    const ratings = await Rating.find({ store: storeId }).populate(
      "user",
      "name email"
    );
    const avgRating = ratings.length
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;
    res.json({ ratings, avgRating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
