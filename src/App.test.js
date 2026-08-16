import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the portfolio introduction and contact action', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /I create digital things/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Send a message/i })).toBeInTheDocument();
});
