// --- ADDED: Make sure Express is required ---
const express = require('express');
// ... other imports like mongoose, path etc. should be here ...
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // Often needed for production builds
const mongoose = require('mongoose'); // Example

// Import API route handlers (Ensure paths are correct)
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');

dotenv.config();

// --- Database Connection (Example - adjust if needed) ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));
// --- End Database Connection Example ---

const app = express();

// --- CORS Configuration ---
// --- UPDATED: Use the correct Vite localhost URL ---
// --- ↓↓↓ MAKE SURE THIS MATCHES YOUR VITE TERMINAL OUTPUT ↓↓↓ ---
const VITE_LOCALHOST_URL = 'http://localhost:8080'; // <-- Example: Update if yours is different (like :8080)
// --- ↑↑↑ MAKE SURE THIS MATCHES YOUR VITE TERMINAL OUTPUT ↑↑↑ ---

const IP_ADDRESS_URL = 'http://172.20.10.6:8080'; // <-- Your specific IP (Ensure port matches Vite if different)
const FRONTEND_ENV_URL = process.env.FRONTEND_URL;

// Create the list of allowed origins dynamically
const allowedOrigins = [
    VITE_LOCALHOST_URL, // Allow the standard localhost dev URL
    IP_ADDRESS_URL     // Allow the specific IP address
];

// Add the URL from the .env file if it's different from the others
if (FRONTEND_ENV_URL && allowedOrigins.indexOf(FRONTEND_ENV_URL) === -1) {
    allowedOrigins.push(FRONTEND_ENV_URL);
}

console.log("Allowed CORS Origins:", allowedOrigins); // Log allowed origins for debugging

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);

        // Check if the incoming request origin is in our allowed list
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `CORS Error: The origin "${origin}" is not allowed. Allowed origins: ${allowedOrigins.join(', ')}`;
            console.error(msg); // Log the blocked origin and allowed list
            return callback(new Error(msg), false); // Block the request
        }
        // Origin is allowed
        return callback(null, true);
    },
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));
// --- End CORS Configuration ---

app.use(express.json()); // Middleware for JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware for URL-encoded bodies


// --- API Routes (Ensure these are uncommented and paths are correct) ---
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
// --- End API Routes ---


// --- Production Build Static Serving (Optional but common) ---
if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    // Assuming build output is 'frontend/dist' relative to backend root
    app.use(express.static(path.join(__dirname, '/frontend/dist')));

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
    );
} else {
    app.get('/', (req, res) => {
        res.send('API is running in development mode...');
    });
}
// --- End Production Build Static Serving ---


// --- Define Port and Start Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
// --- End Define Port and Start Server ---

