const config = {
  PORT: process.env.PORT || 8080,
  MONGO_URL: process.env.MONGO_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_TTL: process.env.JWT_TTL || '7d',
  STATIC_PATH: process.env.STATIC_PATH || __dirname
};

module.exports = config;