const express = require("express");
const { validateBody } = require("../middleware/validate");
const {
  createPlanSchema,
  updatePlanSchema,
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan,
} = require("../controllers/plannerController");

const router = express.Router();

router.post("/", validateBody(createPlanSchema), createPlan);
router.get("/", getAllPlans);
router.get("/:id", getPlanById);
router.put("/:id", validateBody(updatePlanSchema), updatePlan);
router.delete("/:id", deletePlan);

module.exports = router;
