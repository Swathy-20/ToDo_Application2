const express = require("express");
const Todo = require("../models/Todo");
const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post("/", async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) return res.status(400).json({ error: "Title is required" });

        const lastTodo = await Todo.findOne().sort({ id: -1 });
        const newId = lastTodo && lastTodo.id ? lastTodo.id + 1 : 1;

        const newTodo = new Todo({ id: newId, title });
        await newTodo.save();

        res.status(201).json(newTodo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const todo = await Todo.findOne({ id: req.params.id });
        if (!todo) return res.status(404).json({ error: "Todo not found" });

        res.json(todo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { title, completed } = req.body;
        const todo = await Todo.findOneAndUpdate(
            { id: req.params.id },
            { title, completed },
            { new: true }
        );

        if (!todo) return res.status(404).json({ error: "Todo not found" });

        res.json(todo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


const mongoose = require("mongoose");

router.delete("/:id", async (req, res) => {
    try {
        
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        const todo = await Todo.findByIdAndDelete(req.params.id);

        if (!todo) return res.status(404).json({ error: "Todo not found" });

        res.json({ message: "Todo deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
