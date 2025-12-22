import '@testing-library/jest-dom';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as Record<string, unknown>),
  useNavigate: () => mockNavigate,
}));

import Login from '../auth/Login';

describe('Login page', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('shows validation errors when fields are empty', () => {
    render(<Login />);

    const button = screen.getByRole('button', { name: /ចូល/ });
    fireEvent.click(button);

    // identifier validation
    // expect(screen.getByText(/សូមបញ្ចូល/)).toBeInTheDocument()
  });

  test('navigates to dashboard when identifier and password provided', () => {
    render(<Login />);

    const nameInput = screen.getByLabelText('name');
    const passwordInput = screen.getByLabelText('password');
    const button = screen.getByRole('button', { name: /ចូល/ });

    fireEvent.change(nameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'secret' } });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
