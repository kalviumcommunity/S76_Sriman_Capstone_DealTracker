const User = require('../models/UserModel'); 
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

beforeAll(async () => {
  // Connect to a test database
  await mongoose.connect('mongodb://127.0.0.1:27017/testDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

// Test Case 1: Password hashing
test('Password is hashed before saving', async () => {
  const user = new User({ name: 'Test User', email: 'test@example.com', password: 'PlainPassword123' });
  await user.save();

  expect(user.password).not.toBe('PlainPassword123');
  const isMatch = await bcrypt.compare('PlainPassword123', user.password);
  expect(isMatch).toBe(true);

  await User.deleteOne({ email: 'test@example.com' });
});

// Test Case 2: User model default values and timestamps
test('User model has correct default values and timestamps', async () => {
  const user = new User({ 
    name: 'Test User', 
    email: 'test2@example.com', 
    password: 'Password123' 
  });

  expect(user.isGoogleUser).toBe(false);
  expect(user.purchasedProducts).toEqual([]);

  await user.save();

  expect(user.createdAt).toBeDefined();
  expect(user.updatedAt).toBeDefined();
  expect(user.createdAt instanceof Date).toBe(true);
  expect(user.updatedAt instanceof Date).toBe(true);

  await User.deleteOne({ email: 'test2@example.com' });
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
  const userData = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass123'
  };

  const user = new User(userData);
  await user.save();

  const savedUser = await User.findOne({ email: userData.email });
  expect(savedUser).toBeTruthy();
  expect(savedUser.name).toBe(userData.name);
  expect(savedUser.email).toBe(userData.email);

  await User.deleteOne({ email: userData.email });
});

// Test Case 5: Duplicate email prevention
test('Cannot create user with duplicate email', async () => {
  const userData = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'SecurePass123'
  };

  const user1 = new User(userData);
  await user1.save();

  const user2 = new User(userData);
  await expect(user2.save()).rejects.toThrow();

  await User.deleteOne({ email: userData.email });
});
