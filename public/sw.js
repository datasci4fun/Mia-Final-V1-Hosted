if(!self.define){let e,s={};const t=(t,a)=>(t=new URL(t+".js",a).href,s[t]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=t,e.onload=s,document.head.appendChild(e)}else e=t,importScripts(t),s()})).then((()=>{let e=s[t];if(!e)throw new Error(`Module ${t} didn’t register its module`);return e})));self.define=(a,i)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let c={};const o=e=>t(e,n),r={module:{uri:n},exports:c,require:o};s[n]=Promise.all(a.map((e=>r[e]||o(e)))).then((e=>(i(...e),c)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts("worker-3AhWjbYQtoXMoP8qlvXZ6.js"),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/DARK_BRAND_LOGO.png",revision:"1156d30a299a046690e919fb97448531"},{url:"/LIGHT_BRAND_LOGO.png",revision:"1156d30a299a046690e919fb97448531"},{url:"/_next/app-build-manifest.json",revision:"b7cc687cd39a1cea4c42af18fb131432"},{url:"/_next/static/3AhWjbYQtoXMoP8qlvXZ6/_buildManifest.js",revision:"a0ae24e7f29dd3809ab75b5dd91a79dc"},{url:"/_next/static/3AhWjbYQtoXMoP8qlvXZ6/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/23-977fb0145cf28714.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/275-a9dfab5d6855c58c.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/296.35a6f1a9ce4632b5.js",revision:"35a6f1a9ce4632b5"},{url:"/_next/static/chunks/35.03ae917f238a8966.js",revision:"03ae917f238a8966"},{url:"/_next/static/chunks/391-318e874e1cb122e9.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/429-fd6ebe57a0c4a426.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/448.051e87bb59265d81.js",revision:"051e87bb59265d81"},{url:"/_next/static/chunks/473-1143299237084eaf.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/487-37305a97c5e3783f.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/51-fa358fa1544aaaf2.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/533-1653448d134c02a1.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/561-3e28b0a3dedfb40b.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/582-88af56e1a81ef5f8.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/592-a236cd78e31e1bde.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/5f069060-98cc48216fc3bfff.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/630-5c5f6cf8b6e6e5d0.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/691-3a7b84383e5765d7.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/718-a66b32d04bc63dff.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/85-309595cf81da55bb.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/872-cc0cd2e73c7bd944.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/896-0ce440093dc83846.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/93-d1be0810c4a018ed.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/app/%5Blocale%5D/%5Bworkspaceid%5D/chat/%5Bchatid%5D/page-f9d14ef3f461751b.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/app/%5Blocale%5D/%5Bworkspaceid%5D/chat/page-852bfcfc5019b65e.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/app/%5Blocale%5D/%5Bworkspaceid%5D/layout-87307d5c7555f6d4.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/app/%5Blocale%5D/%5Bworkspaceid%5D/page-aed4d32d0e57cc19.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/app/%5Blocale%5D/chat/layout-cb75db7c751b7c42.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/app/%5Blocale%5D/chat/page-14a2966b0f94a754.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/app/%5Blocale%5D/help/page-28a176dbfe1920d7.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/app/%5Blocale%5D/layout-04eef2e85050ad07.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/app/%5Blocale%5D/loading-6ed26642bc56bdf2.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/app/%5Blocale%5D/login/page-9757169ea8e14b07.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/app/%5Blocale%5D/login/password/page-96f15125531561a8.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/app/%5Blocale%5D/page-871cd1cff3c9b826.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/app/%5Blocale%5D/setup/page-fcedefd08f26ebe5.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/app/_not-found/page-29f5059583aacce2.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/fd9d1056-47199b51060597f8.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/framework-b370f160bb96059c.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/main-app-d8b4347ec7e2575d.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/main-e56150b0156cab72.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/pages/_app-037b5d058bd9a820.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/pages/_error-6ae619510b1539d6.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-8a883188b9a679d7.js",revision:"3AhWjbYQtoXMoP8qlvXZ6"},{url:"/_next/static/css/9c24517369335ff6.css",revision:"9c24517369335ff6"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/_next/static/media/groq.b9f43df3.png",revision:"729c22b9f81090ce1f5afb6954501077"},{url:"/_next/static/media/mistral.eea6c58a.png",revision:"f2c796d7d28caba7a562f5256903e88e"},{url:"/_next/static/media/perplexity.87b1132a.png",revision:"e95b1bb5202b415bf1916693b99bd0e4"},{url:"/avatar_robot@2x-1ad749fc.png",revision:"e07384018d885356fa11ab7055fac04e"},{url:"/chat-widget.js",revision:"727ddea608b4805ade0a879905fce91b"},{url:"/dist/chat-widget.bundle.js",revision:"93b1bc9872d269c19103ce7447591d84"},{url:"/favicon.ico",revision:"060d596c3b70afc87fbb83401f4984e7"},{url:"/icon-192x192.png",revision:"65e756679b0179f69790ad876c4ff2fa"},{url:"/icon-256x256.png",revision:"189f691ac1a2b8c79e4bf7d1951b2025"},{url:"/icon-512x512.png",revision:"cf12be4afd99acc9b097f3080c37f5db"},{url:"/locales/de/translation.json",revision:"90945edb7796c5d89ce334ba70cc59f1"},{url:"/locales/en/translation.json",revision:"a13832ab3b3c1833880c53cad2445148"},{url:"/manifest.json",revision:"431495206b80e17d2ab9ff5fc516bfcd"},{url:"/providers/groq.png",revision:"729c22b9f81090ce1f5afb6954501077"},{url:"/providers/meta.png",revision:"94fe01eebf95c93790ea50bb7ff08602"},{url:"/providers/mistral.png",revision:"f2c796d7d28caba7a562f5256903e88e"},{url:"/providers/perplexity.png",revision:"e95b1bb5202b415bf1916693b99bd0e4"},{url:"/readme/screenshot.png",revision:"952aec7d7e1362666fdfec726491d98d"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:t,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
