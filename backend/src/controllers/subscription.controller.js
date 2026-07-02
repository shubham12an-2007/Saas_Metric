const subscriptionModel = require("../models/Subscription.model");
const activityModel = require("../models/activity.model");

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

    await activityModel.create({
      action: "CREATED",
      message: `New subscription "${req.body.name}" was successfully added.`,
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
    const subs = await subscriptionModel.find({
      user: req.user.id,
      status: "Active",
    });

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

async function deleteSubscription(req, res) {
  const id = req.params.id;

  try {
    const deletedSubscription = await subscriptionModel.findByIdAndDelete(id);

    if (!deletedSubscription) {
      return res.status(404).json({
        message: "Subscription not found in MongoDB database cluster.",
      });
    }

    res.status(200).json({
      message: "Subscription deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete the Subscription",
      error: error.message,
    });
  }
}
async function updateSubscription(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log("Updating sub ID:", id, "with data:", updateData);

    const updatedSubscription = await subscriptionModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: false, // 👈 ISE EK BAAR FALSE KARKE DEKHO!
      },
    );

    if (!updatedSubscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    await Activity.create({
      action: "DELETED",
      message: `Subscription was removed from the system.`,
    });

    res.status(200).json({ success: true, updatedSubscription });
  } catch (error) {
    console.error("Update controller error:", error);
    res.status(500).json({ message: error.message });
  }
}
// get Chart analytics
async function getCategoryAnalytics(req, res) {
  try {
    const analytics = await subscriptionModel.aggregate([
      {
        $match: { status: "Active" },
      },

      {
        $group: {
          _id: "$category",
          totalSpend: { $sum: "$price" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalSpend: 1,
          count: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, analytics });
  } catch (error) {
    res.status(500).json({ message: "Failed analytics", error: error.message });
  }
}

// get upcoming subs
async function getUpcomingSubs(req, res) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);
    sevenDaysFromNow.setHours(23, 59, 59, 999);

    // 3. MongoDB / Mongoose Query
    const upcomingSubscriptions = await subscriptionModel
      .find({
        nextBilling: {
          $gte: today,
          $lte: sevenDaysFromNow,
        },
      })
      .sort({ nextBilling: 1 });

    // 4. Return Data to Frontend
    res.status(200).json({
      success: true,
      upcoming: upcomingSubscriptions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch upcoming cluster alerts.",
      error: error.message,
    });
  }
}

// fetch logs controller
async function getActivityLogs(req, res) {
  try {
    const logs = await Activity.find().sort({ createdAt: -1 }).limit(20); // Latest 20 logs ascending/descending order me
    res.status(200).json({ success: true, logs });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch logs", error: error.message });
  }
}

module.exports = {
  addSubscription,
  getUserSubscription,
  getSubscriptionStats,
  deleteSubscription,
  updateSubscription,
  getCategoryAnalytics,
  getUpcomingSubs,
  getActivityLogs,
};
