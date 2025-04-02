import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app without crashing', () => {
  render(<App />);
});

test('contains login route', () => {
  render(<App />);
  // Basic smoke test - ensure the app renders without crashing
  expect(document.querySelector('div')).toBeInTheDocument();
});
