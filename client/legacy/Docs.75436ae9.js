import{_ as t,a as n,b as e,c as i,i as r,s as o,d as c,S as s,f as a,v as l,g as f,h as u,w as h,j as v,H as d,k as m,I as g,l as p,y as $,t as w,o as y,p as _,q as E,n as b,r as R,J as j,K as k,L as B,A as D,m as A,M as L,N as S,O as I,P as N,Q as T}from"./client.ebddc9d9.js";function C(t){var i=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,o=n(t);if(i){var c=n(this).constructor;r=Reflect.construct(o,arguments,c)}else r=o.apply(this,arguments);return e(this,r)}}function P(t,n,e){var i=t.slice();return i[9]=n[e],i}function V(t,n,e){var i=t.slice();return i[12]=n[e],i}function q(t){var n,e,i;return e=new I({props:{name:"arrow-right"}}),{c:function(){n=a("div"),y(e.$$.fragment),this.h()},l:function(t){n=f(t,"DIV",{class:!0});var i=u(n);_(e.$$.fragment,i),i.forEach(v),this.h()},h:function(){m(n,"class","icon-container svelte-mm3tjv")},m:function(t,r){p(t,n,r),E(e,n,null),i=!0},i:function(t){i||(w(e.$$.fragment,t),i=!0)},o:function(t){b(e.$$.fragment,t),i=!1},d:function(t){t&&v(n),R(e)}}}function x(t){var n,e,i;return e=new I({props:{name:"arrow-right"}}),{c:function(){n=a("div"),y(e.$$.fragment),this.h()},l:function(t){n=f(t,"DIV",{class:!0});var i=u(n);_(e.$$.fragment,i),i.forEach(v),this.h()},h:function(){m(n,"class","icon-container svelte-mm3tjv")},m:function(t,r){p(t,n,r),E(e,n,null),i=!0},i:function(t){i||(w(e.$$.fragment,t),i=!0)},o:function(t){b(e.$$.fragment,t),i=!1},d:function(t){t&&v(n),R(e)}}}function H(t){var n,e,i,r,o,c,s=t[12].title+"",y=t[12].slug===t[2]&&x();return{c:function(){n=a("a"),i=l(),y&&y.c(),this.h()},l:function(t){n=f(t,"A",{class:!0,href:!0,"data-level":!0});var e=u(n);i=h(e),y&&y.l(e),e.forEach(v),this.h()},h:function(){e=new d(i),m(n,"class","subsection svelte-mm3tjv"),m(n,"href",r=t[3]+"#"+t[12].slug),m(n,"data-level",o=t[12].level),g(n,"active",t[12].slug===t[2])},m:function(t,r){p(t,n,r),e.m(s,n),$(n,i),y&&y.m(n,null),c=!0},p:function(t,i){(!c||2&i)&&s!==(s=t[12].title+"")&&e.p(s),t[12].slug===t[2]?y?6&i&&w(y,1):((y=x()).c(),w(y,1),y.m(n,null)):y&&(j(),b(y,1,1,(function(){y=null})),k()),(!c||10&i&&r!==(r=t[3]+"#"+t[12].slug))&&m(n,"href",r),(!c||2&i&&o!==(o=t[12].level))&&m(n,"data-level",o),6&i&&g(n,"active",t[12].slug===t[2])},i:function(t){c||(w(y),c=!0)},o:function(t){b(y),c=!1},d:function(t){t&&v(n),y&&y.d()}}}function O(t){for(var n,e,i,r,o,c,s,y,_=t[9].metadata.title+"",E=t[9].slug===t[2]&&q(),R=t[9].subsections,D=[],A=0;A<R.length;A+=1)D[A]=H(V(t,R,A));var L=function(t){return b(D[t],1,1,(function(){D[t]=null}))};return{c:function(){n=a("li"),e=a("a"),r=l(),E&&E.c(),c=l();for(var t=0;t<D.length;t+=1)D[t].c();s=l(),this.h()},l:function(t){n=f(t,"LI",{class:!0});var i=u(n);e=f(i,"A",{class:!0,href:!0});var o=u(e);r=h(o),E&&E.l(o),o.forEach(v),c=h(i);for(var a=0;a<D.length;a+=1)D[a].l(i);s=h(i),i.forEach(v),this.h()},h:function(){i=new d(r),m(e,"class","section svelte-mm3tjv"),m(e,"href",o=t[3]+"#"+t[9].slug),g(e,"active",t[9].slug===t[2]),m(n,"class","svelte-mm3tjv")},m:function(t,o){p(t,n,o),$(n,e),i.m(_,e),$(e,r),E&&E.m(e,null),$(n,c);for(var a=0;a<D.length;a+=1)D[a].m(n,null);$(n,s),y=!0},p:function(t,r){if((!y||2&r)&&_!==(_=t[9].metadata.title+"")&&i.p(_),t[9].slug===t[2]?E?6&r&&w(E,1):((E=q()).c(),w(E,1),E.m(e,null)):E&&(j(),b(E,1,1,(function(){E=null})),k()),(!y||10&r&&o!==(o=t[3]+"#"+t[9].slug))&&m(e,"href",o),6&r&&g(e,"active",t[9].slug===t[2]),14&r){var c;for(R=t[9].subsections,c=0;c<R.length;c+=1){var a=V(t,R,c);D[c]?(D[c].p(a,r),w(D[c],1)):(D[c]=H(a),D[c].c(),w(D[c],1),D[c].m(n,s))}for(j(),c=R.length;c<D.length;c+=1)L(c);k()}},i:function(t){if(!y){w(E);for(var n=0;n<R.length;n+=1)w(D[n]);y=!0}},o:function(t){b(E),D=D.filter(Boolean);for(var n=0;n<D.length;n+=1)b(D[n]);y=!1},d:function(t){t&&v(n),E&&E.d(),B(D,t)}}}function z(t){for(var n,e,i,r,o=t[1],c=[],s=0;s<o.length;s+=1)c[s]=O(P(t,o,s));var l=function(t){return b(c[t],1,1,(function(){c[t]=null}))};return{c:function(){n=a("ul");for(var t=0;t<c.length;t+=1)c[t].c();this.h()},l:function(t){n=f(t,"UL",{class:!0});for(var e=u(n),i=0;i<c.length;i+=1)c[i].l(e);e.forEach(v),this.h()},h:function(){m(n,"class","reference-toc svelte-mm3tjv")},m:function(o,s){p(o,n,s);for(var a=0;a<c.length;a+=1)c[a].m(n,null);t[6](n),e=!0,i||(r=[D(n,"mouseenter",t[7]),D(n,"mouseleave",t[8])],i=!0)},p:function(t,e){var i=A(e,1)[0];if(14&i){var r;for(o=t[1],r=0;r<o.length;r+=1){var s=P(t,o,r);c[r]?(c[r].p(s,i),w(c[r],1)):(c[r]=O(s),c[r].c(),w(c[r],1),c[r].m(n,null))}for(j(),r=o.length;r<c.length;r+=1)l(r);k()}},i:function(t){if(!e){for(var n=0;n<o.length;n+=1)w(c[n]);e=!0}},o:function(t){c=c.filter(Boolean);for(var n=0;n<c.length;n+=1)b(c[n]);e=!1},d:function(e){e&&v(n),B(c,e),t[6](null),i=!1,L(r)}}}function M(t,n,e){var i,r=n.sections,o=void 0===r?[]:r,c=n.active_section,s=void 0===c?null:c,a=n.show_contents,l=n.prevent_sidebar_scroll,f=void 0!==l&&l,u=n.dir;S((function(){if(!(f||a&&window.innerWidth<832)){var t=i.querySelector(".active");if(t){var n=t.getBoundingClientRect(),e=n.top,r=n.bottom,o=window.innerHeight-200;e>o?i.parentNode.scrollBy({top:e-o,left:0,behavior:"smooth"}):r<200&&i.parentNode.scrollBy({top:r-200,left:0,behavior:"smooth"})}}}));return t.$$set=function(t){"sections"in t&&e(1,o=t.sections),"active_section"in t&&e(2,s=t.active_section),"show_contents"in t&&e(5,a=t.show_contents),"prevent_sidebar_scroll"in t&&e(0,f=t.prevent_sidebar_scroll),"dir"in t&&e(3,u=t.dir)},[f,o,s,u,i,a,function(t){N[t?"unshift":"push"]((function(){e(4,i=t)}))},function(){return e(0,f=!0)},function(){return e(0,f=!1)}]}var U=function(n){t(a,s);var e=C(a);function a(t){var n;return i(this,a),n=e.call(this),r(c(n),t,M,z,o,{sections:1,active_section:2,show_contents:5,prevent_sidebar_scroll:0,dir:3}),n}return a}();function J(t){var i=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,o=n(t);if(i){var c=n(this).constructor;r=Reflect.construct(o,arguments,c)}else r=o.apply(this,arguments);return e(this,r)}}function K(t,n,e){var i=t.slice();return i[14]=n[e],i}function Q(t){var n,e,i,r,o,c,s,g,j,k,B,D,A,L,S,N,T,C,P,V=t[14].metadata.title+"",q=t[14].html+"";return A=new I({props:{name:"edit"}}),{c:function(){n=a("section"),e=a("h2"),i=a("span"),o=l(),c=a("a"),g=l(),k=l(),B=a("small"),D=a("a"),y(A.$$.fragment),S=l(),T=l(),this.h()},l:function(t){n=f(t,"SECTION",{"data-id":!0,class:!0});var r=u(n);e=f(r,"H2",{class:!0});var s=u(e);i=f(s,"SPAN",{class:!0,id:!0}),u(i).forEach(v),o=h(s),c=f(s,"A",{href:!0,class:!0,"aria-hidden":!0}),u(c).forEach(v),g=h(s),k=h(s),B=f(s,"SMALL",{class:!0});var a=u(B);D=f(a,"A",{href:!0,title:!0,class:!0});var l=u(D);_(A.$$.fragment,l),l.forEach(v),a.forEach(v),s.forEach(v),S=h(r),T=h(r),r.forEach(v),this.h()},h:function(){m(i,"class","offset-anchor"),m(i,"id",r=t[14].slug),m(c,"href",s=t[3]+"#"+t[14].slug),m(c,"class","anchor"),m(c,"aria-hidden",""),j=new d(k),m(D,"href",L="https://github.com/"+t[0]+"/"+t[1]+"/edit/master"+t[2]+"/"+t[3]+"/"+t[14].file),m(D,"title",t[4]),m(D,"class","svelte-1itkhys"),m(B,"class","svelte-1itkhys"),m(e,"class","svelte-1itkhys"),N=new d(T),m(n,"data-id",C=t[14].slug),m(n,"class","svelte-1itkhys")},m:function(t,r){p(t,n,r),$(n,e),$(e,i),$(e,o),$(e,c),$(e,g),j.m(V,e),$(e,k),$(e,B),$(B,D),E(A,D,null),$(n,S),N.m(q,n),$(n,T),P=!0},p:function(t,e){(!P||32&e&&r!==(r=t[14].slug))&&m(i,"id",r),(!P||40&e&&s!==(s=t[3]+"#"+t[14].slug))&&m(c,"href",s),(!P||32&e)&&V!==(V=t[14].metadata.title+"")&&j.p(V),(!P||47&e&&L!==(L="https://github.com/"+t[0]+"/"+t[1]+"/edit/master"+t[2]+"/"+t[3]+"/"+t[14].file))&&m(D,"href",L),(!P||16&e)&&m(D,"title",t[4]),(!P||32&e)&&q!==(q=t[14].html+"")&&N.p(q),(!P||32&e&&C!==(C=t[14].slug))&&m(n,"data-id",C)},i:function(t){P||(w(A.$$.fragment,t),P=!0)},o:function(t){b(A.$$.fragment,t),P=!1},d:function(t){t&&v(n),R(A)}}}function W(t){for(var n,e,i,r,o,c,s,d,S,N,T,C=t[5],P=[],V=0;V<C.length;V+=1)P[V]=Q(K(t,C,V));var q=function(t){return b(P[t],1,1,(function(){P[t]=null}))};return o=new U({props:{sections:t[5],active_section:t[6],show_contents:t[9],dir:t[3]}}),d=new I({props:{name:t[9]?"close":"menu"}}),{c:function(){n=a("div");for(var t=0;t<P.length;t+=1)P[t].c();e=l(),i=a("aside"),r=a("div"),y(o.$$.fragment),c=l(),s=a("button"),y(d.$$.fragment),this.h()},l:function(t){n=f(t,"DIV",{class:!0});for(var a=u(n),l=0;l<P.length;l+=1)P[l].l(a);a.forEach(v),e=h(t),i=f(t,"ASIDE",{class:!0});var m=u(i);r=f(m,"DIV",{class:!0});var g=u(r);_(o.$$.fragment,g),g.forEach(v),c=h(m),s=f(m,"BUTTON",{class:!0});var p=u(s);_(d.$$.fragment,p),p.forEach(v),m.forEach(v),this.h()},h:function(){m(n,"class","content listify svelte-1itkhys"),m(r,"class","sidebar svelte-1itkhys"),m(s,"class","svelte-1itkhys"),m(i,"class","sidebar-container svelte-1itkhys"),g(i,"open",t[9])},m:function(a,l){p(a,n,l);for(var f=0;f<P.length;f+=1)P[f].m(n,null);t[10](n),p(a,e,l),p(a,i,l),$(i,r),E(o,r,null),$(i,c),$(i,s),E(d,s,null),t[13](i),S=!0,N||(T=[D(r,"click",t[11]),D(s,"click",t[12])],N=!0)},p:function(t,e){var r=A(e,1)[0];if(63&r){var c;for(C=t[5],c=0;c<C.length;c+=1){var s=K(t,C,c);P[c]?(P[c].p(s,r),w(P[c],1)):(P[c]=Q(s),P[c].c(),w(P[c],1),P[c].m(n,null))}for(j(),c=C.length;c<P.length;c+=1)q(c);k()}var a={};32&r&&(a.sections=t[5]),64&r&&(a.active_section=t[6]),512&r&&(a.show_contents=t[9]),8&r&&(a.dir=t[3]),o.$set(a);var l={};512&r&&(l.name=t[9]?"close":"menu"),d.$set(l),512&r&&g(i,"open",t[9])},i:function(t){if(!S){for(var n=0;n<C.length;n+=1)w(P[n]);w(o.$$.fragment,t),w(d.$$.fragment,t),S=!0}},o:function(t){P=P.filter(Boolean);for(var n=0;n<P.length;n+=1)b(P[n]);b(o.$$.fragment,t),b(d.$$.fragment,t),S=!1},d:function(r){r&&v(n),B(P,r),t[10](null),r&&v(e),r&&v(i),R(o),R(d),t[13](null),N=!1,L(T)}}}function F(t,n,e){var i,r,o,c=n.owner,s=void 0===c?"sveltejs":c,a=n.project,l=void 0===a?"svelte":a,f=n.path,u=void 0===f?"/site/content":f,h=n.dir,v=void 0===h?"docs":h,d=n.edit_title,m=void 0===d?"edit this section":d,g=n.sections,p=!1;T((function(){var t,n=r.querySelectorAll("[id]:not([data-scrollignore])"),o=function(){var e=r.getBoundingClientRect().top;t=[].map.call(n,(function(t){return t.getBoundingClientRect().top-e}))},c=window.location.hash.slice(1),s=function(){for(var o=r.getBoundingClientRect().top,s=n.length;s--;)if(t[s]+o<40){var a=n[s].id;return void(a!==c&&(e(6,i=a),c=a))}};window.addEventListener("scroll",s,!0),window.addEventListener("resize",o,!0);var a=[setTimeout(o,1e3),setTimeout(s,5e3)];return o(),s(),function(){window.removeEventListener("scroll",s,!0),window.removeEventListener("resize",o,!0),a.forEach((function(t){return clearTimeout(t)}))}}));return t.$$set=function(t){"owner"in t&&e(0,s=t.owner),"project"in t&&e(1,l=t.project),"path"in t&&e(2,u=t.path),"dir"in t&&e(3,v=t.dir),"edit_title"in t&&e(4,m=t.edit_title),"sections"in t&&e(5,g=t.sections)},[s,l,u,v,m,g,i,r,o,p,function(t){N[t?"unshift":"push"]((function(){e(7,r=t)}))},function(){return e(9,p=!1)},function(){return e(9,p=!p)},function(t){N[t?"unshift":"push"]((function(){e(8,o=t)}))}]}var G=function(n){t(a,s);var e=J(a);function a(t){var n;return i(this,a),n=e.call(this),r(c(n),t,F,W,o,{owner:0,project:1,path:2,dir:3,edit_title:4,sections:5}),n}return a}();export{G as D};
