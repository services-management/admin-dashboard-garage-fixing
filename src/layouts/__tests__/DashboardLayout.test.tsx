import '@testing-library/jest-dom';
import { beforeEach, describe, expect, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import DashboardLayout from '../DashboardLayout';

function renderLayout(initialEntries = ['/dashboard']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="dashboard" element={<div>Dashboard content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('DashboardLayout', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.dataset.theme = '';
  });

  test('marks current nav item as active based on location', () => {
    renderLayout(['/dashboard']);

    const dashboardLink = screen.getByRole('link', { name: 'ផ្ទាំងទូទៅ' });
    expect(dashboardLink).toHaveClass('active');
    expect(screen.getByText('Dashboard content')).toBeInTheDocument();
  });

  test('initializes theme from storage and toggles on button click', () => {
    localStorage.setItem('theme', 'dark');

    renderLayout(['/dashboard']);

    const toggleButton = screen.getByRole('button', { name: /toggle dark mode/i });
    expect(document.documentElement.dataset.theme).toBe('dark');

    fireEvent.click(toggleButton);

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  test('updates search query when user types', () => {
    renderLayout(['/dashboard']);

    const searchInput = screen.getByPlaceholderText('ស្វែងរក...');
    fireEvent.change(searchInput, { target: { value: 'services' } });

    expect(searchInput).toHaveValue('services');
  });
});

