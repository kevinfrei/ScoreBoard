import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

// This is a really bad test :/
// I'm bad at UI testing. Scoring test is actually useful
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Red/i);
  expect(linkElement).toBeInTheDocument();
});
