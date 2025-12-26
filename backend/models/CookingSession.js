const mongoose = require('mongoose');

const stepLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  userSpeech: String,        // What the user said
  visualObservation: String, // What AI saw (e.g., "Onions are translucent")
  aiResponse: String,        // What AI replied
  status: { type: String, enum: ['success', 'warning', 'danger'] }
});

const cookingSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // A session is active until the user clicks "End Cooking"
  isActive: { type: Boolean, default: true },
  history: [stepLogSchema]
}, { timestamps: true });

module.exports = mongoose.model('CookingSession', cookingSessionSchema);