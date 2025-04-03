import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

describe('App CRUD Operations', () => {
  // Test initial rendering
  test('renders initial clothing list', () => {
    render(<App />);
    expect(screen.getByText(/T-Shirt/i)).toBeInTheDocument();
    expect(screen.getByText(/Jeans/i)).toBeInTheDocument();
  });

  // Test Adding a new clothing item
  test('adds a new clothing item', async () => {
    render(<App />);

    // Fill the form
    fireEvent.change(screen.getByPlaceholderText(/Clothing Name/i), { target: { value: 'Test Shirt' } });
    fireEvent.change(screen.getByPlaceholderText(/Price/i), { target: { value: '25' } });
    fireEvent.change(screen.getByPlaceholderText(/Category/i), { target: { value: 'Unisex' } });
    fireEvent.change(screen.getByPlaceholderText(/Brand/i), { target: { value: 'TestBrand' } });
    fireEvent.change(screen.getByPlaceholderText(/Description/i), { target: { value: 'A test item' } });
    fireEvent.change(screen.getByPlaceholderText(/Image URL/i), { target: { value: 'test-image.png' } });

    // Submit the form
    fireEvent.click(screen.getByText(/Add/i));

    // Wait for the new item to appear
    await waitFor(() => {
      expect(screen.getByText(/Test Shirt/i)).toBeInTheDocument();
    });
  });

  // Test Editing an existing clothing item
  test('updates an existing clothing item', async () => {
    render(<App />);

    // Click edit on the first item (T-Shirt)
    fireEvent.click(screen.getAllByText(/Edit/i)[0]);

    // Update the form
    fireEvent.change(screen.getByPlaceholderText(/Clothing Name/i), { target: { value: 'Updated T-Shirt' } });
    fireEvent.change(screen.getByPlaceholderText(/Price/i), { target: { value: '30' } });

    // Submit the update
    fireEvent.click(screen.getByText(/Update/i));

    // Wait for the updated item to appear
    await waitFor(() => {
      expect(screen.getByText(/Updated T-Shirt/i)).toBeInTheDocument();
      //expect(screen.getByText(/\$30/i)).toBeInTheDocument();
    });
  });

  // Test Deleting a clothing item
  test('deletes a clothing item', async () => {
    render(<App />);

    // Ensure item exists before deletion
    expect(screen.getByText(/T-Shirt/i)).toBeInTheDocument();

    // Click delete on the first item (T-Shirt)
    fireEvent.click(screen.getAllByText(/Delete/i)[0]);

    // Wait for the item to be removed
    await waitFor(() => {
      expect(screen.queryByText(/T-Shirt/i)).not.toBeInTheDocument();
    });
  });

  // Test filtering by category
  test('filters clothes by category', () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/Filter by category/i), { target: { value: 'Men' } });
    expect(screen.getByText(/T-Shirt/i)).toBeInTheDocument();
    expect(screen.queryByText(/Jeans/i)).not.toBeInTheDocument(); // Jeans is Women
  });

  // Test sorting by price
  test('sorts clothes by price', () => {
    render(<App />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'price' } });
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent(/Socks/i); // Cheapest: $10
    expect(items[1]).toHaveTextContent(/Cap/i);   // Next: $15
  });
});