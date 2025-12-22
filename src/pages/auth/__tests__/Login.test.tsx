import '@testing-library/jest-dom';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';

import Login from '../Login';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  // The double assertion below is required to avoid a TypeScript "spread types" error
  // when spreading the module namespace. ESLint flags the assertion as unnecessary,
  // but removing it reintroduces TS2698 during build. Silence the specific rule here.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const actual = jest.requireActual('react-router-dom') as unknown as Record<string, unknown>;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  } as unknown as typeof import('react-router-dom');
});

describe('Login page', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('shows validation errors when fields are empty', () => {
    render(<Login />);

    const button = screen.getByRole('button', { name: /ចូល/ });
    fireEvent.click(button);
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
