const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_KEY); // if fails then catch block else next line
        req.userData = { userEmail: decodedToken.userEmail, userId: decodedToken.userId }; // set a new variable in req, value of which can be accessed by functions running check-auth middleware
        next();
    } catch (error) {
        res.status(401).json({ message: "You are not authenticated!" });
    }
};