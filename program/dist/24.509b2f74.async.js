webpackJsonp([24],{687:function(e,t,r){"use strict";function a(e){return n.apply(this,arguments)}function n(){return n=h()(d.a.mark(function e(t){var r,a,n,c,s;return d.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.offset,a=void 0===r?0:r,n=t.limit,c=void 0===n?10:n,s=v.a.get("access_token"),e.abrupt("return",Object(b.a)("".concat(k,"/returns/order?offset=").concat(a,"&limit=").concat(c),{headers:{Authorization:s}}));case 3:case"end":return e.stop()}},e,this)})),n.apply(this,arguments)}function c(e){return s.apply(this,arguments)}function s(){return s=h()(d.a.mark(function e(t){var r,a;return d.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.returnId,a=v.a.get("access_token"),e.abrupt("return",Object(b.a)("".concat(k,"/returns/order/").concat(r),{headers:{Authorization:a}}));case 3:case"end":return e.stop()}},e,this)})),s.apply(this,arguments)}function u(e){return o.apply(this,arguments)}function o(){return o=h()(d.a.mark(function e(t){var r,a,n;return d.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.returnId,a=t.data,n=v.a.get("access_token"),e.abrupt("return",Object(b.a)("".concat(k,"/returns/order/").concat(r),{method:"put",headers:{Authorization:n},data:f()({},a)}));case 3:case"end":return e.stop()}},e,this)})),o.apply(this,arguments)}Object.defineProperty(t,"__esModule",{value:!0});var i=r(42),f=r.n(i),p=r(96),d=r.n(p),l=r(189),h=r.n(l),x=r(127),v=r.n(x),y=r(97),b=r(320),k="".concat(y.f,"/v1/chief");t.default={namespace:"returns",state:{list:[],detail:{},offset:0,limit:15,total:0},effects:{fetch:d.a.mark(function e(t,r){var n,c,s,u,o,i,f,p;return d.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.offset,c=t.limit,s=t.success,u=t.error,o=r.call,i=r.put,e.next=4,o(a,{offset:n,limit:c});case 4:if(f=e.sent,f.rescode>>0!==y.j){e.next=9;break}"function"==typeof s&&s(f),e.next=12;break;case 9:if("function"!=typeof u){e.next=12;break}return u(f),e.abrupt("return");case 12:return p=f.headers,e.next=15,i({type:"save",payload:f.data,headers:p});case 15:case"end":return e.stop()}},e,this)}),fetchDetail:d.a.mark(function e(t,r){var a,n,s,u,o,i,f;return d.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a=t.returnId,n=t.success,s=t.error,u=r.call,o=r.put,e.next=4,u(c,{returnId:a});case 4:if(i=e.sent,i.rescode>>0!==y.j){e.next=9;break}"function"==typeof n&&n(i),e.next=12;break;case 9:if("function"!=typeof s){e.next=12;break}return s(i),e.abrupt("return");case 12:return f=i.headers,e.next=15,o({type:"saveDetail",payload:i.data,headers:f});case 15:case"end":return e.stop()}},e,this)}),fetchAudit:d.a.mark(function e(t,r){var n,c,s,o,i,f,p,l,h;return d.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.returnId,c=t.data,s=t.success,o=t.error,i=r.call,f=r.put,e.next=4,i(u,{returnId:n,data:c});case 4:if(p=e.sent,p.rescode>>0!==y.j){e.next=9;break}"function"==typeof s&&s(p),e.next=12;break;case 9:if("function"!=typeof o){e.next=12;break}return o(p),e.abrupt("return");case 12:return e.next=14,i(a,{});case 14:return l=e.sent,h=l.headers,e.next=18,f({type:"save",payload:l.data,headers:h});case 18:case"end":return e.stop()}},e,this)})},reducers:{save:function(e,t){return f()({},e,{list:t.payload,total:t.headers["x-content-total"]>>0})},saveDetail:function(e,t){return f()({},e,{detail:t.payload})},saveSearch:function(e,t){return f()({},e,{list:t.payload,exceptionList:t.payload})}}}}});