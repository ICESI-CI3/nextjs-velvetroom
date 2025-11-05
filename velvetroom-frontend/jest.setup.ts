import '@testing-library/jest-dom';

// Mock next/navigation for client components
jest.mock('next/navigation', () => {
  const push = jest.fn();
  const replace = jest.fn();
  const back = jest.fn();
  return {
    useRouter: () => ({ push, replace, back }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
  };
});

// Silence Sonner toasts during tests
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  },
}));

// Basic mock for framer-motion to avoid animations during tests
jest.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: () => (props: any) => props.children || null,
  }),
}));
