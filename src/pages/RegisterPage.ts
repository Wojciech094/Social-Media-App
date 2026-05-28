import { renderRoute } from '../router';
import { registerUser } from '../services/api/client.js';
import { setLocalItem } from '../utils/storage.js';
import type {
  ApiResponse,
  RegisterResponse,
  RegisterRequest,
} from '../types/index.js';

export default async function RegisterPage() {
  setTimeout(() => {
    const form = document.getElementById('registerForm') as HTMLFormElement;
    if (form) {
      const submitBtn = form.querySelector(
        "button[type='submit']"
      ) as HTMLButtonElement;

      form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Form inputs
        const nameInput = document.getElementById(
          'registerName'
        ) as HTMLInputElement;
        const emailInput = document.getElementById(
          'registerEmail'
        ) as HTMLInputElement;
        const passwordInput = document.getElementById(
          'registerPassword'
        ) as HTMLInputElement;
        const confirmPasswordInput = document.getElementById(
          'registerConfirmPassword'
        ) as HTMLInputElement;
        const bioInput = document.getElementById(
          'registerBio'
        ) as HTMLInputElement;
        const avatarUrlInput = document.getElementById(
          'registerAvatarUrl'
        ) as HTMLInputElement;
        const formError = document.getElementById('registerMessage');

        if (
          !nameInput ||
          !emailInput ||
          !passwordInput ||
          !confirmPasswordInput
        ) {
          console.error('Form inputs not found');
          return;
        }

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const bio = bioInput?.value.trim() || '';
        const avatarUrl = avatarUrlInput?.value.trim() || '';

        // Reset error message
        if (formError) {
          formError.textContent = '';
          formError.style.color = 'red';
        }

        // Validation
        if (!name || !email || !password || !confirmPassword) {
          if (formError)
            formError.textContent = 'Please fill in all required fields.';
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

        if (password !== confirmPassword) {
          if (formError) formError.textContent = 'Passwords do not match.';
          return;
        }

        // Disable submit
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = '🔄 Registering...';
        }

        const loadingScreen = (window as any).loadingScreen;
        if (loadingScreen) loadingScreen.showWithMessage('Registering...');

        // ✅ Typed data object
        const registerData: RegisterRequest = { name, email, password };

        if (bio) registerData.bio = bio;
        if (avatarUrl) {
          registerData.avatar = {
            url: avatarUrl,
            alt: `${name}'s avatar`,
          };
        }

        try {
          const result: ApiResponse<RegisterResponse> = await registerUser(
            registerData
          );

          if (result.errors && result.errors.length > 0) {
            const errorMessage =
              result.errors[0]?.message || 'Registration failed.';
            if (formError) {
              if (errorMessage.toLowerCase().includes('email')) {
                formError.textContent = '❌ Email address already in use.';
              } else {
                formError.textContent = `❌ ${errorMessage}`;
              }
            }
          } else if (result.data) {
            if (formError) {
              formError.style.color = 'white';
              formError.textContent =
                '✅ Registration successful! Redirecting to login page...';
            }

            if (result.data.accessToken)
              setLocalItem('accessToken', result.data.accessToken);
            if (result.data.name) setLocalItem('user', result.data.name);

            setTimeout(() => {
              history.pushState({ path: '/login' }, '', '/login');
              renderRoute('/login');
            }, 1500);
          } else {
            if (formError)
              formError.textContent = 'Unexpected response from server.';
          }
        } catch (error) {
          console.error('Registration error:', error);
          if (formError) {
            if (error instanceof TypeError && error.message.includes('fetch')) {
              formError.textContent =
                '🌐 Network error. Please check your internet connection.';
            } else {
              formError.textContent =
                '⚠️ Something went wrong. Please try again.';
            }
          }
        } finally {
          if (loadingScreen) loadingScreen.hideLoadingScreen();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '🚀 Register';
          }
        }
      });
    }

    // Login link
    const loginLink = document.getElementById('login-link');
    if (loginLink) {
      loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        history.pushState({ path: '/login' }, '', '/login');
        renderRoute('/login');
      });
    }
  }, 0);

  return `
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
  `;
}
