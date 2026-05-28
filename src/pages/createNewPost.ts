import NewPostForm, { wireNewPostForm } from '../components/PostEditor';

export default async function CreatePostPage(): Promise<string> {
  setTimeout(wireNewPostForm, 0); // Wire the form after HTML renders
  return `
    <main class="min-h-dvh bg-gray-900 text-gray-100 p-8">
    <a class="inline-block mt-6 underline" href="/feed">← Back to Feed</a>
      ${NewPostForm()}
    </main>
  `;
}
