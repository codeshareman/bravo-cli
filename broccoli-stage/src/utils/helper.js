/**
 * Helper.js
 * 工具函数
 */
const Helper = {
    timerEnd: null,
    timerStart: null
};

String.prototype.trim = function() {
    return this.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
};

function getUA() {
    return (function() {
        let u = navigator.userAgent;
        let app = navigator.appVersion;
        return {
            trident: u.indexOf("Trident") > -1, // IE内核
            presto: u.indexOf("Presto") > -1, // opera内核
            webKit: u.indexOf("AppleWebKit") > -1, // 苹果、谷歌内核
            gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") === -1, // 火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
            isIos: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
            isAndroid: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, // android终端或者uc浏览器
            iPhone: u.indexOf("iPhone") > -1, // 是否为iPhone或者QQHD浏览器
            iPad: u.indexOf("iPad") > -1, // 是否iPad
            weixin: u.indexOf("MicroMessenger") > -1, // 是否微信
            qq: u.match(/\sQQ/i) === " qq", // 是否QQ
            weibo: u.indexOf("weibo") > -1, //  是否sina weibo
            inNative: u.indexOf("iting") > -1, //  是否xmly app
            version: app
        };
    })();
}

function getLocal() {
    return (function() {
        let location = window.location;
        return {
            host: location.host,
            origin: location.origin,
            path: location.pathname,
            href: location.href,
            search: location.search,
            protocol: location.protocol,
            isTest: /test/.test(location.host),
            isDev: !/ximalaya/.test(location.host)
        };
    })();
}
const ua = {
    ...getUA()
};
const local = {
    ...getLocal()
};

/* ua场景信息 */
Helper.UA = ua;

/* url信息 */
Helper.LOCAL = local;

Helper.config = {
    static: "http://static2.test.ximalaya.com",
    mstatic: "http://mstatic.test.ximalaya.com",
    xmcdn: "http://s1.xmcdn.com",
    projectCdnUrl: Helper.LOCAL.isTest
        ? "http://static2.test.ximalaya.com/lib/hybrid-listening/last/dist/"
        : "http://s1.xmcdn.com/lib/hybrid-listening/last/dist/",
    crossImgUrl: Helper.LOCAL.isTest
        ? "http://static2.test.ximalaya.com/lib/common/last/assets/cross-img/"
        : "http://s1.xmcdn.com/lib/common/last/assets/cross-img/",
    MSiteLogin: Helper.LOCAL.isTest
        ? "http://m.test.ximalaya.com/login?fromUri="
        : "https://m.ximalaya.com/login?fromUri="
};

// Helper.timerEnd = Helper.timerStart = null

/**
 * formDataJSONparse
 * formData 转queryString
 * @param {JSON} json
 */
Helper.formDataJSONparse = function(json) {
    let res = "";
    for (var key in json) {
        res +=
            encodeURIComponent(key) + "=" + encodeURIComponent(json[key]) + "&";
    }
    return res.replace(/&$/, "");
};

/**
 * cookie
 * cookie存取操作
 * @param {String} name
 * @param {String} value
 * @param {Object} options
 */
Helper.cookie = function(name, value, options) {
    if (typeof value !== "undefined") {
        options = options || {};
        if (value === null) {
            value = "";
            options = Object.assgin({}, options);
            options.expires = -1;
        }
        var expires = "";
        if (
            options.expires &&
            (typeof options.expires === "number" || options.expires.toUTCString)
        ) {
            var date;
            if (typeof options.expires === "number") {
                date = new Date();
                date.setTime(date.getTime() + options.expires * 1000);
            } else {
                date = options.expires;
            }
            expires = "; expires=" + date.toUTCString();
        }
        var path = options.path ? "; path=" + options.path : "";
        var domain = options.domain ? "; domain=" + options.domain : "";
        var secure = options.secure ? "; secure" : "";
        // document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('')
        document.cookie = [
            name,
            "=",
            value,
            expires,
            path,
            domain,
            secure
        ].join("");
    } else {
        var cookieValue = null;
        if (document.cookie && document.cookie !== "") {
            var cookies = document.cookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
                var cookie = (cookies[i] + "").trim();
                if (cookie.substring(0, name.length + 1) === name + "=") {
                    cookieValue = decodeURIComponent(
                        cookie.substring(name.length + 1)
                    );
                    break;
                }
            }
        }
        return cookieValue;
    }
};

/**
 * getUid
 * 获取uid
 */
Helper.getUid = function() {
    let id = null;
    let isDev = this.LOCAL.isTest;
    let token = this.cookie((isDev ? 4 : 1) + "&_token");

    if (token) {
        id = token.split("&")[0];
    }
    return id;
};

