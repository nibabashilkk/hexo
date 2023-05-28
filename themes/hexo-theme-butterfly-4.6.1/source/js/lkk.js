"use strict";
var lkk = {
    switchDarkMode: () => {
        "light" == ("dark" === document.documentElement.getAttribute("data-theme") ? "dark" : "light") ? (activateDarkMode(), saveToLocal.set("theme", "dark", 2), void 0 !== GLOBAL_CONFIG.Snackbar && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night)) : (activateLightMode(), saveToLocal.set("theme", "light", 2), void 0 !== GLOBAL_CONFIG.Snackbar && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day)), "function" == typeof utterancesTheme && utterancesTheme(), "object" === ("undefined" == typeof FB ? "undefined" : _typeof(FB)) && window.loadFBComment(), window.DISQUS && document.getElementById("disqus_thread").children.length && setTimeout((function () {
            return window.disqusReset()
        }), 200)
    },
    getCoverPath: (path) => {
        return path.substr(2, 9)
    },
    saveData: (e, n) => {
        localStorage.setItem(e, JSON.stringify({
            time: Date.now(),
            data: n
        }))
    },
    loadData: (e, n) => {
        let t = JSON.parse(localStorage.getItem(e));
        if (t) {
            let e = Date.now() - t.time;
            if (-1 < e && e < 6e4 * n) return t.data
        }
        return 0
    },
    talkTime: null,
    indexTalk: () => {
        if (lkk.talkTime && (clearInterval(lkk.talkTime), lkk.talkTime = null), !document.getElementById("bber-talk")) return;

        function e(e) {
            let n = "";
            e.forEach(((e, t) => {
                n += `<li class="item item-${t+1}">${e.content}</li>`,console.log(e.content)
            }));
            let t = document.querySelector("#bber-talk .talk-list");
            t.innerHTML = n, lkk.talkTime = setInterval((() => {
                t.appendChild(t.children[0])
            }), 3e3)
        }
        let n = lkk.loadData("talk", 10);
        n ? e(n) : fetch("http://43.143.231.27:8081/essay/get").then((e => e.json())).then((n => {e(n)
            , lkk.saveData("talk", n)
        }))
    },
    swiper: () => {
        var swiper = new Swiper('.blog-slider', {
            passiveListeners: true,
            spaceBetween: 30,
            effect: 'fade',
            loop: true,
            autoplay: {
                disableOnInteraction: true,
                delay: 3000
            },
            mousewheel: true,
            pagination: {
                el: '.blog-slider__pagination',
                clickable: true,
            }
        });

        var comtainer = document.getElementById('swiper_container');
        if (comtainer !== null) {
            comtainer.onmouseenter = function () {
                swiper.autoplay.stop();
            };
            comtainer.onmouseleave = function () {
                swiper.autoplay.start();
            }
        } else {}
    },
    runtime: () => {
        var e = function (e) {
            return e > 9 ? e : "0" + e
        };
        let n = new Date("2022/10/01 00:00:00").getTime(),
            t = (new Date).getTime(),
            o = Math.round((t - n) / 1e3),
            a = "本站已运行：";
        o >= 86400 && (a += e(parseInt(o / 86400)) + " 天 ", o %= 86400), o >= 3600 && (a += e(parseInt(o / 3600)) + " 时 ", o %= 3600), o >= 60 && (a += e(parseInt(o / 60)) + " 分 ", o %= 60), o >= 0 && (a += e(o) + " 秒");
        let l = document.getElementById("runtime");
        l && (l.innerHTML = a), setTimeout(lkk.runtime, 1e3)
    },
    getComment: () => {
        var getApi = "https://xcx.xiaoliu.life/comment/get/";
        var url = window.location.url;
        console.log(url);
        var urlBase64 = window.btoa(url);
        console.log(getApi + urlBase64);
        fetch(getApi + urlBase64).then(res => console.log(res));
    }
}
window.onkeydown = e => {
    123 === e.keyCode && btf.snackbarShow("开发者模式已打开，请遵循GPL协议")
}

/*适配pjax*/
function whenDOMReady() {
    lkk.indexTalk();
    lkk.swiper();
    lkk.runtime();
}

whenDOMReady()
document.addEventListener("pjax:complete", whenDOMReady)
