const statusElement = document.getElementById('status');
const checkButton = document.getElementById('checkBtn');

function runCheck() {
  const now = new Date();
  statusElement.textContent = `Check passed at ${now.toLocaleTimeString()}.`;
}

checkButton?.addEventListener('click', runCheck);
