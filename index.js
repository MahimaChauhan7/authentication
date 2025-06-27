const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

// Move constants to top
const users = [
    { username: "admin", password: "admin123" },
    { username: "test", password: "test123" }


];
const JWT_SECRET = "MynameisMahima";

// get my account 
app.get("/me", (req, res) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "Token is missing" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const username = decoded.username;

        const foundUser = users.find(user => user.username === username);

        if (foundUser) {
            return res.json({
                username: foundUser.username,
                password: foundUser.password
            });
        }

        return res.status(404).json({
            message: "User not found"
        });

    } catch (err) {
        console.error("ME endpoint error:", err);
        if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }
        return res.status(500).json({
            message: "Internal server error"
        });
    }
})

app.post("/signup", function (req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        users.push({
            username,
            password
        });

        return res.status(201).json({ message: "User signed up successfully" });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
})
app.post("/signin", function (req, res) {
    try {
        const { username, password } = req.body;


        // Input validation
        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        let User = null;
        for (let i = 0; i < users.length; i++) {
            if (users[i].username === username && users[i].password === password) {
                User = users[i];
                break;
            }
        }

        if (User) {
            const token = jwt.sign({
                username: username
            }, JWT_SECRET);
            return res.json({
                token: token
            });
        }

        return res.status(401).json({
            message: "Invalid username or password"
        });

    } catch (error) {
        console.error("Signin error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

app.listen(8080, () => {
    console.log("Server started on http://localhost:8080");
});// that the http server is listening on port 3000
// ✅ This should be LAST
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.stack || err);
    res.status(500).json({
        error: "InternalServerError",
        message: err.message || "Unexpected error occurred"
    });
});

