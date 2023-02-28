function whenDOMReady() {
    "/about/" == location.pathname && (leonus.initPostsChart(), leonus.initTagsChart(), leonus.initCategoriesChart()), "/photos/" == location.pathname && leonus.photos(), leonus.loadBG(), leonus.owoBig(), leonus.swiper(), leonus.comCount(), leonus.indexTalk(), leonus.pagination(), leonus.randomLink(), leonus.switchLine(), leonus.hideLoading(), leonus.setPageTitle(), setTimeout(leonus.topCategoriesBarScroll, 50)
}
whenDOMReady(), document.addEventListener("pjax:send", leonus.showLoading), document.addEventListener("pjax:complete", whenDOMReady), leonus.logInfo(), leonus.sidebar(), leonus.runtime(), leonus.searchSize(), leonus.setPageTitle(), window.onscroll = leonus.percent, window.onresize = () => {
    leonus.searchSize(), "/photos/" == location.pathname && waterfall(".gallery-photos")
}, window.onkeydown = e => {
    123 === e.keyCode && btf.snackbarShow("开发者模式已打开，请遵循GPL协议")
}, document.body.addEventListener("copy", (e => {
    "TEXTAREA" == e.target.tagName && "" == e.target.className || btf.snackbarShow("复制成功~")
})), document.body.addEventListener("paste", (e => {
    btf.snackbarShow("粘贴成功~")
}));