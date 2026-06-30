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

// delete route
router.delete(
  "/:id",
  authMiddleware.protectRoute,
  subscriptionController.deleteSubscription,
);

// edit route
router.put(
  "/:id",
  authMiddleware.protectRoute,
  subscriptionController.updateSubscription,
);

module.exports = router;
