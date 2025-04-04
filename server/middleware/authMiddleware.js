const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const authHeader = req.header("Authorization"); // Get token from header

    if (!authHeader) {
        console.error("❌ No token provided.");
        return res.status(403).json({ message: "Access Denied. No token provided." });
    }

    try {
        // Extract the token (Remove "Bearer " prefix if present)
        const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

        // Debugging logs
        console.log("🔹 Received Token:", token);
        console.log("🔹 JWT_SECRET:", process.env.JWT_SECRET ? "Exists ✅" : "Not Found ❌");

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded; // Attach admin details to request
        next();
    } catch (error) {
        console.error("❌ JWT Verification Error:", error.message);
        return res.status(401).json({ message: "Invalid token" });
    }
};
