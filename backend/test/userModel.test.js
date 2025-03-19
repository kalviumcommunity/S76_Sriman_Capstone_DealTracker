const User = require('../models/UserModel'); 
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Test data constants
const TEST_DATA = {
  validUser: {
    name: 'Test User',
    email: 'test@example.com',
    password: 'TestPassword123!'
  },
  validUser2: {
    name: 'Test User 2',
    email: 'test2@example.com',
    password: 'TestPassword456!'
  }
};

// Database connection
beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/testDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Cleanup after each test
afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

// Test Case 1: Password hashing
test('Password is hashed before saving', async () => {
  const user = new User(TEST_DATA.validUser);
  await user.save();

  expect(user.password).not.toBe(TEST_DATA.validUser.password);
  const isMatch = await bcrypt.compare(TEST_DATA.validUser.password, user.password);
  expect(isMatch).toBe(true);
});

// Test Case 2: User model default values and timestamps
test('User model has correct default values and timestamps', async () => {
  const user = new User(TEST_DATA.validUser);

  // Check default values
  expect(user.isGoogleUser).toBe(false);
  expect(user.purchasedProducts).toEqual([]);

  await user.save();

  expect(user.createdAt).toBeDefined();
  expect(user.updatedAt).toBeDefined();
  expect(user.createdAt instanceof Date).toBe(true);
  expect(user.updatedAt instanceof Date).toBe(true);
});

// Test Case 3: Required fields validation
test('Required fields are enforced', async () => {
  const userWithoutRequired = new User({});
  const error = userWithoutRequired.validateSync();
  
  expect(error.errors.name).toBeDefined();
  expect(error.errors.email).toBeDefined();
  expect(error.errors.password).toBeDefined();
});

// Test Case 4: User creation with valid data
test('User can be created with valid data', async () => {
  const user = new User(TEST_DATA.validUser);
  await user.save();

  const savedUser = await User.findOne({ email: TEST_DATA.validUser.email });
  expect(savedUser).toBeTruthy();
  expect(savedUser.name).toBe(TEST_DATA.validUser.name);
  expect(savedUser.email).toBe(TEST_DATA.validUser.email);
});

// Test Case 5: Duplicate email prevention
test('Cannot create user with duplicate email', async () => {
  const user1 = new User(TEST_DATA.validUser);
  await user1.save();

  const user2 = new User(TEST_DATA.validUser);
  await expect(user2.save()).rejects.toThrow();
});
