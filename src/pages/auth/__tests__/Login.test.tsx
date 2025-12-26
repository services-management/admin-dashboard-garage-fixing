import '@testing-library/jest-dom';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import Login from '../Login';

/* =========================
   MOCK react-router-dom
========================= */
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom') as object;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

/* =========================
   MOCK redux hooks
========================= */
const mockDispatch = jest.fn() as jest.MockedFunction<(arg?: any) => Promise<any>>;

jest.mock('../../../store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: () => ({
    loading: false,
    error: null,
  }),
}));

/* =========================
   MOCK auth thunk
========================= */
jest.mock('../../../store/auth/authThunk', () => ({
  adminLogin: {
    fulfilled: {
      match: () => true,
    },
  },
}));

/* =========================
   TESTS
========================= */
describe('Login page', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockDispatch.mockClear();
    mockDispatch.mockResolvedValue({});
  });

  test('shows validation error when fields are empty', () => {
    render(<Login />);

    fireEvent.click(screen.getByRole('button', { name: /ចូល/i }));

    expect(screen.getByText('សូមបញ្ចូល ឈ្មោះ')).toBeInTheDocument();
  });
});
