(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function r(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(s){if(s.ep)return;s.ep=!0;const i=r(s);fetch(s.href,i)}})();const Hn="https://v2.api.noroff.dev/social",jn="c/eb3d-d728-4cdf-ab19",Nr="js-lazy-load",Bn="js-app";function X(t,e){if(!t)return;const r=typeof e=="string"?e:JSON.stringify(e);window.localStorage.setItem(t,r)}function mt(t){if(!t)return null;const e=window.localStorage.getItem(t);if(e===null)return null;try{return JSON.parse(e)}catch{return e}}class Xe extends Error{statusCode;constructor(e,r){super(e),this.name="ApiError",this.statusCode=r}}function _n(t,e,r,n,s){return console.warn("--- Global Error Caught ---"),console.warn("Message:",t),console.warn("Source:",e),console.warn("Line:",r),console.warn("Column:",n),console.warn("Error Object:",s),ht(gt(typeof t=="string"?t:"A generic error occured in our app")),!0}function Yn(t){console.log("--- Unhandled Promise Rejection Caught ---"),console.log("Reason for rejection:",t.reason);const e=gt(t.reason.message,t.reason.stack);ht(e),t.preventDefault()}async function ht(t){try{await _e(`/${jn}`,t)}catch(e){console.log(e)}}function gt(t="No error message provided.",e="No stack trace available."){return{message:t,stack:e,timestamp:new Date().toISOString(),url:window.location.href}}const Jn="X-Noroff-API-Key";function ee(){const t=mt("accessToken")??mt("token")??null;if(!t)return null;if(typeof t=="string")return t;try{const e=typeof t=="object"?t:JSON.parse(String(t??"null"));if(e&&typeof e=="object"){if(typeof e.accessToken=="string")return e.accessToken;if(typeof e.token=="string")return e.token}}catch{}return null}function Gn(t){X("accessToken",t)}async function Se(t,e={}){const{body:r,...n}=e,s={method:r?n.method??"POST":n.method??"GET",...n,headers:{...n.headers||{}}},i=mt("apiKey"),o=ee();i&&(s.headers[Jn]=i),o&&(s.headers.Authorization=`Bearer ${o}`),r!=null&&(r instanceof FormData?s.body=r:typeof r=="string"||r instanceof Blob?(s.body=r,typeof r=="string"&&(s.headers["Content-Type"]=s.headers["Content-Type"]??"application/json")):(s.headers["Content-Type"]=s.headers["Content-Type"]??"application/json",s.body=JSON.stringify(r)));const a=Hn.replace(/\/+$/,"");let l=t.replace(/^\/+/,"");a.endsWith("/social")&&/^social\/?/i.test(l)&&(l=l.replace(/^social\/?/i,""));const c=`${a}/${l}`;try{const u=await fetch(c,s),d=u.headers.get("content-type")??"";if(u.status===204||!d.includes("application/json")){if(!u.ok)throw new Xe(`HTTP Error: ${u.status}`,u.status);return null}const m=await u.json();if(!u.ok){const f=m?.errors?.[0]?.message||`HTTP Error: ${u.status}`;throw new Xe(f,u.status)}return Array.isArray(m)?m.filter(f=>f?.media?.url!==""&&f?.url!==""):m}catch(u){throw u instanceof Xe?u:new Error("A network or client error occurred.")}}function Ze(t,e){return Se(t,e)}const Kn=t=>Se(t,{method:"GET"}),_e=(t,e)=>Se(t,{method:"POST",body:e}),Cr=(t,e)=>Se(t,{method:"PUT",body:e}),$r=t=>Se(t,{method:"DELETE"});async function Qn(t){const r=await(await fetch("https://v2.api.noroff.dev/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)})).json(),n=r?.data?.accessToken||r?.accessToken;return typeof n=="string"&&Gn(n),r}async function Xn(t){return(await fetch("https://v2.api.noroff.dev/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)})).json()}async function es(t){const e=await fetch("https://v2.api.noroff.dev/auth/create-api-key",{method:"POST",headers:{Authorization:`Bearer ${t}`}});if(!e.ok)throw new Error(`Failed to fetch API key: ${e.status} ${e.statusText}`);const n=(await e.json())?.data?.key;return typeof n=="string"&&X("apiKey",n),n}async function yt(){return setTimeout(()=>{const t=document.getElementById("loginForm");if(t){const r=t.querySelector("button[type='submit']");t.addEventListener("submit",async n=>{n.preventDefault();const s=document.getElementById("loginEmail"),i=document.getElementById("loginPassword"),o=document.getElementById("loginMessage"),a=document.getElementById("loadingOverlay");if(!s||!i){console.error("Form inputs not found");return}const l=s.value.trim(),c=i.value;if(o&&(o.textContent="",o.style.color="red"),!l&&!c){o&&(o.textContent="Please enter both email and password.");return}if(!l){o&&(o.textContent="Please enter your email address.");return}if(!c){o&&(o.textContent="Please enter your password.");return}if(!l.includes("@")){o&&(o.textContent="Please enter a valid email address.");return}if(!l.endsWith("@stud.noroff.no")){o&&(o.textContent="Please use your @stud.noroff.no email address.");return}if(c.length<8){o&&(o.textContent="Password must be at least 8 characters long.");return}r&&(r.disabled=!0,r.textContent="🔄 Signing In..."),a&&a.classList.remove("opacity-0","hidden");const u={email:l,password:c};try{const d=await Qn(u);if(d.errors&&d.errors.length>0){const m=d.errors[0]?.message||"Login failed.";o&&(m.toLowerCase().includes("email")?o.textContent="❌ Email address not found. Please check your email or register for an account.":m.toLowerCase().includes("password")?o.textContent="❌ Incorrect password. Please check your password and try again.":m.toLowerCase().includes("user")&&m.toLowerCase().includes("not")?o.textContent="❌ No account found with this email. Please register first.":m.toLowerCase().includes("invalid")?o.textContent="❌ Invalid login credentials. Please check your email and password.":m.toLowerCase().includes("credentials")?o.textContent="❌ Invalid email or password. Please double-check your credentials.":o.textContent=`❌ ${m}`)}else if(d.data){const{accessToken:m,name:f}=d.data;m&&X("accessToken",m),f&&X("user",f);try{const w=await es(m);w&&X("apiKey",w)}catch(w){console.warn("Failed to get API key:",w)}o&&(o.style.color="white",o.textContent="✅ Login successful! Redirecting to your dashboard..."),typeof window.refreshNavbar=="function"&&window.refreshNavbar(),setTimeout(()=>{history.pushState({path:"/feed"},"","/feed"),L("/feed")},1e3)}else o&&(o.textContent="Unexpected response from server.")}catch(d){console.error("Login error:",d),o&&(d instanceof TypeError&&d.message.includes("fetch")?o.textContent="🌐 Network error. Please check your internet connection and try again.":o.textContent="⚠️ Something went wrong. Please try again in a moment.")}finally{setTimeout(()=>{a&&(a.classList.add("opacity-0"),setTimeout(()=>a.classList.add("hidden"),400)),r&&(r.disabled=!1,r.textContent="🚀 Sign In")},1500)}})}const e=document.getElementById("register-link");e&&e.addEventListener("click",r=>{r.preventDefault(),history.pushState({path:"/register"},"","/register"),L("/register")})},0),`
  <div class="page px-5 active flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-700" id="loginPage">
    <div class="auth-container w-full max-w-md px-8 py-10 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
      <div class="auth-card text-white">
        <h1 class="text-3xl md:text-4xl font-extrabold text-center mb-6 text-white drop-shadow-sm">
          Welcome Back 👋
        </h1>
        <div id="loginMessage" class="mb-4 text-center font-medium text-red-300"></div>

        <form id="loginForm" class="space-y-6">
          <div class="form-group">
            <label for="loginEmail" class="block mb-2 text-lg font-semibold">Email Address</label>
            <input
              type="email"
              id="loginEmail"
              required
              placeholder="Enter your @stud.noroff.no email"
              class="w-full text-white text-lg px-4 py-3 border border-white/30 bg-white/10 rounded-lg placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition duration-200"
            />
          </div>

          <div class="form-group">
            <label for="loginPassword" class="block mb-2 text-lg font-semibold">Password</label>
            <input
              type="password"
              id="loginPassword"
              required
              placeholder="Enter your password"
              class="w-full text-white text-lg px-4 py-3 border border-white/30 bg-white/10 rounded-lg placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition duration-200"
            />
          </div>

          <button
            type="submit"
            class="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg hover:scale-[1.02] hover:shadow-md transition-transform duration-200 flex items-center justify-center cursor-pointer gap-2"
          >
            <span>🚀</span> Sign In
          </button>
        </form>

        <div class="login-tips mt-8 p-4 rounded-lg border border-indigo-300 bg-white/10 text-sm text-indigo-100">
          <div class="font-semibold mb-2 flex items-center gap-2">
            <span>💡</span> Login Tips:
          </div>
          <ul class="list-disc list-inside space-y-1">
            <li>Use your <code>@stud.noroff.no</code> email</li>
            <li>Password must be at least 8 characters</li>
            <li>Ensure your account is registered</li>
          </ul>
        </div>

        <div class="auth-links mt-6 text-center text-white text-base">
          <p>
            Don't have an account?
            <a href="#" id="register-link" class="underline hover:text-indigo-300 font-semibold transition">Create one here</a>
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Modern Loading Overlay -->
  <div id="loadingOverlay" class="hidden opacity-0 fixed inset-0 z-50 bg-gradient-to-br from-indigo-950/90 via-purple-900/80 to-indigo-800/90 backdrop-blur-sm flex flex-col items-center justify-center transition-opacity duration-500">
    <div class="relative flex items-center justify-center mb-4">
      <div class="h-20 w-20 rounded-full border-[6px] border-t-transparent border-r-transparent border-b-transparent border-l-white animate-spin"></div>
      <div class="absolute inset-0 h-20 w-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 blur-md opacity-60 animate-pulse"></div>
    </div>
    <p class="text-white text-lg font-medium tracking-wide animate-pulse">Authenticating...</p>
  </div>
  `}async function ts(){return setTimeout(()=>{const t=document.getElementById("registerForm");if(t){const r=t.querySelector("button[type='submit']");t.addEventListener("submit",async n=>{n.preventDefault();const s=document.getElementById("registerName"),i=document.getElementById("registerEmail"),o=document.getElementById("registerPassword"),a=document.getElementById("registerConfirmPassword"),l=document.getElementById("registerBio"),c=document.getElementById("registerAvatarUrl"),u=document.getElementById("registerMessage");if(!s||!i||!o||!a){console.error("Form inputs not found");return}const d=s.value.trim(),m=i.value.trim(),f=o.value,w=a.value,E=l?.value.trim()||"",O=c?.value.trim()||"";if(u&&(u.textContent="",u.style.color="red"),!d||!m||!f||!w){u&&(u.textContent="Please fill in all required fields.");return}if(!m.includes("@")){u&&(u.textContent="Please enter a valid email address.");return}if(!m.endsWith("@stud.noroff.no")){u&&(u.textContent="Please use your @stud.noroff.no email address.");return}if(f.length<8){u&&(u.textContent="Password must be at least 8 characters long.");return}if(f!==w){u&&(u.textContent="Passwords do not match.");return}r&&(r.disabled=!0,r.textContent="🔄 Registering...");const N=window.loadingScreen;N&&N.showWithMessage("Registering...");const A={name:d,email:m,password:f};E&&(A.bio=E),O&&(A.avatar={url:O,alt:`${d}'s avatar`});try{const D=await Xn(A);if(D.errors&&D.errors.length>0){const Ne=D.errors[0]?.message||"Registration failed.";u&&(Ne.toLowerCase().includes("email")?u.textContent="❌ Email address already in use.":u.textContent=`❌ ${Ne}`)}else D.data?(u&&(u.style.color="white",u.textContent="✅ Registration successful! Redirecting to login page..."),D.data.accessToken&&X("accessToken",D.data.accessToken),D.data.name&&X("user",D.data.name),setTimeout(()=>{history.pushState({path:"/login"},"","/login"),L("/login")},1500)):u&&(u.textContent="Unexpected response from server.")}catch(D){console.error("Registration error:",D),u&&(D instanceof TypeError&&D.message.includes("fetch")?u.textContent="🌐 Network error. Please check your internet connection.":u.textContent="⚠️ Something went wrong. Please try again.")}finally{N&&N.hideLoadingScreen(),r&&(r.disabled=!1,r.textContent="🚀 Register")}})}const e=document.getElementById("login-link");e&&e.addEventListener("click",r=>{r.preventDefault(),history.pushState({path:"/login"},"","/login"),L("/login")})},0),`
  <div class="page px-5 active flex items-center justify-center min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-teal-900" id="registerPage">
    <div class="auth-container w-full max-w-md px-8 py-10 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
      <div class="auth-card text-white">
        <h1 class="text-3xl md:text-4xl font-extrabold text-center text-white drop-shadow-sm">
          Create Account ✨
        </h1>

        <div id="registerMessage" class="mb-4 text-center font-medium text-red-300"></div>

        <form id="registerForm" class="space-y-6">
          <div class="form-group mb-1">
            <label for="registerName" class="block mb-2 text-lg font-semibold">Full Name</label>
            <input type="text" id="registerName" required placeholder="Enter your full name"
              class="w-full text-white text-lg px-4 py-3 border border-white/30 bg-white/10 rounded-lg placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white transition duration-200" />
          </div>

          <div class="form-group mb-1">
            <label for="registerEmail" class="block mb-2 text-lg font-semibold">Email Address</label>
            <input type="email" id="registerEmail" required placeholder="Enter your @stud.noroff.no email"
              class="w-full text-white text-lg px-4 py-3 border border-white/30 bg-white/10 rounded-lg placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white transition duration-200" />
          </div>

          <div class="form-group mb-1">
            <label for="registerPassword" class="block mb-2 text-lg font-semibold">Password</label>
            <input type="password" id="registerPassword" required placeholder="Enter your password"
              class="w-full text-white text-lg px-4 py-3 border border-white/30 bg-white/10 rounded-lg placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white transition duration-200" />
          </div>

          <div class="form-group mb-1">
            <label for="registerConfirmPassword" class="block mb-2 text-lg font-semibold">Confirm Password</label>
            <input type="password" id="registerConfirmPassword" required placeholder="Confirm your password"
              class="w-full text-white text-lg px-4 py-3 border border-white/30 bg-white/10 rounded-lg placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white transition duration-200" />
          </div>

          <!-- Optional fields -->
          <div class="form-group mb-1">
            <label for="registerBio" class="block mb-2 text-lg font-semibold">Bio (Optional)</label>
            <input type="text" id="registerBio" placeholder="Write a short bio"
              class="w-full text-white text-lg px-4 py-3 border border-white/30 bg-white/10 rounded-lg placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white transition duration-200" />
          </div>

          <div class="form-group mb-3">
            <label for="registerAvatarUrl" class="block mb-2 text-lg font-semibold">Avatar URL (Optional)</label>
            <input type="url" id="registerAvatarUrl" placeholder="https://img.service.com/avatar.jpg"
              class="w-full text-white text-lg px-4 py-3 border border-white/30 bg-white/10 rounded-lg placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white transition duration-200" />
          </div>

          <button type="submit mb-1"
            class="w-full py-3 bg-gradient-to-r from-green-500 to-teal-400 text-white font-semibold rounded-lg hover:scale-[1.02] hover:shadow-lg cursor-pointer transition-transform duration-200 flex items-center justify-center gap-2">
            <span>🚀</span> Register
          </button>
        </form>

        <div class="auth-links mt-8 mb-1 text-center text-white text-base">
          <p>
            Already have an account?
            <a href="#" id="login-link" class="underline hover:text-green-300 font-semibold transition">Login here</a>
          </p>
        </div>
      </div>
    </div>
  </div>
  `}const rs="modulepreload",ns=function(t){return"/"+t},Wt={},Dr=function(e,r,n){let s=Promise.resolve();if(r&&r.length>0){let l=function(c){return Promise.all(c.map(u=>Promise.resolve(u).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),a=o?.nonce||o?.getAttribute("nonce");s=l(r.map(c=>{if(c=ns(c),c in Wt)return;Wt[c]=!0;const u=c.endsWith(".css"),d=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${d}`))return;const m=document.createElement("link");if(m.rel=u?"stylesheet":rs,u||(m.as="script"),m.crossOrigin="",m.href=c,a&&m.setAttribute("nonce",a),document.head.appendChild(m),u)return new Promise((f,w)=>{m.addEventListener("load",f),m.addEventListener("error",()=>w(new Error(`Unable to preload CSS for ${c}`)))})}))}function i(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return s.then(o=>{for(const a of o||[])a.status==="rejected"&&i(a.reason);return e().catch(i)})},ye=(t,e="")=>t&&String(t).trim()?String(t):e,Ut="https://placehold.co/48x48?text=%20",Rt="https://placehold.co/32x32?text=%20";function ss(t){const e=t.media;return typeof e=="string"?{url:e,alt:t.title||"media"}:e&&typeof e=="object"?{url:e.url||"",alt:e.alt||t.title||"media"}:{url:"",alt:t.title||"media"}}function is(t){return t.reactions?.find(r=>r.symbol==="❤️")?.count??t._count?.reactions??0}function os(t){return t._count?.comments??t.comments?.length??0}function as(){try{const t=ee();if(!t)return null;const e=t.split(".")[1];if(!e)return null;let r=e.replace(/-/g,"+").replace(/_/g,"/");for(;r.length%4;)r+="=";const n=JSON.parse(atob(r)),s=n?.name??n?.username??n?.user_name??n?.sub;return typeof s=="string"?s:null}catch{return null}}const Ce=as();function Mr(t,e){const{url:r,alt:n}=ss(t),s=is(t),i=os(t);return`
  <article
class="post-card h-full flex flex-col rounded-xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur-md shadow-md hover:shadow-lg hover:shadow-blue-900/30 hover:ring-blue-600/50 transition-all duration-300"
    data-post data-post-id="${t.id}">

    <header class="flex items-center justify-between gap-3 mb-3">
      <img src="${ye(typeof t.author?.avatar=="object"&&t.author.avatar!==null?t.author.avatar.url:null,Ut)}" alt="${ye(t.author?.avatar?.alt,"User avatar")}" class="size-10 rounded-full object-cover" onerror="this.src='${Ut}'" />
      <div>
        <div class="font-semibold clamp-1">${ye(t.author?.name,"Unknown")}</div>
        <div class=" text-xs md:text-s opacity-70">${new Date(t.created).toLocaleString()}</div>
      </div>

     ${Ce&&t.author?.name!==Ce&&ee()?`<button
      type="button"
      class="follow-btn px-3 py-1 rounded-lg bg-green-500/70 hover:bg-green-800 text-white text-md transition cursor-pointer"
      data-follow-btn
      data-username="${t.author?.name}"
      data-followed="false"
    >
      Follow
    </button>`:""}
    </header>

    ${r?`
      <div class="w-full rounded-lg overflow-hidden aspect-[16/9] mb-3 bg-white/10">
        <img src="${r}" alt="${n}" class="w-full h-full object-cover" onerror="this.style.display='none'"/>
      </div>`:""}

    ${t.title?`<h3 class="text-lg font-bold mb-1 clamp-1">${t.title}</h3>`:""}
    ${t.body?`<p class="opacity-90 mb-3 whitespace-pre-wrap clamp-3">${t.body}</p>`:""}

    <div class="mt-auto">
      <div class="flex items-center justify-between gap-6 text-sm mb-3">
        <button
          type="button"
          class="like-btn inline-flex md:text-lg items-center gap-1 px-3 py-1 rounded-full hover:ring-1 hover:ring-white/30 cursor-pointer"
          data-like-btn data-post-id="${t.id}" data-symbol="❤️" data-liked="0"
          aria-pressed="false" aria-label="Like">
          ❤️ <span data-like-count>${s}</span>
        </button>

        <button type="button" class="inline-flex items-center gap-1 opacity-80 cursor-pointer"
                data-comments-toggle data-post-id="${t.id}">
          💬 <span>${i}</span> <span class="underline ml-1">Show</span>
        </button>
      </div>

      <a href="/post/${t.id}" data-link
         class="inline-block mb-3 px-3 py-1 rounded-md bg-blue-600 text-white text-sm md:text-base hover:bg-blue-700 transition">
        View post →
      </a>

      <form data-comment-form data-post-id="${t.id}" class="flex flex-wrap items-center gap-2">
        <input name="comment" placeholder="Write a comment…" class="flex-1 px-3 py-2 rounded-lg bg-white/10 ring-1 ring-white/15 focus:outline-none" autocomplete="off" />
        <button type="submit" class="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer">Send</button>
      </form>

      <ul data-comment-list class="space-y-3 hidden mt-3">
        ${(t.comments??[]).slice().sort((o,a)=>+new Date(a.created)-+new Date(o.created)).map(o=>{const a=Ce&&o.owner===Ce;return`
            <li class="comment rounded-lg bg-white/5 p-3" data-id="${o.id}" data-owner="${o.owner}">
              <div class="flex items-start gap-3">
                <img src="${ye(o.author?.avatar?.url,Rt)}" alt="${ye(o.author?.avatar?.alt,"User avatar")}" class="size-8 rounded-full object-cover" onerror="this.src='${Rt}'" />
                <div class="flex-1">
                  <div class="text-sm">
                    <span class="font-semibold">@${o.owner}</span>
                    <span class="opacity-70">• ${new Date(o.created).toLocaleString()}</span>
                  </div>
                  <div class="comment-body whitespace-pre-wrap">${o.body??""}</div>
                  <div class="mt-2">
                    ${a?`
                      <button type="button" class="text-xs opacity-70 hover:opacity-100"
                              data-delete-comment data-post-id="${t.id}" data-comment-id="${o.id}">
                        Delete
                      </button>`:""}
                  </div>
                </div>
              </div>
            </li>`}).join("")}
      </ul>
    </div>
  </article>
  `}async function Lr(){return Kn("/posts?_author=true&_reactions=true&_comments=true")}function qt(t="logout-btn",e="Logout"){return`
    <button
      id="${t}"
      type="button"
      class="px-4 py-1.5 rounded-md bg-red-600/90 hover:bg-red-500 text-white font-medium text-sm transition-colors duration-200 cursor-pointer md:text-lg"
      aria-label="${e}"
    >
      ${e}
    </button>
  `}function Zt(t="logout-btn",e){const n=(e??document).querySelector("#"+t);n&&n.addEventListener("click",async s=>{s.preventDefault(),console.log("🚪 Logging out..."),await Do(),console.log("🔑 Token after logout:",localStorage.getItem("accessToken"))})}function $e(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const ls="/profile.avatar.png";let We=[],zt=0;const cs=1e3*60*2;function us(){const t=localStorage.getItem("name");if(t)try{return JSON.parse(t)}catch{return t}const e=localStorage.getItem("username");if(e)try{return JSON.parse(e)}catch{return e}const r=ee();if(!r)return null;try{const n=JSON.parse(atob(r.split(".")[1]||""));if(n&&typeof n.name=="string")return n.name}catch{}return null}async function Ar(){const t=Date.now();if(We.length>0&&t-zt<cs)return console.log("[FeedPage] Using cached posts"),We;try{const r=await Lr(),n=Array.isArray(r)?r:Array.isArray(r?.data)?r.data:[];return We=n,zt=t,n}catch(r){return r.response?.status===429?(console.warn("Rate limited by Noroff API — retrying in 3 seconds..."),await new Promise(n=>setTimeout(n,3e3)),Ar()):(console.error("Error loading posts:",r),[])}}async function Fr(t){try{const e=await Ze(`/profiles/${encodeURIComponent(t)}?_followers=true&_following=true`);return e?.data??e??{}}catch(e){return e.response?.status===429?(console.warn("Rate limited fetching profile — retrying in 3 seconds..."),await new Promise(r=>setTimeout(r,3e3)),Fr(t)):(console.error("Error fetching profile:",e),{})}}async function ds(){let t=[],e={};t=await Ar();const r=us();r&&(await new Promise(d=>setTimeout(d,500)),e=await Fr(r));const n=typeof e?.avatar=="string"?e.avatar:e?.avatar?.url||ls,s=typeof e?.avatar=="object"&&e?.avatar?.alt?e.avatar.alt:"Profile picture",i=e?.name||r||"Anonymous",o=e?.bio||"No bio yet.",a=Array.isArray(e?.followers)?e.followers.length:e?._count?.followers??0,l=Array.isArray(e?.following)?e.following.length:e?._count?.following??0,c=Array.isArray(t)?t.length:0,u=`
    <div class="container fixed grid min-w-full grid-cols-5 min-h-dvh bg-gray-900">

      <!-- MOBILE NAV -->
      <div class="aside fixed bottom-0 left-0 right-0 z-30 flex justify-evenly items-center gap-5 h-16 w-full 
                  border-t border-gray-800 
                  bg-gray-900/70 backdrop-blur-md shadow-lg 
                  lg:hidden">
        <a href="/feed" class="flex items-center w-12 h-12 pl-2" title="Home / Feed">
          <img src="/Hubble.png" alt="Logo" class="w-10 h-10 object-contain [mix-blend-mode:lighten]">
        </a>
        <a href="/feed" class="flex items-center hover:text-blue-400 transition-colors duration-200" title="Feed">
          <i class="text-xl text-gray-300 cursor-pointer fa-solid fa-house-user"></i>
        </a>
        <a href="/profile" class="flex items-center hover:text-blue-400 transition-colors duration-200" title="Profile">
          <i class="text-xl text-gray-300 cursor-pointer fa-solid fa-user"></i>
        </a>
        <a href="/create" class="flex items-center hover:text-blue-400 transition-colors duration-200" title="Create">
          <i class="text-xl text-gray-300 cursor-pointer fa fa-camera"></i>
        </a>
        <div class="flex items-center">
          ${qt("logout-mobile","Logout")}
        </div>
      </div>

      <!-- DESKTOP SIDEBAR NAV -->
      <div class="aside hidden lg:flex flex-col h-full min-h-dvh w-64 
                  border-r border-gray-800 
                  bg-gray-800/70 backdrop-blur-md shadow-lg 
                  text-gray-300">
        <a href="/feed" class="flex items-center h-20 py-20 pl-10 w-45 shadow-white mt-10 mb-20" title="Home / Feed">
          <img src="/Hubble.png" alt="Logo" class="shadow-white [mix-blend-mode:lighten]">
        </a>
        <nav class="flex flex-col gap-7">
          <a href="/feed" class="flex items-center py-3 px-10 hover:text-blue-400 transition-colors duration-200" title="Feed">
            <i class="text-xl fa-solid fa-house-user"></i>
            <span class="text-lg font-medium pl-4">Feed</span>
          </a>
          <a href="/profile" class="flex items-center py-3 px-10 hover:text-blue-400 transition-colors duration-200" title="Profile">
            <i class="text-xl fa-solid fa-user"></i>
            <span class="text-lg font-medium pl-4">Profile</span>
          </a>
          <a href="/create" class="flex items-center py-3 px-10 hover:text-blue-400 transition-colors duration-200" title="Create">
            <i class="text-xl fa fa-camera"></i>
            <span class="text-lg font-medium pl-4">Create</span>
          </a>
        </nav>
        <div class="mt-auto px-10 pb-8">
          ${qt("logout-desktop","Logout")}
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <div class="aside grid grid-rows-4 col-span-5 h-dvh w-full px-5 overflow-y-scroll bg-gray-900 place-items-start s:pt-10 s:px-10 lg:col-span-4 lg:px-0">
        <div class="flex flex-col items-center mt-10 top-container ">
          <div class="w-full bg-gray-850/70 backdrop-blur-sm text-center rounded-lg p-6">
            <div class="relative mx-auto w-25 h-25 sm:w-32 sm:h-32 mb-4">
              <img src="${$e(n)}" alt="${$e(s)}" class="w-full h-full rounded-full object-cover border-4 border-gray-700 shadow-inner"/>
              <span class="absolute bottom-1 right-1 w-6 h-6 sm:w-7 sm:h-7 bg-green-500 border-2 border-gray-900 rounded-full animate-pulse"></span>
            </div>

            <h1 class="text-2xl sm:text-4xl font-extrabold mb-1">${$e(i)}</h1>
            <p class="text-gray-300 text-sm sm:text-base mb-4">${$e(o)}</p>

            <!-- STATS -->
            <div class="flex justify-center gap-4 mb-6 flex-wrap">
                   <span class="cursor-pointer text-md bg-gray-800/50 px-4 py-2 rounded-lg hover:bg-gray-700/60 transition"><span class="text-blue-400 text-lg">👥</span> Followers: <b>${a}</b></span>
            <span class="cursor-pointer text-md bg-gray-800/50 px-4 py-2 rounded-lg hover:bg-gray-700/60 transition"><span class="text-green-400 text-lg">⭐</span> Following: <b>${l}</b></span>
            <span class="cursor-pointer text-md bg-gray-800/50 px-4 py-2 rounded-lg hover:bg-gray-700/60 transition"><span class="text-yellow-400 text-lg">📝</span> Posts: <b>${c}</b></span>
            </div>

            <!-- SEARCH -->
            <div class="w-full px-5 md:px-10 mt-6">
              <input
                type="search"
                id="feedSearch"
                placeholder="Search posts, authors, text…"
                class="w-full px-4 py-2 rounded-lg bg-white/10 ring-1 ring-white/15 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autocomplete="off"
              />
            </div>

            <!-- POSTS GRID -->
            <div
              id="feedGrid"
              class="w-full mt-6 md:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-5 md:px-10 items-start justify-items-stretch">
              ${t.map((d,m)=>Mr(d)).join("")}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;return setTimeout(async()=>{fs(),hs();const{initFollowButtons:d}=await Dr(async()=>{const{initFollowButtons:m}=await import("./initFollowButtons-Zm2oB98c.js");return{initFollowButtons:m}},[]);d()},0),u}function fs(){const t=document.querySelector("#feedSearch"),e=document.querySelector("#feedGrid");!t||!e||t.addEventListener("input",r=>{const n=r.target.value.toLowerCase().trim(),s=We.filter(i=>i.title?.toLowerCase().includes(n)||i.body?.toLowerCase().includes(n)||i.author?.name?.toLowerCase().includes(n));e.innerHTML=s.map((i,o)=>Mr(i)).join(""),Dr(()=>import("./initFollowButtons-Zm2oB98c.js"),[]).then(i=>i.initFollowButtons())})}function ms(){const t=localStorage.getItem("username")||localStorage.getItem("name");if(!t)return null;try{return JSON.parse(t)}catch{return t}}const et={};function hs(){const t=document.getElementById("followersBtn"),e=document.getElementById("followingBtn"),r=ms();r&&(t?.addEventListener("click",()=>Ht(r,"followers")),e?.addEventListener("click",()=>Ht(r,"following")))}async function Ht(t,e){const r=`${t}_${e}`;if(et[r]){console.log(`[Cache hit] Using cached ${e} data`),De(et[r],e);return}De(null,e,!0);try{const n=ee(),s=`https://v2.api.noroff.dev/social/profiles/${encodeURIComponent(t)}/${e}`,i=await fetch(s,{headers:n?{Authorization:`Bearer ${n}`}:{}});if(!i.ok)throw new Error(`Failed to fetch ${e}`);const o=await i.json(),a=Array.isArray(o)?o:o.data||[];et[r]=a,sessionStorage.setItem(r,JSON.stringify(a)),De(a,e)}catch(n){console.error("Error fetching follow list:",n),De([],e,!1,!0)}}function De(t,e,r=!1,n=!1){let s=document.getElementById("followModal");s||(s=document.createElement("div"),s.id="followModal",s.className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50",document.body.appendChild(s));const i=`<h2 class="text-xl font-bold mb-4 text-center capitalize">${e}</h2>`;let o="";r?o='<p class="text-center text-gray-400">Loading...</p>':n?o=`<p class="text-center text-red-400">Failed to load ${e}. Please try again later.</p>`:t&&t.length?o=`<ul class="space-y-3">${t.map(a=>{const l=a.avatar?.url||"/profile.avatar.png",c=a.name||"Unknown User";return`
          <li class="flex items-center gap-3 border-b border-gray-700 pb-2">
            <img src="${l}" alt="${c}" class="w-10 h-10 rounded-full object-cover border border-gray-700">
            <span class="font-semibold">${c}</span>
          </li>`}).join("")}</ul>`:o=`<p class="text-gray-400 text-center">No ${e} yet.</p>`,s.innerHTML=`
    <div class="bg-gray-800 text-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto relative">
      <button id="closeFollowModal" class="absolute top-2 right-3 text-gray-400 hover:text-white text-xl">&times;</button>
      ${i}
      ${o}
    </div>
  `,s.querySelector("#closeFollowModal")?.addEventListener("click",()=>s?.remove()),s.addEventListener("click",a=>{a.target===s&&s.remove()})}const Vr=document.createElement("style");Vr.textContent=`
@keyframes fadeIn { from {opacity:0; transform:scale(0.98);} to {opacity:1; transform:scale(1);} }
.animate-fadeIn { animation: fadeIn 0.2s ease-out; }
`;document.head.appendChild(Vr);async function gs(){return"<h1>The Page you looking for can't be found</h1>"}class te extends Error{}class ys extends te{constructor(e){super(`Invalid DateTime: ${e.toMessage()}`)}}class ps extends te{constructor(e){super(`Invalid Interval: ${e.toMessage()}`)}}class ws extends te{constructor(e){super(`Invalid Duration: ${e.toMessage()}`)}}class oe extends te{}class Pr extends te{constructor(e){super(`Invalid unit ${e}`)}}class C extends te{}class B extends te{constructor(){super("Zone is an abstract class")}}const h="numeric",z="short",F="long",ze={year:h,month:h,day:h},Wr={year:h,month:z,day:h},bs={year:h,month:z,day:h,weekday:z},Ur={year:h,month:F,day:h},Rr={year:h,month:F,day:h,weekday:F},qr={hour:h,minute:h},Zr={hour:h,minute:h,second:h},zr={hour:h,minute:h,second:h,timeZoneName:z},Hr={hour:h,minute:h,second:h,timeZoneName:F},jr={hour:h,minute:h,hourCycle:"h23"},Br={hour:h,minute:h,second:h,hourCycle:"h23"},_r={hour:h,minute:h,second:h,hourCycle:"h23",timeZoneName:z},Yr={hour:h,minute:h,second:h,hourCycle:"h23",timeZoneName:F},Jr={year:h,month:h,day:h,hour:h,minute:h},Gr={year:h,month:h,day:h,hour:h,minute:h,second:h},Kr={year:h,month:z,day:h,hour:h,minute:h},Qr={year:h,month:z,day:h,hour:h,minute:h,second:h},vs={year:h,month:z,day:h,weekday:z,hour:h,minute:h},Xr={year:h,month:F,day:h,hour:h,minute:h,timeZoneName:z},en={year:h,month:F,day:h,hour:h,minute:h,second:h,timeZoneName:z},tn={year:h,month:F,day:h,weekday:F,hour:h,minute:h,timeZoneName:F},rn={year:h,month:F,day:h,weekday:F,hour:h,minute:h,second:h,timeZoneName:F};class Te{get type(){throw new B}get name(){throw new B}get ianaName(){return this.name}get isUniversal(){throw new B}offsetName(e,r){throw new B}formatOffset(e,r){throw new B}offset(e){throw new B}equals(e){throw new B}get isValid(){throw new B}}let tt=null;class Ye extends Te{static get instance(){return tt===null&&(tt=new Ye),tt}get type(){return"system"}get name(){return new Intl.DateTimeFormat().resolvedOptions().timeZone}get isUniversal(){return!1}offsetName(e,{format:r,locale:n}){return hn(e,r,n)}formatOffset(e,r){return xe(this.offset(e),r)}offset(e){return-new Date(e).getTimezoneOffset()}equals(e){return e.type==="system"}get isValid(){return!0}}const pt=new Map;function xs(t){let e=pt.get(t);return e===void 0&&(e=new Intl.DateTimeFormat("en-US",{hour12:!1,timeZone:t,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",era:"short"}),pt.set(t,e)),e}const ks={year:0,month:1,day:2,era:3,hour:4,minute:5,second:6};function Ss(t,e){const r=t.format(e).replace(/\u200E/g,""),n=/(\d+)\/(\d+)\/(\d+) (AD|BC),? (\d+):(\d+):(\d+)/.exec(r),[,s,i,o,a,l,c,u]=n;return[o,s,i,a,l,c,u]}function Ts(t,e){const r=t.formatToParts(e),n=[];for(let s=0;s<r.length;s++){const{type:i,value:o}=r[s],a=ks[i];i==="era"?n[a]=o:g(a)||(n[a]=parseInt(o,10))}return n}const rt=new Map;class j extends Te{static create(e){let r=rt.get(e);return r===void 0&&rt.set(e,r=new j(e)),r}static resetCache(){rt.clear(),pt.clear()}static isValidSpecifier(e){return this.isValidZone(e)}static isValidZone(e){if(!e)return!1;try{return new Intl.DateTimeFormat("en-US",{timeZone:e}).format(),!0}catch{return!1}}constructor(e){super(),this.zoneName=e,this.valid=j.isValidZone(e)}get type(){return"iana"}get name(){return this.zoneName}get isUniversal(){return!1}offsetName(e,{format:r,locale:n}){return hn(e,r,n,this.name)}formatOffset(e,r){return xe(this.offset(e),r)}offset(e){if(!this.valid)return NaN;const r=new Date(e);if(isNaN(r))return NaN;const n=xs(this.name);let[s,i,o,a,l,c,u]=n.formatToParts?Ts(n,r):Ss(n,r);a==="BC"&&(s=-Math.abs(s)+1);const m=Ge({year:s,month:i,day:o,hour:l===24?0:l,minute:c,second:u,millisecond:0});let f=+r;const w=f%1e3;return f-=w>=0?w:1e3+w,(m-f)/(60*1e3)}equals(e){return e.type==="iana"&&e.name===this.name}get isValid(){return this.valid}}let jt={};function Es(t,e={}){const r=JSON.stringify([t,e]);let n=jt[r];return n||(n=new Intl.ListFormat(t,e),jt[r]=n),n}const wt=new Map;function bt(t,e={}){const r=JSON.stringify([t,e]);let n=wt.get(r);return n===void 0&&(n=new Intl.DateTimeFormat(t,e),wt.set(r,n)),n}const vt=new Map;function Os(t,e={}){const r=JSON.stringify([t,e]);let n=vt.get(r);return n===void 0&&(n=new Intl.NumberFormat(t,e),vt.set(r,n)),n}const xt=new Map;function Is(t,e={}){const{base:r,...n}=e,s=JSON.stringify([t,n]);let i=xt.get(s);return i===void 0&&(i=new Intl.RelativeTimeFormat(t,e),xt.set(s,i)),i}let we=null;function Ns(){return we||(we=new Intl.DateTimeFormat().resolvedOptions().locale,we)}const kt=new Map;function nn(t){let e=kt.get(t);return e===void 0&&(e=new Intl.DateTimeFormat(t).resolvedOptions(),kt.set(t,e)),e}const St=new Map;function Cs(t){let e=St.get(t);if(!e){const r=new Intl.Locale(t);e="getWeekInfo"in r?r.getWeekInfo():r.weekInfo,"minimalDays"in e||(e={...sn,...e}),St.set(t,e)}return e}function $s(t){const e=t.indexOf("-x-");e!==-1&&(t=t.substring(0,e));const r=t.indexOf("-u-");if(r===-1)return[t];{let n,s;try{n=bt(t).resolvedOptions(),s=t}catch{const l=t.substring(0,r);n=bt(l).resolvedOptions(),s=l}const{numberingSystem:i,calendar:o}=n;return[s,i,o]}}function Ds(t,e,r){return(r||e)&&(t.includes("-u-")||(t+="-u"),r&&(t+=`-ca-${r}`),e&&(t+=`-nu-${e}`)),t}function Ms(t){const e=[];for(let r=1;r<=12;r++){const n=y.utc(2009,r,1);e.push(t(n))}return e}function Ls(t){const e=[];for(let r=1;r<=7;r++){const n=y.utc(2016,11,13+r);e.push(t(n))}return e}function Me(t,e,r,n){const s=t.listingMode();return s==="error"?null:s==="en"?r(e):n(e)}function As(t){return t.numberingSystem&&t.numberingSystem!=="latn"?!1:t.numberingSystem==="latn"||!t.locale||t.locale.startsWith("en")||nn(t.locale).numberingSystem==="latn"}class Fs{constructor(e,r,n){this.padTo=n.padTo||0,this.floor=n.floor||!1;const{padTo:s,floor:i,...o}=n;if(!r||Object.keys(o).length>0){const a={useGrouping:!1,...n};n.padTo>0&&(a.minimumIntegerDigits=n.padTo),this.inf=Os(e,a)}}format(e){if(this.inf){const r=this.floor?Math.floor(e):e;return this.inf.format(r)}else{const r=this.floor?Math.floor(e):Lt(e,3);return T(r,this.padTo)}}}class Vs{constructor(e,r,n){this.opts=n,this.originalZone=void 0;let s;if(this.opts.timeZone)this.dt=e;else if(e.zone.type==="fixed"){const o=-1*(e.offset/60),a=o>=0?`Etc/GMT+${o}`:`Etc/GMT${o}`;e.offset!==0&&j.create(a).valid?(s=a,this.dt=e):(s="UTC",this.dt=e.offset===0?e:e.setZone("UTC").plus({minutes:e.offset}),this.originalZone=e.zone)}else e.zone.type==="system"?this.dt=e:e.zone.type==="iana"?(this.dt=e,s=e.zone.name):(s="UTC",this.dt=e.setZone("UTC").plus({minutes:e.offset}),this.originalZone=e.zone);const i={...this.opts};i.timeZone=i.timeZone||s,this.dtf=bt(r,i)}format(){return this.originalZone?this.formatToParts().map(({value:e})=>e).join(""):this.dtf.format(this.dt.toJSDate())}formatToParts(){const e=this.dtf.formatToParts(this.dt.toJSDate());return this.originalZone?e.map(r=>{if(r.type==="timeZoneName"){const n=this.originalZone.offsetName(this.dt.ts,{locale:this.dt.locale,format:this.opts.timeZoneName});return{...r,value:n}}else return r}):e}resolvedOptions(){return this.dtf.resolvedOptions()}}class Ps{constructor(e,r,n){this.opts={style:"long",...n},!r&&fn()&&(this.rtf=Is(e,n))}format(e,r){return this.rtf?this.rtf.format(e,r):ii(r,e,this.opts.numeric,this.opts.style!=="long")}formatToParts(e,r){return this.rtf?this.rtf.formatToParts(e,r):[]}}const sn={firstDay:1,minimalDays:4,weekend:[6,7]};class x{static fromOpts(e){return x.create(e.locale,e.numberingSystem,e.outputCalendar,e.weekSettings,e.defaultToEN)}static create(e,r,n,s,i=!1){const o=e||S.defaultLocale,a=o||(i?"en-US":Ns()),l=r||S.defaultNumberingSystem,c=n||S.defaultOutputCalendar,u=Et(s)||S.defaultWeekSettings;return new x(a,l,c,u,o)}static resetCache(){we=null,wt.clear(),vt.clear(),xt.clear(),kt.clear(),St.clear()}static fromObject({locale:e,numberingSystem:r,outputCalendar:n,weekSettings:s}={}){return x.create(e,r,n,s)}constructor(e,r,n,s,i){const[o,a,l]=$s(e);this.locale=o,this.numberingSystem=r||a||null,this.outputCalendar=n||l||null,this.weekSettings=s,this.intl=Ds(this.locale,this.numberingSystem,this.outputCalendar),this.weekdaysCache={format:{},standalone:{}},this.monthsCache={format:{},standalone:{}},this.meridiemCache=null,this.eraCache={},this.specifiedLocale=i,this.fastNumbersCached=null}get fastNumbers(){return this.fastNumbersCached==null&&(this.fastNumbersCached=As(this)),this.fastNumbersCached}listingMode(){const e=this.isEnglish(),r=(this.numberingSystem===null||this.numberingSystem==="latn")&&(this.outputCalendar===null||this.outputCalendar==="gregory");return e&&r?"en":"intl"}clone(e){return!e||Object.getOwnPropertyNames(e).length===0?this:x.create(e.locale||this.specifiedLocale,e.numberingSystem||this.numberingSystem,e.outputCalendar||this.outputCalendar,Et(e.weekSettings)||this.weekSettings,e.defaultToEN||!1)}redefaultToEN(e={}){return this.clone({...e,defaultToEN:!0})}redefaultToSystem(e={}){return this.clone({...e,defaultToEN:!1})}months(e,r=!1){return Me(this,e,pn,()=>{const n=this.intl==="ja"||this.intl.startsWith("ja-");r&=!n;const s=r?{month:e,day:"numeric"}:{month:e},i=r?"format":"standalone";if(!this.monthsCache[i][e]){const o=n?a=>this.dtFormatter(a,s).format():a=>this.extract(a,s,"month");this.monthsCache[i][e]=Ms(o)}return this.monthsCache[i][e]})}weekdays(e,r=!1){return Me(this,e,vn,()=>{const n=r?{weekday:e,year:"numeric",month:"long",day:"numeric"}:{weekday:e},s=r?"format":"standalone";return this.weekdaysCache[s][e]||(this.weekdaysCache[s][e]=Ls(i=>this.extract(i,n,"weekday"))),this.weekdaysCache[s][e]})}meridiems(){return Me(this,void 0,()=>xn,()=>{if(!this.meridiemCache){const e={hour:"numeric",hourCycle:"h12"};this.meridiemCache=[y.utc(2016,11,13,9),y.utc(2016,11,13,19)].map(r=>this.extract(r,e,"dayperiod"))}return this.meridiemCache})}eras(e){return Me(this,e,kn,()=>{const r={era:e};return this.eraCache[e]||(this.eraCache[e]=[y.utc(-40,1,1),y.utc(2017,1,1)].map(n=>this.extract(n,r,"era"))),this.eraCache[e]})}extract(e,r,n){const s=this.dtFormatter(e,r),i=s.formatToParts(),o=i.find(a=>a.type.toLowerCase()===n);return o?o.value:null}numberFormatter(e={}){return new Fs(this.intl,e.forceSimple||this.fastNumbers,e)}dtFormatter(e,r={}){return new Vs(e,this.intl,r)}relFormatter(e={}){return new Ps(this.intl,this.isEnglish(),e)}listFormatter(e={}){return Es(this.intl,e)}isEnglish(){return this.locale==="en"||this.locale.toLowerCase()==="en-us"||nn(this.intl).locale.startsWith("en-us")}getWeekSettings(){return this.weekSettings?this.weekSettings:mn()?Cs(this.locale):sn}getStartOfWeek(){return this.getWeekSettings().firstDay}getMinDaysInFirstWeek(){return this.getWeekSettings().minimalDays}getWeekendDays(){return this.getWeekSettings().weekend}equals(e){return this.locale===e.locale&&this.numberingSystem===e.numberingSystem&&this.outputCalendar===e.outputCalendar}toString(){return`Locale(${this.locale}, ${this.numberingSystem}, ${this.outputCalendar})`}}let nt=null;class M extends Te{static get utcInstance(){return nt===null&&(nt=new M(0)),nt}static instance(e){return e===0?M.utcInstance:new M(e)}static parseSpecifier(e){if(e){const r=e.match(/^utc(?:([+-]\d{1,2})(?::(\d{2}))?)?$/i);if(r)return new M(Ke(r[1],r[2]))}return null}constructor(e){super(),this.fixed=e}get type(){return"fixed"}get name(){return this.fixed===0?"UTC":`UTC${xe(this.fixed,"narrow")}`}get ianaName(){return this.fixed===0?"Etc/UTC":`Etc/GMT${xe(-this.fixed,"narrow")}`}offsetName(){return this.name}formatOffset(e,r){return xe(this.fixed,r)}get isUniversal(){return!0}offset(){return this.fixed}equals(e){return e.type==="fixed"&&e.fixed===this.fixed}get isValid(){return!0}}class Ws extends Te{constructor(e){super(),this.zoneName=e}get type(){return"invalid"}get name(){return this.zoneName}get isUniversal(){return!1}offsetName(){return null}formatOffset(){return""}offset(){return NaN}equals(){return!1}get isValid(){return!1}}function Y(t,e){if(g(t)||t===null)return e;if(t instanceof Te)return t;if(Hs(t)){const r=t.toLowerCase();return r==="default"?e:r==="local"||r==="system"?Ye.instance:r==="utc"||r==="gmt"?M.utcInstance:M.parseSpecifier(r)||j.create(t)}else return J(t)?M.instance(t):typeof t=="object"&&"offset"in t&&typeof t.offset=="function"?t:new Ws(t)}const Ct={arab:"[٠-٩]",arabext:"[۰-۹]",bali:"[᭐-᭙]",beng:"[০-৯]",deva:"[०-९]",fullwide:"[０-９]",gujr:"[૦-૯]",hanidec:"[〇|一|二|三|四|五|六|七|八|九]",khmr:"[០-៩]",knda:"[೦-೯]",laoo:"[໐-໙]",limb:"[᥆-᥏]",mlym:"[൦-൯]",mong:"[᠐-᠙]",mymr:"[၀-၉]",orya:"[୦-୯]",tamldec:"[௦-௯]",telu:"[౦-౯]",thai:"[๐-๙]",tibt:"[༠-༩]",latn:"\\d"},Bt={arab:[1632,1641],arabext:[1776,1785],bali:[6992,7001],beng:[2534,2543],deva:[2406,2415],fullwide:[65296,65303],gujr:[2790,2799],khmr:[6112,6121],knda:[3302,3311],laoo:[3792,3801],limb:[6470,6479],mlym:[3430,3439],mong:[6160,6169],mymr:[4160,4169],orya:[2918,2927],tamldec:[3046,3055],telu:[3174,3183],thai:[3664,3673],tibt:[3872,3881]},Us=Ct.hanidec.replace(/[\[|\]]/g,"").split("");function Rs(t){let e=parseInt(t,10);if(isNaN(e)){e="";for(let r=0;r<t.length;r++){const n=t.charCodeAt(r);if(t[r].search(Ct.hanidec)!==-1)e+=Us.indexOf(t[r]);else for(const s in Bt){const[i,o]=Bt[s];n>=i&&n<=o&&(e+=n-i)}}return parseInt(e,10)}else return e}const Tt=new Map;function qs(){Tt.clear()}function U({numberingSystem:t},e=""){const r=t||"latn";let n=Tt.get(r);n===void 0&&(n=new Map,Tt.set(r,n));let s=n.get(e);return s===void 0&&(s=new RegExp(`${Ct[r]}${e}`),n.set(e,s)),s}let _t=()=>Date.now(),Yt="system",Jt=null,Gt=null,Kt=null,Qt=60,Xt,er=null;class S{static get now(){return _t}static set now(e){_t=e}static set defaultZone(e){Yt=e}static get defaultZone(){return Y(Yt,Ye.instance)}static get defaultLocale(){return Jt}static set defaultLocale(e){Jt=e}static get defaultNumberingSystem(){return Gt}static set defaultNumberingSystem(e){Gt=e}static get defaultOutputCalendar(){return Kt}static set defaultOutputCalendar(e){Kt=e}static get defaultWeekSettings(){return er}static set defaultWeekSettings(e){er=Et(e)}static get twoDigitCutoffYear(){return Qt}static set twoDigitCutoffYear(e){Qt=e%100}static get throwOnInvalid(){return Xt}static set throwOnInvalid(e){Xt=e}static resetCaches(){x.resetCache(),j.resetCache(),y.resetCache(),qs()}}class Z{constructor(e,r){this.reason=e,this.explanation=r}toMessage(){return this.explanation?`${this.reason}: ${this.explanation}`:this.reason}}const on=[0,31,59,90,120,151,181,212,243,273,304,334],an=[0,31,60,91,121,152,182,213,244,274,305,335];function P(t,e){return new Z("unit out of range",`you specified ${e} (of type ${typeof e}) as a ${t}, which is invalid`)}function $t(t,e,r){const n=new Date(Date.UTC(t,e-1,r));t<100&&t>=0&&n.setUTCFullYear(n.getUTCFullYear()-1900);const s=n.getUTCDay();return s===0?7:s}function ln(t,e,r){return r+(Ee(t)?an:on)[e-1]}function cn(t,e){const r=Ee(t)?an:on,n=r.findIndex(i=>i<e),s=e-r[n];return{month:n+1,day:s}}function Dt(t,e){return(t-e+7)%7+1}function He(t,e=4,r=1){const{year:n,month:s,day:i}=t,o=ln(n,s,i),a=Dt($t(n,s,i),r);let l=Math.floor((o-a+14-e)/7),c;return l<1?(c=n-1,l=ke(c,e,r)):l>ke(n,e,r)?(c=n+1,l=1):c=n,{weekYear:c,weekNumber:l,weekday:a,...Qe(t)}}function tr(t,e=4,r=1){const{weekYear:n,weekNumber:s,weekday:i}=t,o=Dt($t(n,1,e),r),a=ae(n);let l=s*7+i-o-7+e,c;l<1?(c=n-1,l+=ae(c)):l>a?(c=n+1,l-=ae(n)):c=n;const{month:u,day:d}=cn(c,l);return{year:c,month:u,day:d,...Qe(t)}}function st(t){const{year:e,month:r,day:n}=t,s=ln(e,r,n);return{year:e,ordinal:s,...Qe(t)}}function rr(t){const{year:e,ordinal:r}=t,{month:n,day:s}=cn(e,r);return{year:e,month:n,day:s,...Qe(t)}}function nr(t,e){if(!g(t.localWeekday)||!g(t.localWeekNumber)||!g(t.localWeekYear)){if(!g(t.weekday)||!g(t.weekNumber)||!g(t.weekYear))throw new oe("Cannot mix locale-based week fields with ISO-based week fields");return g(t.localWeekday)||(t.weekday=t.localWeekday),g(t.localWeekNumber)||(t.weekNumber=t.localWeekNumber),g(t.localWeekYear)||(t.weekYear=t.localWeekYear),delete t.localWeekday,delete t.localWeekNumber,delete t.localWeekYear,{minDaysInFirstWeek:e.getMinDaysInFirstWeek(),startOfWeek:e.getStartOfWeek()}}else return{minDaysInFirstWeek:4,startOfWeek:1}}function Zs(t,e=4,r=1){const n=Je(t.weekYear),s=W(t.weekNumber,1,ke(t.weekYear,e,r)),i=W(t.weekday,1,7);return n?s?i?!1:P("weekday",t.weekday):P("week",t.weekNumber):P("weekYear",t.weekYear)}function zs(t){const e=Je(t.year),r=W(t.ordinal,1,ae(t.year));return e?r?!1:P("ordinal",t.ordinal):P("year",t.year)}function un(t){const e=Je(t.year),r=W(t.month,1,12),n=W(t.day,1,je(t.year,t.month));return e?r?n?!1:P("day",t.day):P("month",t.month):P("year",t.year)}function dn(t){const{hour:e,minute:r,second:n,millisecond:s}=t,i=W(e,0,23)||e===24&&r===0&&n===0&&s===0,o=W(r,0,59),a=W(n,0,59),l=W(s,0,999);return i?o?a?l?!1:P("millisecond",s):P("second",n):P("minute",r):P("hour",e)}function g(t){return typeof t>"u"}function J(t){return typeof t=="number"}function Je(t){return typeof t=="number"&&t%1===0}function Hs(t){return typeof t=="string"}function js(t){return Object.prototype.toString.call(t)==="[object Date]"}function fn(){try{return typeof Intl<"u"&&!!Intl.RelativeTimeFormat}catch{return!1}}function mn(){try{return typeof Intl<"u"&&!!Intl.Locale&&("weekInfo"in Intl.Locale.prototype||"getWeekInfo"in Intl.Locale.prototype)}catch{return!1}}function Bs(t){return Array.isArray(t)?t:[t]}function sr(t,e,r){if(t.length!==0)return t.reduce((n,s)=>{const i=[e(s),s];return n&&r(n[0],i[0])===n[0]?n:i},null)[1]}function _s(t,e){return e.reduce((r,n)=>(r[n]=t[n],r),{})}function ce(t,e){return Object.prototype.hasOwnProperty.call(t,e)}function Et(t){if(t==null)return null;if(typeof t!="object")throw new C("Week settings must be an object");if(!W(t.firstDay,1,7)||!W(t.minimalDays,1,7)||!Array.isArray(t.weekend)||t.weekend.some(e=>!W(e,1,7)))throw new C("Invalid week settings");return{firstDay:t.firstDay,minimalDays:t.minimalDays,weekend:Array.from(t.weekend)}}function W(t,e,r){return Je(t)&&t>=e&&t<=r}function Ys(t,e){return t-e*Math.floor(t/e)}function T(t,e=2){const r=t<0;let n;return r?n="-"+(""+-t).padStart(e,"0"):n=(""+t).padStart(e,"0"),n}function _(t){if(!(g(t)||t===null||t===""))return parseInt(t,10)}function G(t){if(!(g(t)||t===null||t===""))return parseFloat(t)}function Mt(t){if(!(g(t)||t===null||t==="")){const e=parseFloat("0."+t)*1e3;return Math.floor(e)}}function Lt(t,e,r="round"){const n=10**e;switch(r){case"expand":return t>0?Math.ceil(t*n)/n:Math.floor(t*n)/n;case"trunc":return Math.trunc(t*n)/n;case"round":return Math.round(t*n)/n;case"floor":return Math.floor(t*n)/n;case"ceil":return Math.ceil(t*n)/n;default:throw new RangeError(`Value rounding ${r} is out of range`)}}function Ee(t){return t%4===0&&(t%100!==0||t%400===0)}function ae(t){return Ee(t)?366:365}function je(t,e){const r=Ys(e-1,12)+1,n=t+(e-r)/12;return r===2?Ee(n)?29:28:[31,null,31,30,31,30,31,31,30,31,30,31][r-1]}function Ge(t){let e=Date.UTC(t.year,t.month-1,t.day,t.hour,t.minute,t.second,t.millisecond);return t.year<100&&t.year>=0&&(e=new Date(e),e.setUTCFullYear(t.year,t.month-1,t.day)),+e}function ir(t,e,r){return-Dt($t(t,1,e),r)+e-1}function ke(t,e=4,r=1){const n=ir(t,e,r),s=ir(t+1,e,r);return(ae(t)-n+s)/7}function Ot(t){return t>99?t:t>S.twoDigitCutoffYear?1900+t:2e3+t}function hn(t,e,r,n=null){const s=new Date(t),i={hourCycle:"h23",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"};n&&(i.timeZone=n);const o={timeZoneName:e,...i},a=new Intl.DateTimeFormat(r,o).formatToParts(s).find(l=>l.type.toLowerCase()==="timezonename");return a?a.value:null}function Ke(t,e){let r=parseInt(t,10);Number.isNaN(r)&&(r=0);const n=parseInt(e,10)||0,s=r<0||Object.is(r,-0)?-n:n;return r*60+s}function gn(t){const e=Number(t);if(typeof t=="boolean"||t===""||!Number.isFinite(e))throw new C(`Invalid unit value ${t}`);return e}function Be(t,e){const r={};for(const n in t)if(ce(t,n)){const s=t[n];if(s==null)continue;r[e(n)]=gn(s)}return r}function xe(t,e){const r=Math.trunc(Math.abs(t/60)),n=Math.trunc(Math.abs(t%60)),s=t>=0?"+":"-";switch(e){case"short":return`${s}${T(r,2)}:${T(n,2)}`;case"narrow":return`${s}${r}${n>0?`:${n}`:""}`;case"techie":return`${s}${T(r,2)}${T(n,2)}`;default:throw new RangeError(`Value format ${e} is out of range for property format`)}}function Qe(t){return _s(t,["hour","minute","second","millisecond"])}const Js=["January","February","March","April","May","June","July","August","September","October","November","December"],yn=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],Gs=["J","F","M","A","M","J","J","A","S","O","N","D"];function pn(t){switch(t){case"narrow":return[...Gs];case"short":return[...yn];case"long":return[...Js];case"numeric":return["1","2","3","4","5","6","7","8","9","10","11","12"];case"2-digit":return["01","02","03","04","05","06","07","08","09","10","11","12"];default:return null}}const wn=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],bn=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],Ks=["M","T","W","T","F","S","S"];function vn(t){switch(t){case"narrow":return[...Ks];case"short":return[...bn];case"long":return[...wn];case"numeric":return["1","2","3","4","5","6","7"];default:return null}}const xn=["AM","PM"],Qs=["Before Christ","Anno Domini"],Xs=["BC","AD"],ei=["B","A"];function kn(t){switch(t){case"narrow":return[...ei];case"short":return[...Xs];case"long":return[...Qs];default:return null}}function ti(t){return xn[t.hour<12?0:1]}function ri(t,e){return vn(e)[t.weekday-1]}function ni(t,e){return pn(e)[t.month-1]}function si(t,e){return kn(e)[t.year<0?0:1]}function ii(t,e,r="always",n=!1){const s={years:["year","yr."],quarters:["quarter","qtr."],months:["month","mo."],weeks:["week","wk."],days:["day","day","days"],hours:["hour","hr."],minutes:["minute","min."],seconds:["second","sec."]},i=["hours","minutes","seconds"].indexOf(t)===-1;if(r==="auto"&&i){const d=t==="days";switch(e){case 1:return d?"tomorrow":`next ${s[t][0]}`;case-1:return d?"yesterday":`last ${s[t][0]}`;case 0:return d?"today":`this ${s[t][0]}`}}const o=Object.is(e,-0)||e<0,a=Math.abs(e),l=a===1,c=s[t],u=n?l?c[1]:c[2]||c[1]:l?s[t][0]:t;return o?`${a} ${u} ago`:`in ${a} ${u}`}function or(t,e){let r="";for(const n of t)n.literal?r+=n.val:r+=e(n.val);return r}const oi={D:ze,DD:Wr,DDD:Ur,DDDD:Rr,t:qr,tt:Zr,ttt:zr,tttt:Hr,T:jr,TT:Br,TTT:_r,TTTT:Yr,f:Jr,ff:Kr,fff:Xr,ffff:tn,F:Gr,FF:Qr,FFF:en,FFFF:rn};class ${static create(e,r={}){return new $(e,r)}static parseFormat(e){let r=null,n="",s=!1;const i=[];for(let o=0;o<e.length;o++){const a=e.charAt(o);a==="'"?((n.length>0||s)&&i.push({literal:s||/^\s+$/.test(n),val:n===""?"'":n}),r=null,n="",s=!s):s||a===r?n+=a:(n.length>0&&i.push({literal:/^\s+$/.test(n),val:n}),n=a,r=a)}return n.length>0&&i.push({literal:s||/^\s+$/.test(n),val:n}),i}static macroTokenToFormatOpts(e){return oi[e]}constructor(e,r){this.opts=r,this.loc=e,this.systemLoc=null}formatWithSystemDefault(e,r){return this.systemLoc===null&&(this.systemLoc=this.loc.redefaultToSystem()),this.systemLoc.dtFormatter(e,{...this.opts,...r}).format()}dtFormatter(e,r={}){return this.loc.dtFormatter(e,{...this.opts,...r})}formatDateTime(e,r){return this.dtFormatter(e,r).format()}formatDateTimeParts(e,r){return this.dtFormatter(e,r).formatToParts()}formatInterval(e,r){return this.dtFormatter(e.start,r).dtf.formatRange(e.start.toJSDate(),e.end.toJSDate())}resolvedOptions(e,r){return this.dtFormatter(e,r).resolvedOptions()}num(e,r=0,n=void 0){if(this.opts.forceSimple)return T(e,r);const s={...this.opts};return r>0&&(s.padTo=r),n&&(s.signDisplay=n),this.loc.numberFormatter(s).format(e)}formatDateTimeFromString(e,r){const n=this.loc.listingMode()==="en",s=this.loc.outputCalendar&&this.loc.outputCalendar!=="gregory",i=(f,w)=>this.loc.extract(e,f,w),o=f=>e.isOffsetFixed&&e.offset===0&&f.allowZ?"Z":e.isValid?e.zone.formatOffset(e.ts,f.format):"",a=()=>n?ti(e):i({hour:"numeric",hourCycle:"h12"},"dayperiod"),l=(f,w)=>n?ni(e,f):i(w?{month:f}:{month:f,day:"numeric"},"month"),c=(f,w)=>n?ri(e,f):i(w?{weekday:f}:{weekday:f,month:"long",day:"numeric"},"weekday"),u=f=>{const w=$.macroTokenToFormatOpts(f);return w?this.formatWithSystemDefault(e,w):f},d=f=>n?si(e,f):i({era:f},"era"),m=f=>{switch(f){case"S":return this.num(e.millisecond);case"u":case"SSS":return this.num(e.millisecond,3);case"s":return this.num(e.second);case"ss":return this.num(e.second,2);case"uu":return this.num(Math.floor(e.millisecond/10),2);case"uuu":return this.num(Math.floor(e.millisecond/100));case"m":return this.num(e.minute);case"mm":return this.num(e.minute,2);case"h":return this.num(e.hour%12===0?12:e.hour%12);case"hh":return this.num(e.hour%12===0?12:e.hour%12,2);case"H":return this.num(e.hour);case"HH":return this.num(e.hour,2);case"Z":return o({format:"narrow",allowZ:this.opts.allowZ});case"ZZ":return o({format:"short",allowZ:this.opts.allowZ});case"ZZZ":return o({format:"techie",allowZ:this.opts.allowZ});case"ZZZZ":return e.zone.offsetName(e.ts,{format:"short",locale:this.loc.locale});case"ZZZZZ":return e.zone.offsetName(e.ts,{format:"long",locale:this.loc.locale});case"z":return e.zoneName;case"a":return a();case"d":return s?i({day:"numeric"},"day"):this.num(e.day);case"dd":return s?i({day:"2-digit"},"day"):this.num(e.day,2);case"c":return this.num(e.weekday);case"ccc":return c("short",!0);case"cccc":return c("long",!0);case"ccccc":return c("narrow",!0);case"E":return this.num(e.weekday);case"EEE":return c("short",!1);case"EEEE":return c("long",!1);case"EEEEE":return c("narrow",!1);case"L":return s?i({month:"numeric",day:"numeric"},"month"):this.num(e.month);case"LL":return s?i({month:"2-digit",day:"numeric"},"month"):this.num(e.month,2);case"LLL":return l("short",!0);case"LLLL":return l("long",!0);case"LLLLL":return l("narrow",!0);case"M":return s?i({month:"numeric"},"month"):this.num(e.month);case"MM":return s?i({month:"2-digit"},"month"):this.num(e.month,2);case"MMM":return l("short",!1);case"MMMM":return l("long",!1);case"MMMMM":return l("narrow",!1);case"y":return s?i({year:"numeric"},"year"):this.num(e.year);case"yy":return s?i({year:"2-digit"},"year"):this.num(e.year.toString().slice(-2),2);case"yyyy":return s?i({year:"numeric"},"year"):this.num(e.year,4);case"yyyyyy":return s?i({year:"numeric"},"year"):this.num(e.year,6);case"G":return d("short");case"GG":return d("long");case"GGGGG":return d("narrow");case"kk":return this.num(e.weekYear.toString().slice(-2),2);case"kkkk":return this.num(e.weekYear,4);case"W":return this.num(e.weekNumber);case"WW":return this.num(e.weekNumber,2);case"n":return this.num(e.localWeekNumber);case"nn":return this.num(e.localWeekNumber,2);case"ii":return this.num(e.localWeekYear.toString().slice(-2),2);case"iiii":return this.num(e.localWeekYear,4);case"o":return this.num(e.ordinal);case"ooo":return this.num(e.ordinal,3);case"q":return this.num(e.quarter);case"qq":return this.num(e.quarter,2);case"X":return this.num(Math.floor(e.ts/1e3));case"x":return this.num(e.ts);default:return u(f)}};return or($.parseFormat(r),m)}formatDurationFromString(e,r){const n=this.opts.signMode==="negativeLargestOnly"?-1:1,s=u=>{switch(u[0]){case"S":return"milliseconds";case"s":return"seconds";case"m":return"minutes";case"h":return"hours";case"d":return"days";case"w":return"weeks";case"M":return"months";case"y":return"years";default:return null}},i=(u,d)=>m=>{const f=s(m);if(f){const w=d.isNegativeDuration&&f!==d.largestUnit?n:1;let E;return this.opts.signMode==="negativeLargestOnly"&&f!==d.largestUnit?E="never":this.opts.signMode==="all"?E="always":E="auto",this.num(u.get(f)*w,m.length,E)}else return m},o=$.parseFormat(r),a=o.reduce((u,{literal:d,val:m})=>d?u:u.concat(m),[]),l=e.shiftTo(...a.map(s).filter(u=>u)),c={isNegativeDuration:l<0,largestUnit:Object.keys(l.values)[0]};return or(o,i(l,c))}}const Sn=/[A-Za-z_+-]{1,256}(?::?\/[A-Za-z0-9_+-]{1,256}(?:\/[A-Za-z0-9_+-]{1,256})?)?/;function ue(...t){const e=t.reduce((r,n)=>r+n.source,"");return RegExp(`^${e}$`)}function de(...t){return e=>t.reduce(([r,n,s],i)=>{const[o,a,l]=i(e,s);return[{...r,...o},a||n,l]},[{},null,1]).slice(0,2)}function fe(t,...e){if(t==null)return[null,null];for(const[r,n]of e){const s=r.exec(t);if(s)return n(s)}return[null,null]}function Tn(...t){return(e,r)=>{const n={};let s;for(s=0;s<t.length;s++)n[t[s]]=_(e[r+s]);return[n,null,r+s]}}const En=/(?:([Zz])|([+-]\d\d)(?::?(\d\d))?)/,ai=`(?:${En.source}?(?:\\[(${Sn.source})\\])?)?`,At=/(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,30}))?)?)?/,On=RegExp(`${At.source}${ai}`),Ft=RegExp(`(?:[Tt]${On.source})?`),li=/([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/,ci=/(\d{4})-?W(\d\d)(?:-?(\d))?/,ui=/(\d{4})-?(\d{3})/,di=Tn("weekYear","weekNumber","weekDay"),fi=Tn("year","ordinal"),mi=/(\d{4})-(\d\d)-(\d\d)/,In=RegExp(`${At.source} ?(?:${En.source}|(${Sn.source}))?`),hi=RegExp(`(?: ${In.source})?`);function le(t,e,r){const n=t[e];return g(n)?r:_(n)}function gi(t,e){return[{year:le(t,e),month:le(t,e+1,1),day:le(t,e+2,1)},null,e+3]}function me(t,e){return[{hours:le(t,e,0),minutes:le(t,e+1,0),seconds:le(t,e+2,0),milliseconds:Mt(t[e+3])},null,e+4]}function Oe(t,e){const r=!t[e]&&!t[e+1],n=Ke(t[e+1],t[e+2]),s=r?null:M.instance(n);return[{},s,e+3]}function Ie(t,e){const r=t[e]?j.create(t[e]):null;return[{},r,e+1]}const yi=RegExp(`^T?${At.source}$`),pi=/^-?P(?:(?:(-?\d{1,20}(?:\.\d{1,20})?)Y)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20}(?:\.\d{1,20})?)W)?(?:(-?\d{1,20}(?:\.\d{1,20})?)D)?(?:T(?:(-?\d{1,20}(?:\.\d{1,20})?)H)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,20}))?S)?)?)$/;function wi(t){const[e,r,n,s,i,o,a,l,c]=t,u=e[0]==="-",d=l&&l[0]==="-",m=(f,w=!1)=>f!==void 0&&(w||f&&u)?-f:f;return[{years:m(G(r)),months:m(G(n)),weeks:m(G(s)),days:m(G(i)),hours:m(G(o)),minutes:m(G(a)),seconds:m(G(l),l==="-0"),milliseconds:m(Mt(c),d)}]}const bi={GMT:0,EDT:-240,EST:-300,CDT:-300,CST:-360,MDT:-360,MST:-420,PDT:-420,PST:-480};function Vt(t,e,r,n,s,i,o){const a={year:e.length===2?Ot(_(e)):_(e),month:yn.indexOf(r)+1,day:_(n),hour:_(s),minute:_(i)};return o&&(a.second=_(o)),t&&(a.weekday=t.length>3?wn.indexOf(t)+1:bn.indexOf(t)+1),a}const vi=/^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;function xi(t){const[,e,r,n,s,i,o,a,l,c,u,d]=t,m=Vt(e,s,n,r,i,o,a);let f;return l?f=bi[l]:c?f=0:f=Ke(u,d),[m,new M(f)]}function ki(t){return t.replace(/\([^()]*\)|[\n\t]/g," ").replace(/(\s\s+)/g," ").trim()}const Si=/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/,Ti=/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/,Ei=/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;function ar(t){const[,e,r,n,s,i,o,a]=t;return[Vt(e,s,n,r,i,o,a),M.utcInstance]}function Oi(t){const[,e,r,n,s,i,o,a]=t;return[Vt(e,a,r,n,s,i,o),M.utcInstance]}const Ii=ue(li,Ft),Ni=ue(ci,Ft),Ci=ue(ui,Ft),$i=ue(On),Nn=de(gi,me,Oe,Ie),Di=de(di,me,Oe,Ie),Mi=de(fi,me,Oe,Ie),Li=de(me,Oe,Ie);function Ai(t){return fe(t,[Ii,Nn],[Ni,Di],[Ci,Mi],[$i,Li])}function Fi(t){return fe(ki(t),[vi,xi])}function Vi(t){return fe(t,[Si,ar],[Ti,ar],[Ei,Oi])}function Pi(t){return fe(t,[pi,wi])}const Wi=de(me);function Ui(t){return fe(t,[yi,Wi])}const Ri=ue(mi,hi),qi=ue(In),Zi=de(me,Oe,Ie);function zi(t){return fe(t,[Ri,Nn],[qi,Zi])}const lr="Invalid Duration",Cn={weeks:{days:7,hours:168,minutes:10080,seconds:10080*60,milliseconds:10080*60*1e3},days:{hours:24,minutes:1440,seconds:1440*60,milliseconds:1440*60*1e3},hours:{minutes:60,seconds:3600,milliseconds:3600*1e3},minutes:{seconds:60,milliseconds:60*1e3},seconds:{milliseconds:1e3}},Hi={years:{quarters:4,months:12,weeks:52,days:365,hours:365*24,minutes:365*24*60,seconds:365*24*60*60,milliseconds:365*24*60*60*1e3},quarters:{months:3,weeks:13,days:91,hours:2184,minutes:2184*60,seconds:2184*60*60,milliseconds:2184*60*60*1e3},months:{weeks:4,days:30,hours:720,minutes:720*60,seconds:720*60*60,milliseconds:720*60*60*1e3},...Cn},V=146097/400,re=146097/4800,ji={years:{quarters:4,months:12,weeks:V/7,days:V,hours:V*24,minutes:V*24*60,seconds:V*24*60*60,milliseconds:V*24*60*60*1e3},quarters:{months:3,weeks:V/28,days:V/4,hours:V*24/4,minutes:V*24*60/4,seconds:V*24*60*60/4,milliseconds:V*24*60*60*1e3/4},months:{weeks:re/7,days:re,hours:re*24,minutes:re*24*60,seconds:re*24*60*60,milliseconds:re*24*60*60*1e3},...Cn},Q=["years","quarters","months","weeks","days","hours","minutes","seconds","milliseconds"],Bi=Q.slice(0).reverse();function H(t,e,r=!1){const n={values:r?e.values:{...t.values,...e.values||{}},loc:t.loc.clone(e.loc),conversionAccuracy:e.conversionAccuracy||t.conversionAccuracy,matrix:e.matrix||t.matrix};return new b(n)}function $n(t,e){let r=e.milliseconds??0;for(const n of Bi.slice(1))e[n]&&(r+=e[n]*t[n].milliseconds);return r}function cr(t,e){const r=$n(t,e)<0?-1:1;Q.reduceRight((n,s)=>{if(g(e[s]))return n;if(n){const i=e[n]*r,o=t[s][n],a=Math.floor(i/o);e[s]+=a*r,e[n]-=a*o*r}return s},null),Q.reduce((n,s)=>{if(g(e[s]))return n;if(n){const i=e[n]%1;e[n]-=i,e[s]+=i*t[n][s]}return s},null)}function ur(t){const e={};for(const[r,n]of Object.entries(t))n!==0&&(e[r]=n);return e}class b{constructor(e){const r=e.conversionAccuracy==="longterm"||!1;let n=r?ji:Hi;e.matrix&&(n=e.matrix),this.values=e.values,this.loc=e.loc||x.create(),this.conversionAccuracy=r?"longterm":"casual",this.invalid=e.invalid||null,this.matrix=n,this.isLuxonDuration=!0}static fromMillis(e,r){return b.fromObject({milliseconds:e},r)}static fromObject(e,r={}){if(e==null||typeof e!="object")throw new C(`Duration.fromObject: argument expected to be an object, got ${e===null?"null":typeof e}`);return new b({values:Be(e,b.normalizeUnit),loc:x.fromObject(r),conversionAccuracy:r.conversionAccuracy,matrix:r.matrix})}static fromDurationLike(e){if(J(e))return b.fromMillis(e);if(b.isDuration(e))return e;if(typeof e=="object")return b.fromObject(e);throw new C(`Unknown duration argument ${e} of type ${typeof e}`)}static fromISO(e,r){const[n]=Pi(e);return n?b.fromObject(n,r):b.invalid("unparsable",`the input "${e}" can't be parsed as ISO 8601`)}static fromISOTime(e,r){const[n]=Ui(e);return n?b.fromObject(n,r):b.invalid("unparsable",`the input "${e}" can't be parsed as ISO 8601`)}static invalid(e,r=null){if(!e)throw new C("need to specify a reason the Duration is invalid");const n=e instanceof Z?e:new Z(e,r);if(S.throwOnInvalid)throw new ws(n);return new b({invalid:n})}static normalizeUnit(e){const r={year:"years",years:"years",quarter:"quarters",quarters:"quarters",month:"months",months:"months",week:"weeks",weeks:"weeks",day:"days",days:"days",hour:"hours",hours:"hours",minute:"minutes",minutes:"minutes",second:"seconds",seconds:"seconds",millisecond:"milliseconds",milliseconds:"milliseconds"}[e&&e.toLowerCase()];if(!r)throw new Pr(e);return r}static isDuration(e){return e&&e.isLuxonDuration||!1}get locale(){return this.isValid?this.loc.locale:null}get numberingSystem(){return this.isValid?this.loc.numberingSystem:null}toFormat(e,r={}){const n={...r,floor:r.round!==!1&&r.floor!==!1};return this.isValid?$.create(this.loc,n).formatDurationFromString(this,e):lr}toHuman(e={}){if(!this.isValid)return lr;const r=e.showZeros!==!1,n=Q.map(s=>{const i=this.values[s];return g(i)||i===0&&!r?null:this.loc.numberFormatter({style:"unit",unitDisplay:"long",...e,unit:s.slice(0,-1)}).format(i)}).filter(s=>s);return this.loc.listFormatter({type:"conjunction",style:e.listStyle||"narrow",...e}).format(n)}toObject(){return this.isValid?{...this.values}:{}}toISO(){if(!this.isValid)return null;let e="P";return this.years!==0&&(e+=this.years+"Y"),(this.months!==0||this.quarters!==0)&&(e+=this.months+this.quarters*3+"M"),this.weeks!==0&&(e+=this.weeks+"W"),this.days!==0&&(e+=this.days+"D"),(this.hours!==0||this.minutes!==0||this.seconds!==0||this.milliseconds!==0)&&(e+="T"),this.hours!==0&&(e+=this.hours+"H"),this.minutes!==0&&(e+=this.minutes+"M"),(this.seconds!==0||this.milliseconds!==0)&&(e+=Lt(this.seconds+this.milliseconds/1e3,3)+"S"),e==="P"&&(e+="T0S"),e}toISOTime(e={}){if(!this.isValid)return null;const r=this.toMillis();return r<0||r>=864e5?null:(e={suppressMilliseconds:!1,suppressSeconds:!1,includePrefix:!1,format:"extended",...e,includeOffset:!1},y.fromMillis(r,{zone:"UTC"}).toISOTime(e))}toJSON(){return this.toISO()}toString(){return this.toISO()}[Symbol.for("nodejs.util.inspect.custom")](){return this.isValid?`Duration { values: ${JSON.stringify(this.values)} }`:`Duration { Invalid, reason: ${this.invalidReason} }`}toMillis(){return this.isValid?$n(this.matrix,this.values):NaN}valueOf(){return this.toMillis()}plus(e){if(!this.isValid)return this;const r=b.fromDurationLike(e),n={};for(const s of Q)(ce(r.values,s)||ce(this.values,s))&&(n[s]=r.get(s)+this.get(s));return H(this,{values:n},!0)}minus(e){if(!this.isValid)return this;const r=b.fromDurationLike(e);return this.plus(r.negate())}mapUnits(e){if(!this.isValid)return this;const r={};for(const n of Object.keys(this.values))r[n]=gn(e(this.values[n],n));return H(this,{values:r},!0)}get(e){return this[b.normalizeUnit(e)]}set(e){if(!this.isValid)return this;const r={...this.values,...Be(e,b.normalizeUnit)};return H(this,{values:r})}reconfigure({locale:e,numberingSystem:r,conversionAccuracy:n,matrix:s}={}){const o={loc:this.loc.clone({locale:e,numberingSystem:r}),matrix:s,conversionAccuracy:n};return H(this,o)}as(e){return this.isValid?this.shiftTo(e).get(e):NaN}normalize(){if(!this.isValid)return this;const e=this.toObject();return cr(this.matrix,e),H(this,{values:e},!0)}rescale(){if(!this.isValid)return this;const e=ur(this.normalize().shiftToAll().toObject());return H(this,{values:e},!0)}shiftTo(...e){if(!this.isValid)return this;if(e.length===0)return this;e=e.map(o=>b.normalizeUnit(o));const r={},n={},s=this.toObject();let i;for(const o of Q)if(e.indexOf(o)>=0){i=o;let a=0;for(const c in n)a+=this.matrix[c][o]*n[c],n[c]=0;J(s[o])&&(a+=s[o]);const l=Math.trunc(a);r[o]=l,n[o]=(a*1e3-l*1e3)/1e3}else J(s[o])&&(n[o]=s[o]);for(const o in n)n[o]!==0&&(r[i]+=o===i?n[o]:n[o]/this.matrix[i][o]);return cr(this.matrix,r),H(this,{values:r},!0)}shiftToAll(){return this.isValid?this.shiftTo("years","months","weeks","days","hours","minutes","seconds","milliseconds"):this}negate(){if(!this.isValid)return this;const e={};for(const r of Object.keys(this.values))e[r]=this.values[r]===0?0:-this.values[r];return H(this,{values:e},!0)}removeZeros(){if(!this.isValid)return this;const e=ur(this.values);return H(this,{values:e},!0)}get years(){return this.isValid?this.values.years||0:NaN}get quarters(){return this.isValid?this.values.quarters||0:NaN}get months(){return this.isValid?this.values.months||0:NaN}get weeks(){return this.isValid?this.values.weeks||0:NaN}get days(){return this.isValid?this.values.days||0:NaN}get hours(){return this.isValid?this.values.hours||0:NaN}get minutes(){return this.isValid?this.values.minutes||0:NaN}get seconds(){return this.isValid?this.values.seconds||0:NaN}get milliseconds(){return this.isValid?this.values.milliseconds||0:NaN}get isValid(){return this.invalid===null}get invalidReason(){return this.invalid?this.invalid.reason:null}get invalidExplanation(){return this.invalid?this.invalid.explanation:null}equals(e){if(!this.isValid||!e.isValid||!this.loc.equals(e.loc))return!1;function r(n,s){return n===void 0||n===0?s===void 0||s===0:n===s}for(const n of Q)if(!r(this.values[n],e.values[n]))return!1;return!0}}const ne="Invalid Interval";function _i(t,e){return!t||!t.isValid?k.invalid("missing or invalid start"):!e||!e.isValid?k.invalid("missing or invalid end"):e<t?k.invalid("end before start",`The end of an interval must be after its start, but you had start=${t.toISO()} and end=${e.toISO()}`):null}class k{constructor(e){this.s=e.start,this.e=e.end,this.invalid=e.invalid||null,this.isLuxonInterval=!0}static invalid(e,r=null){if(!e)throw new C("need to specify a reason the Interval is invalid");const n=e instanceof Z?e:new Z(e,r);if(S.throwOnInvalid)throw new ps(n);return new k({invalid:n})}static fromDateTimes(e,r){const n=pe(e),s=pe(r),i=_i(n,s);return i??new k({start:n,end:s})}static after(e,r){const n=b.fromDurationLike(r),s=pe(e);return k.fromDateTimes(s,s.plus(n))}static before(e,r){const n=b.fromDurationLike(r),s=pe(e);return k.fromDateTimes(s.minus(n),s)}static fromISO(e,r){const[n,s]=(e||"").split("/",2);if(n&&s){let i,o;try{i=y.fromISO(n,r),o=i.isValid}catch{o=!1}let a,l;try{a=y.fromISO(s,r),l=a.isValid}catch{l=!1}if(o&&l)return k.fromDateTimes(i,a);if(o){const c=b.fromISO(s,r);if(c.isValid)return k.after(i,c)}else if(l){const c=b.fromISO(n,r);if(c.isValid)return k.before(a,c)}}return k.invalid("unparsable",`the input "${e}" can't be parsed as ISO 8601`)}static isInterval(e){return e&&e.isLuxonInterval||!1}get start(){return this.isValid?this.s:null}get end(){return this.isValid?this.e:null}get lastDateTime(){return this.isValid&&this.e?this.e.minus(1):null}get isValid(){return this.invalidReason===null}get invalidReason(){return this.invalid?this.invalid.reason:null}get invalidExplanation(){return this.invalid?this.invalid.explanation:null}length(e="milliseconds"){return this.isValid?this.toDuration(e).get(e):NaN}count(e="milliseconds",r){if(!this.isValid)return NaN;const n=this.start.startOf(e,r);let s;return r?.useLocaleWeeks?s=this.end.reconfigure({locale:n.locale}):s=this.end,s=s.startOf(e,r),Math.floor(s.diff(n,e).get(e))+(s.valueOf()!==this.end.valueOf())}hasSame(e){return this.isValid?this.isEmpty()||this.e.minus(1).hasSame(this.s,e):!1}isEmpty(){return this.s.valueOf()===this.e.valueOf()}isAfter(e){return this.isValid?this.s>e:!1}isBefore(e){return this.isValid?this.e<=e:!1}contains(e){return this.isValid?this.s<=e&&this.e>e:!1}set({start:e,end:r}={}){return this.isValid?k.fromDateTimes(e||this.s,r||this.e):this}splitAt(...e){if(!this.isValid)return[];const r=e.map(pe).filter(o=>this.contains(o)).sort((o,a)=>o.toMillis()-a.toMillis()),n=[];let{s}=this,i=0;for(;s<this.e;){const o=r[i]||this.e,a=+o>+this.e?this.e:o;n.push(k.fromDateTimes(s,a)),s=a,i+=1}return n}splitBy(e){const r=b.fromDurationLike(e);if(!this.isValid||!r.isValid||r.as("milliseconds")===0)return[];let{s:n}=this,s=1,i;const o=[];for(;n<this.e;){const a=this.start.plus(r.mapUnits(l=>l*s));i=+a>+this.e?this.e:a,o.push(k.fromDateTimes(n,i)),n=i,s+=1}return o}divideEqually(e){return this.isValid?this.splitBy(this.length()/e).slice(0,e):[]}overlaps(e){return this.e>e.s&&this.s<e.e}abutsStart(e){return this.isValid?+this.e==+e.s:!1}abutsEnd(e){return this.isValid?+e.e==+this.s:!1}engulfs(e){return this.isValid?this.s<=e.s&&this.e>=e.e:!1}equals(e){return!this.isValid||!e.isValid?!1:this.s.equals(e.s)&&this.e.equals(e.e)}intersection(e){if(!this.isValid)return this;const r=this.s>e.s?this.s:e.s,n=this.e<e.e?this.e:e.e;return r>=n?null:k.fromDateTimes(r,n)}union(e){if(!this.isValid)return this;const r=this.s<e.s?this.s:e.s,n=this.e>e.e?this.e:e.e;return k.fromDateTimes(r,n)}static merge(e){const[r,n]=e.sort((s,i)=>s.s-i.s).reduce(([s,i],o)=>i?i.overlaps(o)||i.abutsStart(o)?[s,i.union(o)]:[s.concat([i]),o]:[s,o],[[],null]);return n&&r.push(n),r}static xor(e){let r=null,n=0;const s=[],i=e.map(l=>[{time:l.s,type:"s"},{time:l.e,type:"e"}]),o=Array.prototype.concat(...i),a=o.sort((l,c)=>l.time-c.time);for(const l of a)n+=l.type==="s"?1:-1,n===1?r=l.time:(r&&+r!=+l.time&&s.push(k.fromDateTimes(r,l.time)),r=null);return k.merge(s)}difference(...e){return k.xor([this].concat(e)).map(r=>this.intersection(r)).filter(r=>r&&!r.isEmpty())}toString(){return this.isValid?`[${this.s.toISO()} – ${this.e.toISO()})`:ne}[Symbol.for("nodejs.util.inspect.custom")](){return this.isValid?`Interval { start: ${this.s.toISO()}, end: ${this.e.toISO()} }`:`Interval { Invalid, reason: ${this.invalidReason} }`}toLocaleString(e=ze,r={}){return this.isValid?$.create(this.s.loc.clone(r),e).formatInterval(this):ne}toISO(e){return this.isValid?`${this.s.toISO(e)}/${this.e.toISO(e)}`:ne}toISODate(){return this.isValid?`${this.s.toISODate()}/${this.e.toISODate()}`:ne}toISOTime(e){return this.isValid?`${this.s.toISOTime(e)}/${this.e.toISOTime(e)}`:ne}toFormat(e,{separator:r=" – "}={}){return this.isValid?`${this.s.toFormat(e)}${r}${this.e.toFormat(e)}`:ne}toDuration(e,r){return this.isValid?this.e.diff(this.s,e,r):b.invalid(this.invalidReason)}mapEndpoints(e){return k.fromDateTimes(e(this.s),e(this.e))}}class Le{static hasDST(e=S.defaultZone){const r=y.now().setZone(e).set({month:12});return!e.isUniversal&&r.offset!==r.set({month:6}).offset}static isValidIANAZone(e){return j.isValidZone(e)}static normalizeZone(e){return Y(e,S.defaultZone)}static getStartOfWeek({locale:e=null,locObj:r=null}={}){return(r||x.create(e)).getStartOfWeek()}static getMinimumDaysInFirstWeek({locale:e=null,locObj:r=null}={}){return(r||x.create(e)).getMinDaysInFirstWeek()}static getWeekendWeekdays({locale:e=null,locObj:r=null}={}){return(r||x.create(e)).getWeekendDays().slice()}static months(e="long",{locale:r=null,numberingSystem:n=null,locObj:s=null,outputCalendar:i="gregory"}={}){return(s||x.create(r,n,i)).months(e)}static monthsFormat(e="long",{locale:r=null,numberingSystem:n=null,locObj:s=null,outputCalendar:i="gregory"}={}){return(s||x.create(r,n,i)).months(e,!0)}static weekdays(e="long",{locale:r=null,numberingSystem:n=null,locObj:s=null}={}){return(s||x.create(r,n,null)).weekdays(e)}static weekdaysFormat(e="long",{locale:r=null,numberingSystem:n=null,locObj:s=null}={}){return(s||x.create(r,n,null)).weekdays(e,!0)}static meridiems({locale:e=null}={}){return x.create(e).meridiems()}static eras(e="short",{locale:r=null}={}){return x.create(r,null,"gregory").eras(e)}static features(){return{relative:fn(),localeWeek:mn()}}}function dr(t,e){const r=s=>s.toUTC(0,{keepLocalTime:!0}).startOf("day").valueOf(),n=r(e)-r(t);return Math.floor(b.fromMillis(n).as("days"))}function Yi(t,e,r){const n=[["years",(l,c)=>c.year-l.year],["quarters",(l,c)=>c.quarter-l.quarter+(c.year-l.year)*4],["months",(l,c)=>c.month-l.month+(c.year-l.year)*12],["weeks",(l,c)=>{const u=dr(l,c);return(u-u%7)/7}],["days",dr]],s={},i=t;let o,a;for(const[l,c]of n)r.indexOf(l)>=0&&(o=l,s[l]=c(t,e),a=i.plus(s),a>e?(s[l]--,t=i.plus(s),t>e&&(a=t,s[l]--,t=i.plus(s))):t=a);return[t,s,a,o]}function Ji(t,e,r,n){let[s,i,o,a]=Yi(t,e,r);const l=e-s,c=r.filter(d=>["hours","minutes","seconds","milliseconds"].indexOf(d)>=0);c.length===0&&(o<e&&(o=s.plus({[a]:1})),o!==s&&(i[a]=(i[a]||0)+l/(o-s)));const u=b.fromObject(i,n);return c.length>0?b.fromMillis(l,n).shiftTo(...c).plus(u):u}const Gi="missing Intl.DateTimeFormat.formatToParts support";function v(t,e=r=>r){return{regex:t,deser:([r])=>e(Rs(r))}}const Ki=" ",Dn=`[ ${Ki}]`,Mn=new RegExp(Dn,"g");function Qi(t){return t.replace(/\./g,"\\.?").replace(Mn,Dn)}function fr(t){return t.replace(/\./g,"").replace(Mn," ").toLowerCase()}function R(t,e){return t===null?null:{regex:RegExp(t.map(Qi).join("|")),deser:([r])=>t.findIndex(n=>fr(r)===fr(n))+e}}function mr(t,e){return{regex:t,deser:([,r,n])=>Ke(r,n),groups:e}}function Ae(t){return{regex:t,deser:([e])=>e}}function Xi(t){return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function eo(t,e){const r=U(e),n=U(e,"{2}"),s=U(e,"{3}"),i=U(e,"{4}"),o=U(e,"{6}"),a=U(e,"{1,2}"),l=U(e,"{1,3}"),c=U(e,"{1,6}"),u=U(e,"{1,9}"),d=U(e,"{2,4}"),m=U(e,"{4,6}"),f=O=>({regex:RegExp(Xi(O.val)),deser:([N])=>N,literal:!0}),E=(O=>{if(t.literal)return f(O);switch(O.val){case"G":return R(e.eras("short"),0);case"GG":return R(e.eras("long"),0);case"y":return v(c);case"yy":return v(d,Ot);case"yyyy":return v(i);case"yyyyy":return v(m);case"yyyyyy":return v(o);case"M":return v(a);case"MM":return v(n);case"MMM":return R(e.months("short",!0),1);case"MMMM":return R(e.months("long",!0),1);case"L":return v(a);case"LL":return v(n);case"LLL":return R(e.months("short",!1),1);case"LLLL":return R(e.months("long",!1),1);case"d":return v(a);case"dd":return v(n);case"o":return v(l);case"ooo":return v(s);case"HH":return v(n);case"H":return v(a);case"hh":return v(n);case"h":return v(a);case"mm":return v(n);case"m":return v(a);case"q":return v(a);case"qq":return v(n);case"s":return v(a);case"ss":return v(n);case"S":return v(l);case"SSS":return v(s);case"u":return Ae(u);case"uu":return Ae(a);case"uuu":return v(r);case"a":return R(e.meridiems(),0);case"kkkk":return v(i);case"kk":return v(d,Ot);case"W":return v(a);case"WW":return v(n);case"E":case"c":return v(r);case"EEE":return R(e.weekdays("short",!1),1);case"EEEE":return R(e.weekdays("long",!1),1);case"ccc":return R(e.weekdays("short",!0),1);case"cccc":return R(e.weekdays("long",!0),1);case"Z":case"ZZ":return mr(new RegExp(`([+-]${a.source})(?::(${n.source}))?`),2);case"ZZZ":return mr(new RegExp(`([+-]${a.source})(${n.source})?`),2);case"z":return Ae(/[a-z_+-/]{1,256}?/i);case" ":return Ae(/[^\S\n\r]/);default:return f(O)}})(t)||{invalidReason:Gi};return E.token=t,E}const to={year:{"2-digit":"yy",numeric:"yyyyy"},month:{numeric:"M","2-digit":"MM",short:"MMM",long:"MMMM"},day:{numeric:"d","2-digit":"dd"},weekday:{short:"EEE",long:"EEEE"},dayperiod:"a",dayPeriod:"a",hour12:{numeric:"h","2-digit":"hh"},hour24:{numeric:"H","2-digit":"HH"},minute:{numeric:"m","2-digit":"mm"},second:{numeric:"s","2-digit":"ss"},timeZoneName:{long:"ZZZZZ",short:"ZZZ"}};function ro(t,e,r){const{type:n,value:s}=t;if(n==="literal"){const l=/^\s+$/.test(s);return{literal:!l,val:l?" ":s}}const i=e[n];let o=n;n==="hour"&&(e.hour12!=null?o=e.hour12?"hour12":"hour24":e.hourCycle!=null?e.hourCycle==="h11"||e.hourCycle==="h12"?o="hour12":o="hour24":o=r.hour12?"hour12":"hour24");let a=to[o];if(typeof a=="object"&&(a=a[i]),a)return{literal:!1,val:a}}function no(t){return[`^${t.map(r=>r.regex).reduce((r,n)=>`${r}(${n.source})`,"")}$`,t]}function so(t,e,r){const n=t.match(e);if(n){const s={};let i=1;for(const o in r)if(ce(r,o)){const a=r[o],l=a.groups?a.groups+1:1;!a.literal&&a.token&&(s[a.token.val[0]]=a.deser(n.slice(i,i+l))),i+=l}return[n,s]}else return[n,{}]}function io(t){const e=i=>{switch(i){case"S":return"millisecond";case"s":return"second";case"m":return"minute";case"h":case"H":return"hour";case"d":return"day";case"o":return"ordinal";case"L":case"M":return"month";case"y":return"year";case"E":case"c":return"weekday";case"W":return"weekNumber";case"k":return"weekYear";case"q":return"quarter";default:return null}};let r=null,n;return g(t.z)||(r=j.create(t.z)),g(t.Z)||(r||(r=new M(t.Z)),n=t.Z),g(t.q)||(t.M=(t.q-1)*3+1),g(t.h)||(t.h<12&&t.a===1?t.h+=12:t.h===12&&t.a===0&&(t.h=0)),t.G===0&&t.y&&(t.y=-t.y),g(t.u)||(t.S=Mt(t.u)),[Object.keys(t).reduce((i,o)=>{const a=e(o);return a&&(i[a]=t[o]),i},{}),r,n]}let it=null;function oo(){return it||(it=y.fromMillis(1555555555555)),it}function ao(t,e){if(t.literal)return t;const r=$.macroTokenToFormatOpts(t.val),n=Vn(r,e);return n==null||n.includes(void 0)?t:n}function Ln(t,e){return Array.prototype.concat(...t.map(r=>ao(r,e)))}class An{constructor(e,r){if(this.locale=e,this.format=r,this.tokens=Ln($.parseFormat(r),e),this.units=this.tokens.map(n=>eo(n,e)),this.disqualifyingUnit=this.units.find(n=>n.invalidReason),!this.disqualifyingUnit){const[n,s]=no(this.units);this.regex=RegExp(n,"i"),this.handlers=s}}explainFromTokens(e){if(this.isValid){const[r,n]=so(e,this.regex,this.handlers),[s,i,o]=n?io(n):[null,null,void 0];if(ce(n,"a")&&ce(n,"H"))throw new oe("Can't include meridiem when specifying 24-hour format");return{input:e,tokens:this.tokens,regex:this.regex,rawMatches:r,matches:n,result:s,zone:i,specificOffset:o}}else return{input:e,tokens:this.tokens,invalidReason:this.invalidReason}}get isValid(){return!this.disqualifyingUnit}get invalidReason(){return this.disqualifyingUnit?this.disqualifyingUnit.invalidReason:null}}function Fn(t,e,r){return new An(t,r).explainFromTokens(e)}function lo(t,e,r){const{result:n,zone:s,specificOffset:i,invalidReason:o}=Fn(t,e,r);return[n,s,i,o]}function Vn(t,e){if(!t)return null;const n=$.create(e,t).dtFormatter(oo()),s=n.formatToParts(),i=n.resolvedOptions();return s.map(o=>ro(o,t,i))}const ot="Invalid DateTime",hr=864e13;function be(t){return new Z("unsupported zone",`the zone "${t.name}" is not supported`)}function at(t){return t.weekData===null&&(t.weekData=He(t.c)),t.weekData}function lt(t){return t.localWeekData===null&&(t.localWeekData=He(t.c,t.loc.getMinDaysInFirstWeek(),t.loc.getStartOfWeek())),t.localWeekData}function K(t,e){const r={ts:t.ts,zone:t.zone,c:t.c,o:t.o,loc:t.loc,invalid:t.invalid};return new y({...r,...e,old:r})}function Pn(t,e,r){let n=t-e*60*1e3;const s=r.offset(n);if(e===s)return[n,e];n-=(s-e)*60*1e3;const i=r.offset(n);return s===i?[n,s]:[t-Math.min(s,i)*60*1e3,Math.max(s,i)]}function Fe(t,e){t+=e*60*1e3;const r=new Date(t);return{year:r.getUTCFullYear(),month:r.getUTCMonth()+1,day:r.getUTCDate(),hour:r.getUTCHours(),minute:r.getUTCMinutes(),second:r.getUTCSeconds(),millisecond:r.getUTCMilliseconds()}}function Ue(t,e,r){return Pn(Ge(t),e,r)}function gr(t,e){const r=t.o,n=t.c.year+Math.trunc(e.years),s=t.c.month+Math.trunc(e.months)+Math.trunc(e.quarters)*3,i={...t.c,year:n,month:s,day:Math.min(t.c.day,je(n,s))+Math.trunc(e.days)+Math.trunc(e.weeks)*7},o=b.fromObject({years:e.years-Math.trunc(e.years),quarters:e.quarters-Math.trunc(e.quarters),months:e.months-Math.trunc(e.months),weeks:e.weeks-Math.trunc(e.weeks),days:e.days-Math.trunc(e.days),hours:e.hours,minutes:e.minutes,seconds:e.seconds,milliseconds:e.milliseconds}).as("milliseconds"),a=Ge(i);let[l,c]=Pn(a,r,t.zone);return o!==0&&(l+=o,c=t.zone.offset(l)),{ts:l,o:c}}function se(t,e,r,n,s,i){const{setZone:o,zone:a}=r;if(t&&Object.keys(t).length!==0||e){const l=e||a,c=y.fromObject(t,{...r,zone:l,specificOffset:i});return o?c:c.setZone(a)}else return y.invalid(new Z("unparsable",`the input "${s}" can't be parsed as ${n}`))}function Ve(t,e,r=!0){return t.isValid?$.create(x.create("en-US"),{allowZ:r,forceSimple:!0}).formatDateTimeFromString(t,e):null}function ct(t,e,r){const n=t.c.year>9999||t.c.year<0;let s="";if(n&&t.c.year>=0&&(s+="+"),s+=T(t.c.year,n?6:4),r==="year")return s;if(e){if(s+="-",s+=T(t.c.month),r==="month")return s;s+="-"}else if(s+=T(t.c.month),r==="month")return s;return s+=T(t.c.day),s}function yr(t,e,r,n,s,i,o){let a=!r||t.c.millisecond!==0||t.c.second!==0,l="";switch(o){case"day":case"month":case"year":break;default:if(l+=T(t.c.hour),o==="hour")break;if(e){if(l+=":",l+=T(t.c.minute),o==="minute")break;a&&(l+=":",l+=T(t.c.second))}else{if(l+=T(t.c.minute),o==="minute")break;a&&(l+=T(t.c.second))}if(o==="second")break;a&&(!n||t.c.millisecond!==0)&&(l+=".",l+=T(t.c.millisecond,3))}return s&&(t.isOffsetFixed&&t.offset===0&&!i?l+="Z":t.o<0?(l+="-",l+=T(Math.trunc(-t.o/60)),l+=":",l+=T(Math.trunc(-t.o%60))):(l+="+",l+=T(Math.trunc(t.o/60)),l+=":",l+=T(Math.trunc(t.o%60)))),i&&(l+="["+t.zone.ianaName+"]"),l}const Wn={month:1,day:1,hour:0,minute:0,second:0,millisecond:0},co={weekNumber:1,weekday:1,hour:0,minute:0,second:0,millisecond:0},uo={ordinal:1,hour:0,minute:0,second:0,millisecond:0},Re=["year","month","day","hour","minute","second","millisecond"],fo=["weekYear","weekNumber","weekday","hour","minute","second","millisecond"],mo=["year","ordinal","hour","minute","second","millisecond"];function qe(t){const e={year:"year",years:"year",month:"month",months:"month",day:"day",days:"day",hour:"hour",hours:"hour",minute:"minute",minutes:"minute",quarter:"quarter",quarters:"quarter",second:"second",seconds:"second",millisecond:"millisecond",milliseconds:"millisecond",weekday:"weekday",weekdays:"weekday",weeknumber:"weekNumber",weeksnumber:"weekNumber",weeknumbers:"weekNumber",weekyear:"weekYear",weekyears:"weekYear",ordinal:"ordinal"}[t.toLowerCase()];if(!e)throw new Pr(t);return e}function pr(t){switch(t.toLowerCase()){case"localweekday":case"localweekdays":return"localWeekday";case"localweeknumber":case"localweeknumbers":return"localWeekNumber";case"localweekyear":case"localweekyears":return"localWeekYear";default:return qe(t)}}function ho(t){if(ve===void 0&&(ve=S.now()),t.type!=="iana")return t.offset(ve);const e=t.name;let r=It.get(e);return r===void 0&&(r=t.offset(ve),It.set(e,r)),r}function wr(t,e){const r=Y(e.zone,S.defaultZone);if(!r.isValid)return y.invalid(be(r));const n=x.fromObject(e);let s,i;if(g(t.year))s=S.now();else{for(const l of Re)g(t[l])&&(t[l]=Wn[l]);const o=un(t)||dn(t);if(o)return y.invalid(o);const a=ho(r);[s,i]=Ue(t,a,r)}return new y({ts:s,zone:r,loc:n,o:i})}function br(t,e,r){const n=g(r.round)?!0:r.round,s=g(r.rounding)?"trunc":r.rounding,i=(a,l)=>(a=Lt(a,n||r.calendary?0:2,r.calendary?"round":s),e.loc.clone(r).relFormatter(r).format(a,l)),o=a=>r.calendary?e.hasSame(t,a)?0:e.startOf(a).diff(t.startOf(a),a).get(a):e.diff(t,a).get(a);if(r.unit)return i(o(r.unit),r.unit);for(const a of r.units){const l=o(a);if(Math.abs(l)>=1)return i(l,a)}return i(t>e?-0:0,r.units[r.units.length-1])}function vr(t){let e={},r;return t.length>0&&typeof t[t.length-1]=="object"?(e=t[t.length-1],r=Array.from(t).slice(0,t.length-1)):r=Array.from(t),[e,r]}let ve;const It=new Map;class y{constructor(e){const r=e.zone||S.defaultZone;let n=e.invalid||(Number.isNaN(e.ts)?new Z("invalid input"):null)||(r.isValid?null:be(r));this.ts=g(e.ts)?S.now():e.ts;let s=null,i=null;if(!n)if(e.old&&e.old.ts===this.ts&&e.old.zone.equals(r))[s,i]=[e.old.c,e.old.o];else{const a=J(e.o)&&!e.old?e.o:r.offset(this.ts);s=Fe(this.ts,a),n=Number.isNaN(s.year)?new Z("invalid input"):null,s=n?null:s,i=n?null:a}this._zone=r,this.loc=e.loc||x.create(),this.invalid=n,this.weekData=null,this.localWeekData=null,this.c=s,this.o=i,this.isLuxonDateTime=!0}static now(){return new y({})}static local(){const[e,r]=vr(arguments),[n,s,i,o,a,l,c]=r;return wr({year:n,month:s,day:i,hour:o,minute:a,second:l,millisecond:c},e)}static utc(){const[e,r]=vr(arguments),[n,s,i,o,a,l,c]=r;return e.zone=M.utcInstance,wr({year:n,month:s,day:i,hour:o,minute:a,second:l,millisecond:c},e)}static fromJSDate(e,r={}){const n=js(e)?e.valueOf():NaN;if(Number.isNaN(n))return y.invalid("invalid input");const s=Y(r.zone,S.defaultZone);return s.isValid?new y({ts:n,zone:s,loc:x.fromObject(r)}):y.invalid(be(s))}static fromMillis(e,r={}){if(J(e))return e<-hr||e>hr?y.invalid("Timestamp out of range"):new y({ts:e,zone:Y(r.zone,S.defaultZone),loc:x.fromObject(r)});throw new C(`fromMillis requires a numerical input, but received a ${typeof e} with value ${e}`)}static fromSeconds(e,r={}){if(J(e))return new y({ts:e*1e3,zone:Y(r.zone,S.defaultZone),loc:x.fromObject(r)});throw new C("fromSeconds requires a numerical input")}static fromObject(e,r={}){e=e||{};const n=Y(r.zone,S.defaultZone);if(!n.isValid)return y.invalid(be(n));const s=x.fromObject(r),i=Be(e,pr),{minDaysInFirstWeek:o,startOfWeek:a}=nr(i,s),l=S.now(),c=g(r.specificOffset)?n.offset(l):r.specificOffset,u=!g(i.ordinal),d=!g(i.year),m=!g(i.month)||!g(i.day),f=d||m,w=i.weekYear||i.weekNumber;if((f||u)&&w)throw new oe("Can't mix weekYear/weekNumber units with year/month/day or ordinals");if(m&&u)throw new oe("Can't mix ordinal dates with month/day");const E=w||i.weekday&&!f;let O,N,A=Fe(l,c);E?(O=fo,N=co,A=He(A,o,a)):u?(O=mo,N=uo,A=st(A)):(O=Re,N=Wn);let D=!1;for(const ge of O){const zn=i[ge];g(zn)?D?i[ge]=N[ge]:i[ge]=A[ge]:D=!0}const Ne=E?Zs(i,o,a):u?zs(i):un(i),Pt=Ne||dn(i);if(Pt)return y.invalid(Pt);const Rn=E?tr(i,o,a):u?rr(i):i,[qn,Zn]=Ue(Rn,c,n),he=new y({ts:qn,zone:n,o:Zn,loc:s});return i.weekday&&f&&e.weekday!==he.weekday?y.invalid("mismatched weekday",`you can't specify both a weekday of ${i.weekday} and a date of ${he.toISO()}`):he.isValid?he:y.invalid(he.invalid)}static fromISO(e,r={}){const[n,s]=Ai(e);return se(n,s,r,"ISO 8601",e)}static fromRFC2822(e,r={}){const[n,s]=Fi(e);return se(n,s,r,"RFC 2822",e)}static fromHTTP(e,r={}){const[n,s]=Vi(e);return se(n,s,r,"HTTP",r)}static fromFormat(e,r,n={}){if(g(e)||g(r))throw new C("fromFormat requires an input string and a format");const{locale:s=null,numberingSystem:i=null}=n,o=x.fromOpts({locale:s,numberingSystem:i,defaultToEN:!0}),[a,l,c,u]=lo(o,e,r);return u?y.invalid(u):se(a,l,n,`format ${r}`,e,c)}static fromString(e,r,n={}){return y.fromFormat(e,r,n)}static fromSQL(e,r={}){const[n,s]=zi(e);return se(n,s,r,"SQL",e)}static invalid(e,r=null){if(!e)throw new C("need to specify a reason the DateTime is invalid");const n=e instanceof Z?e:new Z(e,r);if(S.throwOnInvalid)throw new ys(n);return new y({invalid:n})}static isDateTime(e){return e&&e.isLuxonDateTime||!1}static parseFormatForOpts(e,r={}){const n=Vn(e,x.fromObject(r));return n?n.map(s=>s?s.val:null).join(""):null}static expandFormat(e,r={}){return Ln($.parseFormat(e),x.fromObject(r)).map(s=>s.val).join("")}static resetCache(){ve=void 0,It.clear()}get(e){return this[e]}get isValid(){return this.invalid===null}get invalidReason(){return this.invalid?this.invalid.reason:null}get invalidExplanation(){return this.invalid?this.invalid.explanation:null}get locale(){return this.isValid?this.loc.locale:null}get numberingSystem(){return this.isValid?this.loc.numberingSystem:null}get outputCalendar(){return this.isValid?this.loc.outputCalendar:null}get zone(){return this._zone}get zoneName(){return this.isValid?this.zone.name:null}get year(){return this.isValid?this.c.year:NaN}get quarter(){return this.isValid?Math.ceil(this.c.month/3):NaN}get month(){return this.isValid?this.c.month:NaN}get day(){return this.isValid?this.c.day:NaN}get hour(){return this.isValid?this.c.hour:NaN}get minute(){return this.isValid?this.c.minute:NaN}get second(){return this.isValid?this.c.second:NaN}get millisecond(){return this.isValid?this.c.millisecond:NaN}get weekYear(){return this.isValid?at(this).weekYear:NaN}get weekNumber(){return this.isValid?at(this).weekNumber:NaN}get weekday(){return this.isValid?at(this).weekday:NaN}get isWeekend(){return this.isValid&&this.loc.getWeekendDays().includes(this.weekday)}get localWeekday(){return this.isValid?lt(this).weekday:NaN}get localWeekNumber(){return this.isValid?lt(this).weekNumber:NaN}get localWeekYear(){return this.isValid?lt(this).weekYear:NaN}get ordinal(){return this.isValid?st(this.c).ordinal:NaN}get monthShort(){return this.isValid?Le.months("short",{locObj:this.loc})[this.month-1]:null}get monthLong(){return this.isValid?Le.months("long",{locObj:this.loc})[this.month-1]:null}get weekdayShort(){return this.isValid?Le.weekdays("short",{locObj:this.loc})[this.weekday-1]:null}get weekdayLong(){return this.isValid?Le.weekdays("long",{locObj:this.loc})[this.weekday-1]:null}get offset(){return this.isValid?+this.o:NaN}get offsetNameShort(){return this.isValid?this.zone.offsetName(this.ts,{format:"short",locale:this.locale}):null}get offsetNameLong(){return this.isValid?this.zone.offsetName(this.ts,{format:"long",locale:this.locale}):null}get isOffsetFixed(){return this.isValid?this.zone.isUniversal:null}get isInDST(){return this.isOffsetFixed?!1:this.offset>this.set({month:1,day:1}).offset||this.offset>this.set({month:5}).offset}getPossibleOffsets(){if(!this.isValid||this.isOffsetFixed)return[this];const e=864e5,r=6e4,n=Ge(this.c),s=this.zone.offset(n-e),i=this.zone.offset(n+e),o=this.zone.offset(n-s*r),a=this.zone.offset(n-i*r);if(o===a)return[this];const l=n-o*r,c=n-a*r,u=Fe(l,o),d=Fe(c,a);return u.hour===d.hour&&u.minute===d.minute&&u.second===d.second&&u.millisecond===d.millisecond?[K(this,{ts:l}),K(this,{ts:c})]:[this]}get isInLeapYear(){return Ee(this.year)}get daysInMonth(){return je(this.year,this.month)}get daysInYear(){return this.isValid?ae(this.year):NaN}get weeksInWeekYear(){return this.isValid?ke(this.weekYear):NaN}get weeksInLocalWeekYear(){return this.isValid?ke(this.localWeekYear,this.loc.getMinDaysInFirstWeek(),this.loc.getStartOfWeek()):NaN}resolvedLocaleOptions(e={}){const{locale:r,numberingSystem:n,calendar:s}=$.create(this.loc.clone(e),e).resolvedOptions(this);return{locale:r,numberingSystem:n,outputCalendar:s}}toUTC(e=0,r={}){return this.setZone(M.instance(e),r)}toLocal(){return this.setZone(S.defaultZone)}setZone(e,{keepLocalTime:r=!1,keepCalendarTime:n=!1}={}){if(e=Y(e,S.defaultZone),e.equals(this.zone))return this;if(e.isValid){let s=this.ts;if(r||n){const i=e.offset(this.ts),o=this.toObject();[s]=Ue(o,i,e)}return K(this,{ts:s,zone:e})}else return y.invalid(be(e))}reconfigure({locale:e,numberingSystem:r,outputCalendar:n}={}){const s=this.loc.clone({locale:e,numberingSystem:r,outputCalendar:n});return K(this,{loc:s})}setLocale(e){return this.reconfigure({locale:e})}set(e){if(!this.isValid)return this;const r=Be(e,pr),{minDaysInFirstWeek:n,startOfWeek:s}=nr(r,this.loc),i=!g(r.weekYear)||!g(r.weekNumber)||!g(r.weekday),o=!g(r.ordinal),a=!g(r.year),l=!g(r.month)||!g(r.day),c=a||l,u=r.weekYear||r.weekNumber;if((c||o)&&u)throw new oe("Can't mix weekYear/weekNumber units with year/month/day or ordinals");if(l&&o)throw new oe("Can't mix ordinal dates with month/day");let d;i?d=tr({...He(this.c,n,s),...r},n,s):g(r.ordinal)?(d={...this.toObject(),...r},g(r.day)&&(d.day=Math.min(je(d.year,d.month),d.day))):d=rr({...st(this.c),...r});const[m,f]=Ue(d,this.o,this.zone);return K(this,{ts:m,o:f})}plus(e){if(!this.isValid)return this;const r=b.fromDurationLike(e);return K(this,gr(this,r))}minus(e){if(!this.isValid)return this;const r=b.fromDurationLike(e).negate();return K(this,gr(this,r))}startOf(e,{useLocaleWeeks:r=!1}={}){if(!this.isValid)return this;const n={},s=b.normalizeUnit(e);switch(s){case"years":n.month=1;case"quarters":case"months":n.day=1;case"weeks":case"days":n.hour=0;case"hours":n.minute=0;case"minutes":n.second=0;case"seconds":n.millisecond=0;break}if(s==="weeks")if(r){const i=this.loc.getStartOfWeek(),{weekday:o}=this;o<i&&(n.weekNumber=this.weekNumber-1),n.weekday=i}else n.weekday=1;if(s==="quarters"){const i=Math.ceil(this.month/3);n.month=(i-1)*3+1}return this.set(n)}endOf(e,r){return this.isValid?this.plus({[e]:1}).startOf(e,r).minus(1):this}toFormat(e,r={}){return this.isValid?$.create(this.loc.redefaultToEN(r)).formatDateTimeFromString(this,e):ot}toLocaleString(e=ze,r={}){return this.isValid?$.create(this.loc.clone(r),e).formatDateTime(this):ot}toLocaleParts(e={}){return this.isValid?$.create(this.loc.clone(e),e).formatDateTimeParts(this):[]}toISO({format:e="extended",suppressSeconds:r=!1,suppressMilliseconds:n=!1,includeOffset:s=!0,extendedZone:i=!1,precision:o="milliseconds"}={}){if(!this.isValid)return null;o=qe(o);const a=e==="extended";let l=ct(this,a,o);return Re.indexOf(o)>=3&&(l+="T"),l+=yr(this,a,r,n,s,i,o),l}toISODate({format:e="extended",precision:r="day"}={}){return this.isValid?ct(this,e==="extended",qe(r)):null}toISOWeekDate(){return Ve(this,"kkkk-'W'WW-c")}toISOTime({suppressMilliseconds:e=!1,suppressSeconds:r=!1,includeOffset:n=!0,includePrefix:s=!1,extendedZone:i=!1,format:o="extended",precision:a="milliseconds"}={}){return this.isValid?(a=qe(a),(s&&Re.indexOf(a)>=3?"T":"")+yr(this,o==="extended",r,e,n,i,a)):null}toRFC2822(){return Ve(this,"EEE, dd LLL yyyy HH:mm:ss ZZZ",!1)}toHTTP(){return Ve(this.toUTC(),"EEE, dd LLL yyyy HH:mm:ss 'GMT'")}toSQLDate(){return this.isValid?ct(this,!0):null}toSQLTime({includeOffset:e=!0,includeZone:r=!1,includeOffsetSpace:n=!0}={}){let s="HH:mm:ss.SSS";return(r||e)&&(n&&(s+=" "),r?s+="z":e&&(s+="ZZ")),Ve(this,s,!0)}toSQL(e={}){return this.isValid?`${this.toSQLDate()} ${this.toSQLTime(e)}`:null}toString(){return this.isValid?this.toISO():ot}[Symbol.for("nodejs.util.inspect.custom")](){return this.isValid?`DateTime { ts: ${this.toISO()}, zone: ${this.zone.name}, locale: ${this.locale} }`:`DateTime { Invalid, reason: ${this.invalidReason} }`}valueOf(){return this.toMillis()}toMillis(){return this.isValid?this.ts:NaN}toSeconds(){return this.isValid?this.ts/1e3:NaN}toUnixInteger(){return this.isValid?Math.floor(this.ts/1e3):NaN}toJSON(){return this.toISO()}toBSON(){return this.toJSDate()}toObject(e={}){if(!this.isValid)return{};const r={...this.c};return e.includeConfig&&(r.outputCalendar=this.outputCalendar,r.numberingSystem=this.loc.numberingSystem,r.locale=this.loc.locale),r}toJSDate(){return new Date(this.isValid?this.ts:NaN)}diff(e,r="milliseconds",n={}){if(!this.isValid||!e.isValid)return b.invalid("created by diffing an invalid DateTime");const s={locale:this.locale,numberingSystem:this.numberingSystem,...n},i=Bs(r).map(b.normalizeUnit),o=e.valueOf()>this.valueOf(),a=o?this:e,l=o?e:this,c=Ji(a,l,i,s);return o?c.negate():c}diffNow(e="milliseconds",r={}){return this.diff(y.now(),e,r)}until(e){return this.isValid?k.fromDateTimes(this,e):this}hasSame(e,r,n){if(!this.isValid)return!1;const s=e.valueOf(),i=this.setZone(e.zone,{keepLocalTime:!0});return i.startOf(r,n)<=s&&s<=i.endOf(r,n)}equals(e){return this.isValid&&e.isValid&&this.valueOf()===e.valueOf()&&this.zone.equals(e.zone)&&this.loc.equals(e.loc)}toRelative(e={}){if(!this.isValid)return null;const r=e.base||y.fromObject({},{zone:this.zone}),n=e.padding?this<r?-e.padding:e.padding:0;let s=["years","months","days","hours","minutes","seconds"],i=e.unit;return Array.isArray(e.unit)&&(s=e.unit,i=void 0),br(r,this.plus(n),{...e,numeric:"always",units:s,unit:i})}toRelativeCalendar(e={}){return this.isValid?br(e.base||y.fromObject({},{zone:this.zone}),this,{...e,numeric:"auto",units:["years","months","days"],calendary:!0}):null}static min(...e){if(!e.every(y.isDateTime))throw new C("min requires all arguments be DateTimes");return sr(e,r=>r.valueOf(),Math.min)}static max(...e){if(!e.every(y.isDateTime))throw new C("max requires all arguments be DateTimes");return sr(e,r=>r.valueOf(),Math.max)}static fromFormatExplain(e,r,n={}){const{locale:s=null,numberingSystem:i=null}=n,o=x.fromOpts({locale:s,numberingSystem:i,defaultToEN:!0});return Fn(o,e,r)}static fromStringExplain(e,r,n={}){return y.fromFormatExplain(e,r,n)}static buildFormatParser(e,r={}){const{locale:n=null,numberingSystem:s=null}=r,i=x.fromOpts({locale:n,numberingSystem:s,defaultToEN:!0});return new An(i,e)}static fromFormatParser(e,r,n={}){if(g(e)||g(r))throw new C("fromFormatParser requires an input string and a format parser");const{locale:s=null,numberingSystem:i=null}=n,o=x.fromOpts({locale:s,numberingSystem:i,defaultToEN:!0});if(!o.equals(r.locale))throw new C(`fromFormatParser called with a locale of ${o}, but the format parser was created for ${r.locale}`);const{result:a,zone:l,specificOffset:c,invalidReason:u}=r.explainFromTokens(e);return u?y.invalid(u):se(a,l,n,`format ${r.format}`,e,c)}static get DATE_SHORT(){return ze}static get DATE_MED(){return Wr}static get DATE_MED_WITH_WEEKDAY(){return bs}static get DATE_FULL(){return Ur}static get DATE_HUGE(){return Rr}static get TIME_SIMPLE(){return qr}static get TIME_WITH_SECONDS(){return Zr}static get TIME_WITH_SHORT_OFFSET(){return zr}static get TIME_WITH_LONG_OFFSET(){return Hr}static get TIME_24_SIMPLE(){return jr}static get TIME_24_WITH_SECONDS(){return Br}static get TIME_24_WITH_SHORT_OFFSET(){return _r}static get TIME_24_WITH_LONG_OFFSET(){return Yr}static get DATETIME_SHORT(){return Jr}static get DATETIME_SHORT_WITH_SECONDS(){return Gr}static get DATETIME_MED(){return Kr}static get DATETIME_MED_WITH_SECONDS(){return Qr}static get DATETIME_MED_WITH_WEEKDAY(){return vs}static get DATETIME_FULL(){return Xr}static get DATETIME_FULL_WITH_SECONDS(){return en}static get DATETIME_HUGE(){return tn}static get DATETIME_HUGE_WITH_SECONDS(){return rn}}function pe(t){if(y.isDateTime(t))return t;if(t&&t.valueOf&&J(t.valueOf()))return y.fromJSDate(t);if(t&&typeof t=="object")return y.fromObject(t);throw new C(`Unknown datetime argument: ${t}, of type ${typeof t}`)}function go(t){return!!t&&typeof t=="object"&&Array.isArray(t.data)}async function yo(t=[]){const e=Number(t[0]);if(isNaN(e))return'<p class="text-red-500 text-center p-10">Invalid post ID</p>';const r=await Lr();let n=[];if(Array.isArray(r))n=r;else if(go(r))n=r.data;else return'<p class="text-red-500 text-center p-10">Error loading post</p>';const s=n.find(f=>Number(f.id)===e);if(!s)return'<p class="text-red-500 text-center p-10">Post not found</p>';const i=y.fromISO(s.createdAt||new Date().toISOString()).toRelative({locale:"en"})||"just now",o=!!s.isLiked,a=o?"text-pink-600 animate__animated animate__heartBeat":"text-pink-500",l=s._count?.reactions??s.reactions?.length??0,c=s._count?.comments??s.comments?.length??0,u=!!s.isFollowing,d=u?"Unfollow":"Follow",m=u?"bg-red-500 hover:bg-red-600":"bg-blue-500 hover:bg-blue-600";return`
  <div class="min-h-screen flex flex-col bg-gray-900 text-white">
    <div class="flex-grow flex items-center justify-center p-4 overflow-auto">
      <article class="max-w-2xl w-full bg-white rounded-xl shadow-md overflow-hidden p-6 text-gray-900 flex flex-col"
              style="max-height: 90vh; min-height: 700px;">

        <!-- Header -->
        <div class="flex items-center mb-6 justify-between">
          <div class="flex items-center">
            <div class="w-14 h-14 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center mr-4">
              <img
                src="${s.media?.url?s.media.url:`https://i.pravatar.cc/100?u=${s.userId}`}"
                alt="${s.author||`user${s.userId}`}'s avatar"
                class="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-800">${s.title}</h1>
              <p class="text-sm text-gray-500">
                ${i} • By 
                <span class="font-semibold">${s.author||`@user${s.userId}`}</span>
              </p>
            </div>
          </div>
          <button
            class="follow-btn text-white cursor-pointer px-3 py-1 rounded ${m} text-lg font-semibold transition-colors"
            data-authorid="${s.userId}"
            aria-label="${d} ${s.author||`user${s.userId}`}"
            type="button"
          >
            ${d}
          </button>
        </div>

        <!-- Image -->
        ${s.media?.url?`<div class="mb-6 flex-shrink-0">
                <img
                  src="${s.media.url}"
                  alt="${s.media.alt||"Post image"}"
                  class="w-full rounded-lg object-cover shadow-md max-h-[41vh] mx-auto"
                />
              </div>`:""}

        <!-- Body -->
        <p class="text-gray-900 text-lg leading-relaxed flex-grow overflow-auto">
          ${s.body??""}
        </p>

        <!-- Tags -->
        ${s.tags?.length?`<div class="flex flex-wrap gap-3 mb-6">
                ${s.tags.map(f=>`<span class="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full cursor-default">#${f}</span>`).join("")}
              </div>`:""}

        <!-- Footer -->
        <div class="flex items-center justify-between mt-auto pt-2 border-t border-gray-200">
          <button
            class="like-btn flex items-center ${a} hover:text-pink-600 transition-colors"
            data-postid="${s.id}"
            aria-pressed="${o}"
            aria-label="Like post"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" class="w-6 h-6 mr-2">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
            </svg>
            <span class="font-semibold text-lg like-count">${l}</span>
          </button>

          <div class="flex items-center text-gray-600 text-sm cursor-pointer js-comments-count" role="button" tabindex="0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="w-5 h-5 mr-1">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2h-8l-4 4v-4H7a2 2 0 01-2-2v-2"/>
            </svg>
            <span class="comments-count">${c}</span>
          </div>

          <button id="back-to-feed" class="text-blue-600 hover:underline text-lg font-semibold cursor-pointer" type="button">
            ← Back to Feed
          </button>
        </div>

        <!-- Comments section -->
        <section id="comments-section" class="mt-2">
          <h2 class="text-lg font-semibold text-gray-800 mb-3">Comments</h2>
          <div id="comments-list" class="space-y-3">
            <div class="text-sm text-gray-500">Loading comments…</div>
          </div>
        </section>

        <!-- Comment Form -->
        <form id="comment-form" class="mt-4">
          <textarea id="comment-text" placeholder="Write a comment..." required
            class="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="1"></textarea>
          <button type="submit"
            class="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Post Comment
          </button>
        </form>

      </article>
    </div>
  </div>
  `}function po(){const t=localStorage.getItem("name");if(t)try{return JSON.parse(t)}catch{return t}const e=localStorage.getItem("username");if(e)try{return JSON.parse(e)}catch{return e}const r=ee();if(!r)return null;try{const n=JSON.parse(atob(r.split(".")[1]||""));if(n&&typeof n.name=="string")return n.name}catch{}return null}function q(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}async function wo(){const t=po();if(!t)return`
         <main class="min-h-dvh bg-gray-900 text-gray-100 p-8">
        <h1 class="text-3xl font-bold mb-6">Your Profile</h1>
        <p class="opacity-80">
          No username found. Please log in again or set it manually:
          <code>localStorage.setItem('name', JSON.stringify('YourName'))</code>
        </p>
        <a class="inline-block mt-6 underline" href="/login">→ Go to Login</a>
      </main>
    `;let e;try{e=await Ze(`/profiles/${encodeURIComponent(t)}`)}catch(d){return`
    <main class="min-h-dvh bg-gray-900 text-gray-100 p-8">
        <h1 class="text-3xl font-bold mb-6">Your Profile</h1>
        <div class="p-4 rounded bg-red-900/30 border border-red-700">
          <div class="font-semibold mb-1">Error loading profile</div>
          <code class="text-sm break-all">${q(d?.message??String(d))}</code>
        </div>
        <p class="mt-4 opacity-80">Check your token / API key.</p>
      </main>
    `}let r=[];try{const d=await Ze(`/profiles/${encodeURIComponent(t)}/posts?sort=created&sortOrder=desc`);r=Array.isArray(d)?d:Array.isArray(d?.data)?d.data:[]}catch{r=[]}const n=e?.data??{},s=(typeof n?.avatar=="string"?n.avatar:n?.avatar?.url)||"./profile-avatar.png",i=n?.name||t||"Anonymous",o=n?.bio||"Welcome to my page!",a=n?._count?.followers??0,l=n?._count?.following??0,c=n?._count?.posts??r.length??0,u=`
   <main class="relative min-h-dvh bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-gray-100">
  
  <!-- 🔹 Sticky Header -->
  <header class="sticky top-0 z-50 w-full bg-gray-900/70 backdrop-blur-md border-b border-gray-800 shadow-sm">
    <div class="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
      <!-- Left: Nav -->
      <nav class="flex items-center gap-6">
        <a href="/feed" 
           class="text-gray-300 hover:text-blue-400 md:text-lg font-medium transition-colors duration-200">
          🏠 Feed
        </a>
        <a href="/profile"
           class="text-gray-300 hover:text-blue-400 md:text-lg font-medium transition-colors duration-200">
          👤 Profile
        </a>
      </nav>

      <!-- Center: Profile Name -->
      <h1 class="text-lg sm:text-xl font-semibold text-blue-300 tracking-tight">
        ${q(i)}
      </h1>

      <!-- Right: Logout -->
      <button id="logout-btn"
              class="px-4 py-1.5 rounded-md bg-red-600/90 hover:bg-red-500 text-white font-medium text-sm transition-colors duration-200 cursor-pointer md:text-lg">
        Logout
      </button>
    </div>
  </header>

  <!-- 🔹 Profile Header Card -->

  <section class="px-4 sm:px-6 py-10">
    <header class="max-w-3xl mx-auto mt-6 rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md p-8 sm:p-10 shadow-xl hover:shadow-2xl transition-all duration-300">
      <div class="flex flex-col items-center text-center gap-5">
        <div class="relative">
          <img src="${q(s)}" alt="${q(typeof e?.avatar=="string"?"Avatar":e?.avatar?.alt??"Avatar")}"
               class="w-25 h-25 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-800 shadow-lg hover:scale-105 transition-transform duration-300"/>
        </div>

        <div>
          <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
            ${q(i)}
          </h2>
          <p class="opacity-80 text-sm sm:text-base mt-3 max-w-md mx-auto leading-relaxed">
            ${q(o)}
          </p>

          <div class="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-300">
            <span class="cursor-pointer text-md lg:text-lg bg-gray-800/50 px-4 py-2 rounded-lg hover:bg-gray-700/60 transition"><span class="text-blue-400 text-lg">👥</span> Followers: <b>${a}</b></span>
            <span class="cursor-pointer text-md lg:text-lg bg-gray-800/50 px-4 py-2 rounded-lg hover:bg-gray-700/60 transition"><span class="text-green-400 text-lg">⭐</span> Following: <b>${l}</b></span>
            <span class="cursor-pointer text-md lg:text-lg bg-gray-800/50 px-4 py-2 rounded-lg hover:bg-gray-700/60 transition"><span class="text-yellow-400 text-lg">📝</span> Posts: <b>${c}</b></span>
          </div>

          <div class="mt-6">
            <button id="toggle-create"
                    class="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600
                           text-white font-medium shadow hover:from-blue-500 hover:to-indigo-500 
                           transition-all duration-200 cursor-pointer">
              + New Post
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 🔹 Post Editor -->
    <section id="editor" class="max-w-2xl mx-auto mt-10 hidden">
      <div class="rounded-2xl border border-gray-800 bg-gray-900/70 backdrop-blur-md p-6 sm:p-8 shadow-2xl">
        <h2 id="editor-title" class="text-xl font-semibold mb-4 text-blue-300">Create a new post</h2>
        <form id="post-form" class="space-y-4">
          <input type="hidden" id="postId" value="">

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-300">Title <span class="text-red-400">*</span></label>
            <input id="title" required
                   class="w-full p-2.5 rounded-lg border border-gray-700 bg-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-300">Body</label>
            <textarea id="body" rows="6"
                      class="w-full p-2.5 rounded-lg border border-gray-700 bg-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-300">Image URL</label>
              <input id="imgUrl"
                     class="w-full p-2.5 rounded-lg border border-gray-700 bg-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                     placeholder="https://..." />
            </div>
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-300">Image ALT</label>
              <input id="imgAlt"
                     class="w-full p-2.5 rounded-lg border border-gray-700 bg-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
            </div>
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-300">Tags (comma separated)</label>
            <input id="tags"
                   class="w-full p-2.5 rounded-lg border border-gray-700 bg-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                   placeholder="news, cats" />
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button type="submit" id="save-btn"
                    class="px-5 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium hover:from-green-500 hover:to-emerald-500 transition-all cursor-pointer">
              Create
            </button>
            <button type="button" id="cancel-edit"
                    class="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all cursor-pointer">
              Cancel
            </button>
            <button type="button" id="reset-edit"
                    class="px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 hover:bg-gray-700 transition-all cursor-pointer">
              Reset
            </button>
            <span id="msg" class="text-sm opacity-80 ml-2 text-yellow-400"></span>
          </div>
        </form>
      </div>
    </section>

    <!-- 🔹 Posts -->
    <section class="max-w-6xl mx-auto mt-12">
      <div class="flex items-center gap-2 mb-5">
        <span class="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gray-800 border border-gray-700 text-blue-400">🗂️</span>
        <h2 class="text-xl font-semibold text-gray-200">Your Posts</h2>
      </div>

      <div id="posts" class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        ${r.length?r.map(d=>{const m=Array.isArray(d.media)?d.media?.[0]?.url:d.media?.url,f=d.author?.name===e.name,w=d.created?new Date(d.created).toLocaleString():"",E=Array.isArray(d.tags)&&d.tags.length?`<div class="flex flex-wrap gap-1 mt-2">${d.tags.slice(0,5).map(O=>`<span class="text-xs px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-gray-300">${q(O)}</span>`).join("")}</div>`:"";return`
                  <article class="rounded-2xl bg-gray-900/60 border border-gray-800 p-5 shadow-lg hover:shadow-blue-900/30 hover:border-blue-600/50 transition-all duration-300">
                    ${m?`<img class="w-full h-48 object-cover rounded-lg mb-4 border border-gray-800" src="${q(m)}" alt="">`:""}
                    <h3 class="font-semibold text-lg mb-1 text-gray-100">${q(d.title)}</h3>
                    <div class="text-xs text-gray-400 mb-2">${q(w)}</div>
                    <div class="text-sm text-gray-300 line-clamp-3">${q(d.body??"")}</div>
                    ${E}
                    ${f?`<div class="flex gap-2 mt-4">
                             <button class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 transition-all js-edit cursor-pointer" data-id="${d.id}">Edit</button>
                             <button class="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 transition-all js-delete cursor-pointer" data-id="${d.id}">Delete</button>
                           </div>`:""}
                  </article>
                `}).join(""):'<p class="opacity-70 text-gray-400 italic">No posts yet. Create your first one!</p>'}
      </div>
    </section>
  </section>

  <!-- 🔹 Bottom Back Link -->
  <div class="max-w-6xl mx-auto text-center pb-10">
    <a href="/feed"
       class="inline-flex items-center gap-2 text-lg font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200">
      ← Back to Feed
    </a>
  </div>
</main>

  `;return xo(),u}function p(t){return document.querySelector(t)}function bo(){const t=p("#editor"),e=p("#editor-title"),r=p("#postId"),n=p("#save-btn"),s=p("#msg"),i=p("#title"),o=p("#body"),a=p("#imgUrl"),l=p("#imgAlt"),c=p("#tags");t?.classList.remove("hidden"),e&&(e.textContent="Create a new post"),n&&(n.textContent="Create"),r&&(r.value=""),s&&(s.textContent=""),i&&(i.value=""),o&&(o.value=""),a&&(a.value=""),l&&(l.value=""),c&&(c.value=""),i?.focus()}function vo(t){const e=p("#editor"),r=p("#editor-title"),n=p("#postId"),s=p("#save-btn"),i=p("#msg"),o=p("#post-form"),a=p("#title"),l=p("#body"),c=p("#imgUrl"),u=p("#imgAlt"),d=p("#tags");e?.classList.remove("hidden"),r&&(r.textContent=`Edit post #${t.id}`),s&&(s.textContent="Save changes"),n&&(n.value=String(t.id)),i&&(i.textContent="");const m=Array.isArray(t.media)?t.media?.[0]:t.media||{},f={id:t?.id??"",title:t?.title??"",body:t?.body??"",imgUrl:m?.url??"",imgAlt:m?.alt??"",tags:Array.isArray(t?.tags)?t.tags:[]};a&&(a.value=f.title),l&&(l.value=f.body),c&&(c.value=f.imgUrl),u&&(u.value=f.imgAlt),d&&(d.value=f.tags.join(", ")),o&&(o.dataset.original=JSON.stringify(f)),a?.focus()}function xr(){const t=p("#editor"),e=p("#postId"),r=p("#msg");t?.classList.add("hidden"),e&&(e.value=""),r&&(r.textContent="")}function xo(){window.__profileHandlersWired||(window.__profileHandlersWired=!0,document.addEventListener("click",async t=>{const e=t.target;if(e.closest("#logout-btn")){t.preventDefault();try{localStorage.clear(),sessionStorage.clear(),L("/login")}catch(s){console.error("Logout failed:",s)}return}if(e.closest('a[href="/feed"]')){t.preventDefault(),L("/feed");return}if(e.closest("#toggle-create")){const s=p("#editor");if(!s)return;s.classList.contains("hidden")?bo():xr();return}if(e.closest("#cancel-edit")){if(!p("#editor"))return;xr();return}if(e.closest("#reset-edit")){const s=p("#post-form");if(!s?.dataset.original)return;const i=JSON.parse(s.dataset.original);p("#title").value=i.title||"",p("#body").value=i.body||"",p("#imgUrl").value=i.imgUrl||"",p("#imgAlt").value=i.imgAlt||"",p("#tags").value=Array.isArray(i.tags)?i.tags.join(", "):"";return}const r=e.closest(".js-edit");if(r){const s=r.getAttribute("data-id");if(!s)return;try{const i=await Ze(`/posts/${s}?_author=true&_reactions=true&_comments=true`),o=i?.data??i;vo({id:o?.id??s,title:o?.title??"",body:o?.body??"",tags:Array.isArray(o?.tags)?o.tags:[],media:o?.media??null})}catch{alert("Failed to load post for edit")}return}const n=e.closest(".js-delete");if(n){const s=n.getAttribute("data-id");if(!s||!confirm("Delete this post? This cannot be undone."))return;try{await $r(`/posts/${s}`),L("/profile")}catch(i){alert(`Delete failed: ${i?.message??String(i)}`)}return}}),document.addEventListener("submit",async t=>{if(t.target?.id!=="post-form")return;t.preventDefault();const r=p("#save-btn"),n=p("#msg"),s=p("#postId"),i=p("#title"),o=p("#body"),a=p("#imgUrl"),l=p("#imgAlt"),c=p("#tags");if(!i||!r||!n)return;const u=s?.value?.trim(),d=i.value.trim(),m=o?.value?.trim()||"",f=a?.value?.trim()||"",w=l?.value?.trim()||"",E=c?.value?.trim()||"",O=E?E.split(",").map(A=>A.trim()).filter(Boolean):[];if(!d){n.textContent="Title is required.";return}const N={title:d};m&&(N.body=m),O.length&&(N.tags=O),N.media=f?{url:f,...w?{alt:w}:{}}:null;try{r.disabled=!0,r.textContent=u?"Saving…":"Creating…",n.textContent="",u?await Cr(`/posts/${u}`,N):await _e("/posts",N),L("/profile")}catch(A){n.textContent=`Error: ${A?.message??String(A)}`}finally{r.disabled=!1,r.textContent=u?"Save changes":"Create"}}))}async function kr(t,e="❤️"){await Cr(`/posts/${t}/react/${encodeURIComponent(e)}`,{})}async function Sr(t,e,r){const n={body:e};return _e(`/posts/${t}/comment`,n)}async function Tr(t,e){await $r(`/posts/${t}/comment/${e}`)}const I={show:"Show",hide:"Hide",liked:"Liked",unliked:"Removed like",addComment:"Comment added",delComment:"Comment deleted",reactError:"Could not react to the post.",addError:"Could not add the comment.",delError:"Could not delete the comment.",notYours:"You can delete only your own comments.",sending:"Sending…",justNow:"Just now",you:"you",undo:"UNDO"},ut="https://placehold.co/32x32?text=%20";function Er(){try{const t=ee();if(!t)return null;const e=t.split(".")[1];if(!e)return null;let r=e.replace(/-/g,"+").replace(/_/g,"/");for(;r.length%4;)r+="=";const n=JSON.parse(atob(r)),s=n?.name??n?.username??n?.user_name??n?.sub;return typeof s=="string"?s:null}catch{return null}}function ie(t){return(typeof t=="string"?t:t==null?"":String(t)).replace(/[&<>"']/g,r=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[r])}function Pe(t){console.warn(t)}function dt(t,e,r=5e3){const n=document.createElement("div");n.className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-purple-500 text-white shadow-lg flex items-center gap-4",n.innerHTML=`<span>${t}</span>
    <button type="button" data-undo class="px-3 py-1 rounded bg-white/10 hover:bg-purple-700 cursor-pointer transition">${I.undo}</button>`,document.body.appendChild(n);let s=!1;const i=setTimeout(()=>{s||document.body.removeChild(n)},r);n.querySelector("[data-undo]").addEventListener("click",async()=>{s=!0,clearTimeout(i);try{await e()}finally{document.body.removeChild(n)}})}let Or=!1;function Nt(){Or||(Or=!0,document.addEventListener("click",t=>{const e=t.target.closest("[data-comments-toggle]");if(!e)return;const n=e.closest("[data-post]")?.querySelector("[data-comment-list]");if(!n)return;const s=e.querySelector("span.underline"),i=n.classList.contains("hidden");n.classList.toggle("hidden",!i),s&&(s.textContent=i?I.hide:I.show)}),document.addEventListener("click",async t=>{const e=t.target.closest("[data-like-btn]");if(!e||e.dataset.busy==="1")return;const r=Number(e.dataset.postId);if(!Number.isFinite(r))return;const n=e.dataset.symbol||"❤️",i=e.closest("[data-post]")?.querySelector("[data-like-count]"),o=e.classList.contains("is-liked")||e.getAttribute("aria-pressed")==="true"||e.dataset.liked==="1";if(e.dataset.busy="1",i){const a=Number(i.innerText||"0");i.innerText=String(o?Math.max(0,a-1):a+1)}e.classList.toggle("is-liked",!o),e.setAttribute("aria-pressed",String(!o)),e.dataset.liked=o?"0":"1";try{await kr(r,n),dt(o?I.unliked:I.liked,async()=>{e.dataset.busy="1";try{if(await kr(r,n),e.classList.toggle("is-liked",o),e.setAttribute("aria-pressed",String(o)),e.dataset.liked=o?"1":"0",i){const a=Number(i.innerText||"0");i.innerText=String(o?a+1:Math.max(0,a-1))}}finally{e.dataset.busy="0"}})}catch(a){if(e.classList.toggle("is-liked",o),e.setAttribute("aria-pressed",String(o)),e.dataset.liked=o?"1":"0",i){const l=Number(i.innerText||"0");i.innerText=String(o?l+1:Math.max(0,l-1))}console.error("Reaction failed",a),Pe(I.reactError)}finally{e.dataset.busy="0"}}),document.addEventListener("submit",async t=>{const e=t.target.closest("[data-comment-form]");if(!e)return;t.preventDefault();const r=Number(e.dataset.postId);if(!Number.isFinite(r))return;const n=e.querySelector('[name="comment"]');if(!n)return;const s=String(n.value||"").trim();if(!s)return;const i=e.closest("[data-post]"),o=i?.querySelector("[data-comment-list]");if(!o)return;if(o.classList.contains("hidden")){o.classList.remove("hidden");const d=i?.querySelector("[data-comments-toggle] .underline");d&&(d.textContent=I.hide)}const a=Er()||"",l=a||I.you,c=`temp-${Date.now()}`,u=document.createElement("li");u.dataset.id=c,u.dataset.owner=a,u.className="comment pending rounded-lg bg-white/5 p-3",u.innerHTML=`
      <div class="flex items-start gap-3">
        <img src="${ut}" class="size-8 rounded-full" alt="" />
        <div class="flex-1">
          <div class="text-sm">
            <span class="font-semibold">@${ie(l)}</span>
            <span class="opacity-70">• ${I.justNow}</span>
            <span class="opacity-60 ml-2" data-sending>${I.sending}</span>
          </div>
          <div class="comment-body whitespace-pre-wrap">${ie(s)}</div>
        </div>
      </div>
    `,o.prepend(u);try{const d=await Sr(r,s);u.dataset.id=String(d.id),u.dataset.owner=d.owner??a,u.classList.remove("pending"),u.innerHTML=`
        <div class="flex items-start gap-3">
          <img src="${d.author?.avatar||ut}" class="size-8 rounded-full" alt="" />
          <div class="flex-1">
            <div class="text-sm">
              <span class="font-semibold">@${ie(d.owner??l)}</span>
              <span class="opacity-70">• ${d.created?new Date(d.created).toLocaleString():I.justNow}</span>
            </div>
            <div class="comment-body whitespace-pre-wrap">${ie(d.body)}</div>
            <div class="mt-2">
              <button type="button" class="text-xs opacity-70 hover:opacity-100"
                      data-delete-comment data-post-id="${r}" data-comment-id="${d.id}">
                Delete
              </button>
            </div>
          </div>
        </div>
      `,requestAnimationFrame(()=>{u.scrollIntoView({behavior:"smooth",block:"nearest"})}),dt(I.addComment,async()=>{await Tr(r,d.id),u.remove()})}catch(d){u.remove(),console.error("Add comment failed",d),Pe(I.addError)}finally{n.value=""}}),document.addEventListener("click",async t=>{const e=t.target.closest("[data-delete-comment]");if(!e)return;const r=Er(),n=e.closest("li[data-id]"),s=n?.getAttribute("data-owner")||"";if(!r||s!==r){Pe(I.notYours);return}const i=Number(e.dataset.postId),o=Number(e.dataset.commentId);if(!n||!Number.isFinite(i)||!Number.isFinite(o))return;const a=n.querySelector(".comment-body")?.textContent??"";n.classList.add("opacity-50");try{await Tr(i,o),n.remove(),dt(I.delComment,async()=>{const l=await Sr(i,a),c=document.querySelector(`[data-post-id="${i}"] [data-comment-list]`);if(!c)return;const u=document.createElement("li");u.dataset.id=String(l.id),u.dataset.owner=r,u.className="comment rounded-lg bg-white/5 p-3",u.innerHTML=`
          <div class="flex items-start gap-3">
            <img src="${l.author?.avatar||ut}" class="size-8 rounded-full" alt="" />
            <div class="flex-1">
              <div class="text-sm">
                <span class="font-semibold">@${ie(l.owner??r??I.you)}</span>
                <span class="opacity-70">• ${l.created?new Date(l.created).toLocaleString():I.justNow}</span>
              </div>
              <div class="comment-body whitespace-pre-wrap">${ie(l.body)}</div>
              <div class="mt-2">
                <button type="button" class="text-xs opacity-70 hover:opacity-100"
                        data-delete-comment data-post-id="${i}" data-comment-id="${l.id}">
                  Delete
                </button>
              </div>
            </div>
          </div>
        `,c.prepend(u)})}catch(l){n.classList.remove("opacity-50"),console.error("Delete comment failed",l),Pe(I.delError)}}))}Nt();function ko(t=[],e){t.forEach(r=>{if(r.isIntersecting){const n=r.target;n.src=n.dataset.src,n.classList.remove(Nr),e.unobserve(n)}})}function So(t=Nr,e="15%"){const r=document.querySelectorAll(`.${t}`),n={root:null,rootMargin:`0px 0px ${e} 0px`},s=new IntersectionObserver(ko,n);r.forEach(i=>s.observe(i))}function To(t,e=200){let r;return(...n)=>{r&&window.clearTimeout(r),r=window.setTimeout(()=>t(...n),e)}}function ft(t,e){return(t??document).querySelector(e)}function Eo(t,e){return Array.from((t??document).querySelectorAll(e))}function Oo(t=null){const e=ft(t,"[data-feed-search]"),r=ft(t,"[data-feed-grid]");if(!e||!r)return;const n=Eo(r,":scope > *");let s=ft(t,"#no-results-hint");s||(s=document.createElement("p"),s.id="no-results-hint",s.className="mt-6 text-center text-gray-400 hidden",s.textContent="No results for your query.",r.parentElement?.appendChild(s));const i=c=>{const u=c.trim().toLowerCase();let d=0;for(const m of n){const f=(m.textContent||"").toLowerCase(),w=!u||f.includes(f);m.style.display=w?"":"none",w&&d++}s?.classList.toggle("hidden",d!==0)},a=(new URL(window.location.href).searchParams.get("q")??"").trim();a&&!e.value&&(e.value=a),i(e.value);const l=To(()=>{i(e.value);const c=new URL(window.location.href),u=e.value.trim();u?c.searchParams.set("q",u):c.searchParams.delete("q"),window.history.replaceState({},"",c.toString())},200);e.addEventListener("input",l),e.addEventListener("keydown",c=>{if(c.key==="Enter"&&(c.preventDefault(),i(e.value)),c.key==="Escape"){c.target.value="",i("");const u=new URL(window.location.href);u.searchParams.delete("q"),window.history.replaceState({},"",u.toString())}})}function Io(){return`
    <section class="max-w-2xl mx-auto mt-10">
      <div class="rounded-2xl border border-gray-800 bg-gray-900/70 backdrop-blur-md p-6 sm:p-8 shadow-2xl">
        <h2 class="text-2xl text-center font-semibold mb-4 text-blue-300">Create a new post</h2>
        <form id="post-form" class="space-y-4">
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-300">Title <span class="text-red-400">*</span></label>
            <input id="title" required
                   class="w-full p-2.5 rounded-lg border border-gray-700 bg-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-300">Body</label>
            <textarea id="body" rows="6"
                      class="w-full p-2.5 rounded-lg border border-gray-700 bg-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"></textarea>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-300">Image URL</label>
              <input id="imgUrl"
                     class="w-full p-2.5 rounded-lg border border-gray-700 bg-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                     placeholder="https://..." />
            </div>
            <div>
              <label class="block mb-1 text-sm font-medium text-gray-300">Image ALT</label>
              <input id="imgAlt"
                     class="w-full p-2.5 rounded-lg border border-gray-700 bg-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
            </div>
          </div>

          <div>
            <label class="block mb-1 text-sm font-medium text-gray-300">Tags (comma separated)</label>
            <input id="tags"
                   class="w-full p-2.5 rounded-lg border border-gray-700 bg-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                   placeholder="news, cats" />
          </div>

          <div class="flex items-center gap-3 pt-2">
            
          <section class="max-w-2xl mx-auto mt-10 relative">
  <div class="">
    <form id="post-form" class="">

      <!-- your existing form fields here -->
      
      <div class="flex items-center">
        <button type="submit" id="save-btn"
                class="px-10 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium hover:from-green-500 hover:to-emerald-500 transition-all cursor-pointer">
          Create
        </button>
        <span id="msg" class="text-sm opacity-80 ml-2 text-yellow-400"></span>
      </div>
    </form>
  </div>

  <!-- Spinner overlay -->
  <div id="spinner-overlay" class="hidden absolute inset-0 bg-black/50 flex items-center justify-center z-20">
    <div class="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-500"></div>
  </div>
</section>


            <span id="msg" class="text-sm opacity-80 ml-2 text-yellow-400"></span>
          </div>
        </form>
      </div>
    </section>
  `}let Ir=!1;function No(){if(Ir)return;Ir=!0;const t=document.querySelector("#create-post-bg");let e=document.querySelector("#spinner-overlay");e||(e=document.createElement("div"),e.id="spinner-overlay",e.className="hidden fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm",e.innerHTML=`
      <div class="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500 mb-4"></div>
      <p class="text-blue-400 text-lg font-medium">Creating your post...</p>
    `,document.body.appendChild(e)),document.body.addEventListener("input",r=>{const n=r.target;if(n&&n.id==="imgUrl"&&t){const s=n.value.trim();t.style.backgroundImage=s?`url("${s}")`:"",t.style.backgroundSize="cover",t.style.backgroundPosition="center"}}),document.body.addEventListener("submit",async r=>{const n=r.target;if(!n||n.id!=="post-form")return;r.preventDefault();const s=document.querySelector("#title").value.trim(),i=document.querySelector("#body").value.trim(),o=document.querySelector("#imgUrl").value.trim(),a=document.querySelector("#imgAlt").value.trim(),l=document.querySelector("#tags").value.split(",").map(d=>d.trim()).filter(Boolean),c=document.querySelector("#save-btn"),u=document.querySelector("#msg");try{e.classList.remove("hidden"),c&&(c.disabled=!0),u&&(u.textContent=""),await _e("/posts",{title:s,body:i,tags:l,media:o?{url:o,alt:a}:void 0}),setTimeout(()=>{e.classList.add("hidden"),t&&(t.style.backgroundImage=""),L("/profile")},2e3)}catch(d){e.classList.add("hidden"),c&&(c.disabled=!1),u&&(u.textContent=d?.message??"Failed to create post"),console.error("Failed to create post:",d)}})}async function Co(){return setTimeout(No,0),`
    <main class="min-h-dvh bg-gray-900 text-gray-100 p-8">
    <a class="inline-block mt-6 underline" href="/feed">← Back to Feed</a>
      ${Io()}
    </main>
  `}const $o={home:{url:"/",component:yt,protected:!1},login:{url:"/login",component:yt,protected:!1},register:{url:"/register",component:ts,protected:!1},feed:{url:"/feed",component:ds,protected:!0},profile:{url:"/profile",component:wo,protected:!0},create:{url:"/create",component:Co,protected:!0},postDetails:{url:/^\/post\/(\d+)$/,component:yo,protected:!0}};function Un(){try{const t=localStorage.getItem("accessToken");return!!t&&t.trim().length>0}catch(t){return console.warn("Error reading accessToken",t),!1}}async function Do(){localStorage.removeItem("accessToken"),history.pushState({},"","/login"),await L("/login")}async function Mo(t="",e=$o){t=t||window.location.pathname;let r=null,n=[];for(const i of Object.keys(e)){const o=e[i];if(typeof o.url=="string"&&o.url===t){r=o;break}else if(o.url instanceof RegExp){const a=t.match(o.url);if(a){r=o,n=a.slice(1);break}}}let s;return r?r.protected&&!Un()?(console.warn("Unauthorized access, redirecting to /login"),history.replaceState({},"","/login"),s=await yt()):s=await r.component(n):s=await gs(),s}async function L(t){const e=t??window.location.pathname,r=document.getElementById(Bn);if(r){if(r.innerHTML=await Mo(e),So(),/^\/post\/\d+$/.test(e)){const n=document.getElementById("back-to-feed");n&&n.addEventListener("click",s=>{s.preventDefault(),history.pushState({},"","/feed"),L("/feed")});try{Nt()}catch{}}if(e==="/feed"){Oo(r),Zt("logout-mobile",r),Zt("logout-desktop",r);try{Nt()}catch{}}}}async function Lo(){const t=window.location.pathname;!Un()&&!["/login","/register"].includes(t)?(history.replaceState({},"","/login"),await L("/login")):await L(t)}function Ao(t){history.pushState({path:t},"",t),L(t)}Lo();window.onerror=_n;window.addEventListener("unhandledrejection",Yn);window.addEventListener("popstate",t=>{const e=t.state?.path||window.location.pathname;L(e)});document.body.addEventListener("click",t=>{const r=t.target.closest('a[href^="/"], a[data-link]');if(r){const n=r.getAttribute("href");n&&n.startsWith("/")&&!t.ctrlKey&&!t.metaKey&&!t.shiftKey&&t.button===0&&(t.preventDefault(),Ao(n))}});export{ee as g};
