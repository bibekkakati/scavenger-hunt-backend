const { branchController } = require("../controllers");
const verifyAuthToken = require("../middlewares/verifyAuthToken");

const router = require("express").Router();

router.get("/search", branchController.searchBranchByPincode);
router.use(verifyAuthToken);
router.get("/all", branchController.getAllBranches);
router.get("/details", branchController.getBranchDetails);

module.exports = router;
