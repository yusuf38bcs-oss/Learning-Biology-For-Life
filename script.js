function runCheck(statusElement, now = new Date()) {
  if (!statusElement) return false;
  statusElement.textContent = `Check passed at ${now.toLocaleTimeString()}.`;
  return true;
}

function initializeCheckButton(doc = globalThis.document) {
  if (!doc) return false;

  const statusElement = doc.getElementById('status');
  const checkButton = doc.getElementById('checkBtn');

  if (!checkButton) return false;

  checkButton.addEventListener('click', () => runCheck(statusElement));
  return true;
}

initializeCheckButton();

if (typeof module !== 'undefined') {
  module.exports = { runCheck, initializeCheckButton };
}
