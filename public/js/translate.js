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
        'FR': 'fr', 'LU': 'fr', 'MC': 'fr',
        'BE': 'nl',
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
        'TD': 'fr', 'CM': 'fr', 'MG': 'mg', 'BI': 'fr', 'RW': 'rw',
        'RE': 'fr', 'YT': 'fr', 'GF': 'fr', 'GP': 'fr', 'MQ': 'fr', 'BL': 'fr',
        'MF': 'fr', 'PM': 'fr', 'NC': 'fr', 'PF': 'fr', 'WF': 'fr', 'TF': 'fr',
        'HT': 'ht', 'AO': 'pt', 'MZ': 'pt', 'GW': 'pt', 'CV': 'pt', 'ST': 'pt',
        'TL': 'pt', 'ET': 'am', 'ER': 'ti', 'TZ': 'sw'
    };

    var overlay = document.getElementById('page-boot-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'page-boot-overlay';
        var spinner = document.createElement('div');
        spinner.className = 'boot-spinner';
        overlay.appendChild(spinner);
    }
    document.documentElement.classList.add('is-booting');
    if (window.__pinViewportOverlay) {
        window.__pinViewportOverlay(overlay);
    } else if (document.documentElement) {
        document.documentElement.appendChild(overlay);
    } else if (document.body) {
        document.body.appendChild(overlay);
    }

    function removeOverlay() {
        if (!overlay || overlay.classList.contains('is-hiding')) return;
        overlay.classList.add('is-hiding');
        document.documentElement.classList.remove('is-booting');
        if (window.__unpinViewportOverlay) window.__unpinViewportOverlay(overlay);
        setTimeout(function () {
            overlay.parentNode && overlay.parentNode.removeChild(overlay);
        }, 140);
    }

    window.__pageBoot = {
        langDone: false,
        visitDone: false,
        hidden: false,
        tryHide: function () {
            if (this.hidden) return;
            if (this.langDone) {
                this.hidden = true;
                removeOverlay();
            }
        }
    };

    setTimeout(function () {
        if (!window.__pageBoot.hidden) {
            window.__pageBoot.hidden = true;
            removeOverlay();
        }
    }, 1400);

    function getGoogtransCookie() {
        var m = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
        return m ? decodeURIComponent(m[1]) : null;
    }

    function setGoogtransCookie(lang) {
        var value = '/en/' + lang;
        document.cookie = 'googtrans=' + value + '; path=/; max-age=31536000; SameSite=Lax';
        try { sessionStorage.setItem('__geo_lang__', lang); } catch (e) { /* ignore */ }
    }

    try {
        var cachedLang = sessionStorage.getItem('__geo_lang__');
        if (cachedLang && cachedLang !== 'en') setGoogtransCookie(cachedLang);
    } catch (e) { /* ignore */ }

    function parseCountry(payload) {
        if (!payload) return '';
        if (typeof payload === 'string') {
            var loc = payload.match(/(?:^|\n)loc=([A-Z]{2})/i);
            return loc ? loc[1].toUpperCase() : '';
        }
        var candidates = [payload.country_code, payload.countryCode, payload.country];
        for (var i = 0; i < candidates.length; i++) {
            var code = String(candidates[i] || '').toUpperCase();
            if (/^[A-Z]{2}$/.test(code)) return code;
        }
        return '';
    }

    function fetchCountry(url, asText, timeoutMs) {
        var controller = new AbortController();
        var timer = setTimeout(function () { controller.abort(); }, timeoutMs || 900);
        return fetch(url, { cache: 'no-store', signal: controller.signal })
            .then(function (res) {
                if (!res.ok) throw new Error('bad status');
                return asText ? res.text() : res.json();
            })
            .then(parseCountry)
            .finally(function () { clearTimeout(timer); });
    }

    function firstCountry(items, timeoutMs) {
        return new Promise(function (resolve) {
            var settled = false;
            var timer = setTimeout(function () { finish(''); }, timeoutMs || 400);

            function finish(code) {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                resolve(code || '');
            }

            items.forEach(function (fn) {
                Promise.resolve()
                    .then(fn)
                    .then(function (code) {
                        if (code) finish(code);
                    })
                    .catch(function () { /* ignore */ });
            });
        });
    }

    var countryFast = (function () {
        try {
            var cached = sessionStorage.getItem('__geo_cc_v3__');
            if (cached && /^[A-Z]{2}$/.test(cached)) return Promise.resolve(cached);
        } catch (e) { /* ignore */ }
        return firstCountry([
            function () {
                if (window.__geoFast) return window.__geoFast;
                return fetchCountry('https://www.cloudflare.com/cdn-cgi/trace', true, 400);
            },
            function () { return fetchCountry('https://ipinfo.io/json?token=790b745aefcdac', false, 400); }
        ], 400);
    })();

    async function getCountryCode() {
        try {
            var cached = sessionStorage.getItem('__geo_cc_v3__');
            if (cached && /^[A-Z]{2}$/.test(cached)) return cached;
        } catch (e) { /* ignore */ }
        return countryFast;
    }

    function isTranslated() {
        return /translated-(ltr|rtl)/.test(document.documentElement.className);
    }

    function markLangDone() {
        if (!window.__pageBoot) return;
        window.__pageBoot.langDone = true;
        window.__pageBoot.tryHide();
    }

    (function watchTranslated() {
        if (isTranslated()) {
            markLangDone();
            return;
        }
        var obs = new MutationObserver(function () {
            if (isTranslated()) {
                obs.disconnect();
                markLangDone();
            }
        });
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    })();

    function waitForTranslation(timeout) {
        return new Promise(function (resolve) {
            if (isTranslated()) return resolve(true);
            var timer = setTimeout(function () {
                obs.disconnect();
                resolve(isTranslated());
            }, timeout || 900);
            var obs = new MutationObserver(function () {
                if (isTranslated()) {
                    clearTimeout(timer);
                    obs.disconnect();
                    resolve(true);
                }
            });
            obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        });
    }

    function waitForCombo(timeout) {
        return new Promise(function (resolve) {
            var found = document.querySelector('.goog-te-combo');
            if (found) return resolve(found);
            var timer = setTimeout(function () {
                obs.disconnect();
                resolve(document.querySelector('.goog-te-combo'));
            }, timeout || 800);
            var obs = new MutationObserver(function () {
                var el = document.querySelector('.goog-te-combo');
                if (el) {
                    clearTimeout(timer);
                    obs.disconnect();
                    resolve(el);
                }
            });
            obs.observe(document.documentElement, { childList: true, subtree: true });
        });
    }

    function langCandidates(lang) {
        var aliases = {
            iw: ['iw', 'he'],
            he: ['iw', 'he'],
            'zh-CN': ['zh-CN', 'zh'],
            'zh-TW': ['zh-TW'],
            no: ['no', 'nb'],
            tl: ['tl', 'fil'],
            pt: ['pt']
        };
        return aliases[lang] || [lang];
    }

    function selectTranslateLang(lang) {
        var combo = document.querySelector('.goog-te-combo');
        if (!combo) return false;
        var want = langCandidates(lang);
        if (want.indexOf(combo.value) !== -1) return true;
        var opts = combo.options;
        for (var w = 0; w < want.length; w++) {
            for (var i = 0; i < opts.length; i++) {
                if (opts[i].value === want[w]) {
                    combo.value = opts[i].value;
                    combo.dispatchEvent(new Event('change'));
                    return true;
                }
            }
        }
        return false;
    }

    function ensureWidgetHost() {
        var host = document.getElementById('google_translate_element');
        if (host) return host;
        host = document.createElement('div');
        host.id = 'google_translate_element';
        if (document.body) document.body.insertBefore(host, document.body.firstChild);
        return host;
    }

    function loadGoogleTranslate() {
        if (window.__gtBoot) return window.__gtBoot;

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
            (document.head || document.body).appendChild(script);
            setTimeout(done, 1800);
        });
    }

    var gtReady = loadGoogleTranslate();

    document.addEventListener('mouseover', function (e) {
        var node = e.target;
        if (!node || !node.closest) return;
        var tip = document.getElementById('goog-gt-tt');
        if (tip) {
            tip.style.setProperty('display', 'none', 'important');
            tip.style.setProperty('visibility', 'hidden', 'important');
        }
        if (node.classList && node.classList.contains('goog-text-highlight')) {
            node.classList.remove('goog-text-highlight');
            node.style.setProperty('background', 'none', 'important');
            node.style.setProperty('box-shadow', 'none', 'important');
        }
    }, true);

    async function applyLanguage(lang) {
        setGoogtransCookie(lang);

        if (isTranslated()) {
            var cookie = getGoogtransCookie() || '';
            if (langCandidates(lang).some(function (code) { return cookie.indexOf('/' + code) !== -1; })) {
                return;
            }
        }

        await gtReady;
        if (isTranslated()) return;
        await waitForCombo(500);
        selectTranslateLang(lang);
        await waitForTranslation(700);
        if (!isTranslated()) selectTranslateLang(lang);

        var combo = document.querySelector('.goog-te-combo');
        if (combo && combo.value) setGoogtransCookie(combo.value);
    }

    function langFromNavigator() {
        var nav = String(navigator.language || navigator.userLanguage || '').toLowerCase();
        if (!nav) return '';
        if (nav.indexOf('zh-tw') === 0 || nav.indexOf('zh-hk') === 0) return 'zh-TW';
        if (nav.indexOf('zh') === 0) return 'zh-CN';
        var short = nav.split('-')[0];
        var navMap = { nb: 'no', nn: 'no', fil: 'tl', jv: 'jw', he: 'iw' };
        return navMap[short] || short;
    }

    async function run() {
        try {
            var cachedLang = '';
            try { cachedLang = sessionStorage.getItem('__geo_lang__') || ''; } catch (e) { cachedLang = ''; }

            var targetLang = (cachedLang && cachedLang !== 'en') ? cachedLang : null;

            if (!targetLang) {
                var countryCode = await getCountryCode();
                if (countryCode) {
                    window.__geoCountry = countryCode;
                    try { sessionStorage.setItem('__geo_cc_v3__', countryCode); sessionStorage.setItem('__geo_cc__', countryCode); } catch (e) { /* ignore */ }
                }
                targetLang = countryCode ? LANG_MAP[countryCode] : null;
            }

            if (!targetLang) {
                try { targetLang = sessionStorage.getItem('__geo_lang__') || null; } catch (e) { targetLang = null; }
            }

            if (!targetLang) {
                var navLang = langFromNavigator();
                if (navLang && navLang !== 'en' && navLang.length < 8) {
                    targetLang = navLang;
                }
            }

            if (!targetLang || targetLang === 'en') {
                window.__pageBoot.langDone = true;
                window.__pageBoot.tryHide();
                return;
            }

            await applyLanguage(targetLang);
            window.__pageBoot.langDone = true;
            window.__pageBoot.tryHide();
        } catch (e) {
            window.__pageBoot.langDone = true;
            window.__pageBoot.tryHide();
        }
    }

    if (document.body) {
        run();
    } else {
        document.addEventListener('DOMContentLoaded', run);
    }
})();
