import { renderRoute } from '../router';
import { loginUser, fetchApiKey } from '../services/api/client.js';
import { setLocalItem } from '../utils/storage.js';

import type {
  LoginCredentials,
  ApiResponse,
  LoginResponse,
} from '../types/index.js';

export default async function LoginPage() {
  setTimeout(() => {
    const form = document.getElementById('loginForm') as HTMLFormElement;
    if (form) {
      const submitBtn = form.querySelector(
        "button[type='submit']"
      ) as HTMLButtonElement;

      form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const emailInput = document.getElementById(
          'loginEmail'
        ) as HTMLInputElement;
        const passwordInput = document.getElementById(
          'loginPassword'
        ) as HTMLInputElement;
        const formError = document.getElementById('loginMessage');
        const loadingOverlay = document.getElementById('loadingOverlay');

        if (!emailInput || !passwordInput) {
          console.error('Form inputs not found');
          return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Reset previous messages
        if (formError) {
          formError.textContent = '';
          formError.style.color = 'red';
        }

        // Validation
        if (!email && !password) {
          if (formError)
            formError.textContent = 'Please enter both email and password.';
          return;
        }

        if (!email) {
          if (formError)
            formError.textContent = 'Please enter your email address.';
          return;
        }

        if (!password) {
          if (formError) formError.textContent = 'Please enter your password.';
          return;
        }

        if (!email.includes('@')) {
          if (formError)
            formError.textContent = 'Please enter a valid email address.';
          return;
        }

        if (!email.endsWith('@stud.noroff.no')) {
          if (formError)
            formError.textContent =
              'Please use your @stud.noroff.no email address.';
          return;
        }

        if (password.length < 8) {
          if (formError)
            formError.textContent =
              'Password must be at least 8 characters long.';
          return;
        }

        // Disable button and show loader
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = '🔄 Signing In...';
        }
        if (loadingOverlay)
          loadingOverlay.classList.remove('opacity-0', 'hidden');

        const loginData: LoginCredentials = { email, password };

        try {
          const result: ApiResponse<LoginResponse> = await loginUser(loginData);

          if (result.errors && result.errors.length > 0) {
            const errorMessage = result.errors[0]?.message || 'Login failed.';

            if (formError) {
              if (errorMessage.toLowerCase().includes('email')) {
                formError.textContent =
                  '❌ Email address not found. Please check your email or register for an account.';
              } else if (errorMessage.toLowerCase().includes('password')) {
                formError.textContent =
                  '❌ Incorrect password. Please check your password and try again.';
              } else if (
                errorMessage.toLowerCase().includes('user') &&
                errorMessage.toLowerCase().includes('not')
              ) {
                formError.textContent =
                  '❌ No account found with this email. Please register first.';
              } else if (errorMessage.toLowerCase().includes('invalid')) {
                formError.textContent =
                  '❌ Invalid login credentials. Please check your email and password.';
              } else if (errorMessage.toLowerCase().includes('credentials')) {
                formError.textContent =
                  '❌ Invalid email or password. Please double-check your credentials.';
              } else {
                formError.textContent = `❌ ${errorMessage}`;
              }
            }
          } else if (result.data) {
            const { accessToken, name } = result.data;

            if (accessToken) setLocalItem('accessToken', accessToken);
            if (name) setLocalItem('user', name);

            try {
              const apikey = await fetchApiKey(accessToken);
              if (apikey) setLocalItem('apiKey', apikey);
            } catch (apiError) {
              console.warn('Failed to get API key:', apiError);
            }

            if (formError) {
              formError.style.color = 'white';
              formError.textContent =
                '✅ Login successful! Redirecting to your dashboard...';
            }

            if (typeof (window as any).refreshNavbar === 'function') {
              (window as any).refreshNavbar();
            }

            // Redirect to feed
            setTimeout(() => {
              history.pushState({ path: '/feed' }, '', '/feed');
              renderRoute('/feed');
            }, 1000);
          } else {
            if (formError)
              formError.textContent = 'Unexpected response from server.';
          }
        } catch (error) {
          console.error('Login error:', error);
          if (formError) {
            if (error instanceof TypeError && error.message.includes('fetch')) {
              formError.textContent =
                '🌐 Network error. Please check your internet connection and try again.';
            } else {
              formError.textContent =
                '⚠️ Something went wrong. Please try again in a moment.';
            }
          }
        } finally {
          // Keep loader visible slightly longer for smoother UX
          setTimeout(() => {
            if (loadingOverlay) {
              loadingOverlay.classList.add('opacity-0');
              setTimeout(() => loadingOverlay.classList.add('hidden'), 400); // fade-out
            }
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = '🚀 Sign In';
            }
          }, 1500); // extend loading time here
        }
      });
    }

    // Register link
    const registerLink = document.getElementById('register-link');
    if (registerLink) {
      registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        history.pushState({ path: '/register' }, '', '/register');
        renderRoute('/register');
      });
    }
  }, 0);

  return `
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
  `;
}
