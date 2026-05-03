const test = require('node:test');
const assert = require('node:assert/strict');
const { runCheck, initializeCheckButton } = require('./script');

test('runCheck updates the status text and returns true', () => {
  const status = { textContent: '' };
  const fakeNow = { toLocaleTimeString: () => '10:30:00 AM' };

  const result = runCheck(status, fakeNow);

  assert.equal(result, true);
  assert.equal(status.textContent, 'Check passed at 10:30:00 AM.');
});

test('runCheck returns false when status element is missing', () => {
  assert.equal(runCheck(null), false);
});

test('initializeCheckButton wires click handler when elements exist', () => {
  const status = { textContent: '' };
  let clickHandler = null;
  const button = {
    addEventListener: (event, handler) => {
      assert.equal(event, 'click');
      clickHandler = handler;
    },
  };

  const mockDoc = {
    getElementById: (id) => {
      if (id === 'status') return status;
      if (id === 'checkBtn') return button;
      return null;
    },
  };

  const initialized = initializeCheckButton(mockDoc);
  assert.equal(initialized, true);
  assert.ok(clickHandler);

  const originalDate = global.Date;
  global.Date = class {
    toLocaleTimeString() {
      return '11:45:00 PM';
    }
  };

  clickHandler();
  assert.equal(status.textContent, 'Check passed at 11:45:00 PM.');
  global.Date = originalDate;
});

test('initializeCheckButton returns false when button does not exist', () => {
  const mockDoc = { getElementById: () => null };
  assert.equal(initializeCheckButton(mockDoc), false);
});
