const winston = require('winston');
const path = require('path');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define format for logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define format for file logs (without colors)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Define which transports the logger must use
const transports = [
  // Console transport
  new winston.transports.Console({
    format: format,
    level: process.env.LOG_LEVEL || 'info'
  }),
  
  // File transport for all logs
  new winston.transports.File({
    filename: path.join(process.cwd(), 'backend/logs/app.log'),
    format: fileFormat,
    level: 'info',
    maxsize: 5242880, // 5MB
    maxFiles: 5
  }),
  
  // File transport for error logs
  new winston.transports.File({
    filename: path.join(process.cwd(), 'backend/logs/error.log'),
    format: fileFormat,
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 5
  })
];

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format: fileFormat,
  transports,
  exitOnError: false
});

// Create a stream object for Morgan HTTP logging
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  }
};

// Add custom methods for different types of logs
logger.logUserAction = (userId, action, details = {}) => {
  logger.info(`User Action: ${action}`, {
    userId,
    action,
    details,
    timestamp: new Date().toISOString()
  });
};

logger.logSecurityEvent = (event, details = {}) => {
  logger.warn(`Security Event: ${event}`, {
    event,
    details,
    timestamp: new Date().toISOString(),
    severity: 'security'
  });
};

logger.logAPIRequest = (req, res, responseTime) => {
  const logData = {
    method: req.method,
    url: req.originalUrl,
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress,
    userId: req.user ? req.user._id : null,
    timestamp: new Date().toISOString()
  };

  if (res.statusCode >= 400) {
    logger.warn(`API Request Failed: ${req.method} ${req.originalUrl}`, logData);
  } else {
    logger.http(`API Request: ${req.method} ${req.originalUrl}`, logData);
  }
};

logger.logDatabaseOperation = (operation, collection, details = {}) => {
  logger.debug(`Database Operation: ${operation} on ${collection}`, {
    operation,
    collection,
    details,
    timestamp: new Date().toISOString()
  });
};

logger.logMentalHealthAlert = (userId, alertType, severity, details = {}) => {
  logger.warn(`Mental Health Alert: ${alertType}`, {
    userId,
    alertType,
    severity,
    details,
    timestamp: new Date().toISOString(),
    category: 'mental_health'
  });
};

logger.logEmergencyEvent = (userId, eventType, details = {}) => {
  logger.error(`Emergency Event: ${eventType}`, {
    userId,
    eventType,
    details,
    timestamp: new Date().toISOString(),
    category: 'emergency',
    severity: 'critical'
  });
};

logger.logAIInteraction = (userId, interactionType, details = {}) => {
  logger.info(`AI Interaction: ${interactionType}`, {
    userId,
    interactionType,
    details,
    timestamp: new Date().toISOString(),
    category: 'ai'
  });
};

logger.logPrivacyEvent = (userId, eventType, details = {}) => {
  logger.info(`Privacy Event: ${eventType}`, {
    userId,
    eventType,
    details,
    timestamp: new Date().toISOString(),
    category: 'privacy'
  });
};

// Error handling for logger itself
logger.on('error', (error) => {
  console.error('Logger error:', error);
});

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('Application shutting down gracefully');
  logger.end();
});

process.on('SIGTERM', () => {
  logger.info('Application terminated');
  logger.end();
});

module.exports = logger;
