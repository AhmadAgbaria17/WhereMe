const router = require("express").Router();
const { getPlacesCtrl } = require("../controllers/placeController");


router.route("/:selectedPlace")
.get(getPlacesCtrl)

module.exports = router;
