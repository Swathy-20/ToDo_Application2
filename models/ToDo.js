const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    id: { type: Number, unique: true, required: true }, // Incremental ID
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

module.exports = mongoose.model("Todo", todoSchema);
