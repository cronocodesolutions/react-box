import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Link, MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import DocumentHead from './documentHead';
import { SITE_URL } from './site';

function renderAt(pathname: string) {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <DocumentHead />
    </MemoryRouter>,
  );
}

const canonical = () => document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
const meta = (key: string, value: string) => document.head.querySelector<HTMLMetaElement>(`meta[${key}="${value}"]`)?.content;

describe('DocumentHead', () => {
  it('names the route in the title, the description and the canonical URL', () => {
    renderAt('/dropdown');

    expect(document.title).toBe('Dropdown — React Box');
    expect(canonical()).toBe(`${SITE_URL}/dropdown/`);
    expect(meta('name', 'description')).toContain('APG select-only combobox');
    expect(meta('property', 'og:title')).toBe('Dropdown — React Box');
    expect(meta('property', 'og:url')).toBe(`${SITE_URL}/dropdown/`);
  });

  it('rewrites the head on every navigation instead of stacking tags up', async () => {
    render(
      <MemoryRouter initialEntries={['/dropdown']}>
        <DocumentHead />
        <Link to="/switch">Switch</Link>
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByText('Switch'));

    expect(document.title).toBe('Switch — React Box');
    expect(canonical()).toBe(`${SITE_URL}/switch/`);
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
  });

  it('asks crawlers not to index an address the router does not serve', () => {
    renderAt('/nothing-here');
    expect(document.title).toBe('Page not found — React Box');
    expect(meta('name', 'robots')).toBe('noindex, follow');
  });

  it('drops the noindex again once a published route renders', () => {
    renderAt('/nothing-here');
    renderAt('/colors');

    expect(document.head.querySelector('meta[name="robots"]')).toBeNull();
  });
});
