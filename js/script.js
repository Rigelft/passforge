let passwordHistory = JSON.parse(localStorage.getItem('passwordHistory')) || [];
const itemsPerPage = 5;
let currentPage = 1;

function generatePassword() {
    const length = document.getElementById('passwordLength').value;
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;
    const accountName = document.getElementById('accountName').value;

    let chars = 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+{}[]|:;<>,.?/~';

    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    document.getElementById('passwordOutput').innerText = password;
    updateStrengthMeter(password);
    addToHistory(password, accountName);
    copyToClipboard(password);
    showMessage('✅ Mot de passe copié !');
}

function updateLengthValue(val) {
    document.getElementById('lengthValue').innerText = val;
}

function updateStrengthMeter(password) {
    const strength = calculatePasswordStrength(password);
    const strengthMeter = document.getElementById('strengthMeter');
    const strengthText = document.getElementById('strengthText');

    strengthMeter.style.width = `${strength}%`;
    if (strength < 33) {
        strengthMeter.style.backgroundColor = 'var(--warning-color)';
        strengthText.innerText = 'Faible';
    } else if (strength < 66) {
        strengthMeter.style.backgroundColor = 'var(--warning-color)';
        strengthText.innerText = 'Moyen';
    } else {
        strengthMeter.style.backgroundColor = 'var(--success-color)';
        strengthText.innerText = 'Fort';
    }
}

function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    return strength;
}

function addToHistory(password, accountName) {
    passwordHistory.unshift({password: password, accountName: accountName});
    localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyContainer = document.getElementById('passwordHistory');
    historyContainer.innerHTML = '';
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = passwordHistory.slice(start, end);

    pageItems.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        const truncatedPassword = item.password.length > 16 ? item.password.substring(0, 16) + '...' : item.password;
        historyItem.innerHTML = `
            <span class="history-password">${truncatedPassword}</span>
            <div class="history-actions">
                <button onclick="copyHistoryPassword(${start + index})"><i class="fas fa-copy"></i></button>
                <button onclick="revealPassword(${start + index})"><i class="fas fa-eye"></i></button>
                <button onclick="confirmDeletePassword(${start + index})" style="color: var(--danger-color);"><i class="fas fa-trash"></i></button>
            </div>
        `;
        historyContainer.appendChild(historyItem);
    });

    updatePaginationButtons();
}

function copyHistoryPassword(index) {
    const password = passwordHistory[index].password;
    copyToClipboard(password);
    showMessage('✅ Mot de passe copié !');
}

function revealPassword(index) {
    const password = passwordHistory[index];
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <span class="popup-close" onclick="closePopup(this)"><i class="fas fa-times"></i></span>
            <h3 style="margin-top: 18px;">${password.accountName}</h3>
            <p style="margin-top: 10px;">Mot de passe: ${password.password}</p>
        </div>
    `;
    document.body.appendChild(popup);
    document.querySelector('section.hero').classList.add('blur');
    document.querySelector('header').classList.add('blur');
    popup.addEventListener('click', function(event) {
        if (event.target === this) {
            closePopup(this);
        }
    });
}

function confirmDeletePassword(index) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
            <span class="popup-close" onclick="closePopup(this)"><i class="fas fa-times"></i></span>
            <h3 style="margin-top: 18px;">Voulez-vous vraiment supprimer ce mot de passe ?</h3>
            <button class="generate-button" onclick="deleteHistoryPassword(${index}, this)">Oui</button>
        </div>
    `;
    document.body.appendChild(popup);
    document.querySelector('section.hero').classList.add('blur');
    document.querySelector('header').classList.add('blur');
    popup.addEventListener('click', function(event) {
        if (event.target === this) {
            closePopup(this);
        }
    });
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            deleteHistoryPassword(index, popup);
        }
    });
}

function deleteHistoryPassword(index, btn) {
    passwordHistory.splice(index, 1);
    localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));
    updateHistoryDisplay();
    closePopup(btn);
    showMessage('❌ Mot de passe supprimé !');
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
}

function showMessage(message) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.classList.add('show');
    setTimeout(() => {
        messageElement.classList.remove('show');
    }, 2000);
}

function closePopup(element) {
    const popup = element.closest('.popup');
    popup.remove();
    document.querySelector('section.hero').classList.remove('blur');
    document.querySelector('header').classList.remove('blur');
}

function changePage(direction) {
    currentPage += direction;
    updateHistoryDisplay();
}

function updatePaginationButtons() {
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage * itemsPerPage >= passwordHistory.length;
}

updateHistoryDisplay();