! function (e) {
	if ("function" == typeof bootstrap) bootstrap("simplewebrtc", e);
	else if ("object" == typeof exports) module.exports = e();
	else if ("function" == typeof define && define.amd) define(e);
	else if ("undefined" != typeof ses) {
		if (!ses.ok()) return;
		ses.makeSimpleWebRTC = e
	} else "undefined" != typeof window ? window.SimpleWebRTC = e() : global.SimpleWebRTC = e()
}(function () {
	var define, ses, bootstrap, module, exports;
	return function (e, t, n) {
		function o(n, r) {
			if (!t[n]) {
				if (!e[n]) {
					var s = "function" == typeof require && require;
					if (!r && s) return s(n, !0);
					if (i) return i(n, !0);
					throw new Error("Cannot find module '" + n + "'")
				}
				var a = t[n] = {
					exports: {}
				};
				e[n][0].call(a.exports, function (t) {
					var i = e[n][1][t];
					return o(i ? i : t)
				}, a, a.exports)
			}
			return t[n].exports
		}
		for (var i = "function" == typeof require && require, r = 0; r < n.length; r++) o(n[r]);
		return o
	}({
		1: [
		function (e, t) {
			function n(e) {
				var t, n, s = this,
		a = e || {}, u = this.config = {
			url: "http://127.0.0.1:9898",
		debug: !1,
		localVideoEl: "",
		remoteVideosEl: "",
		enableDataChannels: !0,
		autoRequestMedia: !1,
		autoRemoveVideos: !0,
		adjustPeerVolume: !0,
		peerVolumeWhenSpeaking: .25
		};
	this.logger = function () {
		return e.debug ? e.logger || console : e.logger || c
	}();
	for (t in a) this.config[t] = a[t];
	this.capabilities = r, i.call(this), n = this.connection = p.connect(this.config.url), n.on("connect", function () {
		s.emit("connectionReady", n.socket.sessionid), s.sessionReady = !0, s.testReadiness()
	}), n.on("message", function (e) {
		var t, n = s.webrtc.getPeers(e.from, e.roomType);
		"offer" === e.type ? (t = n.length ? n[0] : s.webrtc.createPeer({
			id: e.from,
			type: e.roomType,
			sharemyscreen: "screen" === e.roomType && !e.broadcaster
		}), t.handleMessage(e)) : n.length && n.forEach(function (t) {
			t.handleMessage(e)
		})
	}), n.on("remove", function (e) {
		e.id !== s.connection.socket.sessionid && s.webrtc.removePeers(e.id, e.type)
	}), e.logger = this.logger, e.debug = !1, this.webrtc = new o(e), ["mute", "unmute", "pause", "resume"].forEach(function (e) {
		s[e] = s.webrtc[e].bind(s.webrtc)
	}), this.webrtc.on("*", function () {
		s.emit.apply(s, arguments)
	}), u.debug && this.on("*", this.logger.log.bind(this.logger, "SimpleWebRTC event:")), this.webrtc.on("localStream", function () {
		s.testReadiness()
	}), this.webrtc.on("message", function (e) {
		s.connection.emit("message", e)
	}), this.webrtc.on("peerStreamAdded", this.handlePeerStreamAdded.bind(this)), this.webrtc.on("peerStreamRemoved", this.handlePeerStreamRemoved.bind(this)), this.config.adjustPeerVolume && (this.webrtc.on("speaking", this.setVolumeForAll.bind(this, this.config.peerVolumeWhenSpeaking)), this.webrtc.on("stoppedSpeaking", this.setVolumeForAll.bind(this, 1))), this.config.autoRequestMedia && this.startLocalVideo()
			}
			var o = e("webrtc"),
			    i = e("wildemitter"),
			    r = e("webrtcsupport"),
			    s = e("attachmediastream"),
			    a = e("getscreenmedia"),
			    c = e("mockconsole"),
			    p = e("socket.io-client");
			n.prototype = Object.create(i.prototype, {
				constructor: {
					value: n
				}
			}), n.prototype.leaveRoom = function () {
				this.roomName && (this.connection.emit("leave", this.roomName), this.webrtc.peers.forEach(function (e) {
					e.end()
				}), this.getLocalScreen() && this.stopScreenShare(), this.emit("leftRoom", this.roomName))
			}, n.prototype.handlePeerStreamAdded = function (e) {
				var t = this.getRemoteVideoContainer(),
				    n = s(e.stream);
				e.videoEl = n, n.id = this.getDomId(e), t && t.appendChild(n), this.emit("videoAdded", n, e)
			}, n.prototype.handlePeerStreamRemoved = function (e) {
				var t = this.getRemoteVideoContainer(),
				    n = e.videoEl;
				this.config.autoRemoveVideos && t && n && t.removeChild(n), n && this.emit("videoRemoved", n, e)
			}, n.prototype.getDomId = function (e) {
				return [e.id, e.type, e.broadcaster ? "broadcasting" : "incoming"].join("_")
			}, n.prototype.setVolumeForAll = function (e) {
				this.webrtc.peers.forEach(function (t) {
					t.videoEl && (t.videoEl.volume = e)
				})
			}, n.prototype.joinRoom = function (e, t) {
				var n = this;
				this.roomName = e, this.connection.emit("join", e, function (o, i) {
					if (o) n.emit("error", o);
					else {
						var r, s, a, c;
						for (r in i.clients) {
							s = i.clients[r];
							for (a in s) s[a] && (c = n.webrtc.createPeer({
								id: r,
							    type: a
							}), c.start())
						}
					}
				t && t(o, i), n.emit("joinedRoom", e)
				})
			}, n.prototype.getEl = function (e) {
				return "string" == typeof e ? document.getElementById(e) : e
			}, n.prototype.startLocalVideo = function () {
				var e = this;
				this.webrtc.startLocalMedia(null, function (t, n) {
					t ? e.emit(t) : s(n, e.getLocalVideoContainer(), {
						muted: !0,
					  mirror: !0
					})
				})
			}, n.prototype.stopLocalVideo = function () {
				this.webrtc.stopLocalMedia()
			}, n.prototype.getLocalVideoContainer = function () {
				var e = this.getEl(this.config.localVideoEl);
				if (e && "VIDEO" === e.tagName) return e;
				if (e) {
					var t = document.createElement("video");
					return e.appendChild(t), t
				}
			}, n.prototype.getRemoteVideoContainer = function () {
				return this.getEl(this.config.remoteVideosEl)
			}, n.prototype.shareScreen = function (e) {
				var t = this;
				a(function (n, o) {
					var i = document.createElement("video"),
					r = t.getRemoteVideoContainer();
				n ? t.emit(n) : (t.webrtc.localScreen = o, i.id = "localScreen", s(o, i), r && r.appendChild(i), t.emit("localScreenAdded", i), t.connection.emit("shareScreen"), t.webrtc.peers.forEach(function (e) {
					var n;
					"video" === e.type && (n = t.webrtc.createPeer({
						id: e.id,
						type: "screen",
						sharemyscreen: !0,
						broadcaster: t.connection.socket.sessionid
					}), n.start())
				})), e && e(n, o)
				})
			}, n.prototype.getLocalScreen = function () {
				return this.webrtc.localScreen
			}, n.prototype.stopScreenShare = function () {
				this.connection.emit("unshareScreen");
				var e = document.getElementById("localScreen"),
				    t = this.getRemoteVideoContainer(),
				    n = this.getLocalScreen();
				this.config.autoRemoveVideos && t && e && t.removeChild(e), e && this.emit("videoRemoved", e), n && n.stop(), this.webrtc.peers.forEach(function (e) {
					e.broadcaster && e.end()
				}), delete this.webrtc.localScreen
			}, n.prototype.testReadiness = function () {
				var e = this;
				this.webrtc.localStream && this.sessionReady && setTimeout(function () {
					e.emit("readyToCall", e.connection.socket.sessionid)
				}, 1e3)
			}, n.prototype.createRoom = function (e, t) {
				2 === arguments.length ? this.connection.emit("create", e, t) : this.connection.emit("create", e)
			}, n.prototype.sendFile = function () {
				return r.dataChannel ? void 0 : this.emit("error", new Error("DataChannelNotSupported"))
			}, t.exports = n
		}, {
			attachmediastream: 5,
			getscreenmedia: 6,
			mockconsole: 7,
			"socket.io-client": 8,
			webrtc: 2,
			webrtcsupport: 4,
			wildemitter: 3
		}
	],
		3: [
			function (e, t) {
				function n() {
					this.callbacks = {}
				}
				t.exports = n, n.prototype.on = function (e) {
					var t = 3 === arguments.length,
					n = t ? arguments[1] : void 0,
					o = t ? arguments[2] : arguments[1];
					return o._groupName = n, (this.callbacks[e] = this.callbacks[e] || []).push(o), this
				}, n.prototype.once = function (e) {
					function t() {
						n.off(e, t), r.apply(this, arguments)
					}
					var n = this,
					    o = 3 === arguments.length,
					    i = o ? arguments[1] : void 0,
					    r = o ? arguments[2] : arguments[1];
					return this.on(e, i, t), this
				}, n.prototype.releaseGroup = function (e) {
					var t, n, o, i;
					for (t in this.callbacks)
						for (i = this.callbacks[t], n = 0, o = i.length; o > n; n++) i[n]._groupName === e && (i.splice(n, 1), n--, o--);
					return this
				}, n.prototype.off = function (e, t) {
					var n, o = this.callbacks[e];
					return o ? 1 === arguments.length ? (delete this.callbacks[e], this) : (n = o.indexOf(t), o.splice(n, 1), this) : this
				}, n.prototype.emit = function (e) {
					var t, n, o = [].slice.call(arguments, 1),
					    i = this.callbacks[e],
					    r = this.getWildcardCallbacks(e);
					if (i)
						for (t = 0, n = i.length; n > t && i[t]; ++t) i[t].apply(this, o);
					if (r)
						for (t = 0, n = r.length; n > t && r[t]; ++t) r[t].apply(this, [e].concat(o));
					return this
				}, n.prototype.getWildcardCallbacks = function (e) {
					var t, n, o = [];
					for (t in this.callbacks) n = t.split("*"), ("*" === t || 2 === n.length && e.slice(0, n[1].length) === n[1]) && (o = o.concat(this.callbacks[t]));
					return o
				}
			}, {}
	],
		4: [
			function (e, t) {
				var n, o = !1,
				i = !1,
				r = navigator.userAgent.toLowerCase(); - 1 !== r.indexOf("firefox") ? (n = "moz", i = !0) : -1 !== r.indexOf("chrome") && (n = "webkit", o = !0);
				var s = window.mozRTCPeerConnection || window.webkitRTCPeerConnection,
				    a = window.mozRTCIceCandidate || window.RTCIceCandidate,
				    c = window.mozRTCSessionDescription || window.RTCSessionDescription,
				    p = window.webkitMediaStream || window.MediaStream,
				    u = navigator.userAgent.match("Chrome") && parseInt(navigator.userAgent.match(/Chrome\/(.*) /)[1], 10) >= 26,
				    h = window.webkitAudioContext || window.AudioContext;
				t.exports = {
					support: !! s,
					dataChannel: o || i || s && s.prototype && s.prototype.createDataChannel,
					prefix: n,
					webAudio: !(!h || !h.prototype.createMediaStreamSource),
					mediaStream: !(!p || !p.prototype.removeTrack),
					screenSharing: !! u,
					AudioContext: h,
					PeerConnection: s,
					SessionDescription: c,
					IceCandidate: a
				}
			}, {}
	],
		5: [
			function (e, t) {
				t.exports = function (e, t, n) {
					var o, i = window.URL,
					r = {
						autoplay: !0,
						mirror: !1,
						muted: !1
					}, s = t || document.createElement("video");
					if (n)
						for (o in n) r[o] = n[o];
					if (r.autoplay && (s.autoplay = "autoplay"), r.muted && (s.muted = !0), r.mirror && ["", "moz", "webkit", "o", "ms"].forEach(function (e) {
						var t = e ? e + "Transform" : "transform";
						s.style[t] = "scaleX(-1)"
					}), i && i.createObjectURL) s.src = i.createObjectURL(e);
					else if (s.srcObject) s.srcObject = e;
					else {
						if (!s.mozSrcObject) return !1;
						s.mozSrcObject = e
					}
					return s
				}
			}, {}
	],
		7: [
			function (e, t) {
				for (var n = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","), o = n.length, i = function () {}, r = {}; o--;) r[n[o]] = i;
				t.exports = r
			}, {}
	],
		8: [
			function (require, module, exports) {
				var io = "undefined" == typeof module ? {} : module.exports;
				! function () {
					if (function (e, t) {
						var n = e;
						n.version = "0.9.16", n.protocol = 1, n.transports = [], n.j = [], n.sockets = {}, n.connect = function (e, o) {
							var i, r, s = n.util.parseUri(e);
							t && t.location && (s.protocol = s.protocol || t.location.protocol.slice(0, -1), s.host = s.host || (t.document ? t.document.domain : t.location.hostname), s.port = s.port || t.location.port), i = n.util.uniqueUri(s);
							var a = {
								host: s.host,
					   secure: "https" == s.protocol,
					   port: s.port || ("https" == s.protocol ? 443 : 80),
					   query: s.query || ""
							};
							return n.util.merge(a, o), (a["force new connection"] || !n.sockets[i]) && (r = new n.Socket(a)), !a["force new connection"] && r && (n.sockets[i] = r), r = r || n.sockets[i], r.of(s.path.length > 1 ? s.path : "")
						}
					}("object" == typeof module ? module.exports : this.io = {}, this), function (e, t) {
						var n = e.util = {}, o = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
					   i = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
					n.parseUri = function (e) {
						for (var t = o.exec(e || ""), n = {}, r = 14; r--;) n[i[r]] = t[r] || "";
						return n
					}, n.uniqueUri = function (e) {
						var n = e.protocol,
						    o = e.host,
						    i = e.port;
						return "document" in t ? (o = o || document.domain, i = i || ("https" == n && "https:" !== document.location.protocol ? 443 : document.location.port)) : (o = o || "localhost", i || "https" != n || (i = 443)), (n || "http") + "://" + o + ":" + (i || 80)
					}, n.query = function (e, t) {
						var o = n.chunkQuery(e || ""),
						    i = [];
						n.merge(o, n.chunkQuery(t || ""));
						for (var r in o) o.hasOwnProperty(r) && i.push(r + "=" + o[r]);
						return i.length ? "?" + i.join("&") : ""
					}, n.chunkQuery = function (e) {
						for (var t, n = {}, o = e.split("&"), i = 0, r = o.length; r > i; ++i) t = o[i].split("="), t[0] && (n[t[0]] = t[1]);
						return n
					};
					var r = !1;
					n.load = function (e) {
						return "document" in t && "complete" === document.readyState || r ? e() : (n.on(t, "load", e, !1), void 0)
					}, n.on = function (e, t, n, o) {
						e.attachEvent ? e.attachEvent("on" + t, n) : e.addEventListener && e.addEventListener(t, n, o)
					}, n.request = function (e) {
						if (e && "undefined" != typeof XDomainRequest && !n.ua.hasCORS) return new XDomainRequest;
						if ("undefined" != typeof XMLHttpRequest && (!e || n.ua.hasCORS)) return new XMLHttpRequest;
						if (!e) try {
							return new(window[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")
						} catch (t) {}
						return null
					}, "undefined" != typeof window && n.load(function () {
						r = !0
					}), n.defer = function (e) {
						return n.ua.webkit && "undefined" == typeof importScripts ? (n.load(function () {
							setTimeout(e, 100)
						}), void 0) : e()
					}, n.merge = function (e, t, o, i) {
						var r, s = i || [],
						    a = "undefined" == typeof o ? 2 : o;
						for (r in t) t.hasOwnProperty(r) && n.indexOf(s, r) < 0 && ("object" == typeof e[r] && a ? n.merge(e[r], t[r], a - 1, s) : (e[r] = t[r], s.push(t[r])));
						return e
					}, n.mixin = function (e, t) {
						n.merge(e.prototype, t.prototype)
					}, n.inherit = function (e, t) {
						function n() {}
						n.prototype = t.prototype, e.prototype = new n
					}, n.isArray = Array.isArray || function (e) {
						return "[object Array]" === Object.prototype.toString.call(e)
					}, n.intersect = function (e, t) {
						for (var o = [], i = e.length > t.length ? e : t, r = e.length > t.length ? t : e, s = 0, a = r.length; a > s; s++)~ n.indexOf(i, r[s]) && o.push(r[s]);
						return o
					}, n.indexOf = function (e, t, n) {
						for (var o = e.length, n = 0 > n ? 0 > n + o ? 0 : n + o : n || 0; o > n && e[n] !== t; n++);
						return n >= o ? -1 : n
					}, n.toArray = function (e) {
						for (var t = [], n = 0, o = e.length; o > n; n++) t.push(e[n]);
						return t
					}, n.ua = {}, n.ua.hasCORS = "undefined" != typeof XMLHttpRequest && function () {
						try {
							var e = new XMLHttpRequest
						} catch (t) {
							return !1
						}
						return void 0 != e.withCredentials
					}(), n.ua.webkit = "undefined" != typeof navigator && /webkit/i.test(navigator.userAgent), n.ua.iDevice = "undefined" != typeof navigator && /iPad|iPhone|iPod/i.test(navigator.userAgent)
					}("undefined" != typeof io ? io : module.exports, this), function (e, t) {
						function n() {}
						e.EventEmitter = n, n.prototype.on = function (e, n) {
							return this.$events || (this.$events = {}), this.$events[e] ? t.util.isArray(this.$events[e]) ? this.$events[e].push(n) : this.$events[e] = [this.$events[e], n] : this.$events[e] = n, this
						}, n.prototype.addListener = n.prototype.on, n.prototype.once = function (e, t) {
							function n() {
								o.removeListener(e, n), t.apply(this, arguments)
							}
							var o = this;
							return n.listener = t, this.on(e, n), this
						}, n.prototype.removeListener = function (e, n) {
							if (this.$events && this.$events[e]) {
								var o = this.$events[e];
								if (t.util.isArray(o)) {
									for (var i = -1, r = 0, s = o.length; s > r; r++)
										if (o[r] === n || o[r].listener && o[r].listener === n) {
											i = r;
											break
										}
									if (0 > i) return this;
									o.splice(i, 1), o.length || delete this.$events[e]
								} else(o === n || o.listener && o.listener === n) && delete this.$events[e]
							}
							return this
						}, n.prototype.removeAllListeners = function (e) {
							return void 0 === e ? (this.$events = {}, this) : (this.$events && this.$events[e] && (this.$events[e] = null), this)
						}, n.prototype.listeners = function (e) {
							return this.$events || (this.$events = {}), this.$events[e] || (this.$events[e] = []), t.util.isArray(this.$events[e]) || (this.$events[e] = [this.$events[e]]), this.$events[e]
						}, n.prototype.emit = function (e) {
							if (!this.$events) return !1;
							var n = this.$events[e];
							if (!n) return !1;
							var o = Array.prototype.slice.call(arguments, 1);
							if ("function" == typeof n) n.apply(this, o);
							else {
								if (!t.util.isArray(n)) return !1;
								for (var i = n.slice(), r = 0, s = i.length; s > r; r++) i[r].apply(this, o)
							}
							return !0
						}
					}("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), function (exports, nativeJSON) {
						"use strict";

						function f(e) {
							return 10 > e ? "0" + e : e
						}

						function date(e) {
							return isFinite(e.valueOf()) ? e.getUTCFullYear() + "-" + f(e.getUTCMonth() + 1) + "-" + f(e.getUTCDate()) + "T" + f(e.getUTCHours()) + ":" + f(e.getUTCMinutes()) + ":" + f(e.getUTCSeconds()) + "Z" : null
						}

						function quote(e) {
							return escapable.lastIndex = 0, escapable.test(e) ? '"' + e.replace(escapable, function (e) {
								var t = meta[e];
								return "string" == typeof t ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
							}) + '"' : '"' + e + '"'
						}

						function str(e, t) {
							var n, o, i, r, s, a = gap,
							    c = t[e];
							switch (c instanceof Date && (c = date(e)), "function" == typeof rep && (c = rep.call(t, e, c)), typeof c) {
								case "string":
									return quote(c);
								case "number":
									return isFinite(c) ? String(c) : "null";
								case "boolean":
								case "null":
									return String(c);
								case "object":
									if (!c) return "null";
									if (gap += indent, s = [], "[object Array]" === Object.prototype.toString.apply(c)) {
										for (r = c.length, n = 0; r > n; n += 1) s[n] = str(n, c) || "null";
										return i = 0 === s.length ? "[]" : gap ? "[\n" + gap + s.join(",\n" + gap) + "\n" + a + "]" : "[" + s.join(",") + "]", gap = a, i
									}
									if (rep && "object" == typeof rep)
										for (r = rep.length, n = 0; r > n; n += 1) "string" == typeof rep[n] && (o = rep[n], i = str(o, c), i && s.push(quote(o) + (gap ? ": " : ":") + i));
									else
										for (o in c) Object.prototype.hasOwnProperty.call(c, o) && (i = str(o, c), i && s.push(quote(o) + (gap ? ": " : ":") + i));
									return i = 0 === s.length ? "{}" : gap ? "{\n" + gap + s.join(",\n" + gap) + "\n" + a + "}" : "{" + s.join(",") + "}", gap = a, i
							}
						}
						if (nativeJSON && nativeJSON.parse) return exports.JSON = {
							parse: nativeJSON.parse,
								stringify: nativeJSON.stringify
						};
						var JSON = exports.JSON = {}, cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
						    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
						    gap, indent, meta = {
							    "\b": "\\b",
							    "	": "\\t",
							    "\n": "\\n",
							    "\f": "\\f",
							    "\r": "\\r",
							    '"': '\\"',
							    "\\": "\\\\"
						    }, rep;
						JSON.stringify = function (e, t, n) {
							var o;
							if (gap = "", indent = "", "number" == typeof n)
								for (o = 0; n > o; o += 1) indent += " ";
							else "string" == typeof n && (indent = n); if (rep = t, t && "function" != typeof t && ("object" != typeof t || "number" != typeof t.length)) throw new Error("JSON.stringify");
							return str("", {
								"": e
							})
						}, JSON.parse = function (text, reviver) {
							function walk(e, t) {
								var n, o, i = e[t];
								if (i && "object" == typeof i)
									for (n in i) Object.prototype.hasOwnProperty.call(i, n) && (o = walk(i, n), void 0 !== o ? i[n] = o : delete i[n]);
								return reviver.call(e, t, i)
							}
							var j;
							if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function (e) {
								return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
							})), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({
								"": j
							}, "") : j;
									throw new SyntaxError("JSON.parse")
									}
									}("undefined" != typeof io ? io : module.exports, "undefined" != typeof JSON ? JSON : void 0), function (e, t) {
										var n = e.parser = {}, o = n.packets = ["disconnect", "connect", "heartbeat", "message", "json", "event", "ack", "error", "noop"],
							   i = n.reasons = ["transport not supported", "client not handshaken", "unauthorized"],
							   r = n.advice = ["reconnect"],
							   s = t.JSON,
							   a = t.util.indexOf;
							n.encodePacket = function (e) {
								var t = a(o, e.type),
							   n = e.id || "",
							   c = e.endpoint || "",
							   p = e.ack,
							   u = null;
							switch (e.type) {
								case "error":
									var h = e.reason ? a(i, e.reason) : "",
									    l = e.advice ? a(r, e.advice) : "";
									("" !== h || "" !== l) && (u = h + ("" !== l ? "+" + l : ""));
									break;
								case "message":
									"" !== e.data && (u = e.data);
									break;
								case "event":
									var d = {
										name: e.name
									};
									e.args && e.args.length && (d.args = e.args), u = s.stringify(d);
									break;
								case "json":
									u = s.stringify(e.data);
									break;
								case "connect":
									e.qs && (u = e.qs);
									break;
								case "ack":
									u = e.ackId + (e.args && e.args.length ? "+" + s.stringify(e.args) : "")
							}
							var f = [t, n + ("data" == p ? "+" : ""), c];
							return null !== u && void 0 !== u && f.push(u), f.join(":")
							}, n.encodePayload = function (e) {
								var t = "";
								if (1 == e.length) return e[0];
								for (var n = 0, o = e.length; o > n; n++) {
									var i = e[n];
									t += "�" + i.length + "�" + e[n]
								}
								return t
							};
							var c = /([^:]+):([0-9]+)?(\+)?:([^:]+)?:?([\s\S]*)?/;
							n.decodePacket = function (e) {
								var t = e.match(c);
								if (!t) return {};
								var n = t[2] || "",
									e = t[5] || "",
									  a = {
										  type: o[t[1]],
										  endpoint: t[4] || ""
									  };
								switch (n && (a.id = n, a.ack = t[3] ? "data" : !0), a.type) {
									case "error":
										var t = e.split("+");
										a.reason = i[t[0]] || "", a.advice = r[t[1]] || "";
										break;
									case "message":
										a.data = e || "";
										break;
									case "event":
										try {
											var p = s.parse(e);
											a.name = p.name, a.args = p.args
										} catch (u) {}
										a.args = a.args || [];
										break;
									case "json":
										try {
											a.data = s.parse(e)
										} catch (u) {}
										break;
									case "connect":
										a.qs = e || "";
										break;
									case "ack":
										var t = e.match(/^([0-9]+)(\+)?(.*)/);
										if (t && (a.ackId = t[1], a.args = [], t[3])) try {
											a.args = t[3] ? s.parse(t[3]) : []
										} catch (u) {}
										break;
									case "disconnect":
									case "heartbeat":
								}
								return a
							}, n.decodePayload = function (e) {
								if ("�" == e.charAt(0)) {
									for (var t = [], o = 1, i = ""; o < e.length; o++) "�" == e.charAt(o) ? (t.push(n.decodePacket(e.substr(o + 1).substr(0, i))), o += Number(i) + 1, i = "") : i += e.charAt(o);
									return t
								}
								return [n.decodePacket(e)]
							}
									}("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), function (e, t) {
										function n(e, t) {
											this.socket = e, this.sessid = t
										}
										e.Transport = n, t.util.mixin(n, t.EventEmitter), n.prototype.heartbeats = function () {
											return !0
										}, n.prototype.onData = function (e) {
											if (this.clearCloseTimeout(), (this.socket.connected || this.socket.connecting || this.socket.reconnecting) && this.setCloseTimeout(), "" !== e) {
												var n = t.parser.decodePayload(e);
												if (n && n.length)
													for (var o = 0, i = n.length; i > o; o++) this.onPacket(n[o])
											}
											return this
										}, n.prototype.onPacket = function (e) {
											return this.socket.setHeartbeatTimeout(), "heartbeat" == e.type ? this.onHeartbeat() : ("connect" == e.type && "" == e.endpoint && this.onConnect(), "error" == e.type && "reconnect" == e.advice && (this.isOpen = !1), this.socket.onPacket(e), this)
										}, n.prototype.setCloseTimeout = function () {
											if (!this.closeTimeout) {
												var e = this;
												this.closeTimeout = setTimeout(function () {
													e.onDisconnect()
												}, this.socket.closeTimeout)
											}
										}, n.prototype.onDisconnect = function () {
											return this.isOpen && this.close(), this.clearTimeouts(), this.socket.onDisconnect(), this
										}, n.prototype.onConnect = function () {
											return this.socket.onConnect(), this
										}, n.prototype.clearCloseTimeout = function () {
											this.closeTimeout && (clearTimeout(this.closeTimeout), this.closeTimeout = null)
										}, n.prototype.clearTimeouts = function () {
											this.clearCloseTimeout(), this.reopenTimeout && clearTimeout(this.reopenTimeout)
										}, n.prototype.packet = function (e) {
											this.send(t.parser.encodePacket(e))
										}, n.prototype.onHeartbeat = function () {
											this.packet({
												type: "heartbeat"
											})
										}, n.prototype.onOpen = function () {
											this.isOpen = !0, this.clearCloseTimeout(), this.socket.onOpen()
										}, n.prototype.onClose = function () {
											this.isOpen = !1, this.socket.onClose(), this.onDisconnect()
										}, n.prototype.prepareUrl = function () {
											var e = this.socket.options;
											return this.scheme() + "://" + e.host + ":" + e.port + "/" + e.resource + "/" + t.protocol + "/" + this.name + "/" + this.sessid
										}, n.prototype.ready = function (e, t) {
											t.call(this)
										}
									}("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), function (e, t, n) {
										function o(e) {
											if (this.options = {
												port: 80,
											   secure: !1,
											   document: "document" in n ? document : !1,
											   resource: "socket.io",
											   transports: t.transports,
											   "connect timeout": 1e4,
											   "try multiple transports": !0,
											   reconnect: !0,
											   "reconnection delay": 500,
											   "reconnection limit": 1 / 0,
											   "reopen delay": 3e3,
											   "max reconnection attempts": 10,
											   "sync disconnect on unload": !1,
											   "auto connect": !0,
											   "flash policy port": 10843,
											   manualFlush: !1
											}, t.util.merge(this.options, e), this.connected = !1, this.open = !1, this.connecting = !1, this.reconnecting = !1, this.namespaces = {}, this.buffer = [], this.doBuffer = !1, this.options["sync disconnect on unload"] && (!this.isXDomain() || t.util.ua.hasCORS)) {
												var o = this;
												t.util.on(n, "beforeunload", function () {
													o.disconnectSync()
												}, !1)
											}
											this.options["auto connect"] && this.connect()
										}

										function i() {}
										e.Socket = o, t.util.mixin(o, t.EventEmitter), o.prototype.of = function (e) {
											return this.namespaces[e] || (this.namespaces[e] = new t.SocketNamespace(this, e), "" !== e && this.namespaces[e].packet({
												type: "connect"
											})), this.namespaces[e]
										}, o.prototype.publish = function () {
											this.emit.apply(this, arguments);
											var e;
											for (var t in this.namespaces) this.namespaces.hasOwnProperty(t) && (e = this.of(t), e.$emit.apply(e, arguments))
										}, o.prototype.handshake = function (e) {
											function n(t) {
												t instanceof Error ? (o.connecting = !1, o.onError(t.message)) : e.apply(null, t.split(":"))
											}
											var o = this,
											    r = this.options,
											    s = ["http" + (r.secure ? "s" : "") + ":/", r.host + ":" + r.port, r.resource, t.protocol, t.util.query(this.options.query, "t=" + +new Date)].join("/");
											if (this.isXDomain() && !t.util.ua.hasCORS) {
												var a = document.getElementsByTagName("script")[0],
													c = document.createElement("script");
												c.src = s + "&jsonp=" + t.j.length, a.parentNode.insertBefore(c, a), t.j.push(function (e) {
													n(e), c.parentNode.removeChild(c)
												})
											} else {
												var p = t.util.request();
												p.open("GET", s, !0), this.isXDomain() && (p.withCredentials = !0), p.onreadystatechange = function () {
													4 == p.readyState && (p.onreadystatechange = i, 200 == p.status ? n(p.responseText) : 403 == p.status ? o.onError(p.responseText) : (o.connecting = !1, !o.reconnecting && o.onError(p.responseText)))
												}, p.send(null)
											}
										}, o.prototype.getTransport = function (e) {
											for (var n, o = e || this.transports, i = 0; n = o[i]; i++)
												if (t.Transport[n] && t.Transport[n].check(this) && (!this.isXDomain() || t.Transport[n].xdomainCheck(this))) return new t.Transport[n](this, this.sessionid);
											return null
										}, o.prototype.connect = function (e) {
											if (this.connecting) return this;
											var n = this;
											return n.connecting = !0, this.handshake(function (o, i, r, s) {
												function a(e) {
													return n.transport && n.transport.clearTimeouts(), n.transport = n.getTransport(e), n.transport ? (n.transport.ready(n, function () {
														n.connecting = !0, n.publish("connecting", n.transport.name), n.transport.open(), n.options["connect timeout"] && (n.connectTimeoutTimer = setTimeout(function () {
															if (!n.connected && (n.connecting = !1, n.options["try multiple transports"])) {
																for (var e = n.transports; e.length > 0 && e.splice(0, 1)[0] != n.transport.name;);
																e.length ? a(e) : n.publish("connect_failed")
															}
														}, n.options["connect timeout"]))
													}), void 0) : n.publish("connect_failed")
												}
												n.sessionid = o, n.closeTimeout = 1e3 * r, n.heartbeatTimeout = 1e3 * i, n.transports || (n.transports = n.origTransports = s ? t.util.intersect(s.split(","), n.options.transports) : n.options.transports), n.setHeartbeatTimeout(), a(n.transports), n.once("connect", function () {
													clearTimeout(n.connectTimeoutTimer), e && "function" == typeof e && e()
												})
											}), this
										}, o.prototype.setHeartbeatTimeout = function () {
											if (clearTimeout(this.heartbeatTimeoutTimer), !this.transport || this.transport.heartbeats()) {
												var e = this;
												this.heartbeatTimeoutTimer = setTimeout(function () {
													e.transport.onClose()
												}, this.heartbeatTimeout)
											}
										}, o.prototype.packet = function (e) {
											return this.connected && !this.doBuffer ? this.transport.packet(e) : this.buffer.push(e), this
										}, o.prototype.setBuffer = function (e) {
											this.doBuffer = e, !e && this.connected && this.buffer.length && (this.options.manualFlush || this.flushBuffer())
										}, o.prototype.flushBuffer = function () {
											this.transport.payload(this.buffer), this.buffer = []
										}, o.prototype.disconnect = function () {
											return (this.connected || this.connecting) && (this.open && this.of("").packet({
												type: "disconnect"
											}), this.onDisconnect("booted")), this
										}, o.prototype.disconnectSync = function () {
											var e = t.util.request(),
											    n = ["http" + (this.options.secure ? "s" : "") + ":/", this.options.host + ":" + this.options.port, this.options.resource, t.protocol, "", this.sessionid].join("/") + "/?disconnect=1";
											e.open("GET", n, !1), e.send(null), this.onDisconnect("booted")
										}, o.prototype.isXDomain = function () {
											var e = n.location.port || ("https:" == n.location.protocol ? 443 : 80);
											return this.options.host !== n.location.hostname || this.options.port != e
										}, o.prototype.onConnect = function () {
											this.connected || (this.connected = !0, this.connecting = !1, this.doBuffer || this.setBuffer(!1), this.emit("connect"))
										}, o.prototype.onOpen = function () {
											this.open = !0
										}, o.prototype.onClose = function () {
											this.open = !1, clearTimeout(this.heartbeatTimeoutTimer)
										}, o.prototype.onPacket = function (e) {
											this.of(e.endpoint).onPacket(e)
										}, o.prototype.onError = function (e) {
											e && e.advice && "reconnect" === e.advice && (this.connected || this.connecting) && (this.disconnect(), this.options.reconnect && this.reconnect()), this.publish("error", e && e.reason ? e.reason : e)
										}, o.prototype.onDisconnect = function (e) {
											var t = this.connected,
											    n = this.connecting;
											this.connected = !1, this.connecting = !1, this.open = !1, (t || n) && (this.transport.close(), this.transport.clearTimeouts(), t && (this.publish("disconnect", e), "booted" != e && this.options.reconnect && !this.reconnecting && this.reconnect()))
										}, o.prototype.reconnect = function () {
											function e() {
												if (n.connected) {
													for (var e in n.namespaces) n.namespaces.hasOwnProperty(e) && "" !== e && n.namespaces[e].packet({
														type: "connect"
													});
													n.publish("reconnect", n.transport.name, n.reconnectionAttempts)
												}
												clearTimeout(n.reconnectionTimer), n.removeListener("connect_failed", t), n.removeListener("connect", t), n.reconnecting = !1, delete n.reconnectionAttempts, delete n.reconnectionDelay, delete n.reconnectionTimer, delete n.redoTransports, n.options["try multiple transports"] = i
											}

											function t() {
												return n.reconnecting ? n.connected ? e() : n.connecting && n.reconnecting ? n.reconnectionTimer = setTimeout(t, 1e3) : (n.reconnectionAttempts++ >= o ? n.redoTransports ? (n.publish("reconnect_failed"), e()) : (n.on("connect_failed", t), n.options["try multiple transports"] = !0, n.transports = n.origTransports, n.transport = n.getTransport(), n.redoTransports = !0, n.connect()) : (n.reconnectionDelay < r && (n.reconnectionDelay *= 2), n.connect(), n.publish("reconnecting", n.reconnectionDelay, n.reconnectionAttempts), n.reconnectionTimer = setTimeout(t, n.reconnectionDelay)), void 0) : void 0
											}
											this.reconnecting = !0, this.reconnectionAttempts = 0, this.reconnectionDelay = this.options["reconnection delay"];
											var n = this,
											    o = this.options["max reconnection attempts"],
											    i = this.options["try multiple transports"],
											    r = this.options["reconnection limit"];
											this.options["try multiple transports"] = !1, this.reconnectionTimer = setTimeout(t, this.reconnectionDelay), this.on("connect", t)
										}
									}("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), function (e, t) {
										function n(e, t) {
											this.socket = e, this.name = t || "", this.flags = {}, this.json = new o(this, "json"), this.ackPackets = 0, this.acks = {}
										}

										function o(e, t) {
											this.namespace = e, this.name = t
										}
										e.SocketNamespace = n, t.util.mixin(n, t.EventEmitter), n.prototype.$emit = t.EventEmitter.prototype.emit, n.prototype.of = function () {
											return this.socket.of.apply(this.socket, arguments)
										}, n.prototype.packet = function (e) {
											return e.endpoint = this.name, this.socket.packet(e), this.flags = {}, this
										}, n.prototype.send = function (e, t) {
											var n = {
												type: this.flags.json ? "json" : "message",
												data: e
											};
											return "function" == typeof t && (n.id = ++this.ackPackets, n.ack = !0, this.acks[n.id] = t), this.packet(n)
										}, n.prototype.emit = function (e) {
											var t = Array.prototype.slice.call(arguments, 1),
											    n = t[t.length - 1],
											    o = {
												    type: "event",
												    name: e
											    };
											return "function" == typeof n && (o.id = ++this.ackPackets, o.ack = "data", this.acks[o.id] = n, t = t.slice(0, t.length - 1)), o.args = t, this.packet(o)
										}, n.prototype.disconnect = function () {
											return "" === this.name ? this.socket.disconnect() : (this.packet({
												type: "disconnect"
											}), this.$emit("disconnect")), this
										}, n.prototype.onPacket = function (e) {
											function n() {
												o.packet({
													type: "ack",
												args: t.util.toArray(arguments),
												ackId: e.id
												})
											}
											var o = this;
											switch (e.type) {
												case "connect":
													this.$emit("connect");
													break;
												case "disconnect":
													"" === this.name ? this.socket.onDisconnect(e.reason || "booted") : this.$emit("disconnect", e.reason);
													break;
												case "message":
												case "json":
													var i = ["message", e.data];
													"data" == e.ack ? i.push(n) : e.ack && this.packet({
														type: "ack",
														ackId: e.id
													}), this.$emit.apply(this, i);
													break;
												case "event":
													var i = [e.name].concat(e.args);
													"data" == e.ack && i.push(n), this.$emit.apply(this, i);
													break;
												case "ack":
													this.acks[e.ackId] && (this.acks[e.ackId].apply(this, e.args), delete this.acks[e.ackId]);
													break;
												case "error":
													e.advice ? this.socket.onError(e) : "unauthorized" == e.reason ? this.$emit("connect_failed", e.reason) : this.$emit("error", e.reason)
											}
										}, o.prototype.send = function () {
											this.namespace.flags[this.name] = !0, this.namespace.send.apply(this.namespace, arguments)
										}, o.prototype.emit = function () {
											this.namespace.flags[this.name] = !0, this.namespace.emit.apply(this.namespace, arguments)
										}
									}("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports), function (e, t, n) {
										function o() {
											t.Transport.apply(this, arguments)
										}
										e.websocket = o, t.util.inherit(o, t.Transport), o.prototype.name = "websocket", o.prototype.open = function () {
											var e, o = t.util.query(this.socket.options.query),
											    i = this;
											return e || (e = n.MozWebSocket || n.WebSocket), this.websocket = new e(this.prepareUrl() + o), this.websocket.onopen = function () {
												i.onOpen(), i.socket.setBuffer(!1)
											}, this.websocket.onmessage = function (e) {
												i.onData(e.data)
											}, this.websocket.onclose = function () {
												i.onClose(), i.socket.setBuffer(!0)
											}, this.websocket.onerror = function (e) {
												i.onError(e)
											}, this
										}, o.prototype.send = t.util.ua.iDevice ? function (e) {
											var t = this;
											return setTimeout(function () {
												t.websocket.send(e)
											}, 0), this
										} : function (e) {
											return this.websocket.send(e), this
										}, o.prototype.payload = function (e) {
											for (var t = 0, n = e.length; n > t; t++) this.packet(e[t]);
											return this
										}, o.prototype.close = function () {
											return this.websocket.close(), this
										}, o.prototype.onError = function (e) {
											this.socket.onError(e)
										}, o.prototype.scheme = function () {
											return this.socket.options.secure ? "wss" : "ws"
										}, o.check = function () {
											return "WebSocket" in n && !("__addTask" in WebSocket) || "MozWebSocket" in n
										}, o.xdomainCheck = function () {
											return !0
										}, t.transports.push("websocket")
									}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), function (e, t) {
										function n() {
											t.Transport.websocket.apply(this, arguments)
										}
										e.flashsocket = n, t.util.inherit(n, t.Transport.websocket), n.prototype.name = "flashsocket", n.prototype.open = function () {
											var e = this,
											    n = arguments;
											return WebSocket.__addTask(function () {
												t.Transport.websocket.prototype.open.apply(e, n)
											}), this
										}, n.prototype.send = function () {
											var e = this,
											    n = arguments;
											return WebSocket.__addTask(function () {
												t.Transport.websocket.prototype.send.apply(e, n)
											}), this
										}, n.prototype.close = function () {
											return WebSocket.__tasks.length = 0, t.Transport.websocket.prototype.close.call(this), this
										}, n.prototype.ready = function (e, o) {
											function i() {
												var t = e.options,
												    i = t["flash policy port"],
												    s = ["http" + (t.secure ? "s" : "") + ":/", t.host + ":" + t.port, t.resource, "static/flashsocket", "WebSocketMain" + (e.isXDomain() ? "Insecure" : "") + ".swf"];
												n.loaded || ("undefined" == typeof WEB_SOCKET_SWF_LOCATION && (WEB_SOCKET_SWF_LOCATION = s.join("/")), 843 !== i && WebSocket.loadFlashPolicyFile("xmlsocket://" + t.host + ":" + i), WebSocket.__initialize(), n.loaded = !0), o.call(r)
											}
											var r = this;
											return document.body ? i() : (t.util.load(i), void 0)
										}, n.check = function () {
											return "undefined" != typeof WebSocket && "__initialize" in WebSocket && swfobject ? swfobject.getFlashPlayerVersion().major >= 10 : !1
										}, n.xdomainCheck = function () {
											return !0
										}, "undefined" != typeof window && (WEB_SOCKET_DISABLE_AUTO_INITIALIZATION = !0), t.transports.push("flashsocket")
									}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports), "undefined" != typeof window) var swfobject = function () {
										function e() {
											if (!F) {
												try {
													var e = P.getElementsByTagName("body")[0].appendChild(y("span"));
													e.parentNode.removeChild(e)
												} catch (t) {
													return
												}
												F = !0;
												for (var n = $.length, o = 0; n > o; o++) $[o]()
											}
										}

										function t(e) {
											F ? e() : $[$.length] = e
										}

										function n(e) {
											if (typeof W.addEventListener != O) W.addEventListener("load", e, !1);
											else if (typeof P.addEventListener != O) P.addEventListener("load", e, !1);
											else if (typeof W.attachEvent != O) g(W, "onload", e);
											else if ("function" == typeof W.onload) {
												var t = W.onload;
												W.onload = function () {
													t(), e()
												}
											} else W.onload = e
										}

										function o() {
											L ? i() : r()
										}

										function i() {
											var e = P.getElementsByTagName("body")[0],
											    t = y(A);
											t.setAttribute("type", D);
											var n = e.appendChild(t);
											if (n) {
												var o = 0;
												! function () {
													if (typeof n.GetVariable != O) {
														var i = n.GetVariable("$version");
														i && (i = i.split(" ")[1].split(","), V.pv = [parseInt(i[0], 10), parseInt(i[1], 10), parseInt(i[2], 10)])
													} else if (10 > o) return o++, setTimeout(arguments.callee, 10), void 0;
													e.removeChild(t), n = null, r()
												}()
											} else r()
										}

										function r() {
											var e = M.length;
											if (e > 0)
												for (var t = 0; e > t; t++) {
													var n = M[t].id,
														o = M[t].callbackFn,
														  i = {
															  success: !1,
															  id: n
														  };
													if (V.pv[0] > 0) {
														var r = m(n);
														if (r)
															if (!v(M[t].swfVersion) || V.wk && V.wk < 312)
																if (M[t].expressInstall && a()) {
																	var u = {};
																	u.data = M[t].expressInstall, u.width = r.getAttribute("width") || "0", u.height = r.getAttribute("height") || "0", r.getAttribute("class") && (u.styleclass = r.getAttribute("class")), r.getAttribute("align") && (u.align = r.getAttribute("align"));
																	for (var h = {}, l = r.getElementsByTagName("param"), d = l.length, f = 0; d > f; f++) "movie" != l[f].getAttribute("name").toLowerCase() && (h[l[f].getAttribute("name")] = l[f].getAttribute("value"));
																	c(u, h, n, o)
																} else p(r), o && o(i);
																else k(n, !0), o && (i.success = !0, i.ref = s(n), o(i))
													} else if (k(n, !0), o) {
														var y = s(n);
														y && typeof y.SetVariable != O && (i.success = !0, i.ref = y), o(i)
													}
												}
										}

										function s(e) {
											var t = null,
											    n = m(e);
											if (n && "OBJECT" == n.nodeName)
												if (typeof n.SetVariable != O) t = n;
												else {
													var o = n.getElementsByTagName(A)[0];
													o && (t = o)
												}
											return t
										}

										function a() {
											return !H && v("6.0.65") && (V.win || V.mac) && !(V.wk && V.wk < 312)
										}

										function c(e, t, n, o) {
											H = !0, C = o || null, E = {
												success: !1,
												id: n
											};
											var i = m(n);
											if (i) {
												"OBJECT" == i.nodeName ? (S = u(i), T = null) : (S = i, T = n), e.id = N, (typeof e.width == O || !/%$/.test(e.width) && parseInt(e.width, 10) < 310) && (e.width = "310"), (typeof e.height == O || !/%$/.test(e.height) && parseInt(e.height, 10) < 137) && (e.height = "137"), P.title = P.title.slice(0, 47) + " - Flash Player Installation";
												var r = V.ie && V.win ? ["Active"].concat("").join("X") : "PlugIn",
												    s = "MMredirectURL=" + W.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + r + "&MMdoctitle=" + P.title;
												if (typeof t.flashvars != O ? t.flashvars += "&" + s : t.flashvars = s, V.ie && V.win && 4 != i.readyState) {
													var a = y("div");
													n += "SWFObjectNew", a.setAttribute("id", n), i.parentNode.insertBefore(a, i), i.style.display = "none",
													  function () {
														  4 == i.readyState ? i.parentNode.removeChild(i) : setTimeout(arguments.callee, 10)
													  }()
												}
												h(e, t, n)
											}
										}

										function p(e) {
											if (V.ie && V.win && 4 != e.readyState) {
												var t = y("div");
												e.parentNode.insertBefore(t, e), t.parentNode.replaceChild(u(e), t), e.style.display = "none",
													function () {
														4 == e.readyState ? e.parentNode.removeChild(e) : setTimeout(arguments.callee, 10)
													}()
											} else e.parentNode.replaceChild(u(e), e)
										}

										function u(e) {
											var t = y("div");
											if (V.win && V.ie) t.innerHTML = e.innerHTML;
											else {
												var n = e.getElementsByTagName(A)[0];
												if (n) {
													var o = n.childNodes;
													if (o)
														for (var i = o.length, r = 0; i > r; r++) 1 == o[r].nodeType && "PARAM" == o[r].nodeName || 8 == o[r].nodeType || t.appendChild(o[r].cloneNode(!0))
												}
											}
											return t
										}

										function h(e, t, n) {
											var o, i = m(n);
											if (V.wk && V.wk < 312) return o;
											if (i)
												if (typeof e.id == O && (e.id = n), V.ie && V.win) {
													var r = "";
													for (var s in e) e[s] != Object.prototype[s] && ("data" == s.toLowerCase() ? t.movie = e[s] : "styleclass" == s.toLowerCase() ? r += ' class="' + e[s] + '"' : "classid" != s.toLowerCase() && (r += " " + s + '="' + e[s] + '"'));
													var a = "";
													for (var c in t) t[c] != Object.prototype[c] && (a += '<param name="' + c + '" value="' + t[c] + '" />');
													i.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + r + ">" + a + "</object>", X[X.length] = e.id, o = m(e.id)
												} else {
													var p = y(A);
													p.setAttribute("type", D);
													for (var u in e) e[u] != Object.prototype[u] && ("styleclass" == u.toLowerCase() ? p.setAttribute("class", e[u]) : "classid" != u.toLowerCase() && p.setAttribute(u, e[u]));
													for (var h in t) t[h] != Object.prototype[h] && "movie" != h.toLowerCase() && l(p, h, t[h]);
													i.parentNode.replaceChild(p, i), o = p
												}
											return o
										}

										function l(e, t, n) {
											var o = y("param");
											o.setAttribute("name", t), o.setAttribute("value", n), e.appendChild(o)
										}

										function d(e) {
											var t = m(e);
											t && "OBJECT" == t.nodeName && (V.ie && V.win ? (t.style.display = "none", function () {
												4 == t.readyState ? f(e) : setTimeout(arguments.callee, 10)
											}()) : t.parentNode.removeChild(t))
										}

										function f(e) {
											var t = m(e);
											if (t) {
												for (var n in t) "function" == typeof t[n] && (t[n] = null);
												t.parentNode.removeChild(t)
											}
										}

										function m(e) {
											var t = null;
											try {
												t = P.getElementById(e)
											} catch (n) {}
											return t
										}

										function y(e) {
											return P.createElement(e)
										}

										function g(e, t, n) {
											e.attachEvent(t, n), B[B.length] = [e, t, n]
										}

										function v(e) {
											var t = V.pv,
											    n = e.split(".");
											return n[0] = parseInt(n[0], 10), n[1] = parseInt(n[1], 10) || 0, n[2] = parseInt(n[2], 10) || 0, t[0] > n[0] || t[0] == n[0] && t[1] > n[1] || t[0] == n[0] && t[1] == n[1] && t[2] >= n[2] ? !0 : !1
										}

										function b(e, t, n, o) {
											if (!V.ie || !V.mac) {
												var i = P.getElementsByTagName("head")[0];
												if (i) {
													var r = n && "string" == typeof n ? n : "screen";
													if (o && (x = null, _ = null), !x || _ != r) {
														var s = y("style");
														s.setAttribute("type", "text/css"), s.setAttribute("media", r), x = i.appendChild(s), V.ie && V.win && typeof P.styleSheets != O && P.styleSheets.length > 0 && (x = P.styleSheets[P.styleSheets.length - 1]), _ = r
													}
													V.ie && V.win ? x && typeof x.addRule == A && x.addRule(e, t) : x && typeof P.createTextNode != O && x.appendChild(P.createTextNode(e + " {" + t + "}"))
												}
											}
										}

										function k(e, t) {
											if (U) {
												var n = t ? "visible" : "hidden";
												F && m(e) ? m(e).style.visibility = n : b("#" + e, "visibility:" + n)
											}
										}

										function w(e) {
											var t = /[\\\"<>\.;]/,
											    n = null != t.exec(e);
											return n && typeof encodeURIComponent != O ? encodeURIComponent(e) : e
										}
										var S, T, C, E, x, _, O = "undefined",
										    A = "object",
										    R = "Shockwave Flash",
										    j = "ShockwaveFlash.ShockwaveFlash",
										    D = "application/x-shockwave-flash",
										    N = "SWFObjectExprInst",
										    I = "onreadystatechange",
										    W = window,
										    P = document,
										    q = navigator,
										    L = !1,
										    $ = [o],
										    M = [],
										    X = [],
										    B = [],
										    F = !1,
										    H = !1,
										    U = !0,
										    V = function () {
											    var e = typeof P.getElementById != O && typeof P.getElementsByTagName != O && typeof P.createElement != O,
											    t = q.userAgent.toLowerCase(),
											    n = q.platform.toLowerCase(),
											    o = n ? /win/.test(n) : /win/.test(t),
											    i = n ? /mac/.test(n) : /mac/.test(t),
											    r = /webkit/.test(t) ? parseFloat(t.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : !1,
											    s = !1,
											    a = [0, 0, 0],
											    c = null;
											    if (typeof q.plugins != O && typeof q.plugins[R] == A) c = q.plugins[R].description, !c || typeof q.mimeTypes != O && q.mimeTypes[D] && !q.mimeTypes[D].enabledPlugin || (L = !0, s = !1, c = c.replace(/^.*\s+(\S+\s+\S+$)/, "$1"), a[0] = parseInt(c.replace(/^(.*)\..*$/, "$1"), 10), a[1] = parseInt(c.replace(/^.*\.(.*)\s.*$/, "$1"), 10), a[2] = /[a-zA-Z]/.test(c) ? parseInt(c.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0);
											    else if (typeof W[["Active"].concat("Object").join("X")] != O) try {
												    var p = new(window[["Active"].concat("Object").join("X")])(j);
												    p && (c = p.GetVariable("$version"), c && (s = !0, c = c.split(" ")[1].split(","), a = [parseInt(c[0], 10), parseInt(c[1], 10), parseInt(c[2], 10)]))
											    } catch (u) {}
											    return {
												    w3: e,
													    pv: a,
													    wk: r,
													    ie: s,
													    win: o,
													    mac: i
											    }
										    }();
										return function () {
											V.w3 && ((typeof P.readyState != O && "complete" == P.readyState || typeof P.readyState == O && (P.getElementsByTagName("body")[0] || P.body)) && e(), F || (typeof P.addEventListener != O && P.addEventListener("DOMContentLoaded", e, !1), V.ie && V.win && (P.attachEvent(I, function () {
												"complete" == P.readyState && (P.detachEvent(I, arguments.callee), e())
											}), W == top && function () {
												if (!F) {
													try {
														P.documentElement.doScroll("left")
													} catch (t) {
														return setTimeout(arguments.callee, 0), void 0
													}
													e()
												}
											}()), V.wk && function () {
												return F ? void 0 : /loaded|complete/.test(P.readyState) ? (e(), void 0) : (setTimeout(arguments.callee, 0), void 0)
											}(), n(e)))
										}(),
										       function () {
											       V.ie && V.win && window.attachEvent("onunload", function () {
												       for (var e = B.length, t = 0; e > t; t++) B[t][0].detachEvent(B[t][1], B[t][2]);
												       for (var n = X.length, o = 0; n > o; o++) d(X[o]);
												       for (var i in V) V[i] = null;
												       V = null;
												       for (var r in swfobject) swfobject[r] = null;
												       swfobject = null
											       })
										       }(), {
											       registerObject: function (e, t, n, o) {
												       if (V.w3 && e && t) {
													       var i = {};
													       i.id = e, i.swfVersion = t, i.expressInstall = n, i.callbackFn = o, M[M.length] = i, k(e, !1)
												       } else o && o({
													       success: !1,
													       id: e
												       })
											       },
											       getObjectById: function (e) {
												       return V.w3 ? s(e) : void 0
											       },
											       embedSWF: function (e, n, o, i, r, s, p, u, l, d) {
												       var f = {
													       success: !1,
													       id: n
												       };
												       V.w3 && !(V.wk && V.wk < 312) && e && n && o && i && r ? (k(n, !1), t(function () {
													       o += "", i += "";
													       var t = {};
													       if (l && typeof l === A)
													       for (var m in l) t[m] = l[m];
												       t.data = e, t.width = o, t.height = i;
												       var y = {};
												       if (u && typeof u === A)
													       for (var g in u) y[g] = u[g];
												       if (p && typeof p === A)
													       for (var b in p) typeof y.flashvars != O ? y.flashvars += "&" + b + "=" + p[b] : y.flashvars = b + "=" + p[b];
												       if (v(r)) {
													       var w = h(t, y, n);
													       t.id == n && k(n, !0), f.success = !0, f.ref = w
												       } else {
													       if (s && a()) return t.data = s, c(t, y, n, d), void 0;
													       k(n, !0)
												       }
												       d && d(f)
												       })) : d && d(f)
											       },
											       switchOffAutoHideShow: function () {
												       U = !1
											       },
											       ua: V,
											       getFlashPlayerVersion: function () {
												       return {
													       major: V.pv[0],
													       minor: V.pv[1],
													       release: V.pv[2]
												       }
											       },
											       hasFlashPlayerVersion: v,
											       createSWF: function (e, t, n) {
												       return V.w3 ? h(e, t, n) : void 0
											       },
											       showExpressInstall: function (e, t, n, o) {
												       V.w3 && a() && c(e, t, n, o)
											       },
											       removeSWF: function (e) {
												       V.w3 && d(e)
											       },
											       createCSS: function (e, t, n, o) {
												       V.w3 && b(e, t, n, o)
											       },
											       addDomLoadEvent: t,
											       addLoadEvent: n,
											       getQueryParamValue: function (e) {
												       var t = P.location.search || P.location.hash;
												       if (t) {
													       if (/\?/.test(t) && (t = t.split("?")[1]), null == e) return w(t);
													       for (var n = t.split("&"), o = 0; o < n.length; o++)
														       if (n[o].substring(0, n[o].indexOf("=")) == e) return w(n[o].substring(n[o].indexOf("=") + 1))
												       }
												       return ""
											       },
											       expressInstallCallback: function () {
												       if (H) {
													       var e = m(N);
													       e && S && (e.parentNode.replaceChild(S, e), T && (k(T, !0), V.ie && V.win && (S.style.display = "block")), C && C(E)), H = !1
												       }
											       }
										       }
									}();
					! function () {
						if ("undefined" != typeof window && !window.WebSocket) {
							var e = window.console;
							if (e && e.log && e.error || (e = {
								log: function () {},
							   error: function () {}
							}), !swfobject.hasFlashPlayerVersion("10.0.0")) return e.error("Flash Player >= 10.0.0 is required."), void 0;
							"file:" == location.protocol && e.error("WARNING: web-socket-js doesn't work in file:///... URL unless you set Flash Security Settings properly. Open the page via Web server i.e. http://..."), WebSocket = function (e, t, n, o, i) {
								var r = this;
								r.__id = WebSocket.__nextId++, WebSocket.__instances[r.__id] = r, r.readyState = WebSocket.CONNECTING, r.bufferedAmount = 0, r.__events = {}, t ? "string" == typeof t && (t = [t]) : t = [], setTimeout(function () {
									WebSocket.__addTask(function () {
										WebSocket.__flash.create(r.__id, e, t, n || null, o || 0, i || null)
									})
								}, 0)
							}, WebSocket.prototype.send = function (e) {
								if (this.readyState == WebSocket.CONNECTING) throw "INVALID_STATE_ERR: Web Socket connection has not been established";
								var t = WebSocket.__flash.send(this.__id, encodeURIComponent(e));
								return 0 > t ? !0 : (this.bufferedAmount += t, !1)
							}, WebSocket.prototype.close = function () {
								this.readyState != WebSocket.CLOSED && this.readyState != WebSocket.CLOSING && (this.readyState = WebSocket.CLOSING, WebSocket.__flash.close(this.__id))
							}, WebSocket.prototype.addEventListener = function (e, t) {
								e in this.__events || (this.__events[e] = []), this.__events[e].push(t)
							}, WebSocket.prototype.removeEventListener = function (e, t) {
								if (e in this.__events)
									for (var n = this.__events[e], o = n.length - 1; o >= 0; --o)
										if (n[o] === t) {
											n.splice(o, 1);
											break
										}
							}, WebSocket.prototype.dispatchEvent = function (e) {
								for (var t = this.__events[e.type] || [], n = 0; n < t.length; ++n) t[n](e);
								var o = this["on" + e.type];
								o && o(e)
							}, WebSocket.prototype.__handleEvent = function (e) {
								"readyState" in e && (this.readyState = e.readyState), "protocol" in e && (this.protocol = e.protocol);
								var t;
								if ("open" == e.type || "error" == e.type) t = this.__createSimpleEvent(e.type);
								else if ("close" == e.type) t = this.__createSimpleEvent("close");
								else {
									if ("message" != e.type) throw "unknown event type: " + e.type;
									var n = decodeURIComponent(e.message);
									t = this.__createMessageEvent("message", n)
								}
								this.dispatchEvent(t)
							}, WebSocket.prototype.__createSimpleEvent = function (e) {
								if (document.createEvent && window.Event) {
									var t = document.createEvent("Event");
									return t.initEvent(e, !1, !1), t
								}
								return {
									type: e,
									bubbles: !1,
									cancelable: !1
								}
							}, WebSocket.prototype.__createMessageEvent = function (e, t) {
								if (document.createEvent && window.MessageEvent && !window.opera) {
									var n = document.createEvent("MessageEvent");
									return n.initMessageEvent("message", !1, !1, t, null, null, window, null), n
								}
								return {
									type: e,
									data: t,
									bubbles: !1,
									cancelable: !1
								}
							}, WebSocket.CONNECTING = 0, WebSocket.OPEN = 1, WebSocket.CLOSING = 2, WebSocket.CLOSED = 3, WebSocket.__flash = null, WebSocket.__instances = {}, WebSocket.__tasks = [], WebSocket.__nextId = 0, WebSocket.loadFlashPolicyFile = function (e) {
								WebSocket.__addTask(function () {
									WebSocket.__flash.loadManualPolicyFile(e)
								})
							}, WebSocket.__initialize = function () {
								if (!WebSocket.__flash) {
									if (WebSocket.__swfLocation && (window.WEB_SOCKET_SWF_LOCATION = WebSocket.__swfLocation), !window.WEB_SOCKET_SWF_LOCATION) return e.error("[WebSocket] set WEB_SOCKET_SWF_LOCATION to location of WebSocketMain.swf"), void 0;
									var t = document.createElement("div");
									t.id = "webSocketContainer", t.style.position = "absolute", WebSocket.__isFlashLite() ? (t.style.left = "0px", t.style.top = "0px") : (t.style.left = "-100px", t.style.top = "-100px");
									var n = document.createElement("div");
									n.id = "webSocketFlash", t.appendChild(n), document.body.appendChild(t), swfobject.embedSWF(WEB_SOCKET_SWF_LOCATION, "webSocketFlash", "1", "1", "10.0.0", null, null, {
										hasPriority: !0,
										swliveconnect: !0,
										allowScriptAccess: "always"
									}, null, function (t) {
										t.success || e.error("[WebSocket] swfobject.embedSWF failed")
									})
								}
							}, WebSocket.__onFlashInitialized = function () {
								setTimeout(function () {
									WebSocket.__flash = document.getElementById("webSocketFlash"), WebSocket.__flash.setCallerUrl(location.href), WebSocket.__flash.setDebug( !! window.WEB_SOCKET_DEBUG);
									for (var e = 0; e < WebSocket.__tasks.length; ++e) WebSocket.__tasks[e]();
									WebSocket.__tasks = []
								}, 0)
							}, WebSocket.__onFlashEvent = function () {
								return setTimeout(function () {
									try {
										for (var t = WebSocket.__flash.receiveEvents(), n = 0; n < t.length; ++n) WebSocket.__instances[t[n].webSocketId].__handleEvent(t[n])
									} catch (o) {
										e.error(o)
									}
								}, 0), !0
							}, WebSocket.__log = function (t) {
								e.log(decodeURIComponent(t))
							}, WebSocket.__error = function (t) {
								e.error(decodeURIComponent(t))
							}, WebSocket.__addTask = function (e) {
								WebSocket.__flash ? e() : WebSocket.__tasks.push(e)
							}, WebSocket.__isFlashLite = function () {
								if (!window.navigator || !window.navigator.mimeTypes) return !1;
								var e = window.navigator.mimeTypes["application/x-shockwave-flash"];
								return e && e.enabledPlugin && e.enabledPlugin.filename ? e.enabledPlugin.filename.match(/flashlite/i) ? !0 : !1 : !1
							}, window.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION || (window.addEventListener ? window.addEventListener("load", function () {
								WebSocket.__initialize()
							}, !1) : window.attachEvent("onload", function () {
								WebSocket.__initialize()
							}))
						}
					}(),
						function (e, t, n) {
							function o(e) {
								e && (t.Transport.apply(this, arguments), this.sendBuffer = [])
							}

							function i() {}
							e.XHR = o, t.util.inherit(o, t.Transport), o.prototype.open = function () {
								return this.socket.setBuffer(!1), this.onOpen(), this.get(), this.setCloseTimeout(), this
							}, o.prototype.payload = function (e) {
								for (var n = [], o = 0, i = e.length; i > o; o++) n.push(t.parser.encodePacket(e[o]));
								this.send(t.parser.encodePayload(n))
							}, o.prototype.send = function (e) {
								return this.post(e), this
							}, o.prototype.post = function (e) {
								function t() {
									4 == this.readyState && (this.onreadystatechange = i, r.posting = !1, 200 == this.status ? r.socket.setBuffer(!1) : r.onClose())
								}

								function o() {
									this.onload = i, r.socket.setBuffer(!1)
								}
								var r = this;
								this.socket.setBuffer(!0), this.sendXHR = this.request("POST"), n.XDomainRequest && this.sendXHR instanceof XDomainRequest ? this.sendXHR.onload = this.sendXHR.onerror = o : this.sendXHR.onreadystatechange = t, this.sendXHR.send(e)
							}, o.prototype.close = function () {
								return this.onClose(), this
							}, o.prototype.request = function (e) {
								var n = t.util.request(this.socket.isXDomain()),
								    o = t.util.query(this.socket.options.query, "t=" + +new Date);
								if (n.open(e || "GET", this.prepareUrl() + o, !0), "POST" == e) try {
									n.setRequestHeader ? n.setRequestHeader("Content-type", "text/plain;charset=UTF-8") : n.contentType = "text/plain"
								} catch (i) {}
								return n
							}, o.prototype.scheme = function () {
								return this.socket.options.secure ? "https" : "http"
							}, o.check = function (e, o) {
								try {
									var i = t.util.request(o),
									    r = n.XDomainRequest && i instanceof XDomainRequest,
									    s = e && e.options && e.options.secure ? "https:" : "http:",
									    a = n.location && s != n.location.protocol;
									if (i && (!r || !a)) return !0
								} catch (c) {}
								return !1
							}, o.xdomainCheck = function (e) {
								return o.check(e, !0)
							}
						}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this),
						function (e, t) {
							function n() {
								t.Transport.XHR.apply(this, arguments)
							}
							e.htmlfile = n, t.util.inherit(n, t.Transport.XHR), n.prototype.name = "htmlfile", n.prototype.get = function () {
								this.doc = new(window[["Active"].concat("Object").join("X")])("htmlfile"), this.doc.open(), this.doc.write("<html></html>"), this.doc.close(), this.doc.parentWindow.s = this;
								var e = this.doc.createElement("div");
								e.className = "socketio", this.doc.body.appendChild(e), this.iframe = this.doc.createElement("iframe"), e.appendChild(this.iframe);
								var n = this,
								    o = t.util.query(this.socket.options.query, "t=" + +new Date);
								this.iframe.src = this.prepareUrl() + o, t.util.on(window, "unload", function () {
									n.destroy()
								})
							}, n.prototype._ = function (e, t) {
								e = e.replace(/\\\//g, "/"), this.onData(e);
								try {
									var n = t.getElementsByTagName("script")[0];
									n.parentNode.removeChild(n)
								} catch (o) {}
							}, n.prototype.destroy = function () {
								if (this.iframe) {
									try {
										this.iframe.src = "about:blank"
									} catch (e) {}
									this.doc = null, this.iframe.parentNode.removeChild(this.iframe), this.iframe = null, CollectGarbage()
								}
							}, n.prototype.close = function () {
								return this.destroy(), t.Transport.XHR.prototype.close.call(this)
							}, n.check = function (e) {
								if ("undefined" != typeof window && ["Active"].concat("Object").join("X") in window) try {
									var n = new(window[["Active"].concat("Object").join("X")])("htmlfile");
									return n && t.Transport.XHR.check(e)
								} catch (o) {}
								return !1
							}, n.xdomainCheck = function () {
								return !1
							}, t.transports.push("htmlfile")
						}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports),
						function (e, t, n) {
							function o() {
								t.Transport.XHR.apply(this, arguments)
							}

							function i() {}
							e["xhr-polling"] = o, t.util.inherit(o, t.Transport.XHR), t.util.merge(o, t.Transport.XHR), o.prototype.name = "xhr-polling", o.prototype.heartbeats = function () {
								return !1
							}, o.prototype.open = function () {
								var e = this;
								return t.Transport.XHR.prototype.open.call(e), !1
							}, o.prototype.get = function () {
								function e() {
									4 == this.readyState && (this.onreadystatechange = i, 200 == this.status ? (r.onData(this.responseText), r.get()) : r.onClose())
								}

								function t() {
									this.onload = i, this.onerror = i, r.retryCounter = 1, r.onData(this.responseText), r.get()
								}

								function o() {
									r.retryCounter++, !r.retryCounter || r.retryCounter > 3 ? r.onClose() : r.get()
								}
								if (this.isOpen) {
									var r = this;
									this.xhr = this.request(), n.XDomainRequest && this.xhr instanceof XDomainRequest ? (this.xhr.onload = t, this.xhr.onerror = o) : this.xhr.onreadystatechange = e, this.xhr.send(null)
								}
							}, o.prototype.onClose = function () {
								if (t.Transport.XHR.prototype.onClose.call(this), this.xhr) {
									this.xhr.onreadystatechange = this.xhr.onload = this.xhr.onerror = i;
									try {
										this.xhr.abort()
									} catch (e) {}
									this.xhr = null
								}
							}, o.prototype.ready = function (e, n) {
								var o = this;
								t.util.defer(function () {
									n.call(o)
								})
							}, t.transports.push("xhr-polling")
						}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this),
						function (e, t, n) {
							function o() {
								t.Transport["xhr-polling"].apply(this, arguments), this.index = t.j.length;
								var e = this;
								t.j.push(function (t) {
									e._(t)
								})
							}
							var i = n.document && "MozAppearance" in n.document.documentElement.style;
							e["jsonp-polling"] = o, t.util.inherit(o, t.Transport["xhr-polling"]), o.prototype.name = "jsonp-polling", o.prototype.post = function (e) {
								function n() {
									o(), i.socket.setBuffer(!1)
								}

								function o() {
									i.iframe && i.form.removeChild(i.iframe);
									try {
										s = document.createElement('<iframe name="' + i.iframeId + '">')
									} catch (e) {
										s = document.createElement("iframe"), s.name = i.iframeId
									}
									s.id = i.iframeId, i.form.appendChild(s), i.iframe = s
								}
								var i = this,
								    r = t.util.query(this.socket.options.query, "t=" + +new Date + "&i=" + this.index);
								if (!this.form) {
									var s, a = document.createElement("form"),
										c = document.createElement("textarea"),
										  p = this.iframeId = "socketio_iframe_" + this.index;
									a.className = "socketio", a.style.position = "absolute", a.style.top = "0px", a.style.left = "0px", a.style.display = "none", a.target = p, a.method = "POST", a.setAttribute("accept-charset", "utf-8"), c.name = "d", a.appendChild(c), document.body.appendChild(a), this.form = a, this.area = c
								}
								this.form.action = this.prepareUrl() + r, o(), this.area.value = t.JSON.stringify(e);
								try {
									this.form.submit()
								} catch (u) {}
								this.iframe.attachEvent ? s.onreadystatechange = function () {
									"complete" == i.iframe.readyState && n()
								} : this.iframe.onload = n, this.socket.setBuffer(!0)
							}, o.prototype.get = function () {
								var e = this,
								    n = document.createElement("script"),
								    o = t.util.query(this.socket.options.query, "t=" + +new Date + "&i=" + this.index);
								this.script && (this.script.parentNode.removeChild(this.script), this.script = null), n.async = !0, n.src = this.prepareUrl() + o, n.onerror = function () {
									e.onClose()
								};
								var r = document.getElementsByTagName("script")[0];
								r.parentNode.insertBefore(n, r), this.script = n, i && setTimeout(function () {
									var e = document.createElement("iframe");
									document.body.appendChild(e), document.body.removeChild(e)
								}, 100)
							}, o.prototype._ = function (e) {
								return this.onData(e), this.isOpen && this.get(), this
							}, o.prototype.ready = function (e, n) {
								var o = this;
								return i ? (t.util.load(function () {
									n.call(o)
								}), void 0) : n.call(this)
							}, o.check = function () {
								return "document" in n
							}, o.xdomainCheck = function () {
								return !0
							}, t.transports.push("jsonp-polling")
						}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), "function" == typeof define && define.amd && define([], function () {
							return io
						})
				}()
			}, {}
	],
		6: [
			function (e, t) {
				var n = e("getusermedia");
				t.exports = function (e) {
					var t, o = {
						video: {
							mandatory: {
								chromeMediaSource: "screen"
							}
						}
					};
					return "http:" === window.location.protocol ? (t = new Error("NavigatorUserMediaError"), t.name = "HTTPS_REQUIRED", e(t)) : (n(o, e), void 0)
				}
			}, {
				getusermedia: 9
			}
	],
		10: [
			function (e, t) {
				var n = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
				t.exports = function (e, t) {
					var o, i = 2 === arguments.length,
					    r = {
						    video: !0,
						    audio: !0
					    }, s = "PERMISSION_DENIED",
					    a = "CONSTRAINT_NOT_SATISFIED";
					return i || (t = e, e = r), n ? (n.call(navigator, e, function (e) {
						t(null, e)
					}, function (e) {
						var n;
						"string" == typeof e ? (n = new Error("NavigatorUserMediaError"), n.name = e === s ? s : a) : (n = e, n.name || (e.name = n[s] ? s : a)), t(n)
					}), void 0) : (o = new Error("NavigatorUserMediaError"), o.name = "NOT_SUPPORTED_ERROR", t(o))
				}
			}, {}
	],
		9: [
			function (e, t) {
				var n = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
				t.exports = function (e, t) {
					var o, i = 2 === arguments.length,
					    r = {
						    video: !0,
						    audio: !0
					    }, s = "PERMISSION_DENIED",
					    a = "CONSTRAINT_NOT_SATISFIED";
					return i || (t = e, e = r), n ? (n.call(navigator, e, function (e) {
						t(null, e)
					}, function (e) {
						var n;
						"string" == typeof e ? (n = new Error("NavigatorUserMediaError"), n.name = e === s ? s : a) : (n = e, n.name || (e.name = n[s] ? s : a)), t(n)
					}), void 0) : (o = new Error("NavigatorUserMediaError"), o.name = "NOT_SUPPORTED_ERROR", t(o))
				}
			}, {}
	],
		2: [
			function (e, t) {
				function n(e) {
					var t = this,
					n = e || {};
					this.config = {
						debug: !1,
						localVideoEl: "",
						remoteVideosEl: "",
						autoRequestMedia: !1,
						peerConnectionConfig: {
							iceServers: [{
								url: "stun:stun.l.google.com:19302"
							}]
						},
						peerConnectionContraints: {
							optional: [{
								DtlsSrtpKeyAgreement: !0
							}, {
								RtpDataChannels: !0
							}]
						},
						autoAdjustMic: !1,
						media: {
							audio: !0,
							video: !0
						},
						detectSpeakingEvents: !0,
						enableDataChannels: !0
					};
					var o;
					this.screenSharingSupport = i.screenSharing, this.logger = function () {
						return e.debug ? e.logger || console : e.logger || u
					}();
					for (o in n) this.config[o] = n[o];
					i.support || this.logger.error("Your browser doesn't seem to support WebRTC"), this.peers = [], a.call(this), this.config.debug && this.on("*", function (e, n, o) {
						var i;
						i = t.config.logger === u ? console : t.logger, i.log("event:", e, n, o)
					})
				}

				function o(e) {
					var t = this;
					if (this.id = e.id, this.parent = e.parent, this.type = e.type || "video", this.oneway = e.oneway || !1, this.sharemyscreen = e.sharemyscreen || !1, this.browserPrefix = e.prefix, this.stream = e.stream, this.channels = {}, this.pc = new s(this.parent.config.peerConnectionConfig, this.parent.config.peerConnectionContraints), this.pc.on("ice", this.onIceCandidate.bind(this)), this.pc.on("addStream", this.handleRemoteStreamAdded.bind(this)), this.pc.on("addChannel", this.handleDataChannelAdded.bind(this)), this.pc.on("removeStream", this.handleStreamRemoved.bind(this)), this.pc.on("negotiationNeeded", this.emit.bind(this, "negotiationNeeded")), this.logger = this.parent.logger, "screen" === e.type ? this.parent.localScreen && this.sharemyscreen && (this.logger.log("adding local screen stream to peer connection"), this.pc.addStream(this.parent.localScreen), this.broadcaster = e.broadcaster) : this.pc.addStream(this.parent.localStream), this.parent.config.enableDataChannels && i.dataChannel) {
						try {
							if (this.reliableChannel = this.getDataChannel("reliable", {
								reliable: !0
							}), !this.reliableChannel.reliable) throw Error("Failed to make reliable channel")
						} catch (n) {
							this.logger.warn("Failed to create reliable data channel."), this.reliableChannel = !1, delete this.channels.reliable
						}
						try {
							if (this.unreliableChannel = this.getDataChannel("unreliable", {
								reliable: !1,
							   preset: !0
							}), this.unreliableChannel.unreliable !== !1) throw Error("Failed to make unreliable channel")
						} catch (n) {
							this.logger.warn("Failed to create unreliable data channel."), this.unreliableChannel = !1, delete this.channels.unreliableChannel
						}
					}
					a.call(this), this.on("*", function () {
						t.parent.emit.apply(t.parent, arguments)
					})
				}
				var i = e("webrtcsupport"),
				    r = e("getusermedia"),
				    s = e("rtcpeerconnection"),
				    a = e("wildemitter"),
				    c = e("hark"),
				    p = e("mediastream-gain"),
				    u = e("mockconsole");
				n.prototype = Object.create(a.prototype, {
					constructor: {
						value: n
					}
				}), n.prototype.createPeer = function (e) {
					var t;
					return e.parent = this, t = new o(e), this.peers.push(t), t
				}, n.prototype.startLocalMedia = function (e, t) {
					var n = this,
					    o = e || {
						    video: !0,
						    audio: !0
					    };
					r(o, function (e, i) {
						e || (o.audio && n.config.detectSpeakingEvents && n.setupAudioMonitor(i), n.localStream = i, n.config.autoAdjustMic && (n.gainController = new p(i), n.setMicIfEnabled(.5)), n.emit("localStream", i)), t && t(e, i)
					})
				}, n.prototype.stopLocalMedia = function () {
					this.localStream && (this.localStream.stop(), this.emit("localStreamStopped"))
				}, n.prototype.mute = function () {
					this._audioEnabled(!1), this.hardMuted = !0, this.emit("audioOff")
				}, n.prototype.unmute = function () {
					this._audioEnabled(!0), this.hardMuted = !1, this.emit("audioOn")
				}, n.prototype.setupAudioMonitor = function (e) {
					this.logger.log("Setup audio");
					var t, n = c(e),
					    o = this;
					n.on("speaking", function () {
						o.hardMuted || (o.setMicIfEnabled(1), o.sendToAll("speaking", {}), o.emit("speaking"))
					}), n.on("stopped_speaking", function () {
						o.hardMuted || (t && clearTimeout(t), t = setTimeout(function () {
							o.setMicIfEnabled(.5), o.sendToAll("stopped_speaking", {}), o.emit("stoppedSpeaking")
						}, 1e3))
					})
				}, n.prototype.setMicIfEnabled = function (e) {
					this.config.autoAdjustMic && this.gainController.setGain(e)
				}, n.prototype.pauseVideo = function () {
					this._videoEnabled(!1), this.emit("videoOff")
				}, n.prototype.resumeVideo = function () {
					this._videoEnabled(!0), this.emit("videoOn")
				}, n.prototype.pause = function () {
					this._audioEnabled(!1), this.pauseVideo()
				}, n.prototype.resume = function () {
					this._audioEnabled(!0), this.resumeVideo()
				}, n.prototype._audioEnabled = function (e) {
					this.setMicIfEnabled(e ? 1 : 0), this.localStream.getAudioTracks().forEach(function (t) {
						t.enabled = !! e
					})
				}, n.prototype._videoEnabled = function (e) {
					this.localStream.getVideoTracks().forEach(function (t) {
						t.enabled = !! e
					})
				}, n.prototype.removePeers = function (e, t) {
					this.getPeers(e, t).forEach(function (e) {
						e.end()
					})
				}, n.prototype.getPeers = function (e, t) {
					return this.peers.filter(function (n) {
						return !(e && n.id !== e || t && n.type !== t)
					})
				}, n.prototype.sendToAll = function (e, t) {
					this.peers.forEach(function (n) {
						n.send(e, t)
					})
				}, o.prototype = Object.create(a.prototype, {
					constructor: {
						value: o
					}
				}), o.prototype.handleMessage = function (e) {
					var t = this;
					this.logger.log("getting", e.type, e), e.prefix && (this.browserPrefix = e.prefix), "offer" === e.type ? this.pc.answer(e.payload, function (e, n) {
						t.send("answer", n)
					}) : "answer" === e.type ? this.pc.handleAnswer(e.payload) : "candidate" === e.type ? this.pc.processIce(e.payload) : "speaking" === e.type ? this.parent.emit("speaking", {
						id: e.from
					}) : "stopped_speaking" === e.type && this.parent.emit("stopped_speaking", {
						id: e.from
					})
				}, o.prototype.send = function (e, t) {
					var n = {
						to: this.id,
						broadcaster: this.broadcaster,
						roomType: this.type,
						type: e,
						payload: t,
						prefix: i.prefix
					};
					this.logger.log("sending", e, n), this.parent.emit("message", n)
				}, o.prototype._observeDataChannel = function (e) {
					var t = this;
					e.onclose = this.emit.bind(this, "channelClose", e), e.onerror = this.emit.bind(this, "channelError", e), e.onmessage = function (n) {
						t.emit("message", e.label, n.data, e, n)
					}, e.onopen = this.emit.bind(this, "channelOpen", e)
				}, o.prototype.getDataChannel = function (e, t) {
					if (!i.dataChannel) return this.emit("error", new Error("createDataChannel not supported"));
					var n = this.channels[e];
					return t || (t = {}), n ? n : (n = this.channels[e] = this.pc.createDataChannel(e, t), this._observeDataChannel(n), n)
				}, o.prototype.onIceCandidate = function (e) {
					this.closed || (e ? this.send("candidate", e) : this.logger.log("End of candidates."))
				}, o.prototype.start = function () {
					var e = this;
					this.pc.offer(function (t, n) {
						e.send("offer", n)
					})
				}, o.prototype.end = function () {
					this.pc.close(), this.handleStreamRemoved()
				}, o.prototype.handleRemoteStreamAdded = function (e) {
					this.stream ? this.logger.warn("Already have a remote stream") : (this.stream = e.stream, this.parent.emit("peerStreamAdded", this))
				}, o.prototype.handleStreamRemoved = function () {
					this.parent.peers.splice(this.parent.peers.indexOf(this), 1), this.closed = !0, this.parent.emit("peerStreamRemoved", this)
				}, o.prototype.handleDataChannelAdded = function (e) {
					this.channels[e.name] = e
				}, t.exports = n
			}, {
				getusermedia: 10,
				hark: 13,
				"mediastream-gain": 12,
				mockconsole: 7,
				rtcpeerconnection: 11,
				webrtcsupport: 4,
				wildemitter: 3
			}
	],
		11: [
			function (e, t) {
				function n(e, t) {
					var n;
					this.pc = new i.PeerConnection(e, t), o.call(this), this.pc.onremovestream = this.emit.bind(this, "removeStream"), this.pc.onnegotiationneeded = this.emit.bind(this, "negotiationNeeded"), this.pc.oniceconnectionstatechange = this.emit.bind(this, "iceConnectionStateChange"), this.pc.onsignalingstatechange = this.emit.bind(this, "signalingStateChange"), this.pc.onaddstream = this._onAddStream.bind(this), this.pc.onicecandidate = this._onIce.bind(this), this.pc.ondatachannel = this._onDataChannel.bind(this), this.config = {
						debug: !1,
						sdpHack: !0
					};
					for (n in e) this.config[n] = e[n];
					this.config.debug && this.on("*", function () {
						var t = e.logger || console;
						t.log("PeerConnection event:", arguments)
					})
				}
				var o = e("wildemitter"),
				    i = e("webrtcsupport");
				n.prototype = Object.create(o.prototype, {
					constructor: {
						value: n
					}
				}), n.prototype.addStream = function (e) {
					this.localStream = e, this.pc.addStream(e)
				}, n.prototype.processIce = function (e) {
					this.pc.addIceCandidate(new i.IceCandidate(e))
				}, n.prototype.offer = function (e, t) {
					var n = this,
					    o = 2 === arguments.length,
					    i = o ? e : {
						    mandatory: {
							    OfferToReceiveAudio: !0,
							    OfferToReceiveVideo: !0
						    }
					    }, r = o ? t : e;
					this.pc.createOffer(function (e) {
						e.sdp = n._applySdpHack(e.sdp), n.pc.setLocalDescription(e), n.emit("offer", e), r && r(null, e)
					}, function (e) {
						n.emit("error", e), r && r(e)
					}, i)
				}, n.prototype.answerAudioOnly = function (e, t) {
					var n = {
						mandatory: {
							OfferToReceiveAudio: !0,
							OfferToReceiveVideo: !1
						}
					};
					this._answer(e, n, t)
				}, n.prototype.answerBroadcastOnly = function (e, t) {
					var n = {
						mandatory: {
							OfferToReceiveAudio: !1,
							OfferToReceiveVideo: !1
						}
					};
					this._answer(e, n, t)
				}, n.prototype.answer = function (e, t, n) {
					var o = 3 === arguments.length,
					    i = o ? n : t,
					    r = o ? t : {
						    mandatory: {
							    OfferToReceiveAudio: !0,
							    OfferToReceiveVideo: !0
						    }
					    };
					this._answer(e, r, i)
				}, n.prototype.handleAnswer = function (e) {
					this.pc.setRemoteDescription(new i.SessionDescription(e))
				}, n.prototype.close = function () {
					this.pc.close(), this.emit("close")
				}, n.prototype._answer = function (e, t, n) {
					var o = this;
					this.pc.setRemoteDescription(new i.SessionDescription(e)), this.pc.createAnswer(function (e) {
						e.sdp = o._applySdpHack(e.sdp), o.pc.setLocalDescription(e), o.emit("answer", e), n && n(null, e)
					}, function (e) {
						o.emit("error", e), n && n(e)
					}, t)
				}, n.prototype._onIce = function (e) {
					e.candidate ? this.emit("ice", e.candidate) : this.emit("endOfCandidates")
				}, n.prototype._onDataChannel = function (e) {
					this.emit("addChannel", e.channel)
				}, n.prototype._onAddStream = function (e) {
					this.remoteStream = e.stream, this.emit("addStream", e)
				}, n.prototype._applySdpHack = function (e) {
					if (!this.config.sdpHack) return e;
					var t = e.split("b=AS:30");
					return 2 === t.length ? t[0] + "b=AS:102400" + t[1] : e
				}, n.prototype.createDataChannel = function (e, t) {
					t || (t = {});
					var n, o, r = !! t.reliable,
					    s = t.protocol || "text/plain",
					    a = !(!t.negotiated && !t.preset);
					return "moz" === i.prefix ? (n = r ? {
						protocol: s,
					       preset: a,
					       stream: e
					} : {}, o = this.pc.createDataChannel(e, n), o.binaryType = "blob") : (n = r ? {
						reliable: !0
					} : {
						reliable: !1
					}, o = this.pc.createDataChannel(e, n)), o
				}, t.exports = n
			}, {
				webrtcsupport: 4,
				wildemitter: 3
			}
	],
		13: [
			function (e, t) {
				function n(e, t) {
					var n = -1 / 0;
					e.getFloatFrequencyData(t);
					for (var o = 0, i = t.length; i > o; o++) t[o] > n && t[o] < 0 && (n = t[o]);
					return n
				}
				var o = e("wildemitter");
				t.exports = function (e, t) {
					var i = new o;
					if (!window.webkitAudioContext) return i;
					var r, s, a, t = t || {}, c = t.smoothing || .5,
						p = t.interval || 100,
						  u = t.threshold,
						  h = t.play,
						  l = new webkitAudioContext;
					a = l.createAnalyser(), a.fftSize = 512, a.smoothingTimeConstant = c, s = new Float32Array(a.fftSize), e.jquery && (e = e[0]), e instanceof HTMLAudioElement ? (r = l.createMediaElementSource(e), "undefined" == typeof h && (h = !0), u = u || -65) : (r = l.createMediaStreamSource(e), u = u || -45), r.connect(a), h && a.connect(l.destination), i.speaking = !1, i.setThreshold = function (e) {
						u = e
					}, i.setInterval = function (e) {
						p = e
					};
					var d = function () {
						setTimeout(function () {
							var e = n(a, s);
							i.emit("volume_change", e, u), e > u ? i.speaking || (i.speaking = !0, i.emit("speaking")) : i.speaking && (i.speaking = !1, i.emit("stopped_speaking")), d()
						}, p)
					};
					return d(), i
				}
			}, {
				wildemitter: 3
			}
	],
		12: [
			function (e, t) {
				function n(e) {
					if (this.support = o.webAudio && o.mediaStream, this.gain = 1, this.support) {
						var t = this.context = new o.AudioContext;
						this.microphone = t.createMediaStreamSource(e), this.gainFilter = t.createGain(), this.destination = t.createMediaStreamDestination(), this.outputStream = this.destination.stream, this.microphone.connect(this.gainFilter), this.gainFilter.connect(this.destination), e.removeTrack(e.getAudioTracks()[0]), e.addTrack(this.outputStream.getAudioTracks()[0])
					}
					this.stream = e
				}
				var o = e("webrtcsupport");
				n.prototype.setGain = function (e) {
					this.support && (this.gainFilter.gain.value = e, this.gain = e)
				}, n.prototype.getGain = function () {
					return this.gain
				}, n.prototype.off = function () {
					return this.setGain(0)
				}, n.prototype.on = function () {
					this.setGain(1)
				}, t.exports = n
			}, {
				webrtcsupport: 4
			}
	]
	}, {}, [1])(1)
});
var io = "undefined" == typeof module ? {} : module.exports;
! function () {
	! function (e, t) {
		var n = e;
		n.version = "0.9.11", n.protocol = 1, n.transports = [], n.j = [], n.sockets = {}, n.connect = function (e, o) {
			var i, r, s = n.util.parseUri(e);
			t && t.location && (s.protocol = s.protocol || t.location.protocol.slice(0, -1), s.host = s.host || (t.document ? t.document.domain : t.location.hostname), s.port = s.port || t.location.port), i = n.util.uniqueUri(s);
			var a = {
				host: s.host,
				secure: "https" == s.protocol,
				port: s.port || ("https" == s.protocol ? 443 : 80),
				query: s.query || ""
			};
			return n.util.merge(a, o), (a["force new connection"] || !n.sockets[i]) && (r = new n.Socket(a)), !a["force new connection"] && r && (n.sockets[i] = r), r = r || n.sockets[i], r.of(s.path.length > 1 ? s.path : "")
		}
	}("object" == typeof module ? module.exports : this.io = {}, this),
		function (e, t) {
			var n = e.util = {}, o = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
			i = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
			n.parseUri = function (e) {
				for (var t = o.exec(e || ""), n = {}, r = 14; r--;) n[i[r]] = t[r] || "";
				return n
			}, n.uniqueUri = function (e) {
				var n = e.protocol,
				    o = e.host,
				    i = e.port;
				return "document" in t ? (o = o || document.domain, i = i || ("https" == n && "https:" !== document.location.protocol ? 443 : document.location.port)) : (o = o || "localhost", i || "https" != n || (i = 443)), (n || "http") + "://" + o + ":" + (i || 80)
			}, n.query = function (e, t) {
				var o = n.chunkQuery(e || ""),
				    i = [];
				n.merge(o, n.chunkQuery(t || ""));
				for (var r in o) o.hasOwnProperty(r) && i.push(r + "=" + o[r]);
				return i.length ? "?" + i.join("&") : ""
			}, n.chunkQuery = function (e) {
				for (var t, n = {}, o = e.split("&"), i = 0, r = o.length; r > i; ++i) t = o[i].split("="), t[0] && (n[t[0]] = t[1]);
				return n
			};
			var r = !1;
			n.load = function (e) {
				return "document" in t && "complete" === document.readyState || r ? e() : (n.on(t, "load", e, !1), void 0)
			}, n.on = function (e, t, n, o) {
				e.attachEvent ? e.attachEvent("on" + t, n) : e.addEventListener && e.addEventListener(t, n, o)
			}, n.request = function (e) {
				if (e && "undefined" != typeof XDomainRequest && !n.ua.hasCORS) return new XDomainRequest;
				if ("undefined" != typeof XMLHttpRequest && (!e || n.ua.hasCORS)) return new XMLHttpRequest;
				if (!e) try {
					return new(window[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")
				} catch (t) {}
				return null
			}, "undefined" != typeof window && n.load(function () {
				r = !0
			}), n.defer = function (e) {
				return n.ua.webkit && "undefined" == typeof importScripts ? (n.load(function () {
					setTimeout(e, 100)
				}), void 0) : e()
			}, n.merge = function (e, t, o, i) {
				var r, s = i || [],
				    a = "undefined" == typeof o ? 2 : o;
				for (r in t) t.hasOwnProperty(r) && n.indexOf(s, r) < 0 && ("object" == typeof e[r] && a ? n.merge(e[r], t[r], a - 1, s) : (e[r] = t[r], s.push(t[r])));
				return e
			}, n.mixin = function (e, t) {
				n.merge(e.prototype, t.prototype)
			}, n.inherit = function (e, t) {
				function n() {}
				n.prototype = t.prototype, e.prototype = new n
			}, n.isArray = Array.isArray || function (e) {
				return "[object Array]" === Object.prototype.toString.call(e)
			}, n.intersect = function (e, t) {
				for (var o = [], i = e.length > t.length ? e : t, r = e.length > t.length ? t : e, s = 0, a = r.length; a > s; s++)~ n.indexOf(i, r[s]) && o.push(r[s]);
				return o
			}, n.indexOf = function (e, t, n) {
				for (var o = e.length, n = 0 > n ? 0 > n + o ? 0 : n + o : n || 0; o > n && e[n] !== t; n++);
				return n >= o ? -1 : n
			}, n.toArray = function (e) {
				for (var t = [], n = 0, o = e.length; o > n; n++) t.push(e[n]);
				return t
			}, n.ua = {}, n.ua.hasCORS = "undefined" != typeof XMLHttpRequest && function () {
				try {
					var e = new XMLHttpRequest
				} catch (t) {
					return !1
				}
				return void 0 != e.withCredentials
			}(), n.ua.webkit = "undefined" != typeof navigator && /webkit/i.test(navigator.userAgent), n.ua.iDevice = "undefined" != typeof navigator && /iPad|iPhone|iPod/i.test(navigator.userAgent)
		}("undefined" != typeof io ? io : module.exports, this),
		function (e, t) {
			function n() {}
			e.EventEmitter = n, n.prototype.on = function (e, n) {
				return this.$events || (this.$events = {}), this.$events[e] ? t.util.isArray(this.$events[e]) ? this.$events[e].push(n) : this.$events[e] = [this.$events[e], n] : this.$events[e] = n, this
			}, n.prototype.addListener = n.prototype.on, n.prototype.once = function (e, t) {
				function n() {
					o.removeListener(e, n), t.apply(this, arguments)
				}
				var o = this;
				return n.listener = t, this.on(e, n), this
			}, n.prototype.removeListener = function (e, n) {
				if (this.$events && this.$events[e]) {
					var o = this.$events[e];
					if (t.util.isArray(o)) {
						for (var i = -1, r = 0, s = o.length; s > r; r++)
							if (o[r] === n || o[r].listener && o[r].listener === n) {
								i = r;
								break
							}
						if (0 > i) return this;
						o.splice(i, 1), o.length || delete this.$events[e]
					} else(o === n || o.listener && o.listener === n) && delete this.$events[e]
				}
				return this
			}, n.prototype.removeAllListeners = function (e) {
				return void 0 === e ? (this.$events = {}, this) : (this.$events && this.$events[e] && (this.$events[e] = null), this)
			}, n.prototype.listeners = function (e) {
				return this.$events || (this.$events = {}), this.$events[e] || (this.$events[e] = []), t.util.isArray(this.$events[e]) || (this.$events[e] = [this.$events[e]]), this.$events[e]
			}, n.prototype.emit = function (e) {
				if (!this.$events) return !1;
				var n = this.$events[e];
				if (!n) return !1;
				var o = Array.prototype.slice.call(arguments, 1);
				if ("function" == typeof n) n.apply(this, o);
				else {
					if (!t.util.isArray(n)) return !1;
					for (var i = n.slice(), r = 0, s = i.length; s > r; r++) i[r].apply(this, o)
				}
				return !0
			}
		}("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports),
		function (exports, nativeJSON) {
			"use strict";

			function f(e) {
				return 10 > e ? "0" + e : e
			}

			function date(e) {
				return isFinite(e.valueOf()) ? e.getUTCFullYear() + "-" + f(e.getUTCMonth() + 1) + "-" + f(e.getUTCDate()) + "T" + f(e.getUTCHours()) + ":" + f(e.getUTCMinutes()) + ":" + f(e.getUTCSeconds()) + "Z" : null
			}

			function quote(e) {
				return escapable.lastIndex = 0, escapable.test(e) ? '"' + e.replace(escapable, function (e) {
					var t = meta[e];
					return "string" == typeof t ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
				}) + '"' : '"' + e + '"'
			}

			function str(e, t) {
				var n, o, i, r, s, a = gap,
				    c = t[e];
				switch (c instanceof Date && (c = date(e)), "function" == typeof rep && (c = rep.call(t, e, c)), typeof c) {
					case "string":
						return quote(c);
					case "number":
						return isFinite(c) ? String(c) : "null";
					case "boolean":
					case "null":
						return String(c);
					case "object":
						if (!c) return "null";
						if (gap += indent, s = [], "[object Array]" === Object.prototype.toString.apply(c)) {
							for (r = c.length, n = 0; r > n; n += 1) s[n] = str(n, c) || "null";
							return i = 0 === s.length ? "[]" : gap ? "[\n" + gap + s.join(",\n" + gap) + "\n" + a + "]" : "[" + s.join(",") + "]", gap = a, i
						}
						if (rep && "object" == typeof rep)
							for (r = rep.length, n = 0; r > n; n += 1) "string" == typeof rep[n] && (o = rep[n], i = str(o, c), i && s.push(quote(o) + (gap ? ": " : ":") + i));
						else
							for (o in c) Object.prototype.hasOwnProperty.call(c, o) && (i = str(o, c), i && s.push(quote(o) + (gap ? ": " : ":") + i));
						return i = 0 === s.length ? "{}" : gap ? "{\n" + gap + s.join(",\n" + gap) + "\n" + a + "}" : "{" + s.join(",") + "}", gap = a, i
				}
			}
			if (nativeJSON && nativeJSON.parse) return exports.JSON = {
				parse: nativeJSON.parse,
					stringify: nativeJSON.stringify
			};
			var JSON = exports.JSON = {}, cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
			    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
			    gap, indent, meta = {
				    "\b": "\\b",
				    "	": "\\t",
				    "\n": "\\n",
				    "\f": "\\f",
				    "\r": "\\r",
				    '"': '\\"',
				    "\\": "\\\\"
			    }, rep;
			JSON.stringify = function (e, t, n) {
				var o;
				if (gap = "", indent = "", "number" == typeof n)
					for (o = 0; n > o; o += 1) indent += " ";
				else "string" == typeof n && (indent = n); if (rep = t, t && "function" != typeof t && ("object" != typeof t || "number" != typeof t.length)) throw new Error("JSON.stringify");
				return str("", {
					"": e
				})
			}, JSON.parse = function (text, reviver) {
				function walk(e, t) {
					var n, o, i = e[t];
					if (i && "object" == typeof i)
						for (n in i) Object.prototype.hasOwnProperty.call(i, n) && (o = walk(i, n), void 0 !== o ? i[n] = o : delete i[n]);
					return reviver.call(e, t, i)
				}
				var j;
				if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function (e) {
					return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
				})), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({
					"": j
				}, "") : j;
						throw new SyntaxError("JSON.parse")
						}
						}("undefined" != typeof io ? io : module.exports, "undefined" != typeof JSON ? JSON : void 0),
						function (e, t) {
							var n = e.parser = {}, o = n.packets = ["disconnect", "connect", "heartbeat", "message", "json", "event", "ack", "error", "noop"],
				   i = n.reasons = ["transport not supported", "client not handshaken", "unauthorized"],
				   r = n.advice = ["reconnect"],
				   s = t.JSON,
				   a = t.util.indexOf;
				n.encodePacket = function (e) {
					var t = a(o, e.type),
				   n = e.id || "",
				   c = e.endpoint || "",
				   p = e.ack,
				   u = null;
				switch (e.type) {
					case "error":
						var h = e.reason ? a(i, e.reason) : "",
						    l = e.advice ? a(r, e.advice) : "";
						("" !== h || "" !== l) && (u = h + ("" !== l ? "+" + l : ""));
						break;
					case "message":
						"" !== e.data && (u = e.data);
						break;
					case "event":
						var d = {
							name: e.name
						};
						e.args && e.args.length && (d.args = e.args), u = s.stringify(d);
						break;
					case "json":
						u = s.stringify(e.data);
						break;
					case "connect":
						e.qs && (u = e.qs);
						break;
					case "ack":
						u = e.ackId + (e.args && e.args.length ? "+" + s.stringify(e.args) : "")
				}
				var f = [t, n + ("data" == p ? "+" : ""), c];
				return null !== u && void 0 !== u && f.push(u), f.join(":")
				}, n.encodePayload = function (e) {
					var t = "";
					if (1 == e.length) return e[0];
					for (var n = 0, o = e.length; o > n; n++) {
						var i = e[n];
						t += "�" + i.length + "�" + e[n]
					}
					return t
				};
				var c = /([^:]+):([0-9]+)?(\+)?:([^:]+)?:?([\s\S]*)?/;
				n.decodePacket = function (e) {
					var t = e.match(c);
					if (!t) return {};
					var n = t[2] || "",
						e = t[5] || "",
						  a = {
							  type: o[t[1]],
							  endpoint: t[4] || ""
						  };
					switch (n && (a.id = n, a.ack = t[3] ? "data" : !0), a.type) {
						case "error":
							var t = e.split("+");
							a.reason = i[t[0]] || "", a.advice = r[t[1]] || "";
							break;
						case "message":
							a.data = e || "";
							break;
						case "event":
							try {
								var p = s.parse(e);
								a.name = p.name, a.args = p.args
							} catch (u) {}
							a.args = a.args || [];
							break;
						case "json":
							try {
								a.data = s.parse(e)
							} catch (u) {}
							break;
						case "connect":
							a.qs = e || "";
							break;
						case "ack":
							var t = e.match(/^([0-9]+)(\+)?(.*)/);
							if (t && (a.ackId = t[1], a.args = [], t[3])) try {
								a.args = t[3] ? s.parse(t[3]) : []
							} catch (u) {}
							break;
						case "disconnect":
						case "heartbeat":
					}
					return a
				}, n.decodePayload = function (e) {
					if ("�" == e.charAt(0)) {
						for (var t = [], o = 1, i = ""; o < e.length; o++) "�" == e.charAt(o) ? (t.push(n.decodePacket(e.substr(o + 1).substr(0, i))), o += Number(i) + 1, i = "") : i += e.charAt(o);
						return t
					}
					return [n.decodePacket(e)]
				}
						}("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports),
						function (e, t) {
							function n(e, t) {
								this.socket = e, this.sessid = t
							}
							e.Transport = n, t.util.mixin(n, t.EventEmitter), n.prototype.heartbeats = function () {
								return !0
							}, n.prototype.onData = function (e) {
								if (this.clearCloseTimeout(), (this.socket.connected || this.socket.connecting || this.socket.reconnecting) && this.setCloseTimeout(), "" !== e) {
									var n = t.parser.decodePayload(e);
									if (n && n.length)
										for (var o = 0, i = n.length; i > o; o++) this.onPacket(n[o])
								}
								return this
							}, n.prototype.onPacket = function (e) {
								return this.socket.setHeartbeatTimeout(), "heartbeat" == e.type ? this.onHeartbeat() : ("connect" == e.type && "" == e.endpoint && this.onConnect(), "error" == e.type && "reconnect" == e.advice && (this.isOpen = !1), this.socket.onPacket(e), this)
							}, n.prototype.setCloseTimeout = function () {
								if (!this.closeTimeout) {
									var e = this;
									this.closeTimeout = setTimeout(function () {
										e.onDisconnect()
									}, this.socket.closeTimeout)
								}
							}, n.prototype.onDisconnect = function () {
								return this.isOpen && this.close(), this.clearTimeouts(), this.socket.onDisconnect(), this
							}, n.prototype.onConnect = function () {
								return this.socket.onConnect(), this
							}, n.prototype.clearCloseTimeout = function () {
								this.closeTimeout && (clearTimeout(this.closeTimeout), this.closeTimeout = null)
							}, n.prototype.clearTimeouts = function () {
								this.clearCloseTimeout(), this.reopenTimeout && clearTimeout(this.reopenTimeout)
							}, n.prototype.packet = function (e) {
								this.send(t.parser.encodePacket(e))
							}, n.prototype.onHeartbeat = function () {
								this.packet({
									type: "heartbeat"
								})
							}, n.prototype.onOpen = function () {
								this.isOpen = !0, this.clearCloseTimeout(), this.socket.onOpen()
							}, n.prototype.onClose = function () {
								this.isOpen = !1, this.socket.onClose(), this.onDisconnect()
							}, n.prototype.prepareUrl = function () {
								var e = this.socket.options;
								return this.scheme() + "://" + e.host + ":" + e.port + "/" + e.resource + "/" + t.protocol + "/" + this.name + "/" + this.sessid
							}, n.prototype.ready = function (e, t) {
								t.call(this)
							}
						}("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports),
						function (e, t, n) {
							function o(e) {
								if (this.options = {
									port: 80,
								secure: !1,
								document: "document" in n ? document : !1,
								resource: "socket.io",
								transports: t.transports,
								"connect timeout": 1e4,
								"try multiple transports": !0,
								reconnect: !0,
								"reconnection delay": 500,
								"reconnection limit": 1 / 0,
								"reopen delay": 3e3,
								"max reconnection attempts": 10,
								"sync disconnect on unload": !1,
								"auto connect": !0,
								"flash policy port": 10843,
								manualFlush: !1
								}, t.util.merge(this.options, e), this.connected = !1, this.open = !1, this.connecting = !1, this.reconnecting = !1, this.namespaces = {}, this.buffer = [], this.doBuffer = !1, this.options["sync disconnect on unload"] && (!this.isXDomain() || t.util.ua.hasCORS)) {
									var o = this;
									t.util.on(n, "beforeunload", function () {
										o.disconnectSync()
									}, !1)
								}
								this.options["auto connect"] && this.connect()
							}

							function i() {}
							e.Socket = o, t.util.mixin(o, t.EventEmitter), o.prototype.of = function (e) {
								return this.namespaces[e] || (this.namespaces[e] = new t.SocketNamespace(this, e), "" !== e && this.namespaces[e].packet({
									type: "connect"
								})), this.namespaces[e]
							}, o.prototype.publish = function () {
								this.emit.apply(this, arguments);
								var e;
								for (var t in this.namespaces) this.namespaces.hasOwnProperty(t) && (e = this.of(t), e.$emit.apply(e, arguments))
							}, o.prototype.handshake = function (e) {
								function n(t) {
									t instanceof Error ? (o.connecting = !1, o.onError(t.message)) : e.apply(null, t.split(":"))
								}
								var o = this,
								    r = this.options,
								    s = ["http" + (r.secure ? "s" : "") + ":/", r.host + ":" + r.port, r.resource, t.protocol, t.util.query(this.options.query, "t=" + +new Date)].join("/");
								if (this.isXDomain() && !t.util.ua.hasCORS) {
									var a = document.getElementsByTagName("script")[0],
										c = document.createElement("script");
									c.src = s + "&jsonp=" + t.j.length, a.parentNode.insertBefore(c, a), t.j.push(function (e) {
										n(e), c.parentNode.removeChild(c)
									})
								} else {
									var p = t.util.request();
									p.open("GET", s, !0), this.isXDomain() && (p.withCredentials = !0), p.onreadystatechange = function () {
										4 == p.readyState && (p.onreadystatechange = i, 200 == p.status ? n(p.responseText) : 403 == p.status ? o.onError(p.responseText) : (o.connecting = !1, !o.reconnecting && o.onError(p.responseText)))
									}, p.send(null)
								}
							}, o.prototype.getTransport = function (e) {
								for (var n, o = e || this.transports, i = 0; n = o[i]; i++)
									if (t.Transport[n] && t.Transport[n].check(this) && (!this.isXDomain() || t.Transport[n].xdomainCheck(this))) return new t.Transport[n](this, this.sessionid);
								return null
							}, o.prototype.connect = function (e) {
								if (this.connecting) return this;
								var n = this;
								return n.connecting = !0, this.handshake(function (o, i, r, s) {
									function a(e) {
										return n.transport && n.transport.clearTimeouts(), n.transport = n.getTransport(e), n.transport ? (n.transport.ready(n, function () {
											n.connecting = !0, n.publish("connecting", n.transport.name), n.transport.open(), n.options["connect timeout"] && (n.connectTimeoutTimer = setTimeout(function () {
												if (!n.connected && (n.connecting = !1, n.options["try multiple transports"])) {
													for (var e = n.transports; e.length > 0 && e.splice(0, 1)[0] != n.transport.name;);
													e.length ? a(e) : n.publish("connect_failed")
												}
											}, n.options["connect timeout"]))
										}), void 0) : n.publish("connect_failed")
									}
									n.sessionid = o, n.closeTimeout = 1e3 * r, n.heartbeatTimeout = 1e3 * i, n.transports || (n.transports = n.origTransports = s ? t.util.intersect(s.split(","), n.options.transports) : n.options.transports), n.setHeartbeatTimeout(), a(n.transports), n.once("connect", function () {
										clearTimeout(n.connectTimeoutTimer), e && "function" == typeof e && e()
									})
								}), this
							}, o.prototype.setHeartbeatTimeout = function () {
								if (clearTimeout(this.heartbeatTimeoutTimer), !this.transport || this.transport.heartbeats()) {
									var e = this;
									this.heartbeatTimeoutTimer = setTimeout(function () {
										e.transport.onClose()
									}, this.heartbeatTimeout)
								}
							}, o.prototype.packet = function (e) {
								return this.connected && !this.doBuffer ? this.transport.packet(e) : this.buffer.push(e), this
							}, o.prototype.setBuffer = function (e) {
								this.doBuffer = e, !e && this.connected && this.buffer.length && (this.options.manualFlush || this.flushBuffer())
							}, o.prototype.flushBuffer = function () {
								this.transport.payload(this.buffer), this.buffer = []
							}, o.prototype.disconnect = function () {
								return (this.connected || this.connecting) && (this.open && this.of("").packet({
									type: "disconnect"
								}), this.onDisconnect("booted")), this
							}, o.prototype.disconnectSync = function () {
								var e = t.util.request(),
								    n = ["http" + (this.options.secure ? "s" : "") + ":/", this.options.host + ":" + this.options.port, this.options.resource, t.protocol, "", this.sessionid].join("/") + "/?disconnect=1";
								e.open("GET", n, !1), e.send(null), this.onDisconnect("booted")
							}, o.prototype.isXDomain = function () {
								var e = n.location.port || ("https:" == n.location.protocol ? 443 : 80);
								return this.options.host !== n.location.hostname || this.options.port != e
							}, o.prototype.onConnect = function () {
								this.connected || (this.connected = !0, this.connecting = !1, this.doBuffer || this.setBuffer(!1), this.emit("connect"))
							}, o.prototype.onOpen = function () {
								this.open = !0
							}, o.prototype.onClose = function () {
								this.open = !1, clearTimeout(this.heartbeatTimeoutTimer)
							}, o.prototype.onPacket = function (e) {
								this.of(e.endpoint).onPacket(e)
							}, o.prototype.onError = function (e) {
								e && e.advice && "reconnect" === e.advice && (this.connected || this.connecting) && (this.disconnect(), this.options.reconnect && this.reconnect()), this.publish("error", e && e.reason ? e.reason : e)
							}, o.prototype.onDisconnect = function (e) {
								var t = this.connected,
								    n = this.connecting;
								this.connected = !1, this.connecting = !1, this.open = !1, (t || n) && (this.transport.close(), this.transport.clearTimeouts(), t && (this.publish("disconnect", e), "booted" != e && this.options.reconnect && !this.reconnecting && this.reconnect()))
							}, o.prototype.reconnect = function () {
								function e() {
									if (n.connected) {
										for (var e in n.namespaces) n.namespaces.hasOwnProperty(e) && "" !== e && n.namespaces[e].packet({
											type: "connect"
										});
										n.publish("reconnect", n.transport.name, n.reconnectionAttempts)
									}
									clearTimeout(n.reconnectionTimer), n.removeListener("connect_failed", t), n.removeListener("connect", t), n.reconnecting = !1, delete n.reconnectionAttempts, delete n.reconnectionDelay, delete n.reconnectionTimer, delete n.redoTransports, n.options["try multiple transports"] = i
								}

								function t() {
									return n.reconnecting ? n.connected ? e() : n.connecting && n.reconnecting ? n.reconnectionTimer = setTimeout(t, 1e3) : (n.reconnectionAttempts++ >= o ? n.redoTransports ? (n.publish("reconnect_failed"), e()) : (n.on("connect_failed", t), n.options["try multiple transports"] = !0, n.transports = n.origTransports, n.transport = n.getTransport(), n.redoTransports = !0, n.connect()) : (n.reconnectionDelay < r && (n.reconnectionDelay *= 2), n.connect(), n.publish("reconnecting", n.reconnectionDelay, n.reconnectionAttempts), n.reconnectionTimer = setTimeout(t, n.reconnectionDelay)), void 0) : void 0
								}
								this.reconnecting = !0, this.reconnectionAttempts = 0, this.reconnectionDelay = this.options["reconnection delay"];
								var n = this,
								    o = this.options["max reconnection attempts"],
								    i = this.options["try multiple transports"],
								    r = this.options["reconnection limit"];
								this.options["try multiple transports"] = !1, this.reconnectionTimer = setTimeout(t, this.reconnectionDelay), this.on("connect", t)
							}
						}("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports, this),
						function (e, t) {
							function n(e, t) {
								this.socket = e, this.name = t || "", this.flags = {}, this.json = new o(this, "json"), this.ackPackets = 0, this.acks = {}
							}

							function o(e, t) {
								this.namespace = e, this.name = t
							}
							e.SocketNamespace = n, t.util.mixin(n, t.EventEmitter), n.prototype.$emit = t.EventEmitter.prototype.emit, n.prototype.of = function () {
								return this.socket.of.apply(this.socket, arguments)
							}, n.prototype.packet = function (e) {
								return e.endpoint = this.name, this.socket.packet(e), this.flags = {}, this
							}, n.prototype.send = function (e, t) {
								var n = {
									type: this.flags.json ? "json" : "message",
									data: e
								};
								return "function" == typeof t && (n.id = ++this.ackPackets, n.ack = !0, this.acks[n.id] = t), this.packet(n)
							}, n.prototype.emit = function (e) {
								var t = Array.prototype.slice.call(arguments, 1),
								n = t[t.length - 1],
								o = {
									type: "event",
									name: e
								};
								return "function" == typeof n && (o.id = ++this.ackPackets, o.ack = "data", this.acks[o.id] = n, t = t.slice(0, t.length - 1)), o.args = t, this.packet(o)
							}, n.prototype.disconnect = function () {
								return "" === this.name ? this.socket.disconnect() : (this.packet({
									type: "disconnect"
								}), this.$emit("disconnect")), this
							}, n.prototype.onPacket = function (e) {
								function n() {
									o.packet({
										type: "ack",
									args: t.util.toArray(arguments),
									ackId: e.id
									})
								}
								var o = this;
								switch (e.type) {
									case "connect":
										this.$emit("connect");
										break;
									case "disconnect":
										"" === this.name ? this.socket.onDisconnect(e.reason || "booted") : this.$emit("disconnect", e.reason);
										break;
									case "message":
									case "json":
										var i = ["message", e.data];
										"data" == e.ack ? i.push(n) : e.ack && this.packet({
											type: "ack",
											ackId: e.id
										}), this.$emit.apply(this, i);
										break;
									case "event":
										var i = [e.name].concat(e.args);
										"data" == e.ack && i.push(n), this.$emit.apply(this, i);
										break;
									case "ack":
										this.acks[e.ackId] && (this.acks[e.ackId].apply(this, e.args), delete this.acks[e.ackId]);
										break;
									case "error":
										e.advice ? this.socket.onError(e) : "unauthorized" == e.reason ? this.$emit("connect_failed", e.reason) : this.$emit("error", e.reason)
								}
							}, o.prototype.send = function () {
								this.namespace.flags[this.name] = !0, this.namespace.send.apply(this.namespace, arguments)
							}, o.prototype.emit = function () {
								this.namespace.flags[this.name] = !0, this.namespace.emit.apply(this.namespace, arguments)
							}
						}("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports),
						function (e, t, n) {
							function o() {
								t.Transport.apply(this, arguments)
							}
							e.websocket = o, t.util.inherit(o, t.Transport), o.prototype.name = "websocket", o.prototype.open = function () {
								var e, o = t.util.query(this.socket.options.query),
								i = this;
								return e || (e = n.MozWebSocket || n.WebSocket), this.websocket = new e(this.prepareUrl() + o), this.websocket.onopen = function () {
									i.onOpen(), i.socket.setBuffer(!1)
								}, this.websocket.onmessage = function (e) {
									i.onData(e.data)
								}, this.websocket.onclose = function () {
									i.onClose(), i.socket.setBuffer(!0)
								}, this.websocket.onerror = function (e) {
									i.onError(e)
								}, this
							}, o.prototype.send = t.util.ua.iDevice ? function (e) {
								var t = this;
								return setTimeout(function () {
									t.websocket.send(e)
								}, 0), this
							} : function (e) {
								return this.websocket.send(e), this
							}, o.prototype.payload = function (e) {
								for (var t = 0, n = e.length; n > t; t++) this.packet(e[t]);
								return this
							}, o.prototype.close = function () {
								return this.websocket.close(), this
							}, o.prototype.onError = function (e) {
								this.socket.onError(e)
							}, o.prototype.scheme = function () {
								return this.socket.options.secure ? "wss" : "ws"
							}, o.check = function () {
								return "WebSocket" in n && !("__addTask" in WebSocket) || "MozWebSocket" in n
							}, o.xdomainCheck = function () {
								return !0
							}, t.transports.push("websocket")
						}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this),
						function (e, t, n) {
							function o(e) {
								e && (t.Transport.apply(this, arguments), this.sendBuffer = [])
							}

							function i() {}
							e.XHR = o, t.util.inherit(o, t.Transport), o.prototype.open = function () {
								return this.socket.setBuffer(!1), this.onOpen(), this.get(), this.setCloseTimeout(), this
							}, o.prototype.payload = function (e) {
								for (var n = [], o = 0, i = e.length; i > o; o++) n.push(t.parser.encodePacket(e[o]));
								this.send(t.parser.encodePayload(n))
							}, o.prototype.send = function (e) {
								return this.post(e), this
							}, o.prototype.post = function (e) {
								function t() {
									4 == this.readyState && (this.onreadystatechange = i, r.posting = !1, 200 == this.status ? r.socket.setBuffer(!1) : r.onClose())
								}

								function o() {
									this.onload = i, r.socket.setBuffer(!1)
								}
								var r = this;
								this.socket.setBuffer(!0), this.sendXHR = this.request("POST"), n.XDomainRequest && this.sendXHR instanceof XDomainRequest ? this.sendXHR.onload = this.sendXHR.onerror = o : this.sendXHR.onreadystatechange = t, this.sendXHR.send(e)
							}, o.prototype.close = function () {
								return this.onClose(), this
							}, o.prototype.request = function (e) {
								var n = t.util.request(this.socket.isXDomain()),
								    o = t.util.query(this.socket.options.query, "t=" + +new Date);
								if (n.open(e || "GET", this.prepareUrl() + o, !0), "POST" == e) try {
									n.setRequestHeader ? n.setRequestHeader("Content-type", "text/plain;charset=UTF-8") : n.contentType = "text/plain"
								} catch (i) {}
								return n
							}, o.prototype.scheme = function () {
								return this.socket.options.secure ? "https" : "http"
							}, o.check = function (e, o) {
								try {
									var i = t.util.request(o),
									    r = n.XDomainRequest && i instanceof XDomainRequest,
									    s = e && e.options && e.options.secure ? "https:" : "http:",
									    a = n.location && s != n.location.protocol;
									if (i && (!r || !a)) return !0
								} catch (c) {}
								return !1
							}, o.xdomainCheck = function (e) {
								return o.check(e, !0)
							}
						}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this),
						function (e, t) {
							function n() {
								t.Transport.XHR.apply(this, arguments)
							}
							e.htmlfile = n, t.util.inherit(n, t.Transport.XHR), n.prototype.name = "htmlfile", n.prototype.get = function () {
								this.doc = new(window[["Active"].concat("Object").join("X")])("htmlfile"), this.doc.open(), this.doc.write("<html></html>"), this.doc.close(), this.doc.parentWindow.s = this;
								var e = this.doc.createElement("div");
								e.className = "socketio", this.doc.body.appendChild(e), this.iframe = this.doc.createElement("iframe"), e.appendChild(this.iframe);
								var n = this,
								    o = t.util.query(this.socket.options.query, "t=" + +new Date);
								this.iframe.src = this.prepareUrl() + o, t.util.on(window, "unload", function () {
									n.destroy()
								})
							}, n.prototype._ = function (e, t) {
								this.onData(e);
								try {
									var n = t.getElementsByTagName("script")[0];
									n.parentNode.removeChild(n)
								} catch (o) {}
							}, n.prototype.destroy = function () {
								if (this.iframe) {
									try {
										this.iframe.src = "about:blank"
									} catch (e) {}
									this.doc = null, this.iframe.parentNode.removeChild(this.iframe), this.iframe = null, CollectGarbage()
								}
							}, n.prototype.close = function () {
								return this.destroy(), t.Transport.XHR.prototype.close.call(this)
							}, n.check = function (e) {
								if ("undefined" != typeof window && ["Active"].concat("Object").join("X") in window) try {
									var n = new(window[["Active"].concat("Object").join("X")])("htmlfile");
									return n && t.Transport.XHR.check(e)
								} catch (o) {}
								return !1
							}, n.xdomainCheck = function () {
								return !1
							}, t.transports.push("htmlfile")
						}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports),
						function (e, t, n) {
							function o() {
								t.Transport.XHR.apply(this, arguments)
							}

							function i() {}
							e["xhr-polling"] = o, t.util.inherit(o, t.Transport.XHR), t.util.merge(o, t.Transport.XHR), o.prototype.name = "xhr-polling", o.prototype.heartbeats = function () {
								return !1
							}, o.prototype.open = function () {
								var e = this;
								return t.Transport.XHR.prototype.open.call(e), !1
							}, o.prototype.get = function () {
								function e() {
									4 == this.readyState && (this.onreadystatechange = i, 200 == this.status ? (r.onData(this.responseText), r.get()) : r.onClose())
								}

								function t() {
									this.onload = i, this.onerror = i, r.retryCounter = 1, r.onData(this.responseText), r.get()
								}

								function o() {
									r.retryCounter++, !r.retryCounter || r.retryCounter > 3 ? r.onClose() : r.get()
								}
								if (this.isOpen) {
									var r = this;
									this.xhr = this.request(), n.XDomainRequest && this.xhr instanceof XDomainRequest ? (this.xhr.onload = t, this.xhr.onerror = o) : this.xhr.onreadystatechange = e, this.xhr.send(null)
								}
							}, o.prototype.onClose = function () {
								if (t.Transport.XHR.prototype.onClose.call(this), this.xhr) {
									this.xhr.onreadystatechange = this.xhr.onload = this.xhr.onerror = i;
									try {
										this.xhr.abort()
									} catch (e) {}
									this.xhr = null
								}
							}, o.prototype.ready = function (e, n) {
								var o = this;
								t.util.defer(function () {
									n.call(o)
								})
							}, t.transports.push("xhr-polling")
						}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this),
						function (e, t, n) {
							function o() {
								t.Transport["xhr-polling"].apply(this, arguments), this.index = t.j.length;
								var e = this;
								t.j.push(function (t) {
									e._(t)
								})
							}
							var i = n.document && "MozAppearance" in n.document.documentElement.style;
							e["jsonp-polling"] = o, t.util.inherit(o, t.Transport["xhr-polling"]), o.prototype.name = "jsonp-polling", o.prototype.post = function (e) {
								function n() {
									o(), i.socket.setBuffer(!1)
								}

								function o() {
									i.iframe && i.form.removeChild(i.iframe);
									try {
										s = document.createElement('<iframe name="' + i.iframeId + '">')
									} catch (e) {
										s = document.createElement("iframe"), s.name = i.iframeId
									}
									s.id = i.iframeId, i.form.appendChild(s), i.iframe = s
								}
								var i = this,
								    r = t.util.query(this.socket.options.query, "t=" + +new Date + "&i=" + this.index);
								if (!this.form) {
									var s, a = document.createElement("form"),
										c = document.createElement("textarea"),
										  p = this.iframeId = "socketio_iframe_" + this.index;
									a.className = "socketio", a.style.position = "absolute", a.style.top = "0px", a.style.left = "0px", a.style.display = "none", a.target = p, a.method = "POST", a.setAttribute("accept-charset", "utf-8"), c.name = "d", a.appendChild(c), document.body.appendChild(a), this.form = a, this.area = c
								}
								this.form.action = this.prepareUrl() + r, o(), this.area.value = t.JSON.stringify(e);
								try {
									this.form.submit()
								} catch (u) {}
								this.iframe.attachEvent ? s.onreadystatechange = function () {
									"complete" == i.iframe.readyState && n()
								} : this.iframe.onload = n, this.socket.setBuffer(!0)
							}, o.prototype.get = function () {
								var e = this,
								    n = document.createElement("script"),
								    o = t.util.query(this.socket.options.query, "t=" + +new Date + "&i=" + this.index);
								this.script && (this.script.parentNode.removeChild(this.script), this.script = null), n.async = !0, n.src = this.prepareUrl() + o, n.onerror = function () {
									e.onClose()
								};
								var r = document.getElementsByTagName("script")[0];
								r.parentNode.insertBefore(n, r), this.script = n, i && setTimeout(function () {
									var e = document.createElement("iframe");
									document.body.appendChild(e), document.body.removeChild(e)
								}, 100)
							}, o.prototype._ = function (e) {
								return this.onData(e), this.isOpen && this.get(), this
							}, o.prototype.ready = function (e, n) {
								var o = this;
								return i ? (t.util.load(function () {
									n.call(o)
								}), void 0) : n.call(this)
							}, o.check = function () {
								return "document" in n
							}, o.xdomainCheck = function () {
								return !0
							}, t.transports.push("jsonp-polling")
						}("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this), "function" == typeof define && define.amd && define([], function () {
							return io
						})
}();

