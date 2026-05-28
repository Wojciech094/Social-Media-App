import logoutBtn from '../components/logoutBtn';

export default function searchBar() {
  return `
    <div id="feed-search-bar" class="flex items-center justify-around w-full px-2 mb-2 -mt-5">
      <!-- Search input -->
      <input
        id="feed-search-input"
        type="text"
        placeholder="Search posts..."
        class="w-2/3 max-w-2xl border border-gray-600 rounded-lg px-3 py-2
               bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <!-- Logout button -->
      <div class="ml-2">
        ${logoutBtn()}
      </div>
    </div>
  `;
}