/** 获取浏览器参数 */
Helper.getSearchParams = function(name) {
    let reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if(r != null)return  unescape(r[2]); return null;
}

/**
 * getToken
 * 获取cookie token
 */
Helper.getToken = function() {
    let token = null;
    let isDev = this.LOCAL.isTest;
    token = this.cookie((isDev ? 4 : 1) + "&_token");
    return token;
};

/**
 * getBlobBydataURI
 * @param {base64} dataURI
 * @param {String} type
 */
/* base64转二进制 */
Helper.getBlobBydataURI = function(dataURI, type) {
    var binary = window.atob(dataURI.split(",")[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: type });
};

/* 获取iframe返回数据 */
Helper.getFrameResponse = function(frame) {
    let doc = null;
    let responseText = "";
    try {
        if (frame.contentWindow) {
            doc = frame.contentWindow.document;
        }
    } catch (err) {
        console.log("cannot get iframe.contentWindow document: " + err);
    }
    if (!doc) {
        try {
            doc = frame.contentDocument
                ? frame.contentDocument
                : frame.document;
        } catch (err) {
            console.log("cannot get iframe.contentDocument: " + err);
            doc = frame.document;
        }
    }
    // 获取根节点
    let docRoot = doc.body ? doc.body : doc.documentElement;
    let pre = doc.getElementsByTagName("pre")[0];
    let b = doc.getElementsByTagName("body")[0];

    if (pre) {
        responseText = pre.textContent ? pre.textContent : pre.innerText;
    } else if (b) {
        responseText = b.textContent ? b.textContent : b.innerText;
    }
    return responseText;
};

/**
 * setMetaTitle
 * 单页应用设置页面title
 * @param {String} title
 */
Helper.setMetaTitle = function(title) {
    var env = this.LOCAL.isTest ? this.config.static : this.config.xmcdn;
    document.title = title;
    let iframe = document.createElement("iframe");
    iframe.style.visibility = "hidden";
    // 替换成站标favicon路径或者任意存在的较小的图片即可
    iframe.setAttribute(
        "src",
        env + "/lib/hybrid_grade/last/dist/static/img/v-blue.png"
    );
    let iframeCallback = function() {
        setTimeout(function() {
            iframe.removeEventListener("load", iframeCallback);
            document.body.removeChild(iframe);
        }, 0);
    };
    iframe.addEventListener("load", iframeCallback);
    document.body.appendChild(iframe);
};

/**
 * toast
 * toast组件
 * @param {String} txt弹出文案
 * @param {Number} 动画时间
 */
Helper.toast = function(txt, t) {
    function styleExtend(target, options) {
        Object.assign(target, options);
    }
    var mToast, mTxt;
    var mToastStyles = {
        position: "fixed",
        width: "auto",
        bottom: "350px",
        left: "0",
        right: "0",
        textAlign: "center",
        opacity: "0",
        transition: "all 0.8s",
        webkitTransition: "all 0.8s",
        zIndex: "999999999",
    };
    var mTxtStyles = {
        fontSize: "14px",
        display: "inline-block",
        background: "rgba(0, 0, 0, 0.86)",
        color: "#fff",
        padding: "20px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        borderRadius: "5px",
        maxWidth: "95%"
    };
    mToast = document.querySelector("#toast");
    if (mToast !== null) {
        document.body.removeChild(mToast);
    }
    mToast = document.createElement("div");
    mTxt = document.createElement("span");
    mToast.id = "toast";
    mTxt.id = "toast-txt";

    styleExtend(mToast.style, mToastStyles);
    styleExtend(mTxt.style, mTxtStyles);
    mTxt.innerText = txt;
    mToast.appendChild(mTxt);

    document.body.appendChild(mToast);
    Helper.timerStart = setTimeout(() => {
        styleExtend(mToast.style, {
            opacity: 1,
            zIndex: 999999
        });
    }, 0);

    Helper.timerEnd = setTimeout(() => {
        styleExtend(mToast.style, {
            opacity: 0,
            zIndex: -999999
        });
    }, t || 3000);
};

/**
 * checkAliIdCard
 * 校验idcard是否被占用
 * @param {String} idcard
 * @param {String} cardType
 */
Helper.checkAliIdCard = function(id, cardType = "二代身份证") {
    if (id === "") {
        return false;
    }
    let formData = new FormData();
    formData.append("card_id", id);
    formData.append("card_type", cardType);
    this.$http.addv
        .checkIdCard(formData)
        .then(res => {
            if (res.status === 200) {
                if (res.data.ret === 1) {
                    if (res.data.data.isValidCard) {
                        this.validAliIdCard = true;
                        this.needResetAliIdCard = false;
                    } else {
                        this.validAliIdCard = false;
                        this.needResetAliIdCard = true;
                        Helper.toast("该身份证号已认证，请重新输入");
                    }
                }
            }
        })
        .catch(err => {
            this.validAliIdCard = true;
            this.needResetAliIdCard = false;
        });
};

