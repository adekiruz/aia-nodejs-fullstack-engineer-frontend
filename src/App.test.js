import { render, fireEvent, waitFor } from '@testing-library/react';

import App from './App';

test('show loading spinner when user search', async () => {
  const dom = render(<App />);

  const searchButton = dom.container.querySelector('#search-button');
  const loadingSpinner = dom.container.querySelector('#loading-spinner')

  fireEvent.click(searchButton);
  await waitFor(() => loadingSpinner);

  expect(loadingSpinner).toBeInTheDocument();
});
