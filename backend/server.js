require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const seedRoutes = require('./routes/seedRoutes');
const googleStrategy = require('./config/passport');

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true
}));

passport.use(googleStrategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { User } = require('./models');
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/loyalty', require('./routes/loyaltyRoutes'));
app.use('/api/referral', require('./routes/referralRoutes'));
app.use('/api/pricing-tiers', require('./routes/pricingTierRoutes'));
app.use('/api/sustainability', require('./routes/sustainabilityRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/user', require('./routes/userProfileRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/seed', seedRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

const getColumnType = (columnDefinition) => {
  if (!columnDefinition) {
    return '';
  }

  if (typeof columnDefinition === 'string') {
    return columnDefinition.toLowerCase();
  }

  return String(columnDefinition.type || '').toLowerCase();
};

async function addColumnIfMissing(tableName, tableDefinition, columnName, sql, logMessage) {
  if (!tableDefinition[columnName]) {
    await sequelize.query(sql);
    console.log(logMessage);
  }
}

async function ensurePropertySchema() {
  const queryInterface = sequelize.getQueryInterface();
  const tableDefinition = await queryInterface.describeTable('properties');

  await addColumnIfMissing(
    'properties',
    tableDefinition,
    'latitude',
    'ALTER TABLE `properties` ADD COLUMN `latitude` DECIMAL(10,7) NULL',
    'Added properties.latitude column'
  );

  await addColumnIfMissing(
    'properties',
    tableDefinition,
    'longitude',
    'ALTER TABLE `properties` ADD COLUMN `longitude` DECIMAL(10,7) NULL',
    'Added properties.longitude column'
  );

  await addColumnIfMissing(
    'properties',
    tableDefinition,
    'commute_landmark',
    'ALTER TABLE `properties` ADD COLUMN `commute_landmark` VARCHAR(255) NULL',
    'Added properties.commute_landmark column'
  );

  await addColumnIfMissing(
    'properties',
    tableDefinition,
    'commute_minutes',
    'ALTER TABLE `properties` ADD COLUMN `commute_minutes` INT NULL',
    'Added properties.commute_minutes column'
  );

  await addColumnIfMissing(
    'properties',
    tableDefinition,
    'preferred_for',
    "ALTER TABLE `properties` ADD COLUMN `preferred_for` ENUM('student', 'working_professional', 'intern', 'family', 'traveler') NULL",
    'Added properties.preferred_for column'
  );

  await addColumnIfMissing(
    'properties',
    tableDefinition,
    'move_in_assurance',
    'ALTER TABLE `properties` ADD COLUMN `move_in_assurance` TINYINT(1) NOT NULL DEFAULT 0',
    'Added properties.move_in_assurance column'
  );

  await addColumnIfMissing(
    'properties',
    tableDefinition,
    'assurance_notes',
    'ALTER TABLE `properties` ADD COLUMN `assurance_notes` TEXT NULL',
    'Added properties.assurance_notes column'
  );

  const refreshedDefinition = await queryInterface.describeTable('properties');
  const typeDefinition = getColumnType(refreshedDefinition.type);
  const preferredForDefinition = getColumnType(refreshedDefinition.preferred_for);

  if (typeDefinition && !typeDefinition.includes("'flat'")) {
    await sequelize.query(
      "ALTER TABLE `properties` MODIFY COLUMN `type` ENUM('hotel', 'hostel', 'pg', 'room', 'flat') NOT NULL"
    );
    console.log('Updated properties.type enum to include flat');
  }

  if (preferredForDefinition && !preferredForDefinition.includes("'working_professional'")) {
    await sequelize.query(
      "ALTER TABLE `properties` MODIFY COLUMN `preferred_for` ENUM('student', 'working_professional', 'intern', 'family', 'traveler') NULL"
    );
    console.log('Updated properties.preferred_for enum');
  }
}

async function ensureReviewSchema() {
  const queryInterface = sequelize.getQueryInterface();
  const tableDefinition = await queryInterface.describeTable('reviews');

  await addColumnIfMissing(
    'reviews',
    tableDefinition,
    'wifi_rating',
    'ALTER TABLE `reviews` ADD COLUMN `wifi_rating` INT NULL',
    'Added reviews.wifi_rating column'
  );

  await addColumnIfMissing(
    'reviews',
    tableDefinition,
    'food_rating',
    'ALTER TABLE `reviews` ADD COLUMN `food_rating` INT NULL',
    'Added reviews.food_rating column'
  );

  await addColumnIfMissing(
    'reviews',
    tableDefinition,
    'safety_rating',
    'ALTER TABLE `reviews` ADD COLUMN `safety_rating` INT NULL',
    'Added reviews.safety_rating column'
  );

  await addColumnIfMissing(
    'reviews',
    tableDefinition,
    'rule_flexibility_rating',
    'ALTER TABLE `reviews` ADD COLUMN `rule_flexibility_rating` INT NULL',
    'Added reviews.rule_flexibility_rating column'
  );
}

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');

    await sequelize.sync();
    console.log('Database tables are ready');

    await ensurePropertySchema();
    console.log('Property schema is up to date');

    await ensureReviewSchema();
    console.log('Review schema is up to date');

    const server = app.listen(PORT);

    server.on('listening', () => {
      console.log(`\nServer running on http://localhost:${PORT}`);
      console.log('\nAvailable endpoints:');
      console.log(`   - Health Check: GET http://localhost:${PORT}/api/health`);
      console.log(`   - Seed Demo Data: GET http://localhost:${PORT}/api/seed`);
      console.log(`   - Login: POST http://localhost:${PORT}/api/auth/login`);
      console.log(`   - Register: POST http://localhost:${PORT}/api/auth/register`);
      console.log('\nBackend is ready.\n');
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`);
        console.error('Stop the existing process on that port, or run with a different port.');
        console.error('Example: $env:PORT=5001; npm run dev');
        console.error(`You can identify the listener with: netstat -ano | findstr :${PORT}`);
      } else {
        console.error('Server startup error:', error.message);
      }

      process.exit(1);
    });
  } catch (err) {
    console.error('Startup failed:', err.message);
    console.error('\nTroubleshooting steps:');
    console.error('   1. Check if MySQL is running');
    console.error('   2. Verify database credentials in .env');
    console.error('   3. Ensure database "roombookify" exists');
    console.error('   4. If you previously used sync({ alter: true }), clean duplicate MySQL indexes if needed');
    process.exit(1);
  }
}

startServer();

module.exports = app;
