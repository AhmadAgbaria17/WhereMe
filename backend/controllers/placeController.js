const asyncHandler = require("express-async-handler");
const axios = require('axios');


/**
 * @desc Get the places
 * @route /api/places/:selectedPlace
 * @method GET
 * @access public
 */
module.exports.getPlacesCtrl = asyncHandler(async (req, res) => {
  const {selectedPlace} = req.params;
  const apiKey = process.env.GOOGLE_PLACE_API_KEY;

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${selectedPlace}&key=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send(error);
  }

  });