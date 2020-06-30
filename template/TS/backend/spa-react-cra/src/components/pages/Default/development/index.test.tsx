import React from 'react';
import { render } from '@testing-library/react';
import Default from '../index';

test('renders learn react link', () => {
  const { getByText } = render(<Default />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
