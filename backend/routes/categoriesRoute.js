const router = require("express").Router();
const { createCategoryCtrl, getAllCategoriesCtrl, deleteCategoryCtrl } = require("../controllers/CategoriesController");
const {verifyTokenAndAdmin}= require("../middlewares/verifyToken");
const validateobjectId = require("../middlewares/validateObjectId");




// /api/categories
router.route("/")
  .post(verifyTokenAndAdmin, createCategoryCtrl)
  .get(getAllCategoriesCtrl)


// /api/categories/:id
router.route("/:id")
  .delete(validateobjectId,verifyTokenAndAdmin,deleteCategoryCtrl)






module.exports = router;
