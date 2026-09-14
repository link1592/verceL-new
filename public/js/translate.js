(function () {
    // ISO country (IP) → Google Translate code. Hebrew = "iw".
    const LANG_MAP = {
        // English
        'US': 'en', 'GB': 'en', 'CA': 'en', 'AU': 'en', 'NZ': 'en', 'IE': 'en',
        'SG': 'en', 'ZA': 'en', 'NG': 'en', 'KE': 'en', 'GH': 'en', 'UG': 'en',
        'ZW': 'en', 'ZM': 'en', 'MW': 'en', 'BW': 'en', 'NA': 'en', 'LS': 'en',
        'SZ': 'en', 'SL': 'en', 'LR': 'en', 'GM': 'en', 'SS': 'en',
        'JM': 'en', 'TT': 'en', 'BB': 'en', 'BS': 'en', 'BZ': 'en', 'GY': 'en',
        'AG': 'en', 'AI': 'en', 'BM': 'en', 'KY': 'en', 'VG': 'en', 'VI': 'en',
        'TC': 'en', 'MS': 'en', 'KN': 'en', 'LC': 'en', 'VC': 'en', 'GD': 'en',
        'DM': 'en', 'FK': 'en', 'GI': 'en', 'IM': 'en', 'JE': 'en', 'GG': 'en',
        'SH': 'en', 'PN': 'en', 'IO': 'en', 'UM': 'en', 'AS': 'en', 'GU': 'en',
        'MP': 'en', 'PR': 'es', 'FM': 'en', 'MH': 'en', 'PW': 'en', 'WS': 'en',
        'TO': 'en', 'VU': 'en', 'SB': 'en', 'PG': 'en', 'FJ': 'en', 'KI': 'en',
        'NR': 'en', 'TV': 'en', 'NU': 'en', 'CK': 'en', 'TK': 'en', 'NF': 'en',
        'CX': 'en', 'CC': 'en', 'HM': 'en', 'GS': 'en', 'AQ': 'en', 'BV': 'en',
        'MU': 'en', 'SC': 'en', 'IN': 'hi',

        // East / Southeast / South Asia
        'JP': 'ja', 'KR': 'ko', 'KP': 'ko',
        'CN': 'zh-CN', 'TW': 'zh-TW', 'HK': 'zh-TW', 'MO': 'zh-TW',
        'TH': 'th', 'VN': 'vi', 'ID': 'id', 'MY': 'ms', 'BN': 'ms', 'PH': 'tl',
        'LA': 'lo', 'KH': 'km', 'MM': 'my', 'NP': 'ne', 'LK': 'si', 'BD': 'bn',
        'PK': 'ur', 'AF': 'fa', 'MV': 'dv', 'BT': 'en', 'MN': 'mn',

        // Europe
        'FR': 'fr', 'BE': 'fr', 'LU': 'fr', 'MC': 'fr',
        'DE': 'de', 'AT': 'de', 'CH': 'de', 'LI': 'de',
        'IT': 'it', 'SM': 'it', 'VA': 'it',
        'ES': 'es', 'AD': 'ca', 'PT': 'pt', 'NL': 'nl', 'AW': 'nl', 'CW': 'nl',
        'SX': 'nl', 'BQ': 'nl', 'SR': 'nl',
        'PL': 'pl', 'CZ': 'cs', 'SK': 'sk', 'HU': 'hu', 'RO': 'ro', 'MD': 'ro',
        'BG': 'bg', 'GR': 'el', 'CY': 'el', 'AL': 'sq', 'XK': 'sq',
        'HR': 'hr', 'SI': 'sl', 'RS': 'sr', 'ME': 'sr', 'BA': 'bs', 'MK': 'mk',
        'UA': 'uk',
        'LT': 'lt', 'LV': 'lv', 'EE': 'et',
        'SE': 'sv', 'NO': 'no', 'SJ': 'no', 'DK': 'da', 'FO': 'da', 'GL': 'da',
        'FI': 'fi', 'IS': 'is', 'AX': 'sv', 'MT': 'mt',

        // Russian-speaking / CIS
        'RU': 'ru',
        'KZ': 'ru',
        'BY': 'ru',
        'KG': 'ru',

        // Central Asia / Caucasus
        'UZ': 'uz', 'TJ': 'tg', 'TM': 'tk',
        'AZ': 'az', 'AM': 'hy', 'GE': 'ka',

        // Middle East
        'TR': 'tr', 'IL': 'iw', 'IR': 'fa',
        'SA': 'ar', 'AE': 'ar', 'QA': 'ar', 'KW': 'ar', 'BH': 'ar', 'OM': 'ar',
        'YE': 'ar', 'IQ': 'ar', 'SY': 'ar', 'JO': 'ar', 'LB': 'ar', 'PS': 'ar',
        'EG': 'ar', 'LY': 'ar', 'TN': 'ar', 'DZ': 'ar', 'MA': 'ar', 'MR': 'ar',
        'SD': 'ar', 'EH': 'ar', 'DJ': 'ar', 'SO': 'so', 'KM': 'ar',

        // Latin America
        'MX': 'es', 'GT': 'es', 'SV': 'es', 'HN': 'es', 'NI': 'es',
        'CR': 'es', 'PA': 'es', 'CU': 'es', 'DO': 'es', 'CO': 'es', 'VE': 'es',
        'EC': 'es', 'PE': 'es', 'BO': 'es', 'PY': 'es', 'CL': 'es', 'AR': 'es',
        'UY': 'es', 'GQ': 'es',
        'BR': 'pt',

        // Africa (non-English)
        'SN': 'fr', 'CI': 'fr', 'ML': 'fr', 'BF': 'fr', 'NE': 'fr', 'TG': 'fr',
        'BJ': 'fr', 'GN': 'fr', 'GA': 'fr', 'CG': 'fr', 'CD': 'fr', 'CF': 'fr',
        'TD': 'fr', 'CM': 'fr', 'MG': 'fr', 'BI': 'fr', 'RW': 'rw',
        'RE': 'fr', 'YT': 'fr', 'GF': 'fr', 'GP': 'fr', 'MQ': 'fr', 'BL': 'fr',
        'MF': 'fr', 'PM': 'fr', 'NC': 'fr', 'PF': 'fr', 'WF': 'fr', 'TF': 'fr',
        'HT': 'ht', 'AO': 'pt', 'MZ': 'pt', 'GW': 'pt', 'CV': 'pt', 'ST': 'pt',
        'TL': 'pt', 'ET': 'am', 'ER': 'ti', 'TZ': 'sw'
    };

    var overlay = document.createElement('div');
    overlay.id = 'translate-overlay';
    overlay.style.cssText = [
        'position:fixed', 'inset:0', 'z-index:999999',
        'background:rgba(255, 255, 255, 0.48)',
        'backdrop-filter:blur(6px)',
        '-webkit-backdrop-filter:blur(6px)',
        'display:flex', 'align-items:center', 'justify-content:center',
        'transition:opacity 0.4s ease',
        'opacity:1'
    ].join(';');

    var spinner = document.createElement('div');
    spinner.style.cssText = [
        'width:36px', 'height:36px',
        'border:3px solid #e0e0e0',
        'border-top-color:#1877f2',
        'border-radius:50%',
        'animation:_tl_spin 0.7s linear infinite'
    ].join(';');

    var style = document.createElement('style');
    style.textContent = '@keyframes _tl_spin{to{transform:rotate(360deg)}}';

    if (document.head) document.head.appendChild(style);
    overlay.appendChild(spinner);
    if (document.body) document.body.appendChild(overlay);

    function removeOverlay() {
        overlay.style.opacity = '0';
        setTimeout(function () {
            overlay.parentNode && overlay.parentNode.removeChild(overlay);
        }, 420);
    }

    function getGoogtransCookie() {
        var m = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
        return m ? decodeURIComponent(m[1]) : null;
    }

    function setGoogtransCookie(lang) {
        var value = '/en/' + lang;
        // Host-only cookie. Do NOT set Domain on *.vercel.app (public suffix → cookie is dropped).
        document.cookie = 'googtrans=' + value + '; path=/; max-age=31536000; SameSite=Lax';
    }

    function parseCountry(payload) {
        if (!payload) return '';
        if (typeof payload === 'string') {
            var loc = payload.match(/(?:^|\n)loc=([A-Z]{2})/i);
            return loc ? loc[1].toUpperCase() : '';
        }
        var code = payload.country || payload.country_code || payload.countryCode || '';
        code = String(code).toUpperCase();
        return /^[A-Z]{2}$/.test(code) ? code : '';
    }

    async function fetchCountry(url, asText) {
        var res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error('bad status');
        if (asText) return parseCountry(await res.text());
        return parseCountry(await res.json());
    }

    async function getCountryCode() {
        var sources = [
            function () { return fetchCountry('https://ipinfo.io/json?token=5a58a2d85996e3'); },
            function () { return fetchCountry('https://www.cloudflare.com/cdn-cgi/trace', true); },
            function () { return fetchCountry('https://ipwho.is/'); },
            function () { return fetchCountry('https://ipapi.co/json/'); }
        ];

        for (var i = 0; i < sources.length; i++) {
            try {
                var code = await sources[i]();
                if (code) return code;
            } catch (e) { /* try next */ }
        }
        return '';
    }

    function waitForTranslation(timeout) {
        return new Promise(function (resolve) {
            var html = document.documentElement;
            if (/translated-(ltr|rtl)/.test(html.className)) {
                return resolve(true);
            }
            var timer = setTimeout(function () {
                obs.disconnect();
                resolve(/translated-(ltr|rtl)/.test(html.className));
            }, timeout || 8000);
            var obs = new MutationObserver(function () {
                if (/translated-(ltr|rtl)/.test(html.className)) {
                    clearTimeout(timer);
                    obs.disconnect();
                    resolve(true);
                }
            });
            obs.observe(html, { attributes: true, attributeFilter: ['class'] });
        });
    }

    function waitForCombo(timeout) {
        return new Promise(function (resolve) {
            var start = Date.now();
            var found = document.querySelector('.goog-te-combo');
            if (found) return resolve(found);

            var timer = setInterval(function () {
                var el = document.querySelector('.goog-te-combo');
                if (el || Date.now() - start > (timeout || 8000)) {
                    clearInterval(timer);
                    resolve(el || null);
                }
            }, 80);
        });
    }

    function selectTranslateLang(lang) {
        var combo = document.querySelector('.goog-te-combo');
        if (!combo) return false;
        combo.value = lang;
        combo.dispatchEvent(new Event('change'));
        return combo.value === lang || combo.value === lang.toLowerCase();
    }

    function ensureWidgetHost() {
        var host = document.getElementById('google_translate_element');
        if (host) return host;
        host = document.createElement('div');
        host.id = 'google_translate_element';
        document.body.insertBefore(host, document.body.firstChild);
        return host;
    }

    function loadGoogleTranslate() {
        return new Promise(function (resolve) {
            ensureWidgetHost();

            if (window.google && window.google.translate && window.google.translate.TranslateElement) {
                try {
                    new google.translate.TranslateElement({
                        pageLanguage: 'en',
                        autoDisplay: false,
                        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
                    }, 'google_translate_element');
                } catch (e) { /* already inited */ }
                return resolve();
            }

            var settled = false;
            function done() {
                if (settled) return;
                settled = true;
                resolve();
            }

            window.googleTranslateElementInit = function () {
                try {
                    new google.translate.TranslateElement({
                        pageLanguage: 'en',
                        autoDisplay: false,
                        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
                    }, 'google_translate_element');
                } catch (e) { /* ignore */ }
                done();
            };

            var script = document.createElement('script');
            script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            script.onerror = done;
            document.body.appendChild(script);
            setTimeout(done, 8000);
        });
    }

    async function applyLanguage(lang) {
        setGoogtransCookie(lang);

        var existing = getGoogtransCookie();
        if (existing !== '/en/' + lang) {
            setGoogtransCookie(lang);
        }

        await loadGoogleTranslate();
        await waitForCombo(8000);

        selectTranslateLang(lang);
        setTimeout(function () { selectTranslateLang(lang); }, 400);

        await waitForTranslation(8000);
    }

    async function run() {
        try {
            var countryCode = await getCountryCode();
            var targetLang = countryCode ? LANG_MAP[countryCode] : null;

            if (!targetLang || targetLang === 'en') {
                removeOverlay();
                return;
            }

            await applyLanguage(targetLang);
        } catch (e) {
            // Keep the page usable even if translate fails
        } finally {
            removeOverlay();
        }
    }

    if (document.body) {
        run();
    } else {
        document.addEventListener('DOMContentLoaded', run);
    }
})();
