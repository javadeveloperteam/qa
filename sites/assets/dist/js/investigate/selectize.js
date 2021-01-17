/*! selectize.js - v0.13.0 | https://github.com/selectize/selectize.js | Apache License (v2) */

!function(e, t) {
    "function" == typeof define && define.amd ? define("sifter", t) : "object" == typeof exports ? module.exports = t() : e.Sifter = t()
}(this, function() {
    function e(e, t) {
        this.items = e,
        this.settings = t || {
            diacritics: !0
        }
    }
    e.prototype.tokenize = function(e) {
        if (!(e = a(String(e || "").toLowerCase())) || !e.length)
            return [];
        for (var t, n, i = [], o = e.split(/ +/), s = 0, r = o.length; s < r; s++) {
            if (t = l(o[s]),
            this.settings.diacritics)
                for (n in p)
                    p.hasOwnProperty(n) && (t = t.replace(new RegExp(n,"g"), p[n]));
            i.push({
                string: o[s],
                regex: new RegExp(t,"i")
            })
        }
        return i
    }
    ,
    e.prototype.iterator = function(e, t) {
        var n = r(e) ? Array.prototype.forEach || function(e) {
            for (var t = 0, n = this.length; t < n; t++)
                e(this[t], t, this)
        }
        : function(e) {
            for (var t in this)
                this.hasOwnProperty(t) && e(this[t], t, this)
        }
        ;
        n.apply(e, [t])
    }
    ,
    e.prototype.getScoreFunction = function(e, t) {
        var o, s, r, a;
        e = this.prepareSearch(e, t),
        s = e.tokens,
        o = e.options.fields,
        r = s.length,
        a = e.options.nesting;
        function l(e, t) {
            var n;
            return !e || -1 === (n = (e = String(e || "")).search(t.regex)) ? 0 : (e = t.string.length / e.length,
            0 === n && (e += .5),
            e)
        }
        var p, c = (p = o.length) ? 1 === p ? function(e, t) {
            return l(g(t, o[0], a), e)
        }
        : function(e, t) {
            for (var n = 0, i = 0; n < p; n++)
                i += l(g(t, o[n], a), e);
            return i / p
        }
        : function() {
            return 0
        }
        ;
        return r ? 1 === r ? function(e) {
            return c(s[0], e)
        }
        : "and" === e.options.conjunction ? function(e) {
            for (var t, n = 0, i = 0; n < r; n++) {
                if ((t = c(s[n], e)) <= 0)
                    return 0;
                i += t
            }
            return i / r
        }
        : function(e) {
            for (var t = 0, n = 0; t < r; t++)
                n += c(s[t], e);
            return n / r
        }
        : function() {
            return 0
        }
    }
    ,
    e.prototype.getSortFunction = function(e, n) {
        var t, i, o, s, r, a, l, p = this, c = !(e = p.prepareSearch(e, n)).query && n.sort_empty || n.sort, d = function(e, t) {
            return "$score" === e ? t.score : g(p.items[t.id], e, n.nesting)
        }, u = [];
        if (c)
            for (t = 0,
            i = c.length; t < i; t++)
                !e.query && "$score" === c[t].field || u.push(c[t]);
        if (e.query) {
            for (l = !0,
            t = 0,
            i = u.length; t < i; t++)
                if ("$score" === u[t].field) {
                    l = !1;
                    break
                }
            l && u.unshift({
                field: "$score",
                direction: "desc"
            })
        } else
            for (t = 0,
            i = u.length; t < i; t++)
                if ("$score" === u[t].field) {
                    u.splice(t, 1);
                    break
                }
        for (a = [],
        t = 0,
        i = u.length; t < i; t++)
            a.push("desc" === u[t].direction ? -1 : 1);
        return (s = u.length) ? 1 === s ? (o = u[0].field,
        r = a[0],
        function(e, t) {
            return r * h(d(o, e), d(o, t))
        }
        ) : function(e, t) {
            for (var n, i = 0; i < s; i++)
                if (n = u[i].field,
                n = a[i] * h(d(n, e), d(n, t)))
                    return n;
            return 0
        }
        : null
    }
    ,
    e.prototype.prepareSearch = function(e, t) {
        if ("object" == typeof e)
            return e;
        var n = (t = s({}, t)).fields
          , i = t.sort
          , o = t.sort_empty;
        return n && !r(n) && (t.fields = [n]),
        i && !r(i) && (t.sort = [i]),
        o && !r(o) && (t.sort_empty = [o]),
        {
            options: t,
            query: String(e || "").toLowerCase(),
            tokens: this.tokenize(e),
            total: 0,
            items: []
        }
    }
    ,
    e.prototype.search = function(e, n) {
        var i, o, t = this, s = this.prepareSearch(e, n);
        return n = s.options,
        e = s.query,
        o = n.score || t.getScoreFunction(s),
        e.length ? t.iterator(t.items, function(e, t) {
            i = o(e),
            (!1 === n.filter || 0 < i) && s.items.push({
                score: i,
                id: t
            })
        }) : t.iterator(t.items, function(e, t) {
            s.items.push({
                score: 1,
                id: t
            })
        }),
        (t = t.getSortFunction(s, n)) && s.items.sort(t),
        s.total = s.items.length,
        "number" == typeof n.limit && (s.items = s.items.slice(0, n.limit)),
        s
    }
    ;
    var h = function(e, t) {
        return "number" == typeof e && "number" == typeof t ? t < e ? 1 : e < t ? -1 : 0 : (e = n(String(e || "")),
        (t = n(String(t || ""))) < e ? 1 : e < t ? -1 : 0)
    }
      , s = function(e, t) {
        for (var n, i, o = 1, s = arguments.length; o < s; o++)
            if (i = arguments[o])
                for (n in i)
                    i.hasOwnProperty(n) && (e[n] = i[n]);
        return e
    }
      , g = function(e, t, n) {
        if (e && t) {
            if (!n)
                return e[t];
            for (var i = t.split("."); i.length && (e = e[i.shift()]); )
                ;
            return e
        }
    }
      , a = function(e) {
        return (e + "").replace(/^\s+|\s+$|/g, "")
    }
      , l = function(e) {
        return (e + "").replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")
    }
      , r = Array.isArray || "undefined" != typeof $ && $.isArray || function(e) {
        return "[object Array]" === Object.prototype.toString.call(e)
    }
      , p = {
        a: "[aḀḁĂăÂâǍǎȺⱥȦȧẠạÄäÀàÁáĀāÃãÅåąĄÃąĄ]",
        b: "[b␢βΒB฿𐌁ᛒ]",
        c: "[cĆćĈĉČčĊċC̄c̄ÇçḈḉȻȼƇƈɕᴄＣｃ]",
        d: "[dĎďḊḋḐḑḌḍḒḓḎḏĐđD̦d̦ƉɖƊɗƋƌᵭᶁᶑȡᴅＤｄð]",
        e: "[eÉéÈèÊêḘḙĚěĔĕẼẽḚḛẺẻĖėËëĒēȨȩĘęᶒɆɇȄȅẾếỀềỄễỂểḜḝḖḗḔḕȆȇẸẹỆệⱸᴇＥｅɘǝƏƐε]",
        f: "[fƑƒḞḟ]",
        g: "[gɢ₲ǤǥĜĝĞğĢģƓɠĠġ]",
        h: "[hĤĥĦħḨḩẖẖḤḥḢḣɦʰǶƕ]",
        i: "[iÍíÌìĬĭÎîǏǐÏïḮḯĨĩĮįĪīỈỉȈȉȊȋỊịḬḭƗɨɨ̆ᵻᶖİiIıɪＩｉ]",
        j: "[jȷĴĵɈɉʝɟʲ]",
        k: "[kƘƙꝀꝁḰḱǨǩḲḳḴḵκϰ₭]",
        l: "[lŁłĽľĻļĹĺḶḷḸḹḼḽḺḻĿŀȽƚⱠⱡⱢɫɬᶅɭȴʟＬｌ]",
        n: "[nŃńǸǹŇňÑñṄṅŅņṆṇṊṋṈṉN̈n̈ƝɲȠƞᵰᶇɳȵɴＮｎŊŋ]",
        o: "[oØøÖöÓóÒòÔôǑǒŐőŎŏȮȯỌọƟɵƠơỎỏŌōÕõǪǫȌȍՕօ]",
        p: "[pṔṕṖṗⱣᵽƤƥᵱ]",
        q: "[qꝖꝗʠɊɋꝘꝙq̃]",
        r: "[rŔŕɌɍŘřŖŗṘṙȐȑȒȓṚṛⱤɽ]",
        s: "[sŚśṠṡṢṣꞨꞩŜŝŠšŞşȘșS̈s̈]",
        t: "[tŤťṪṫŢţṬṭƮʈȚțṰṱṮṯƬƭ]",
        u: "[uŬŭɄʉỤụÜüÚúÙùÛûǓǔŰűŬŭƯưỦủŪūŨũŲųȔȕ∪]",
        v: "[vṼṽṾṿƲʋꝞꝟⱱʋ]",
        w: "[wẂẃẀẁŴŵẄẅẆẇẈẉ]",
        x: "[xẌẍẊẋχ]",
        y: "[yÝýỲỳŶŷŸÿỸỹẎẏỴỵɎɏƳƴ]",
        z: "[zŹźẐẑŽžŻżẒẓẔẕƵƶ]"
    }
      , n = function() {
        var e, t, n, i, o = "", s = {};
        for (n in p)
            if (p.hasOwnProperty(n))
                for (o += i = p[n].substring(2, p[n].length - 1),
                e = 0,
                t = i.length; e < t; e++)
                    s[i.charAt(e)] = n;
        var r = new RegExp("[" + o + "]","g");
        return function(e) {
            return e.replace(r, function(e) {
                return s[e]
            }).toLowerCase()
        }
    }();
    return e
}),
function(e, t) {
    "function" == typeof define && define.amd ? define("microplugin", t) : "object" == typeof exports ? module.exports = t() : e.MicroPlugin = t()
}(this, function() {
    var e = {
        mixin: function(i) {
            i.plugins = {},
            i.prototype.initializePlugins = function(e) {
                var t, n, i, o = [];
                if (this.plugins = {
                    names: [],
                    settings: {},
                    requested: {},
                    loaded: {}
                },
                s.isArray(e))
                    for (t = 0,
                    n = e.length; t < n; t++)
                        "string" == typeof e[t] ? o.push(e[t]) : (this.plugins.settings[e[t].name] = e[t].options,
                        o.push(e[t].name));
                else if (e)
                    for (i in e)
                        e.hasOwnProperty(i) && (this.plugins.settings[i] = e[i],
                        o.push(i));
                for (; o.length; )
                    this.require(o.shift())
            }
            ,
            i.prototype.loadPlugin = function(e) {
                var t = this.plugins
                  , n = i.plugins[e];
                if (!i.plugins.hasOwnProperty(e))
                    throw new Error('Unable to find "' + e + '" plugin');
                t.requested[e] = !0,
                t.loaded[e] = n.fn.apply(this, [this.plugins.settings[e] || {}]),
                t.names.push(e)
            }
            ,
            i.prototype.require = function(e) {
                var t = this.plugins;
                if (!this.plugins.loaded.hasOwnProperty(e)) {
                    if (t.requested[e])
                        throw new Error('Plugin has circular dependency ("' + e + '")');
                    this.loadPlugin(e)
                }
                return t.loaded[e]
            }
            ,
            i.define = function(e, t) {
                i.plugins[e] = {
                    name: e,
                    fn: t
                }
            }
        }
    }
      , s = {
        isArray: Array.isArray || function(e) {
            return "[object Array]" === Object.prototype.toString.call(e)
        }
    };
    return e
});
var highlight = function(e, t) {
    if ("string" != typeof t || t.length) {
        var r = "string" == typeof t ? new RegExp(t,"i") : t
          , a = function(e) {
            var t = 0;
            if (3 === e.nodeType) {
                var n, i, o = e.data.search(r);
                0 <= o && 0 < e.data.length && (i = e.data.match(r),
                (n = document.createElement("span")).className = "highlight",
                (o = e.splitText(o)).splitText(i[0].length),
                i = o.cloneNode(!0),
                n.appendChild(i),
                o.parentNode.replaceChild(n, o),
                t = 1)
            } else if (1 === e.nodeType && e.childNodes && !/(script|style)/i.test(e.tagName) && ("highlight" !== e.className || "SPAN" !== e.tagName))
                for (var s = 0; s < e.childNodes.length; ++s)
                    s += a(e.childNodes[s]);
            return t
        };
        return e.each(function() {
            a(this)
        })
    }
};
$.fn.removeHighlight = function() {
    return this.find("span.highlight").each(function() {
        this.parentNode.firstChild.nodeName;
        var e = this.parentNode;
        e.replaceChild(this.firstChild, this),
        e.normalize()
    }).end()
}
;
var MicroEvent = function() {};
MicroEvent.prototype = {
    on: function(e, t) {
        this._events = this._events || {},
        this._events[e] = this._events[e] || [],
        this._events[e].push(t)
    },
    off: function(e, t) {
        var n = arguments.length;
        return 0 === n ? delete this._events : 1 === n ? delete this._events[e] : (this._events = this._events || {},
        void (e in this._events != !1 && this._events[e].splice(this._events[e].indexOf(t), 1)))
    },
    trigger: function(e) {
        if (this._events = this._events || {},
        e in this._events != !1)
            for (var t = 0; t < this._events[e].length; t++)
                this._events[e][t].apply(this, Array.prototype.slice.call(arguments, 1))
    }
},
MicroEvent.mixin = function(e) {
    for (var t = ["on", "off", "trigger"], n = 0; n < t.length; n++)
        e.prototype[t[n]] = MicroEvent.prototype[t[n]]
}
;
var IS_MAC = /Mac/.test(navigator.userAgent)
  , KEY_A = 65
  , KEY_COMMA = 188
  , KEY_RETURN = 13
  , KEY_ESC = 27
  , KEY_LEFT = 37
  , KEY_UP = 38
  , KEY_P = 80
  , KEY_RIGHT = 39
  , KEY_DOWN = 40
  , KEY_N = 78
  , KEY_BACKSPACE = 8
  , KEY_DELETE = 46
  , KEY_SHIFT = 16
  , KEY_CMD = IS_MAC ? 91 : 17
  , KEY_CTRL = IS_MAC ? 18 : 17
  , KEY_TAB = 9
  , TAG_SELECT = 1
  , TAG_INPUT = 2
  , SUPPORTS_VALIDITY_API = !/android/i.test(window.navigator.userAgent) && !!document.createElement("input").validity
  , isset = function(e) {
    return void 0 !== e
}
  , hash_key = function(e) {
    return null == e ? null : "boolean" == typeof e ? e ? "1" : "0" : e + ""
}
  , escape_html = function(e) {
    return (e + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}
  , escape_replace = function(e) {
    return (e + "").replace(/\$/g, "$$$$")
}
  , hook = {
    before: function(e, t, n) {
        var i = e[t];
        e[t] = function() {
            return n.apply(e, arguments),
            i.apply(e, arguments)
        }
    },
    after: function(t, e, n) {
        var i = t[e];
        t[e] = function() {
            var e = i.apply(t, arguments);
            return n.apply(t, arguments),
            e
        }
    }
}
  , once = function(e) {
    var t = !1;
    return function() {
        t || (t = !0,
        e.apply(this, arguments))
    }
}
  , debounce = function(n, i) {
    var o;
    return function() {
        var e = this
          , t = arguments;
        window.clearTimeout(o),
        o = window.setTimeout(function() {
            n.apply(e, t)
        }, i)
    }
}
  , debounce_events = function(t, n, e) {
    var i, o = t.trigger, s = {};
    for (i in t.trigger = function() {
        var e = arguments[0];
        if (-1 === n.indexOf(e))
            return o.apply(t, arguments);
        s[e] = arguments
    }
    ,
    e.apply(t, []),
    t.trigger = o,
    s)
        s.hasOwnProperty(i) && o.apply(t, s[i])
}
  , watchChildEvent = function(n, e, t, i) {
    n.on(e, t, function(e) {
        for (var t = e.target; t && t.parentNode !== n[0]; )
            t = t.parentNode;
        return e.currentTarget = t,
        i.apply(this, [e])
    })
}
  , getSelection = function(e) {
    var t, n, i = {};
    return "selectionStart"in e ? (i.start = e.selectionStart,
    i.length = e.selectionEnd - i.start) : document.selection && (e.focus(),
    t = document.selection.createRange(),
    n = document.selection.createRange().text.length,
    t.moveStart("character", -e.value.length),
    i.start = t.text.length - n,
    i.length = n),
    i
}
  , transferStyles = function(e, t, n) {
    var i, o, s = {};
    if (n)
        for (i = 0,
        o = n.length; i < o; i++)
            s[n[i]] = e.css(n[i]);
    else
        s = e.css();
    t.css(s)
}
  , measureString = function(e, t) {
    return e ? (Selectize.$testInput || (Selectize.$testInput = $("<span />").css({
        position: "absolute",
        width: "auto",
        padding: 0,
        whiteSpace: "pre"
    }),
    $("<div />").css({
        position: "absolute",
        width: 0,
        height: 0,
        overflow: "hidden"
    }).append(Selectize.$testInput).appendTo("body")),
    Selectize.$testInput.text(e),
    transferStyles(t, Selectize.$testInput, ["letterSpacing", "fontSize", "fontFamily", "fontWeight", "textTransform"]),
    Selectize.$testInput.width()) : 0
}
  , autoGrow = function(r) {
    function e(e, t) {
        var n, i, o, s;
        t = t || {},
        (e = e || window.event || {}).metaKey || e.altKey || !t.force && !1 === r.data("grow") || (i = r.val(),
        e.type && "keydown" === e.type.toLowerCase() && (o = 48 <= (n = e.keyCode) && n <= 57 || 65 <= n && n <= 90 || 96 <= n && n <= 111 || 186 <= n && n <= 222 || 32 === n,
        n === KEY_DELETE || n === KEY_BACKSPACE ? (t = getSelection(r[0])).length ? i = i.substring(0, t.start) + i.substring(t.start + t.length) : n === KEY_BACKSPACE && t.start ? i = i.substring(0, t.start - 1) + i.substring(t.start + 1) : n === KEY_DELETE && void 0 !== t.start && (i = i.substring(0, t.start) + i.substring(t.start + 1)) : o && (o = e.shiftKey,
        s = String.fromCharCode(e.keyCode),
        i += s = o ? s.toUpperCase() : s.toLowerCase())),
        s = r.attr("placeholder"),
        !i && s && (i = s),
        (i = measureString(i, r) + 4) !== a && (a = i,
        r.width(i),
        r.triggerHandler("resize")))
    }
    var a = null;
    r.on("keydown keyup update blur", e),
    e()
}
  , domToString = function(e) {
    var t = document.createElement("div");
    return t.appendChild(e.cloneNode(!0)),
    t.innerHTML
}
  , logError = function(e, t) {
    t = t || {};
    console.error("Selectize: " + e),
    t.explanation && (console.group && console.group(),
    console.error(t.explanation),
    console.group && console.groupEnd())
}
  , Selectize = function(e, t) {
    var n, i, o = this, s = e[0];
    s.selectize = o;
    var r = window.getComputedStyle && window.getComputedStyle(s, null);
    if (r = (r = r ? r.getPropertyValue("direction") : s.currentStyle && s.currentStyle.direction) || e.parents("[dir]:first").attr("dir") || "",
    $.extend(o, {
        order: 0,
        settings: t,
        $input: e,
        tabIndex: e.attr("tabindex") || "",
        tagType: "select" === s.tagName.toLowerCase() ? TAG_SELECT : TAG_INPUT,
        rtl: /rtl/i.test(r),
        eventNS: ".selectize" + ++Selectize.count,
        highlightedValue: null,
        isBlurring: !1,
        isOpen: !1,
        isDisabled: !1,
        isRequired: e.is("[required]"),
        isInvalid: !1,
        isLocked: !1,
        isFocused: !1,
        isInputHidden: !1,
        isSetup: !1,
        isShiftDown: !1,
        isCmdDown: !1,
        isCtrlDown: !1,
        ignoreFocus: !1,
        ignoreBlur: !1,
        ignoreHover: !1,
        hasOptions: !1,
        currentResults: null,
        lastValue: "",
        caretPos: 0,
        loading: 0,
        loadedSearches: {},
        $activeOption: null,
        $activeItems: [],
        optgroups: {},
        options: {},
        userOptions: {},
        items: [],
        renderCache: {},
        onSearchChange: null === t.loadThrottle ? o.onSearchChange : debounce(o.onSearchChange, t.loadThrottle)
    }),
    o.sifter = new Sifter(this.options,{
        diacritics: t.diacritics
    }),
    o.settings.options) {
        for (n = 0,
        i = o.settings.options.length; n < i; n++)
            o.registerOption(o.settings.options[n]);
        delete o.settings.options
    }
    if (o.settings.optgroups) {
        for (n = 0,
        i = o.settings.optgroups.length; n < i; n++)
            o.registerOptionGroup(o.settings.optgroups[n]);
        delete o.settings.optgroups
    }
    o.settings.mode = o.settings.mode || (1 === o.settings.maxItems ? "single" : "multi"),
    "boolean" != typeof o.settings.hideSelected && (o.settings.hideSelected = "multi" === o.settings.mode),
    o.initializePlugins(o.settings.plugins),
    o.setupCallbacks(),
    o.setupTemplates(),
    o.setup()
};
MicroEvent.mixin(Selectize),
"undefined" != typeof MicroPlugin ? MicroPlugin.mixin(Selectize) : logError("Dependency MicroPlugin is missing", {
    explanation: 'Make sure you either: (1) are using the "standalone" version of Selectize, or (2) require MicroPlugin before you load Selectize.'
}),
$.extend(Selectize.prototype, {
    setup: function() {
        var e, t = this, n = t.settings, i = t.eventNS, o = $(window), s = $(document), r = t.$input, a = t.settings.mode, l = r.attr("class") || "", p = $("<div>").addClass(n.wrapperClass).addClass(l).addClass(a), c = $("<div>").addClass(n.inputClass).addClass("items").appendTo(p), d = $('<input type="text" autocomplete="new-password" autofill="no" />').appendTo(c).attr("tabindex", r.is(":disabled") ? "-1" : t.tabIndex), u = $(n.dropdownParent || p), h = $("<div>").addClass(n.dropdownClass).addClass(a).hide().appendTo(u), a = $("<div>").addClass(n.dropdownContentClass).appendTo(h);
        (u = r.attr("id")) && (d.attr("id", u + "-selectized"),
        $("label[for='" + u + "']").attr("for", u + "-selectized")),
        t.settings.copyClassesToDropdown && h.addClass(l),
        p.css({
            width: r[0].style.width
        }),
        t.plugins.names.length && (e = "plugin-" + t.plugins.names.join(" plugin-"),
        p.addClass(e),
        h.addClass(e)),
        (null === n.maxItems || 1 < n.maxItems) && t.tagType === TAG_SELECT && r.attr("multiple", "multiple"),
        t.settings.placeholder && d.attr("placeholder", n.placeholder),
        !t.settings.splitOn && t.settings.delimiter && (e = t.settings.delimiter.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
        t.settings.splitOn = new RegExp("\\s*" + e + "+\\s*")),
        r.attr("autocorrect") && d.attr("autocorrect", r.attr("autocorrect")),
        r.attr("autocapitalize") && d.attr("autocapitalize", r.attr("autocapitalize")),
        d[0].type = r[0].type,
        t.$wrapper = p,
        t.$control = c,
        t.$control_input = d,
        t.$dropdown = h,
        t.$dropdown_content = a,
        h.on("mouseenter mousedown click", "[data-disabled]>[data-selectable]", function(e) {
            e.stopImmediatePropagation()
        }),
        h.on("mouseenter", "[data-selectable]", function() {
            return t.onOptionHover.apply(t, arguments)
        }),
        h.on("mousedown click", "[data-selectable]", function() {
            return t.onOptionSelect.apply(t, arguments)
        }),
        watchChildEvent(c, "mousedown", "*:not(input)", function() {
            return t.onItemSelect.apply(t, arguments)
        }),
        autoGrow(d),
        c.on({
            mousedown: function() {
                return t.onMouseDown.apply(t, arguments)
            },
            click: function() {
                return t.onClick.apply(t, arguments)
            }
        }),
        d.on({
            mousedown: function(e) {
                e.stopPropagation()
            },
            keydown: function() {
                return t.onKeyDown.apply(t, arguments)
            },
            keyup: function() {
                return t.onKeyUp.apply(t, arguments)
            },
            keypress: function() {
                return t.onKeyPress.apply(t, arguments)
            },
            resize: function() {
                t.positionDropdown.apply(t, [])
            },
            blur: function() {
                return t.onBlur.apply(t, arguments)
            },
            focus: function() {
                return t.ignoreBlur = !1,
                t.onFocus.apply(t, arguments)
            },
            paste: function() {
                return t.onPaste.apply(t, arguments)
            }
        }),
        s.on("keydown" + i, function(e) {
            t.isCmdDown = e[IS_MAC ? "metaKey" : "ctrlKey"],
            t.isCtrlDown = e[IS_MAC ? "altKey" : "ctrlKey"],
            t.isShiftDown = e.shiftKey
        }),
        s.on("keyup" + i, function(e) {
            e.keyCode === KEY_CTRL && (t.isCtrlDown = !1),
            e.keyCode === KEY_SHIFT && (t.isShiftDown = !1),
            e.keyCode === KEY_CMD && (t.isCmdDown = !1)
        }),
        s.on("mousedown" + i, function(e) {
            if (t.isFocused) {
                if (e.target === t.$dropdown[0] || e.target.parentNode === t.$dropdown[0])
                    return !1;
                t.$control.has(e.target).length || e.target === t.$control[0] || t.blur(e.target)
            }
        }),
        o.on(["scroll" + i, "resize" + i].join(" "), function() {
            t.isOpen && t.positionDropdown.apply(t, arguments)
        }),
        o.on("mousemove" + i, function() {
            t.ignoreHover = !1
        }),
        this.revertSettings = {
            $children: r.children().detach(),
            tabindex: r.attr("tabindex")
        },
        r.attr("tabindex", -1).hide().after(t.$wrapper),
        $.isArray(n.items) && (t.setValue(n.items),
        delete n.items),
        SUPPORTS_VALIDITY_API && r.on("invalid" + i, function(e) {
            e.preventDefault(),
            t.isInvalid = !0,
            t.refreshState()
        }),
        t.updateOriginalInput(),
        t.refreshItems(),
        t.refreshState(),
        t.updatePlaceholder(),
        t.isSetup = !0,
        r.is(":disabled") && t.disable(),
        t.on("change", this.onChange),
        r.data("selectize", t),
        r.addClass("selectized"),
        t.trigger("initialize"),
        !0 === n.preload && t.onSearchChange("")
    },
    setupTemplates: function() {
        var n = this.settings.labelField
          , i = this.settings.optgroupLabelField
          , e = {
            optgroup: function(e) {
                return '<div class="optgroup">' + e.html + "</div>"
            },
            optgroup_header: function(e, t) {
                return '<div class="optgroup-header">' + t(e[i]) + "</div>"
            },
            option: function(e, t) {
                return '<div class="option">' + t(e[n]) + "</div>"
            },
            item: function(e, t) {
                return '<div class="item">' + t(e[n]) + "</div>"
            },
            option_create: function(e, t) {
                return '<div class="create">Add <strong>' + t(e.input) + "</strong>&hellip;</div>"
            }
        };
        this.settings.render = $.extend({}, e, this.settings.render)
    },
    setupCallbacks: function() {
        var e, t, n = {
            initialize: "onInitialize",
            change: "onChange",
            item_add: "onItemAdd",
            item_remove: "onItemRemove",
            clear: "onClear",
            option_add: "onOptionAdd",
            option_remove: "onOptionRemove",
            option_clear: "onOptionClear",
            optgroup_add: "onOptionGroupAdd",
            optgroup_remove: "onOptionGroupRemove",
            optgroup_clear: "onOptionGroupClear",
            dropdown_open: "onDropdownOpen",
            dropdown_close: "onDropdownClose",
            type: "onType",
            load: "onLoad",
            focus: "onFocus",
            blur: "onBlur",
            dropdown_item_activate: "onDropdownItemActivate",
            dropdown_item_deactivate: "onDropdownItemDeactivate"
        };
        for (e in n)
            n.hasOwnProperty(e) && (t = this.settings[n[e]]) && this.on(e, t)
    },
    onClick: function(e) {
        this.isFocused && this.isOpen || (this.focus(),
        e.preventDefault())
    },
    onMouseDown: function(e) {
        var t = this
          , n = e.isDefaultPrevented();
        $(e.target);
        if (t.isFocused) {
            if (e.target !== t.$control_input[0])
                return "single" === t.settings.mode ? t.isOpen ? t.close() : t.open() : n || t.setActiveItem(null),
                !1
        } else
            n || window.setTimeout(function() {
                t.focus()
            }, 0)
    },
    onChange: function() {
        this.$input.trigger("change")
    },
    onPaste: function(e) {
        var o = this;
        o.isFull() || o.isInputHidden || o.isLocked ? e.preventDefault() : o.settings.splitOn && setTimeout(function() {
            var e = o.$control_input.val();
            if (e.match(o.settings.splitOn))
                for (var t = $.trim(e).split(o.settings.splitOn), n = 0, i = t.length; n < i; n++)
                    o.createItem(t[n])
        }, 0)
    },
    onKeyPress: function(e) {
        if (this.isLocked)
            return e && e.preventDefault();
        var t = String.fromCharCode(e.keyCode || e.which);
        return this.settings.create && "multi" === this.settings.mode && t === this.settings.delimiter ? (this.createItem(),
        e.preventDefault(),
        !1) : void 0
    },
    onKeyDown: function(e) {
        e.target,
        this.$control_input[0];
        var t, n = this;
        if (n.isLocked)
            e.keyCode !== KEY_TAB && e.preventDefault();
        else {
            switch (e.keyCode) {
            case KEY_A:
                if (n.isCmdDown)
                    return void n.selectAll();
                break;
            case KEY_ESC:
                return void (n.isOpen && (e.preventDefault(),
                e.stopPropagation(),
                n.close()));
            case KEY_N:
                if (!e.ctrlKey || e.altKey)
                    break;
            case KEY_DOWN:
                return !n.isOpen && n.hasOptions ? n.open() : n.$activeOption && (n.ignoreHover = !0,
                (t = n.getAdjacentOption(n.$activeOption, 1)).length && n.setActiveOption(t, !0, !0)),
                void e.preventDefault();
            case KEY_P:
                if (!e.ctrlKey || e.altKey)
                    break;
            case KEY_UP:
                return n.$activeOption && (n.ignoreHover = !0,
                (t = n.getAdjacentOption(n.$activeOption, -1)).length && n.setActiveOption(t, !0, !0)),
                void e.preventDefault();
            case KEY_RETURN:
                return void (n.isOpen && n.$activeOption && (n.onOptionSelect({
                    currentTarget: n.$activeOption
                }),
                e.preventDefault()));
            case KEY_LEFT:
                return void n.advanceSelection(-1, e);
            case KEY_RIGHT:
                return void n.advanceSelection(1, e);
            case KEY_TAB:
                return n.settings.selectOnTab && n.isOpen && n.$activeOption && (n.onOptionSelect({
                    currentTarget: n.$activeOption
                }),
                n.isFull() || e.preventDefault()),
                void (n.settings.create && n.createItem() && e.preventDefault());
            case KEY_BACKSPACE:
            case KEY_DELETE:
                return void n.deleteSelection(e)
            }
            !n.isFull() && !n.isInputHidden || (IS_MAC ? e.metaKey : e.ctrlKey) || e.preventDefault()
        }
    },
    onKeyUp: function(e) {
        var t = this;
        if (t.isLocked)
            return e && e.preventDefault();
        e = t.$control_input.val() || "";
        t.lastValue !== e && (t.lastValue = e,
        t.onSearchChange(e),
        t.refreshOptions(),
        t.trigger("type", e))
    },
    onSearchChange: function(t) {
        var n = this
          , i = n.settings.load;
        i && (n.loadedSearches.hasOwnProperty(t) || (n.loadedSearches[t] = !0,
        n.load(function(e) {
            i.apply(n, [t, e])
        })))
    },
    onFocus: function(e) {
        var t = this
          , n = t.isFocused;
        if (t.isDisabled)
            return t.blur(),
            e && e.preventDefault(),
            !1;
        t.ignoreFocus || (t.isFocused = !0,
        "focus" === t.settings.preload && t.onSearchChange(""),
        n || t.trigger("focus"),
        t.$activeItems.length || (t.showInput(),
        t.setActiveItem(null),
        t.refreshOptions(!!t.settings.openOnFocus)),
        t.refreshState())
    },
    onBlur: function(e, t) {
        var n = this;
        if (n.isFocused && (n.isFocused = !1,
        !n.ignoreFocus)) {
            if (!n.ignoreBlur && document.activeElement === n.$dropdown_content[0])
                return n.ignoreBlur = !0,
                void n.onFocus(e);
            e = function() {
                n.close(),
                n.setTextboxValue(""),
                n.setActiveItem(null),
                n.setActiveOption(null),
                n.setCaret(n.items.length),
                n.refreshState(),
                t && t.focus && t.focus(),
                n.isBlurring = !1,
                n.ignoreFocus = !1,
                n.trigger("blur")
            }
            ;
            n.isBlurring = !0,
            n.ignoreFocus = !0,
            n.settings.create && n.settings.createOnBlur ? n.createItem(null, !1, e) : e()
        }
    },
    onOptionHover: function(e) {
        this.ignoreHover || this.setActiveOption(e.currentTarget, !1)
    },
    onOptionSelect: function(e) {
        var t, n = this;
        e.preventDefault && (e.preventDefault(),
        e.stopPropagation()),
        (t = $(e.currentTarget)).hasClass("create") ? n.createItem(null, function() {
            n.settings.closeAfterSelect && n.close()
        }) : void 0 !== (t = t.attr("data-value")) && (n.lastQuery = null,
        n.setTextboxValue(""),
        n.addItem(t),
        n.settings.closeAfterSelect ? n.close() : !n.settings.hideSelected && e.type && /mouse/.test(e.type) && n.setActiveOption(n.getOption(t)))
    },
    onItemSelect: function(e) {
        this.isLocked || "multi" === this.settings.mode && (e.preventDefault(),
        this.setActiveItem(e.currentTarget, e))
    },
    load: function(e) {
        var t = this
          , n = t.$wrapper.addClass(t.settings.loadingClass);
        t.loading++,
        e.apply(t, [function(e) {
            t.loading = Math.max(t.loading - 1, 0),
            e && e.length && (t.addOption(e),
            t.refreshOptions(t.isFocused && !t.isInputHidden)),
            t.loading || n.removeClass(t.settings.loadingClass),
            t.trigger("load", e)
        }
        ])
    },
    setTextboxValue: function(e) {
        var t = this.$control_input;
        t.val() !== e && (t.val(e).triggerHandler("update"),
        this.lastValue = e)
    },
    getValue: function() {
        return this.tagType === TAG_SELECT && this.$input.attr("multiple") ? this.items : this.items.join(this.settings.delimiter)
    },
    setValue: function(e, t) {
        debounce_events(this, t ? [] : ["change"], function() {
            this.clear(t),
            this.addItems(e, t)
        })
    },
    setMaxItems: function(e) {
        0 === e && (e = null),
        this.settings.maxItems = e,
        this.settings.mode = this.settings.mode || (1 === this.settings.maxItems ? "single" : "multi"),
        this.refreshState()
    },
    setActiveItem: function(e, t) {
        var n, i, o, s, r, a, l = this;
        if ("single" !== l.settings.mode) {
            if (!(e = $(e)).length)
                return $(l.$activeItems).removeClass("active"),
                l.$activeItems = [],
                void (l.isFocused && l.showInput());
            if ("mousedown" === (i = t && t.type.toLowerCase()) && l.isShiftDown && l.$activeItems.length) {
                for (a = l.$control.children(".active:last"),
                o = Array.prototype.indexOf.apply(l.$control[0].childNodes, [a[0]]),
                (s = Array.prototype.indexOf.apply(l.$control[0].childNodes, [e[0]])) < o && (a = o,
                o = s,
                s = a),
                n = o; n <= s; n++)
                    r = l.$control[0].childNodes[n],
                    -1 === l.$activeItems.indexOf(r) && ($(r).addClass("active"),
                    l.$activeItems.push(r));
                t.preventDefault()
            } else
                "mousedown" === i && l.isCtrlDown || "keydown" === i && this.isShiftDown ? e.hasClass("active") ? (i = l.$activeItems.indexOf(e[0]),
                l.$activeItems.splice(i, 1),
                e.removeClass("active")) : l.$activeItems.push(e.addClass("active")[0]) : ($(l.$activeItems).removeClass("active"),
                l.$activeItems = [e.addClass("active")[0]]);
            l.hideInput(),
            this.isFocused || l.focus()
        }
    },
    setActiveOption: function(e, t, n) {
        var i, o, s, r, a = this;
        a.$activeOption && (a.$activeOption.removeClass("active"),
        a.trigger("dropdown_item_deactivate", a.$activeOption.attr("data-value"))),
        a.$activeOption = null,
        (e = $(e)).length && (a.$activeOption = e.addClass("active"),
        a.isOpen && a.trigger("dropdown_item_activate", a.$activeOption.attr("data-value")),
        !t && isset(t) || (i = a.$dropdown_content.height(),
        o = a.$activeOption.outerHeight(!0),
        t = a.$dropdown_content.scrollTop() || 0,
        e = (r = s = a.$activeOption.offset().top - a.$dropdown_content.offset().top + t) - i + o,
        i + t < s + o ? a.$dropdown_content.stop().animate({
            scrollTop: e
        }, n ? a.settings.scrollDuration : 0) : s < t && a.$dropdown_content.stop().animate({
            scrollTop: r
        }, n ? a.settings.scrollDuration : 0)))
    },
    selectAll: function() {
        var e = this;
        "single" !== e.settings.mode && (e.$activeItems = Array.prototype.slice.apply(e.$control.children(":not(input)").addClass("active")),
        e.$activeItems.length && (e.hideInput(),
        e.close()),
        e.focus())
    },
    hideInput: function() {
        this.setTextboxValue(""),
        this.$control_input.css({
            opacity: 0,
            position: "absolute",
            left: this.rtl ? 1e4 : -1e4
        }),
        this.isInputHidden = !0
    },
    showInput: function() {
        this.$control_input.css({
            opacity: 1,
            position: "relative",
            left: 0
        }),
        this.isInputHidden = !1
    },
    focus: function() {
        var e = this;
        e.isDisabled || (e.ignoreFocus = !0,
        e.$control_input[0].focus(),
        window.setTimeout(function() {
            e.ignoreFocus = !1,
            e.onFocus()
        }, 0))
    },
    blur: function(e) {
        this.$control_input[0].blur(),
        this.onBlur(null, e)
    },
    getScoreFunction: function(e) {
        return this.sifter.getScoreFunction(e, this.getSearchOptions())
    },
    getSearchOptions: function() {
        var e = this.settings
          , t = e.sortField;
        return "string" == typeof t && (t = [{
            field: t
        }]),
        {
            fields: e.searchField,
            conjunction: e.searchConjunction,
            sort: t,
            nesting: e.nesting
        }
    },
    search: function(e) {
        var t, n, i, o = this, s = o.settings, r = this.getSearchOptions();
        if (s.score && "function" != typeof (i = o.settings.score.apply(this, [e])))
            throw new Error('Selectize "score" setting must be a function that returns a function');
        if (e !== o.lastQuery ? (o.lastQuery = e,
        n = o.sifter.search(e, $.extend(r, {
            score: i
        })),
        o.currentResults = n) : n = $.extend(!0, {}, o.currentResults),
        s.hideSelected)
            for (t = n.items.length - 1; 0 <= t; t--)
                -1 !== o.items.indexOf(hash_key(n.items[t].id)) && n.items.splice(t, 1);
        return n
    },
    refreshOptions: function(e) {
        var t, n, i, o, s, r, a, l, p, c, d, u, h, g;
        void 0 === e && (e = !0);
        var f = this
          , v = $.trim(f.$control_input.val())
          , m = f.search(v)
          , y = f.$dropdown_content
          , w = f.$activeOption && hash_key(f.$activeOption.attr("data-value"))
          , C = m.items.length;
        for ("number" == typeof f.settings.maxOptions && (C = Math.min(C, f.settings.maxOptions)),
        o = {},
        s = [],
        t = 0; t < C; t++)
            for (r = f.options[m.items[t].id],
            a = f.render("option", r),
            l = r[f.settings.optgroupField] || "",
            n = 0,
            i = (p = $.isArray(l) ? l : [l]) && p.length; n < i; n++)
                l = p[n],
                f.optgroups.hasOwnProperty(l) || (l = ""),
                o.hasOwnProperty(l) || (o[l] = document.createDocumentFragment(),
                s.push(l)),
                o[l].appendChild(a);
        for (this.settings.lockOptgroupOrder && s.sort(function(e, t) {
            return (f.optgroups[e].$order || 0) - (f.optgroups[t].$order || 0)
        }),
        c = document.createDocumentFragment(),
        t = 0,
        C = s.length; t < C; t++)
            l = s[t],
            f.optgroups.hasOwnProperty(l) && o[l].childNodes.length ? ((d = document.createDocumentFragment()).appendChild(f.render("optgroup_header", f.optgroups[l])),
            d.appendChild(o[l]),
            c.appendChild(f.render("optgroup", $.extend({}, f.optgroups[l], {
                html: domToString(d),
                dom: d
            })))) : c.appendChild(o[l]);
        if (y.html(c),
        f.settings.highlight && (y.removeHighlight(),
        m.query.length && m.tokens.length))
            for (t = 0,
            C = m.tokens.length; t < C; t++)
                highlight(y, m.tokens[t].regex);
        if (!f.settings.hideSelected)
            for (f.$dropdown.find(".selected").removeClass("selected"),
            t = 0,
            C = f.items.length; t < C; t++)
                f.getOption(f.items[t]).addClass("selected");
        (u = f.canCreate(v)) && (y.prepend(f.render("option_create", {
            input: v
        })),
        g = $(y[0].childNodes[0])),
        f.hasOptions = 0 < m.items.length || u,
        f.hasOptions ? (0 < m.items.length ? ((w = w && f.getOption(w)) && w.length ? h = w : "single" === f.settings.mode && f.items.length && (h = f.getOption(f.items[0])),
        h && h.length || (h = g && !f.settings.addPrecedence ? f.getAdjacentOption(g, 1) : y.find("[data-selectable]:first"))) : h = g,
        f.setActiveOption(h),
        e && !f.isOpen && f.open()) : (f.setActiveOption(null),
        e && f.isOpen && f.close())
    },
    addOption: function(e) {
        var t, n, i, o = this;
        if ($.isArray(e))
            for (t = 0,
            n = e.length; t < n; t++)
                o.addOption(e[t]);
        else
            (i = o.registerOption(e)) && (o.userOptions[i] = !0,
            o.lastQuery = null,
            o.trigger("option_add", i, e))
    },
    registerOption: function(e) {
        var t = hash_key(e[this.settings.valueField]);
        return null != t && !this.options.hasOwnProperty(t) && (e.$order = e.$order || ++this.order,
        this.options[t] = e,
        t)
    },
    registerOptionGroup: function(e) {
        var t = hash_key(e[this.settings.optgroupValueField]);
        return !!t && (e.$order = e.$order || ++this.order,
        this.optgroups[t] = e,
        t)
    },
    addOptionGroup: function(e, t) {
        t[this.settings.optgroupValueField] = e,
        (e = this.registerOptionGroup(t)) && this.trigger("optgroup_add", e, t)
    },
    removeOptionGroup: function(e) {
        this.optgroups.hasOwnProperty(e) && (delete this.optgroups[e],
        this.renderCache = {},
        this.trigger("optgroup_remove", e))
    },
    clearOptionGroups: function() {
        this.optgroups = {},
        this.renderCache = {},
        this.trigger("optgroup_clear")
    },
    updateOption: function(e, t) {
        var n, i, o, s = this;
        if (e = hash_key(e),
        n = hash_key(t[s.settings.valueField]),
        null !== e && s.options.hasOwnProperty(e)) {
            if ("string" != typeof n)
                throw new Error("Value must be set in option data");
            o = s.options[e].$order,
            n !== e && (delete s.options[e],
            -1 !== (i = s.items.indexOf(e)) && s.items.splice(i, 1, n)),
            t.$order = t.$order || o,
            s.options[n] = t,
            i = s.renderCache.item,
            o = s.renderCache.option,
            i && (delete i[e],
            delete i[n]),
            o && (delete o[e],
            delete o[n]),
            -1 !== s.items.indexOf(n) && (e = s.getItem(e),
            t = $(s.render("item", t)),
            e.hasClass("active") && t.addClass("active"),
            e.replaceWith(t)),
            s.lastQuery = null,
            s.isOpen && s.refreshOptions(!1)
        }
    },
    removeOption: function(e, t) {
        var n = this;
        e = hash_key(e);
        var i = n.renderCache.item
          , o = n.renderCache.option;
        i && delete i[e],
        o && delete o[e],
        delete n.userOptions[e],
        delete n.options[e],
        n.lastQuery = null,
        n.trigger("option_remove", e),
        n.removeItem(e, t)
    },
    clearOptions: function(e) {
        var n = this;
        n.loadedSearches = {},
        n.userOptions = {},
        n.renderCache = {};
        var i = n.options;
        $.each(n.options, function(e, t) {
            -1 == n.items.indexOf(e) && delete i[e]
        }),
        n.options = n.sifter.items = i,
        n.lastQuery = null,
        n.trigger("option_clear"),
        n.clear(e)
    },
    getOption: function(e) {
        return this.getElementWithValue(e, this.$dropdown_content.find("[data-selectable]"))
    },
    getAdjacentOption: function(e, t) {
        var n = this.$dropdown.find("[data-selectable]")
          , t = n.index(e) + t;
        return 0 <= t && t < n.length ? n.eq(t) : $()
    },
    getElementWithValue: function(e, t) {
        if (null != (e = hash_key(e)))
            for (var n = 0, i = t.length; n < i; n++)
                if (t[n].getAttribute("data-value") === e)
                    return $(t[n]);
        return $()
    },
    getItem: function(e) {
        return this.getElementWithValue(e, this.$control.children())
    },
    addItems: function(e, t) {
        this.buffer = document.createDocumentFragment();
        for (var n = this.$control[0].childNodes, i = 0; i < n.length; i++)
            this.buffer.appendChild(n[i]);
        for (var o = $.isArray(e) ? e : [e], i = 0, s = o.length; i < s; i++)
            this.isPending = i < s - 1,
            this.addItem(o[i], t);
        e = this.$control[0];
        e.insertBefore(this.buffer, e.firstChild),
        this.buffer = null
    },
    addItem: function(s, r) {
        debounce_events(this, r ? [] : ["change"], function() {
            var e, t, n, i = this, o = i.settings.mode;
            s = hash_key(s),
            -1 === i.items.indexOf(s) ? i.options.hasOwnProperty(s) && ("single" === o && i.clear(r),
            "multi" === o && i.isFull() || (e = $(i.render("item", i.options[s])),
            n = i.isFull(),
            i.items.splice(i.caretPos, 0, s),
            i.insertAtCaret(e),
            i.isPending && (n || !i.isFull()) || i.refreshState(),
            i.isSetup && (t = i.$dropdown_content.find("[data-selectable]"),
            i.isPending || (n = i.getOption(s),
            n = i.getAdjacentOption(n, 1).attr("data-value"),
            i.refreshOptions(i.isFocused && "single" !== o),
            n && i.setActiveOption(i.getOption(n))),
            !t.length || i.isFull() ? i.close() : i.isPending || i.positionDropdown(),
            i.updatePlaceholder(),
            i.trigger("item_add", s, e),
            i.isPending || i.updateOriginalInput({
                silent: r
            })))) : "single" === o && i.close()
        })
    },
    removeItem: function(e, t) {
        var n, i, o = this, s = e instanceof $ ? e : o.getItem(e);
        e = hash_key(s.attr("data-value")),
        -1 !== (n = o.items.indexOf(e)) && (s.remove(),
        s.hasClass("active") && (i = o.$activeItems.indexOf(s[0]),
        o.$activeItems.splice(i, 1)),
        o.items.splice(n, 1),
        o.lastQuery = null,
        !o.settings.persist && o.userOptions.hasOwnProperty(e) && o.removeOption(e, t),
        n < o.caretPos && o.setCaret(o.caretPos - 1),
        o.refreshState(),
        o.updatePlaceholder(),
        o.updateOriginalInput({
            silent: t
        }),
        o.positionDropdown(),
        o.trigger("item_remove", e, s))
    },
    createItem: function(e, n) {
        var i = this
          , o = i.caretPos;
        e = e || $.trim(i.$control_input.val() || "");
        var s = arguments[arguments.length - 1];
        if ("function" != typeof s && (s = function() {}
        ),
        "boolean" != typeof n && (n = !0),
        !i.canCreate(e))
            return s(),
            !1;
        i.lock();
        var t = "function" == typeof i.settings.create ? this.settings.create : function(e) {
            var t = {};
            return t[i.settings.labelField] = e,
            t[i.settings.valueField] = e,
            t
        }
          , r = once(function(e) {
            if (i.unlock(),
            !e || "object" != typeof e)
                return s();
            var t = hash_key(e[i.settings.valueField]);
            if ("string" != typeof t)
                return s();
            i.setTextboxValue(""),
            i.addOption(e),
            i.setCaret(o),
            i.addItem(t),
            i.refreshOptions(n && "single" !== i.settings.mode),
            s(e)
        })
          , t = t.apply(this, [e, r]);
        return void 0 !== t && r(t),
        !0
    },
    refreshItems: function() {
        this.lastQuery = null,
        this.isSetup && this.addItem(this.items),
        this.refreshState(),
        this.updateOriginalInput()
    },
    refreshState: function() {
        this.refreshValidityState(),
        this.refreshClasses()
    },
    refreshValidityState: function() {
        if (!this.isRequired)
            return !1;
        var e = !this.items.length;
        this.isInvalid = e,
        this.$control_input.prop("required", e),
        this.$input.prop("required", !e)
    },
    refreshClasses: function() {
        var e = this
          , t = e.isFull()
          , n = e.isLocked;
        e.$wrapper.toggleClass("rtl", e.rtl),
        e.$control.toggleClass("focus", e.isFocused).toggleClass("disabled", e.isDisabled).toggleClass("required", e.isRequired).toggleClass("invalid", e.isInvalid).toggleClass("locked", n).toggleClass("full", t).toggleClass("not-full", !t).toggleClass("input-active", e.isFocused && !e.isInputHidden).toggleClass("dropdown-active", e.isOpen).toggleClass("has-options", !$.isEmptyObject(e.options)).toggleClass("has-items", 0 < e.items.length),
        e.$control_input.data("grow", !t && !n)
    },
    isFull: function() {
        return null !== this.settings.maxItems && this.items.length >= this.settings.maxItems
    },
    updateOriginalInput: function(e) {
        var t, n, i, o, s = this;
        if (e = e || {},
        s.tagType === TAG_SELECT) {
            for (i = [],
            t = 0,
            n = s.items.length; t < n; t++)
                o = s.options[s.items[t]][s.settings.labelField] || "",
                i.push('<option value="' + escape_html(s.items[t]) + '" selected="selected">' + escape_html(o) + "</option>");
            i.length || this.$input.attr("multiple") || i.push('<option value="" selected="selected"></option>'),
            s.$input.html(i.join(""))
        } else
            s.$input.val(s.getValue()),
            s.$input.attr("value", s.$input.val());
        s.isSetup && (e.silent || s.trigger("change", s.$input.val()))
    },
    updatePlaceholder: function() {
        var e;
        this.settings.placeholder && (e = this.$control_input,
        this.items.length ? e.removeAttr("placeholder") : e.attr("placeholder", this.settings.placeholder),
        e.triggerHandler("update", {
            force: !0
        }))
    },
    open: function() {
        var e = this;
        e.isLocked || e.isOpen || "multi" === e.settings.mode && e.isFull() || (e.focus(),
        e.isOpen = !0,
        e.refreshState(),
        e.$dropdown.css({
            visibility: "hidden",
            display: "block"
        }),
        e.positionDropdown(),
        e.$dropdown.css({
            visibility: "visible"
        }),
        e.trigger("dropdown_open", e.$dropdown))
    },
    close: function() {
        var e = this
          , t = e.isOpen;
        "single" === e.settings.mode && e.items.length && (e.hideInput(),
        e.isBlurring || e.$control_input.blur()),
        e.isOpen = !1,
        e.$dropdown.hide(),
        e.setActiveOption(null),
        e.refreshState(),
        t && e.trigger("dropdown_close", e.$dropdown)
    },
    positionDropdown: function() {
        var e = this.$control
          , t = "body" === this.settings.dropdownParent ? e.offset() : e.position();
		  
			t.top += e.outerHeight(!0),
        this.$dropdown.css({
            width: e[0].getBoundingClientRect().width,
            top: t.top,
            left: t.left
        })
    },
    clear: function(e) {
        var t = this;
        t.items.length && (t.$control.children(":not(input)").remove(),
        t.items = [],
        t.lastQuery = null,
        t.setCaret(0),
        t.setActiveItem(null),
        t.updatePlaceholder(),
        t.updateOriginalInput({
            silent: e
        }),
        t.refreshState(),
        t.showInput(),
        t.trigger("clear"))
    },
    insertAtCaret: function(e) {
        var t = Math.min(this.caretPos, this.items.length)
          , n = e[0]
          , e = this.buffer || this.$control[0];
        0 === t ? e.insertBefore(n, e.firstChild) : e.insertBefore(n, e.childNodes[t]),
        this.setCaret(t + 1)
    },
    deleteSelection: function(e) {
        var t, n, i, o, s, r, a = this, l = e && e.keyCode === KEY_BACKSPACE ? -1 : 1, p = getSelection(a.$control_input[0]);
        if (a.$activeOption && !a.settings.hideSelected && (o = a.getAdjacentOption(a.$activeOption, -1).attr("data-value")),
        i = [],
        a.$activeItems.length) {
            for (r = a.$control.children(".active:" + (0 < l ? "last" : "first")),
            r = a.$control.children(":not(input)").index(r),
            0 < l && r++,
            t = 0,
            n = a.$activeItems.length; t < n; t++)
                i.push($(a.$activeItems[t]).attr("data-value"));
            e && (e.preventDefault(),
            e.stopPropagation())
        } else
            (a.isFocused || "single" === a.settings.mode) && a.items.length && (l < 0 && 0 === p.start && 0 === p.length ? i.push(a.items[a.caretPos - 1]) : 0 < l && p.start === a.$control_input.val().length && i.push(a.items[a.caretPos]));
        if (!i.length || "function" == typeof a.settings.onDelete && !1 === a.settings.onDelete.apply(a, [i]))
            return !1;
        for (void 0 !== r && a.setCaret(r); i.length; )
            a.removeItem(i.pop());
        return a.showInput(),
        a.positionDropdown(),
        a.refreshOptions(!0),
        o && (s = a.getOption(o)).length && a.setActiveOption(s),
        !0
    },
    advanceSelection: function(e, t) {
        var n, i, o, s = this;
        0 !== e && (s.rtl && (e *= -1),
        o = 0 < e ? "last" : "first",
        n = getSelection(s.$control_input[0]),
        s.isFocused && !s.isInputHidden ? (i = s.$control_input.val().length,
        (e < 0 ? 0 !== n.start || 0 !== n.length : n.start !== i) || i || s.advanceCaret(e, t)) : (o = s.$control.children(".active:" + o)).length && (o = s.$control.children(":not(input)").index(o),
        s.setActiveItem(null),
        s.setCaret(0 < e ? o + 1 : o)))
    },
    advanceCaret: function(e, t) {
        var n, i = this;
        0 !== e && (n = 0 < e ? "next" : "prev",
        i.isShiftDown ? (n = i.$control_input[n]()).length && (i.hideInput(),
        i.setActiveItem(n),
        t && t.preventDefault()) : i.setCaret(i.caretPos + e))
    },
    setCaret: function(e) {
        var t = this;
        if (e = "single" === t.settings.mode ? t.items.length : Math.max(0, Math.min(t.items.length, e)),
        !t.isPending)
            for (var n, i = t.$control.children(":not(input)"), o = 0, s = i.length; o < s; o++)
                n = $(i[o]).detach(),
                o < e ? t.$control_input.before(n) : t.$control.append(n);
        t.caretPos = e
    },
    lock: function() {
        this.close(),
        this.isLocked = !0,
        this.refreshState()
    },
    unlock: function() {
        this.isLocked = !1,
        this.refreshState()
    },
    disable: function() {
        this.$input.prop("disabled", !0),
        this.$control_input.prop("disabled", !0).prop("tabindex", -1),
        this.isDisabled = !0,
        this.lock()
    },
    enable: function() {
        var e = this;
        e.$input.prop("disabled", !1),
        e.$control_input.prop("disabled", !1).prop("tabindex", e.tabIndex),
        e.isDisabled = !1,
        e.unlock()
    },
    destroy: function() {
        var e = this
          , t = e.eventNS
          , n = e.revertSettings;
        e.trigger("destroy"),
        e.off(),
        e.$wrapper.remove(),
        e.$dropdown.remove(),
        e.$input.html("").append(n.$children).removeAttr("tabindex").removeClass("selectized").attr({
            tabindex: n.tabindex
        }).show(),
        e.$control_input.removeData("grow"),
        e.$input.removeData("selectize"),
        0 == --Selectize.count && Selectize.$testInput && (Selectize.$testInput.remove(),
        Selectize.$testInput = void 0),
        $(window).off(t),
        $(document).off(t),
        $(document.body).off(t),
        delete e.$input[0].selectize
    },
    render: function(e, t) {
        var n, i, o = "", s = !1, r = this;
        return "option" !== e && "item" !== e || (s = !!(n = hash_key(t[r.settings.valueField]))),
        s && (isset(r.renderCache[e]) || (r.renderCache[e] = {}),
        r.renderCache[e].hasOwnProperty(n)) ? r.renderCache[e][n] : (o = $(r.settings.render[e].apply(this, [t, escape_html])),
        "option" === e || "option_create" === e ? t[r.settings.disabledField] || o.attr("data-selectable", "") : "optgroup" === e && (i = t[r.settings.optgroupValueField] || "",
        o.attr("data-group", i),
        t[r.settings.disabledField] && o.attr("data-disabled", "")),
        "option" !== e && "item" !== e || o.attr("data-value", n || ""),
        s && (r.renderCache[e][n] = o[0]),
        o[0])
    },
    clearCache: function(e) {
        void 0 === e ? this.renderCache = {} : delete this.renderCache[e]
    },
    canCreate: function(e) {
        if (!this.settings.create)
            return !1;
        var t = this.settings.createFilter;
        return e.length && ("function" != typeof t || t.apply(this, [e])) && ("string" != typeof t || new RegExp(t).test(e)) && (!(t instanceof RegExp) || t.test(e))
    }
}),
Selectize.count = 0,
Selectize.defaults = {
    options: [],
    optgroups: [],
    plugins: [],
    delimiter: ",",
    splitOn: null,
    persist: !0,
    diacritics: !0,
    create: !1,
    createOnBlur: !1,
    createFilter: null,
    highlight: !0,
    openOnFocus: !0,
    maxOptions: 1e3,
    maxItems: null,
    hideSelected: null,
    addPrecedence: !1,
    selectOnTab: !0,
    preload: !1,
    allowEmptyOption: !1,
    closeAfterSelect: !1,
    scrollDuration: 60,
    loadThrottle: 300,
    loadingClass: "loading",
    dataAttr: "data-data",
    optgroupField: "optgroup",
    valueField: "value",
    labelField: "text",
    disabledField: "disabled",
    optgroupLabelField: "label",
    optgroupValueField: "value",
    lockOptgroupOrder: !1,
    sortField: "$order",
    searchField: ["text"],
    searchConjunction: "and",
    mode: null,
    wrapperClass: "selectize-control",
    inputClass: "selectize-input",
    dropdownClass: "selectize-dropdown",
    dropdownContentClass: "selectize-dropdown-content",
    dropdownParent: null,
    copyClassesToDropdown: !0,
    render: {}
},
$.fn.selectize = function(i) {
    function o(e, r) {
        function a(e) {
            return "string" == typeof (e = d && e.attr(d)) && e.length ? JSON.parse(e) : null
        }
        function l(e, t) {
            e = $(e);
            var n, i = hash_key(e.val());
            (i || c.allowEmptyOption) && (p.hasOwnProperty(i) ? t && ((n = p[i][f]) ? $.isArray(n) ? n.push(t) : p[i][f] = [n, t] : p[i][f] = t) : ((n = a(e) || {})[u] = n[u] || e.text(),
            n[h] = n[h] || i,
            n[g] = n[g] || e.prop("disabled"),
            n[f] = n[f] || t,
            p[i] = n,
            s.push(n),
            e.is(":selected") && r.items.push(i)))
        }
        var t, n, i, o, s = r.options, p = {};
        for (r.maxItems = e.attr("multiple") ? null : 1,
        t = 0,
        n = (o = e.children()).length; t < n; t++)
            "optgroup" === (i = o[t].tagName.toLowerCase()) ? function(e) {
                var t, n, i, o, s;
                for ((i = (e = $(e)).attr("label")) && ((o = a(e) || {})[v] = i,
                o[m] = i,
                o[g] = e.prop("disabled"),
                r.optgroups.push(o)),
                t = 0,
                n = (s = $("option", e)).length; t < n; t++)
                    l(s[t], i)
            }(o[t]) : "option" === i && l(o[t])
    }
    var s = $.fn.selectize.defaults
      , c = $.extend({}, s, i)
      , d = c.dataAttr
      , u = c.labelField
      , h = c.valueField
      , g = c.disabledField
      , f = c.optgroupField
      , v = c.optgroupLabelField
      , m = c.optgroupValueField;
    return this.each(function() {
        var e, t, n;
        this.selectize || (e = $(this),
        t = this.tagName.toLowerCase(),
        (n = e.attr("placeholder") || e.attr("data-placeholder")) || c.allowEmptyOption || (n = e.children('option[value=""]').text()),
        ("select" === t ? o : function(e, t) {
            var n, i, o, s, r = e.attr(d);
            if (r)
                for (t.options = JSON.parse(r),
                n = 0,
                i = t.options.length; n < i; n++)
                    t.items.push(t.options[n][h]);
            else {
                e = $.trim(e.val() || "");
                if (c.allowEmptyOption || e.length) {
                    for (n = 0,
                    i = (o = e.split(c.delimiter)).length; n < i; n++)
                        (s = {})[u] = o[n],
                        s[h] = o[n],
                        t.options.push(s);
                    t.items = o
                }
            }
        }
        )(e, n = {
            placeholder: n,
            options: [],
            optgroups: [],
            items: []
        }),
        new Selectize(e,$.extend(!0, {}, s, n, i)))
    })
}
,
$.fn.selectize.defaults = Selectize.defaults,
$.fn.selectize.support = {
    validity: SUPPORTS_VALIDITY_API
},
Selectize.define("autofill_disable", function(e) {
    var t, n = this;
    n.setup = (t = n.setup,
    function() {
        t.apply(n, arguments),
        n.$control_input.attr({
            autocomplete: "new-password",
            autofill: "no"
        })
    }
    )
}),
Selectize.define("drag_drop", function(e) {
    if (!$.fn.sortable)
        throw new Error('The "drag_drop" plugin requires jQuery UI "sortable".');
    var i, t, n, o;
    "multi" === this.settings.mode && ((i = this).lock = (t = i.lock,
    function() {
        var e = i.$control.data("sortable");
        return e && e.disable(),
        t.apply(i, arguments)
    }
    ),
    i.unlock = (n = i.unlock,
    function() {
        var e = i.$control.data("sortable");
        return e && e.enable(),
        n.apply(i, arguments)
    }
    ),
    i.setup = (o = i.setup,
    function() {
        o.apply(this, arguments);
        var n = i.$control.sortable({
            items: "[data-value]",
            forcePlaceholderSize: !0,
            disabled: i.isLocked,
            start: function(e, t) {
                t.placeholder.css("width", t.helper.css("width")),
                n.css({
                    overflow: "visible"
                })
            },
            stop: function() {
                n.css({
                    overflow: "hidden"
                });
                var e = i.$activeItems ? i.$activeItems.slice() : null
                  , t = [];
                n.children("[data-value]").each(function() {
                    t.push($(this).attr("data-value"))
                }),
                i.setValue(t),
                i.setActiveItem(e)
            }
        })
    }
    ))
}),
Selectize.define("dropdown_header", function(e) {
    var t, n = this;
    e = $.extend({
        title: "Untitled",
        headerClass: "selectize-dropdown-header",
        titleRowClass: "selectize-dropdown-header-title",
        labelClass: "selectize-dropdown-header-label",
        closeClass: "selectize-dropdown-header-close",
        html: function(e) {
            return '<div class="' + e.headerClass + '"><div class="' + e.titleRowClass + '"><span class="' + e.labelClass + '">' + e.title + '</span><a href="javascript:void(0)" class="' + e.closeClass + '">&times;</a></div></div>'
        }
    }, e),
    n.setup = (t = n.setup,
    function() {
        t.apply(n, arguments),
        n.$dropdown_header = $(e.html(e)),
        n.$dropdown.prepend(n.$dropdown_header)
    }
    )
}),
Selectize.define("optgroup_columns", function(r) {
    var i, a = this;
    r = $.extend({
        equalizeWidth: !0,
        equalizeHeight: !0
    }, r),
    this.getAdjacentOption = function(e, t) {
        var n = e.closest("[data-group]").find("[data-selectable]")
          , t = n.index(e) + t;
        return 0 <= t && t < n.length ? n.eq(t) : $()
    }
    ,
    this.onKeyDown = (i = a.onKeyDown,
    function(e) {
        var t, n;
        return !this.isOpen || e.keyCode !== KEY_LEFT && e.keyCode !== KEY_RIGHT ? i.apply(this, arguments) : (a.ignoreHover = !0,
        t = (n = this.$activeOption.closest("[data-group]")).find("[data-selectable]").index(this.$activeOption),
        void ((t = (n = (n = e.keyCode === KEY_LEFT ? n.prev("[data-group]") : n.next("[data-group]")).find("[data-selectable]")).eq(Math.min(n.length - 1, t))).length && this.setActiveOption(t)))
    }
    );
    function e() {
        var e, t, n, i, o = $("[data-group]", a.$dropdown_content), s = o.length;
        if (s && a.$dropdown_content.width()) {
            if (r.equalizeHeight) {
                for (e = t = 0; e < s; e++)
                    t = Math.max(t, o.eq(e).height());
                o.css({
                    height: t
                })
            }
            r.equalizeWidth && (i = a.$dropdown_content.innerWidth() - l(),
            n = Math.round(i / s),
            o.css({
                width: n
            }),
            1 < s && (n = i - n * (s - 1),
            o.eq(s - 1).css({
                width: n
            })))
        }
    }
    var l = function() {
        var e, t = l.width, n = document;
        return void 0 === t && ((e = n.createElement("div")).innerHTML = '<div style="width:50px;height:50px;position:absolute;left:-50px;top:-50px;overflow:auto;"><div style="width:1px;height:100px;"></div></div>',
        e = e.firstChild,
        n.body.appendChild(e),
        t = l.width = e.offsetWidth - e.clientWidth,
        n.body.removeChild(e)),
        t
    };
    (r.equalizeHeight || r.equalizeWidth) && (hook.after(this, "positionDropdown", e),
    hook.after(this, "refreshOptions", e))
}),
Selectize.define("remove_button", function(e) {
    e = $.extend({
        label: "&times;",
        title: "Remove",
        className: "remove",
        append: !0
    }, e);
    var s, t, n, i, r;
    "single" === this.settings.mode ? function(o, t) {
        t.className = "remove-single";
        var n, s = o, r = '<a href="javascript:void(0)" class="' + t.className + '" tabindex="-1" title="' + escape_html(t.title) + '">' + t.label + "</a>";
        o.setup = (n = s.setup,
        function() {
            var e, i;
            t.append && (e = $(s.$input.context).attr("id"),
            $("#" + e),
            i = s.settings.render.item,
            s.settings.render.item = function(e) {
                return t = i.apply(o, arguments),
                n = r,
                $("<span>").append(t).append(n);
                var t, n
            }
            ),
            n.apply(o, arguments),
            o.$control.on("click", "." + t.className, function(e) {
                e.preventDefault(),
                s.isLocked || s.clear()
            })
        }
        )
    }(this, e) : (i = s = this,
    r = '<a href="javascript:void(0)" class="' + (t = e).className + '" tabindex="-1" title="' + escape_html(t.title) + '">' + t.label + "</a>",
    s.setup = (n = i.setup,
    function() {
        var o;
        t.append && (o = i.settings.render.item,
        i.settings.render.item = function(e) {
            return t = o.apply(s, arguments),
            n = r,
            i = t.search(/(<\/[^>]+>\s*)$/),
            t.substring(0, i) + n + t.substring(i);
            var t, n, i
        }
        ),
        n.apply(s, arguments),
        s.$control.on("click", "." + t.className, function(e) {
            if (e.preventDefault(),
            !i.isLocked) {
                e = $(e.currentTarget).parent();
                return i.setActiveItem(e),
                i.deleteSelection() && i.setCaret(i.items.length),
                !1
            }
        })
    }
    ))
}),
Selectize.define("restore_on_backspace", function(n) {
    var i, e = this;
    n.text = n.text || function(e) {
        return e[this.settings.labelField]
    }
    ,
    this.onKeyDown = (i = e.onKeyDown,
    function(e) {
        var t;
        return e.keyCode === KEY_BACKSPACE && "" === this.$control_input.val() && !this.$activeItems.length && 0 <= (t = this.caretPos - 1) && t < this.items.length ? (t = this.options[this.items[t]],
        this.deleteSelection(e) && (this.setTextboxValue(n.text.apply(this, [t])),
        this.refreshOptions(!0)),
        void e.preventDefault()) : i.apply(this, arguments)
    }
    )
});
