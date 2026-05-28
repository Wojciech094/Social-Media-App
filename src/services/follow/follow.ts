export async function getFollowingUsers() {
  try {
    const response = await fetch('/social/profiles/following', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // adjust if you use another method
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch following users');
    }
    return response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
