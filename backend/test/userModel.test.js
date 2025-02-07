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
  // Disconnect from the database after tests
  await mongoose.connection.close();
});

test('Password is hashed before saving', async () => {
  const user = new User({ name: 'Test User', email: 'test@example.com', password: 'PlainPassword123' });
  await user.save();

  expect(user.password).not.toBe('PlainPassword123');
  const isMatch = await bcrypt.compare('PlainPassword123', user.password);
  expect(isMatch).toBe(true);

  // Cleanup: Delete the user after the test
  await User.deleteOne({ email: 'test@example.com' });
});
