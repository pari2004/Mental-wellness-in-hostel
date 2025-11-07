const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Mood Information
  moodLevel: {
    type: Number,
    required: [true, 'Mood level is required'],
    min: [1, 'Mood level must be between 1 and 10'],
    max: [10, 'Mood level must be between 1 and 10']
  },
  
  moodEmoji: {
    type: String,
    enum: ['😢', '😞', '😐', '🙂', '😊', '😄', '😁', '🥰', '😍', '🤩'],
    required: true
  },
  
  emotions: [{
    type: String,
    enum: [
      'happy', 'sad', 'angry', 'anxious', 'excited', 'calm', 'frustrated',
      'lonely', 'grateful', 'hopeful', 'overwhelmed', 'content', 'worried',
      'energetic', 'tired', 'confused', 'confident', 'stressed', 'peaceful',
      'disappointed', 'motivated', 'fearful', 'loved', 'isolated'
    ]
  }],
  
  // Entry Content
  textEntry: {
    type: String,
    maxlength: [2000, 'Text entry cannot exceed 2000 characters'],
    trim: true
  },
  
  voiceNote: {
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    duration: Number, // in seconds
    transcription: String, // AI-generated transcription
    url: String
  },
  
  // Context Information
  triggers: [{
    type: String,
    enum: [
      'academic_stress', 'homesickness', 'relationship_issues', 'financial_stress',
      'health_concerns', 'family_problems', 'social_anxiety', 'sleep_issues',
      'exam_pressure', 'loneliness', 'roommate_conflicts', 'career_worries',
      'body_image', 'discrimination', 'substance_use', 'other'
    ]
  }],
  
  activities: [{
    type: String,
    enum: [
      'studying', 'socializing', 'exercising', 'sleeping', 'eating',
      'gaming', 'watching_tv', 'reading', 'music', 'meditation',
      'calling_family', 'partying', 'working', 'volunteering', 'other'
    ]
  }],
  
  location: {
    type: String,
    enum: ['hostel_room', 'library', 'cafeteria', 'campus', 'home', 'other'],
    default: 'hostel_room'
  },
  
  // Weather and Environment
  weather: {
    type: String,
    enum: ['sunny', 'cloudy', 'rainy', 'stormy', 'snowy', 'foggy']
  },
  
  timeOfDay: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'night'],
    required: true
  },
  
  // Sleep and Health
  sleepHours: {
    type: Number,
    min: [0, 'Sleep hours cannot be negative'],
    max: [24, 'Sleep hours cannot exceed 24']
  },
  
  sleepQuality: {
    type: Number,
    min: [1, 'Sleep quality must be between 1 and 5'],
    max: [5, 'Sleep quality must be between 1 and 5']
  },
  
  energyLevel: {
    type: Number,
    min: [1, 'Energy level must be between 1 and 10'],
    max: [10, 'Energy level must be between 1 and 10']
  },
  
  stressLevel: {
    type: Number,
    min: [1, 'Stress level must be between 1 and 10'],
    max: [10, 'Stress level must be between 1 and 10']
  },
  
  // Social Connections
  socialInteractions: {
    type: Number,
    min: [0, 'Social interactions cannot be negative'],
    default: 0
  },
  
  socialQuality: {
    type: Number,
    min: [1, 'Social quality must be between 1 and 5'],
    max: [5, 'Social quality must be between 1 and 5']
  },
  
  // Academic Information
  academicStress: {
    type: Number,
    min: [1, 'Academic stress must be between 1 and 10'],
    max: [10, 'Academic stress must be between 1 and 10']
  },
  
  productivity: {
    type: Number,
    min: [1, 'Productivity must be between 1 and 10'],
    max: [10, 'Productivity must be between 1 and 10']
  },
  
  // Coping Strategies Used
  copingStrategies: [{
    type: String,
    enum: [
      'deep_breathing', 'meditation', 'exercise', 'talking_to_friends',
      'calling_family', 'listening_to_music', 'journaling', 'reading',
      'watching_movies', 'gaming', 'sleeping', 'eating', 'crying',
      'seeking_help', 'prayer', 'art_therapy', 'other'
    ]
  }],
  
  // AI Analysis
  aiAnalysis: {
    sentimentScore: {
      type: Number,
      min: [-1, 'Sentiment score must be between -1 and 1'],
      max: [1, 'Sentiment score must be between -1 and 1']
    },
    keyWords: [String],
    riskIndicators: [{
      type: String,
      severity: {
        type: String,
        enum: ['low', 'medium', 'high']
      }
    }],
    recommendations: [String],
    needsAttention: {
      type: Boolean,
      default: false
    },
    confidenceScore: {
      type: Number,
      min: [0, 'Confidence score must be between 0 and 1'],
      max: [1, 'Confidence score must be between 0 and 1']
    }
  },
  
  // Privacy and Sharing
  isPrivate: {
    type: Boolean,
    default: true
  },
  
  sharedWith: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['counselor', 'friend', 'family']
    },
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Follow-up
  followUpRequired: {
    type: Boolean,
    default: false
  },
  
  followUpDate: Date,
  
  followUpNotes: String,
  
  // Metadata
  entryType: {
    type: String,
    enum: ['daily', 'weekly', 'triggered', 'emergency'],
    default: 'daily'
  },
  
  source: {
    type: String,
    enum: ['web', 'mobile', 'api'],
    default: 'web'
  },
  
  isDeleted: {
    type: Boolean,
    default: false
  },
  
  deletedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
