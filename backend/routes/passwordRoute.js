const router = require("express").Router();
const {
  sendRestPasswordLinkCtrl,
  getResetPasswordLinkCtrl,
  ResetPasswordCtrl,
} = require("../controllers/passwordController");


// /api/password/reset-password-link
router.post("/reset-password-link", sendRestPasswordLinkCtrl);

// /api/password/reset-password/:userId/:token
router
  .route("/reset-password/:userId/:token")
  .get(getResetPasswordLinkCtrl)
  .post(ResetPasswordCtrl);

module.exports = router;
