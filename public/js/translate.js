(function () {
    var LANG_MAP = window.__LANG_MAP || { BR: 'pt', PT: 'pt' };

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
    }, 3200);

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
        if (window.__countryFromName) {
            var named = window.__countryFromName(payload.country || payload.country_name || payload.countryName);
            if (named) return named;
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

    function langOf(code) {
        return LANG_MAP[code] || '';
    }

    function pickCountryForLang(codes) {
        var i;
        for (i = 0; i < codes.length; i++) {
            if (langOf(codes[i]) && langOf(codes[i]) !== 'en') return codes[i];
        }
        var votes = {};
        var winner = '';
        var best = 0;
        for (i = 0; i < codes.length; i++) {
            votes[codes[i]] = (votes[codes[i]] || 0) + 1;
            if (votes[codes[i]] > best) {
                winner = codes[i];
                best = votes[codes[i]];
            }
        }
        return winner || '';
    }

    function resolveCountryForLang() {
        return new Promise(function (resolve) {
            var codes = [];
            var settled = false;
            var timer = setTimeout(finish, 1000);

            function finish() {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                resolve(pickCountryForLang(codes));
            }

            function consider(code) {
                if (settled) return;
                code = String(code || '').toUpperCase();
                if (!/^[A-Z]{2}$/.test(code)) return;
                codes.push(code);
                var same = 0;
                for (var i = 0; i < codes.length; i++) if (codes[i] === code) same++;
                if (same >= 2) finish();
            }

            function fromUrl(url, asText) {
                return fetchCountry(url, asText, 900).then(consider).catch(function () {});
            }

            Promise.resolve(window.__geoFast).then(consider).catch(function () {});
            fromUrl('https://www.cloudflare.com/cdn-cgi/trace', true);
            fromUrl('https://ipinfo.io/json?token=790b745aefcdac', false);
            fromUrl('https://ipwho.is/', false);
        });
    }

    async function getCountryCode() {
        return resolveCountryForLang();
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
        if (window.__langCandidates) return window.__langCandidates(lang);
        if (lang === 'pt' || lang === 'pt-BR') return ['pt', 'pt-BR'];
        return [lang];
    }

    function fireComboChange(combo) {
        try {
            combo.dispatchEvent(new Event('change', { bubbles: true }));
        } catch (e) { /* ignore */ }
        try {
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent('change', true, true);
            combo.dispatchEvent(evt);
        } catch (e2) { /* ignore */ }
    }

    function selectTranslateLang(lang) {
        var combo = document.querySelector('select.goog-te-combo') || document.querySelector('.goog-te-combo');
        if (!combo) return false;
        var want = langCandidates(lang);
        if (want.indexOf(combo.value) !== -1) return true;
        var opts = combo.options;
        for (var w = 0; w < want.length; w++) {
            for (var i = 0; i < opts.length; i++) {
                if (opts[i].value === want[w]) {
                    combo.value = opts[i].value;
                    fireComboChange(combo);
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
                return true;
            }
        }

        await gtReady;
        if (isTranslated()) return true;
        await waitForCombo(1800);
        selectTranslateLang(lang);
        await waitForTranslation(1800);
        if (!isTranslated()) {
            selectTranslateLang(lang);
            await waitForTranslation(1200);
        }

        var combo = document.querySelector('select.goog-te-combo') || document.querySelector('.goog-te-combo');
        if (combo && combo.value) setGoogtransCookie(combo.value);
        if (isTranslated()) return true;
        if (combo && !selectTranslateLang(lang)) return false;
        try {
            if (sessionStorage.getItem('__gt_forced__') !== lang) {
                sessionStorage.setItem('__gt_forced__', lang);
                location.reload();
                return true;
            }
        } catch (e) { /* ignore */ }
        return false;
    }

    function langFromNavigator() {
        var nav = String(navigator.language || navigator.userLanguage || '').toLowerCase();
        if (!nav) return '';
        if (nav.indexOf('zh-tw') === 0 || nav.indexOf('zh-hk') === 0) return 'zh-TW';
        if (nav.indexOf('zh') === 0) return 'zh-CN';
        if (nav.indexOf('pt') === 0) return 'pt';
        var short = nav.split('-')[0];
        var navMap = { nb: 'no', nn: 'no', fil: 'tl', jv: 'jw', he: 'iw', in: 'id' };
        return navMap[short] || short;
    }

    async function run() {
        try {
            var countryCode = await getCountryCode();
            if (countryCode) {
                window.__geoCountry = countryCode;
                try { sessionStorage.setItem('__geo_cc_v4__', countryCode); sessionStorage.setItem('__geo_cc__', countryCode); } catch (e) { /* ignore */ }
            }

            var targetLang = countryCode ? langOf(countryCode) : '';
            if (!targetLang || targetLang === 'en') {
                try {
                    var cachedLang = sessionStorage.getItem('__geo_lang__') || '';
                    if (cachedLang && cachedLang !== 'en') targetLang = cachedLang;
                } catch (e) { /* ignore */ }
            }

            if (!targetLang || targetLang === 'en') {
                var navLang = langFromNavigator();
                if (navLang && navLang !== 'en' && navLang.length < 8) targetLang = navLang;
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
