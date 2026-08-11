const assert = require('assert');
const { registerUser, loginUser, logoutUser, getCurrentUser } = require('../js/auth.js');

function createMockStorage() {
  const store = {};
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      Object.keys(store).forEach((key) => delete store[key]);
    }
  };
}

const storage = createMockStorage();
global.localStorage = storage;

const firstRegister = registerUser({ name: 'Ava', email: 'ava@example.com', password: 'secret123' });
assert.strictEqual(firstRegister.success, true, 'first registration should succeed');
assert.strictEqual(firstRegister.user.email, 'ava@example.com');

const duplicateRegister = registerUser({ name: 'Ava', email: 'ava@example.com', password: 'secret123' });
assert.strictEqual(duplicateRegister.success, false, 'duplicate registration should fail');

const loginSuccess = loginUser({ email: 'ava@example.com', password: 'secret123' });
assert.strictEqual(loginSuccess.success, true, 'login should succeed with correct password');
assert.strictEqual(getCurrentUser().email, 'ava@example.com');

const loginFail = loginUser({ email: 'ava@example.com', password: 'wrong' });
assert.strictEqual(loginFail.success, false, 'login should fail with wrong password');

logoutUser();
assert.strictEqual(getCurrentUser(), null, 'logout should clear current user');

console.log('Auth tests passed');
