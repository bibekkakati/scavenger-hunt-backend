const { branchController } = require("../controllers");

const router = require("express").Router();

router.get("/search", branchController.searchBranchByPincode);
router.get("/all", branchController.getAllBranches);
router.get("/", branchController.getBranchDetails);

module.exports = router;
