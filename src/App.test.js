import React from 'react';
import { RecoilRoot } from 'recoil';
import { render } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const { getByText } = render(<App />, {
    wrapper: RecoilRoot,
  });
  const linkElement = getByText(/feedback/i);
  expect(linkElement).toBeInTheDocument();
});
