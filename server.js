const express = require("express");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("CodoMax Blog Backend is running!");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});