// 获取浏览器'?'后的参数
Helper.getUrlQueryOption = function(url) {
    var queryOpts = {};
    if (url.indexOf("?") !== -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            queryOpts[strs[i].split("=")[0]] = strs[i].split("=")[1];
        }
    }
    return queryOpts;
};

// 比较版本
Helper.compareVersion = function(vStr = "0.0.0", appVersion) {
    let vStrArr = vStr.split(".");
    let appArr = appVersion.split(".");
    let n1 = 0;
    let n2 = 0;
    function formatVersion(arr = ["0", "0", "0"]) {
        return arr[0] * 10000 + arr[1] * 100 + arr[2];
    }
    n1 = formatVersion(vStrArr);
    n2 = formatVersion(appArr);
    if (n1 > n2) {
        return 1;
    } else if (n1 === n2) {
        return 0;
    } else {
        return -1;
    }
};

/**
 * draProcess  canvas绘制环形进度条
 * @author nardo.li
 * @created 2017-07-17
 * @param {*} canvas
 * @param {*} process
 * @param {*} width
 * @param {*} height
 * @param {*} direct 旋转方向
 */
Helper.drawProcess = function(canvas, process, width, height, direct) {
    //   console.log(canvas)
    var CANVAS_COLOR = {
        left: "#FFB43B",
        right: "#FF6D5C"
    };
    var context = canvas.getContext("2d");
    if (window.devicePixelRatio) {
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.height = height * window.devicePixelRatio;
        canvas.width = width * window.devicePixelRatio;
    }
    context.scale(window.devicePixelRatio, window.devicePixelRatio);

    context.clearRect(0, 0, 60, 60);

    /* 开始画一个灰色的圆  */
    context.beginPath();
    /* 坐标移动到圆心  */
    context.moveTo(60, 60);
    // 画圆,圆心是60,60,半径60,从角度0开始,画到2PI结束,最后一个参数是方向顺时针还是逆时针
    context.arc(60, 60, 60, 0, Math.PI * 2, false);
    context.closePath();
    // 填充颜色
    context.fillStyle = "#F2F2F2";
    context.fill();

    window._timer = {};

    function rewriteCanvas(n) {
        window._timer[direct] = setInterval(() => {
            if (n > process) {
                // console.log(n)
                clearInterval(window._timer[direct]);
            } else {
                draw(n);
                n += 0.01;
            }
        }, 15);
    }

    function draw(n) {
        // 画进度
        context.beginPath();
        // 画扇形的时候这步很重要,画笔不在圆心画出来的不是扇形
        context.moveTo(60, 60);
        // 跟上面的圆唯一的区别在这里,不画满圆,画个扇形
        context.arc(
            60,
            60,
            60,
            -Math.PI / 2,
            -Math.PI / 2 + Math.PI * 2 * n,
            false
        );
        context.closePath();
        context.fillStyle = CANVAS_COLOR[direct];
        context.fill();

        // 画内部空白
        context.beginPath();
        context.moveTo(60, 60);
        context.arc(60, 60, 52, 0, Math.PI * 2, true);
        context.closePath();
        context.fillStyle = "rgba(255,255,255,1)";
        context.fill();
    }
    rewriteCanvas(0);
};

Helper.prePageCountDown = function(leftTime) {
    // var interval = 1000
    // function showCountDown (leftTime) {
    var leftsecond = parseInt(leftTime / 1000);
    // console.log('leftsecond', leftsecond)
    var day = Math.floor(leftsecond / (60 * 60 * 24));
    // console.log('day', day)
    var hour = Math.floor((leftsecond - day * 24 * 60 * 60) / 3600);
    // console.log('hour', hour)

    var minute = Math.floor(
        (leftsecond - day * 24 * 60 * 60 - hour * 3600) / 60
    );
    // console.log('min', minute)

    var second = Math.floor(
        leftsecond - day * 24 * 60 * 60 - hour * 3600 - minute * 60
    );
    // console.log('second', second)

    if (hour < 10) {
        hour = `0${hour}`;
    }
    if (minute < 10) {
        minute = `0${minute}`;
    }
    if (second < 10) {
        second = `0${second}`;
    }
    var _timeObj = {
        hour: hour + "",
        minute: minute + "",
        second: second + ""
    };
    return _timeObj;
};

Helper.getQuery = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2];
    return null;
};

export default Helper;