moodEntrySchema.index({ userId: 1, createdAt: -1 });
moodEntrySchema.index({ userId: 1, moodLevel: 1 });
moodEntrySchema.index({ userId: 1, entryType: 1 });
moodEntrySchema.index({ createdAt: -1 });
moodEntrySchema.index({ 'aiAnalysis.needsAttention': 1 });
moodEntrySchema.index({ followUpRequired: 1, followUpDate: 1 });

// Virtual for mood description
moodEntrySchema.virtual('moodDescription').get(function() {
  const descriptions = {
    1: 'Very Low',
    2: 'Low',
    3: 'Below Average',
    4: 'Slightly Below Average',
    5: 'Average',
    6: 'Slightly Above Average',
    7: 'Good',
    8: 'Very Good',
    9: 'Excellent',
    10: 'Outstanding'
  };
  return descriptions[this.moodLevel] || 'Unknown';
});

// Virtual for time since entry
moodEntrySchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
});

// Pre-save middleware
moodEntrySchema.pre('save', function(next) {
  // Set time of day based on creation time
  if (!this.timeOfDay) {
    const hour = this.createdAt.getHours();
    if (hour >= 5 && hour < 12) {
      this.timeOfDay = 'morning';
    } else if (hour >= 12 && hour < 17) {
      this.timeOfDay = 'afternoon';
    } else if (hour >= 17 && hour < 21) {
      this.timeOfDay = 'evening';
    } else {
      this.timeOfDay = 'night';
    }
  }
  
  // Set follow-up required based on mood level and risk indicators
  if (this.moodLevel <= 3 || (this.aiAnalysis && this.aiAnalysis.needsAttention)) {
    this.followUpRequired = true;
    if (!this.followUpDate) {
      this.followUpDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    }
  }
  
  next();
});

// Static methods
moodEntrySchema.statics.findByUserId = function(userId, limit = 10) {
  return this.find({ userId, isDeleted: false })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'firstName lastName anonymousId');
};

moodEntrySchema.statics.getMoodTrends = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate },
        isDeleted: false
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        avgMood: { $avg: "$moodLevel" },
        avgStress: { $avg: "$stressLevel" },
        avgEnergy: { $avg: "$energyLevel" },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } }
  ]);
};

moodEntrySchema.statics.getEntriesNeedingAttention = function() {
  return this.find({
    $or: [
      { 'aiAnalysis.needsAttention': true },
      { followUpRequired: true, followUpDate: { $lte: new Date() } }
    ],
    isDeleted: false
  })
  .populate('userId', 'firstName lastName email phoneNumber emergencyContacts')
  .sort({ createdAt: -1 });
};

module.exports = mongoose.model('MoodEntry', moodEntrySchema);
