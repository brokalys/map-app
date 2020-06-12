import React from 'react';
import { render } from '@testing-library/react';

import Navigation from './Navigation';

describe('Navigation', () => {
  test('has pinger button', () => {
    const { getByTestId } = render(<Navigation />);
    const pingerButton = getByTestId('pinger-button');
    expect(pingerButton).toBeInTheDocument();
  });

  test('has feedback button', () => {
    const { getByText } = render(<Navigation />);
    const linkElement = getByText(/Feedback/i);
    expect(linkElement).toBeInTheDocument();
  });
});
