const { MONGO_URI } = require("../../config/config");

module.exports = async (mongoose) => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Mongodb connection successful");
    } catch (err) {
        console.log("MongoDB connection error --->",err.message);
    }
}