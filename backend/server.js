// --- Imports ---
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Import API route handlers
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const aiRoutes = require('./features/ai/aiRoutes');
const virtualChefRoutes = require('./features/virtualChef/virtualChefRoutes'); // <--- ADDED THIS

dotenv.config();

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

const app = express();

// --- CORS Configuration ---
// This allows your frontend (running on these URLs) to talk to this backend
const allowedOrigins = [
    'http://localhost:8081',      // Laptop (Localhost)
    'http://172.20.10.6:8081',    // Phone (Network IP) - Update if your IP changes!
    'http://localhost:5173'       // Vite default port (backup)
];

console.log("Allowed CORS Origins:", allowedOrigins);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, or curl)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // Optional: For dev, you can uncomment the line below to allow ALL origins temporarily
            // return callback(null, true); 
            
            const msg = `CORS Error: The origin "${origin}" is not allowed.`;
            console.error(msg);
            callback(new Error(msg), false);
        }
    },
    methods: "GET,POST,PUT,DELETE",
    credentials: true // Important for cookies/sessions if you use them
}));

// --- Middleware ---
app.use(express.json({ limit: '50mb' })); // Increased limit for Image Uploads (Virtual Chef)
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// --- API Routes ---
app.use('/api/auth', authRoutes);           // Auth (Login/Signup)
app.use('/api/recipes', recipeRoutes);      // Standard Recipes
app.use('/api/ai', aiRoutes);               // Basic AI (Generation)
app.use('/api/virtual-chef', virtualChefRoutes); // <--- NEW: Virtual Chef (Gemini Live)

// --- Root Endpoint ---
app.get('/', (req, res) => {
    res.send('EasyPans API is running (HTTP)...');
});

// --- Start Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server listening on port ${PORT}`);
    console.log(`📡 Network Access: http://172.20.10.6:${PORT}`);
});