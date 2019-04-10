const Farmer = require('../models/farmer');

exports.addFarmer = (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const farmer = new Farmer({
        farmerName: req.body.farmerName,
        farmerPhone: req.body.farmerPhone,
        farmerLanguage: req.body.farmerLanguage,
        farmerCountry: req.body.farmerCountry,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });

    farmer.save()
    .then(createdFarmer => {
        res.status(201).json({
            message: "Farmer added successfully to India",
            farmer: {
                ...createdFarmer,
                id: createdFarmer._id,
            }
        });
    })
    .catch(error => {
        res.status(500).json({
            message: "Creating Farmer Failed!"
        });
    });
}

exports.updateFarmer = (req, res, next) => {

    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }
    const farmer = new Farmer({
        _id: req.params.id,
        farmerName: req.body.farmerName,
        farmerPhone: req.body.farmerPhone,
        farmerLanguage: req.body.farmerLanguage,
        farmerCountry: req.body.farmerCountry,
        imagePath: imagePath,
        creator: req.userData.userId // added on server side so that user cannot cannot manipulate from client side
    });
    Farmer.updateOne({ _id: req.params.id, creator: req.userData.userId }, farmer)
    .then(result => {
        if (result.n > 0) { // n is the number of documents fetched that matches the filter
            res.status(200).json({ message: "Update Successful!" });
        } else {
            res.status(401).json({ message: "Not authorized to carry out this action!" });
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Could not update farmer!"
        });
    });
}

exports.getFarmers = (req, res, next) => {
    
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const farmerQuery = Farmer.find();
    let fetchedFarmers;
    
    if(pageSize && currentPage) {
        farmerQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    
    farmerQuery
    .then(documents => {
        fetchedFarmers = documents
        return Farmer.count();
    })
    .then(count => {
        res.status(200).json({ 
            message:"Farmers fetched successfully.", 
            farmers:fetchedFarmers,
            maxFarmers: count 
        });
    })
    .catch(error => {
        res.status(500).json({
            message: "Fetching Farmers Failed!"
        });
    });
}

exports.getFarmerById = (req, res, next) => {
    
    Farmer.findById(req.params.id)
    .then(farmer => { // of not found
        if (farmer) {
            res.status(200).json(farmer);
        } else {
            res.status(404).json({ 
                message:"Farmer not found.", 
                farmer:farmer 
            });
        }
    })
    .catch(error => { // if technical error
        res.status(500).json({
            message: "Fetching Farmer Failed!"
        });
    });
}

exports.deleteFarmerById = (req, res, next) => {
    Farmer.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
        if (result.n > 0) {
            res.status(200).json({ message: "Delete Successful!" });
        } else {
            res.status(401).json({ message: "Not authorized to carry out this action!" });
        }
    });
}