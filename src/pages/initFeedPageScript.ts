// src/pages/initFeedPageScript.ts
type Root = Document | HTMLElement | null;

function debounce<T extends (...a: any[]) => void>(fn: T, delay = 200) {
  let t: number | undefined;
  return (...args: Parameters<T>) => {
    if (t) window.clearTimeout(t);
    t = window.setTimeout(() => fn(...args), delay);
  };
}

function pick<T extends Element>(root: Root, sel: string): T | null {
  return (root ?? document).querySelector<T>(sel);
}
function pickAll<T extends Element>(root: Root, sel: string): T[] {
  return Array.from((root ?? document).querySelectorAll<T>(sel));
}

/** Init search/filter on /feed */
export default function initFeedPageScripts(root: HTMLElement | null = null) {
  const search = pick<HTMLInputElement>(root, '[data-feed-search]');
  const grid = pick<HTMLElement>(root, '[data-feed-grid]');
  if (!search || !grid) return;

  const cards = pickAll<HTMLElement>(grid, ':scope > *');

  let noResults = pick<HTMLParagraphElement>(root, '#no-results-hint');
  if (!noResults) {
    noResults = document.createElement('p');
    noResults.id = 'no-results-hint';
    noResults.className = 'mt-6 text-center text-gray-400 hidden';
    noResults.textContent = 'No results for your query.';
    grid.parentElement?.appendChild(noResults);
  }

  const applyFilter = (raw: string) => {
    const q = raw.trim().toLowerCase();
    let shown = 0;
    for (const card of cards) {
      const txt = (card.textContent || '').toLowerCase();
      const match = !q || txt.includes(txt);
      card.style.display = match ? '' : 'none';
      if (match) shown++;
    }
    noResults?.classList.toggle('hidden', shown !== 0);
  };

  // Apply ?q= from URL
  const url = new URL(window.location.href);
  const initialQ = (url.searchParams.get('q') ?? '').trim();
  if (initialQ && !search.value) search.value = initialQ;
  applyFilter(search.value);

  const onType = debounce(() => {
    applyFilter(search.value);
    const u = new URL(window.location.href);
    const v = search.value.trim();
    if (v) u.searchParams.set('q', v);
    else u.searchParams.delete('q');
    window.history.replaceState({}, '', u.toString());
  }, 200);

  search.addEventListener('input', onType);
  search.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyFilter(search.value);
    }
    if (e.key === 'Escape') {
      (e.target as HTMLInputElement).value = '';
      applyFilter('');
      const u = new URL(window.location.href);
      u.searchParams.delete('q');
      window.history.replaceState({}, '', u.toString());
    }
  });
}
