const mongoose = require('mongoose');

const farmerSchema = mongoose.Schema({
    farmerName: { type: String, required: true },
    farmerPhone: { type: String, required: true },
    farmerLanguage: { type: String, required: true },
    farmerCountry: { type: String, required: true },
    imagePath: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Farmer', farmerSchema);