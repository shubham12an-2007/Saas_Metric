const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const subscriptionController = require("../controllers/subscription.controller");

const router = express.Router();

router.post(
  "/add",
  authMiddleware.protectRoute,
  subscriptionController.addSubscription,
);

router.get(
  "/all",
  authMiddleware.protectRoute,
  subscriptionController.getUserSubscription,
);

router.get(
  "/stats",
  authMiddleware.protectRoute,
  subscriptionController.getSubscriptionStats,
);

module.exports = router;
