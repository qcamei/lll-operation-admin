webpackJsonp([18],{1576:function(r,t){r.exports={trigger:"trigger___j9ER4"}},1651:function(r,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),e.d(t,"default",function(){return q});var n,i,o=(e(311),e(312)),a=(e(295),e(184)),s=e(183),g=e.n(s),p=e(298),c=e.n(p),u=e(299),d=e.n(u),l=e(300),f=e.n(l),y=e(301),h=e.n(y),v=e(302),_=e.n(v),k=e(1),C=(e.n(k),e(188)),b=(e.n(C),e(1576)),j=e.n(b),q=(n=Object(C.connect)(function(r){return{isloading:r.error.isloading}}))(i=function(r){function t(){var r,e,n;d()(this,t);for(var i=arguments.length,o=new Array(i),a=0;a<i;a++)o[a]=arguments[a];return h()(n,(e=n=h()(this,(r=t.__proto__||c()(t)).call.apply(r,[this].concat(o))),n.state={isloading:!1},n.trigger403=function(){n.setState({isloading:!0}),n.props.dispatch({type:"error/query403"})},n.trigger500=function(){n.setState({isloading:!0}),n.props.dispatch({type:"error/query500"})},n.trigger404=function(){n.setState({isloading:!0}),n.props.dispatch({type:"error/query404"})},e))}return _()(t,r),f()(t,[{key:"render",value:function(){return g()(o.a,{spinning:this.state.isloading,wrapperClassName:j.a.trigger},void 0,g()(a.a,{type:"danger",onClick:this.trigger403},void 0,"\u89e6\u53d1403"),g()(a.a,{type:"danger",onClick:this.trigger500},void 0,"\u89e6\u53d1500"),g()(a.a,{type:"danger",onClick:this.trigger404},void 0,"\u89e6\u53d1404"))}}]),t}(k.PureComponent))||i}});