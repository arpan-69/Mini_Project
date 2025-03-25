const express = require('express');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User = require('./models/user');
require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Debug the static folder path
const staticPath = path.join(__dirname, 'static');
console.log("Serving static files from:", staticPath);
app.use(express.static(staticPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

const FLASK_URL = 'http://localhost:5000'||process.env.FLASK_URL;
console.log("Using Flask URL:", FLASK_URL);

// Rest of the code remains the same...
const secret = process.env.SECRET;

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected")).catch(err => console.log("Error:", err));

const authenticationMiddleWare = async (req, res, next) => {
    try {
        const userToken = req.cookies.clientToken;
        if (!userToken) {
            console.log("No token found. Redirecting to /login");
            return res.redirect('/login');
        }

        const userVerified = jwt.verify(userToken, secret);
        console.log("User Verified:", userVerified);

        req.user = userVerified;
        next();
    } catch (error) {
        console.error("Token Verification Failed:", error.message);
        return res.redirect('/login');
    }
};

app.post('/register', async (req, res) => {
    try {
        console.log("Register Request Body:", req.body);
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            console.log("Missing fields in register request");
            return res.status(400).json({ message: "All fields are required!" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({
            username: username,
            email: email,
            password: hash
        });

        await newUser.save();
        console.log("User registered successfully:", email);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Register error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        console.log("Login Request:", req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            console.log("Missing fields");
            return res.status(400).json({ message: "All fields are required!" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found for email:", email);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Incorrect password for email:", email);
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const tokenForClient = jwt.sign(
            { id: user._id, username: user.username },
            secret
        );

        console.log("Generated Token:", tokenForClient);

        res.cookie("clientToken", tokenForClient, {
            httpOnly: false,
            secure: false,
            sameSite: "Lax",
            maxAge: 60 * 60 * 1000
        });

        console.log("Cookie Set Successfully");

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.post('/enhanceImage', authenticationMiddleWare, async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ error: "No image file provided" });
        }

        const file = req.files.file;
        const modelType = req.body.model || "flowers";

        const formData = new FormData();
        formData.append("file", file.data, file.name);
        formData.append("model", modelType);

        const flaskResponse = await axios.post(`${FLASK_URL}/generate`, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        res.status(flaskResponse.status).json(flaskResponse.data);
    } catch (error) {
        console.error("Error proxying to Flask:", error.message);
        res.status(500).json({ error: "Failed to process image", details: error.message });
    }
});

app.get('/', (req, res) => res.render('landing.ejs'));
app.get('/login', (req, res) => res.render('login.ejs'));
app.get('/register', (req, res) => res.render('register.ejs'));
app.get('/support', (req, res) => res.render('support.ejs'));
app.get('/payment', (req, res) => res.render('payment.ejs'));
app.get('/choseModel', authenticationMiddleWare, (req, res) => res.render('choseModel.ejs'));
app.get('/imageEnhancer', authenticationMiddleWare, (req, res) => res.render('mainPage.ejs'));

app.get("/logout", (req, res) => {
    res.clearCookie("clientToken", {
        httpOnly: true,
        secure: false,
        sameSite: "Lax"
    });
    console.log("✅ User logged out. Cookie cleared.");
    res.redirect("/login");
});

app.listen(process.env.PORT || 3000, () => console.log(`Server running on port ${process.env.PORT || 3000}`));