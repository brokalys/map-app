import { render, screen } from '@testing-library/react';
import React from 'react';

import Navigation from './Navigation';

describe('Navigation', () => {
  test('has pinger button', () => {
    render(<Navigation />);
    const pingerButton = screen.getByTestId('pinger-button');
    expect(pingerButton).toBeInTheDocument();
  });

  test('has feedback button', () => {
    render(<Navigation />);
    const linkElement = screen.getByText(/Feedback/i);
    expect(linkElement).toBeInTheDocument();
  });
});
