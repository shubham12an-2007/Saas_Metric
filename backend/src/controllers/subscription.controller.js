const subscriptionModel = require("../models/Subscription.model");

async function addSubscription(req, res) {
  try {
    const { name, category, price, nextBilling } = req.body;

    if (!name || !category || !price || !nextBilling) {
      return res.status(400).json({
        message: "All fields are required to log an asset",
      });
    }

    const subscription = await subscriptionModel.create({
      user: req.user.id,
      name,
      category,
      price: Number(price),
      nextBilling,
    });
    res.status(201).json({
      message: "Subscription tracked successfully",
      subscription,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create asset pipeline",
      error: error.message,
    });
  }
}

async function getUserSubscription(req, res) {
  try {
    const subscriptions = await subscriptionModel.find({ user: req.user.id });

    res.status(200).json({
      message: "User Subscriptions fetched Successfully",
      subscriptions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch subscription",
      error: error.message,
    });
  }
}

async function getSubscriptionStats(req, res) {
  try {
    const subs = await subscriptionModel.find({ user: req.user.id });

    let totalMonthlySpend = 0;
    let activeCount = 0;

    subs.forEach((sub) => {
      if (sub.status === "Active") {
        activeCount += 1;
        totalMonthlySpend += sub.price;
      }
    });

    res.status(200).json({
      message: "Subscription stats calculated successfully",
      stats: {
        totalMonthlySpend,
        activeCount,
        totalSubscriptions: subs.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to calculate subscription metrics",
      error: error.message,
    });
  }
}

module.exports = { addSubscription, getUserSubscription, getSubscriptionStats };
