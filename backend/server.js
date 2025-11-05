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
const VITE_LOCALHOST_URL = 'http://localhost:8080';
const IP_ADDRESS_URL = 'http://172.20.10.6:8080';
const FRONTEND_ENV_URL = process.env.FRONTEND_URL;

const allowedOrigins = [
    VITE_LOCALHOST_URL,
    IP_ADDRESS_URL
];

// --- CORRECTION FOR DEPLOYMENT ---
// This allows Render to use a comma-separated list of URLs
// (e.g., "https://easypans.vercel.app,https://www.easypans.com")
if (FRONTEND_ENV_URL) {
    FRONTEND_ENV_URL.split(',').forEach(origin => {
        if (origin && allowedOrigins.indexOf(origin.trim()) === -1) {
            allowedOrigins.push(origin.trim());
        }
    });
}
// --- END CORRECTION ---

console.log("Allowed CORS Origins:", allowedOrigins);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            const msg = `CORS Error: The origin "${origin}" is not allowed.`;
            console.error(msg);
            callback(new Error(msg), false);
        }
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
// --- CORRECTION: This entire block is commented out. ---
// This block causes the 'ENOENT' error on Render because
// this backend server is ONLY an API. Your Vercel frontend
// will be responsible for serving the 'index.html' file.

/* <-- Start of commented out block
if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    // Assuming build output is 'frontend/dist' relative to backend root
    app.use(express.static(path.join(__dirname, '/frontend/dist')));

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
    );
} else {
*/ // <-- End of commented out block
    app.get('/', (req, res) => {
        res.send('API is running in development mode...');
    });
// } // <-- This 'else' bracket is also commented out
// --- End Production Build Static Serving ---


// --- Define Port and Start Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
// --- End Define Port and Start Server ---