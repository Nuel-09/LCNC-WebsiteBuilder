import {
  ensureBuilderShape,
  getActivePageData,
  mergeActivePageData,
} from './builderConfigUtils';

describe('builderConfigUtils', () => {
  it('normalizes legacy single-page config into stable builder shape', () => {
    const result = ensureBuilderShape({
      content: [{ type: 'Header', props: { title: 'Legacy Title' } }],
    });

    expect(result.pages).toHaveLength(1);
    expect(result.activePageId).toBe('home');
    expect(result.pages[0].content).toEqual([
      { type: 'Header', props: { title: 'Legacy Title' } },
    ]);
    expect(result.content).toEqual([
      { type: 'Header', props: { title: 'Legacy Title' } },
    ]);
  });

  it('returns sanitized active page content with generated IDs', () => {
    const data = getActivePageData({
      pages: [
        {
          id: 'home',
          title: 'Home',
          slug: 'home',
          content: [
            { type: 'Header', props: { title: 'Title' } },
            null,
            { type: '', props: {} },
          ],
        },
      ],
      activePageId: 'home',
      site: { theme: {} },
    });

    expect(data.content).toHaveLength(1);
    expect(data.content[0].id).toBe('header-1');
    expect(data.content[0].props.title).toBe('Title');
  });

  it('preserves existing page content when incoming pageData has no content array', () => {
    const existing = {
      pages: [
        {
          id: 'home',
          title: 'Home',
          slug: 'home',
          content: [{ type: 'Hero', props: { heading: 'Old' } }],
        },
      ],
      activePageId: 'home',
      site: { theme: {} },
    };

    const merged = mergeActivePageData(existing, { root: {} });

    expect(merged.pages[0].content).toHaveLength(1);
    expect(merged.pages[0].content[0].type).toBe('Hero');
    expect(merged.content[0].type).toBe('Hero');
  });
});