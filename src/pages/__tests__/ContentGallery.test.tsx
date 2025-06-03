import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import ContentGallery from '../ContentGallery';
import { fetchContents } from '../../services/contentService';
import { PricingOption } from '../../services/contentService';

// Mock the contentService
jest.mock('../../services/contentService');

const mockStore = configureStore([]);

describe('ContentGallery', () => {
  let store: any;
  const mockContents = [
    {
      id: '1',
      title: 'Test Content 1',
      creator: 'Creator 1',
      imagePath: '/test1.jpg',
      pricingOption: PricingOption.PAID,
      price: 9.99
    },
    {
      id: '2',
      title: 'Test Content 2',
      creator: 'Creator 2',
      imagePath: '/test2.jpg',
      pricingOption: PricingOption.FREE
    }
  ];

  beforeEach(() => {
    store = mockStore({
      search: {
        query: '',
        results: []
      }
    });

    // Mock fetchContents implementation
    (fetchContents as jest.Mock).mockResolvedValue(mockContents);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <ContentGallery />
        </BrowserRouter>
      </Provider>
    );
  };

  it('renders the component with initial state', async () => {
    renderComponent();
    
    // Check if logo is rendered
    expect(screen.getByText('CONNECT')).toBeInTheDocument();
    
    // Check if search bar is rendered
    expect(screen.getByPlaceholderText("Find the items you're looking for")).toBeInTheDocument();
    
    // Check if filter options are rendered
    expect(screen.getByText('Pricing Option')).toBeInTheDocument();
    expect(screen.getByLabelText('Paid')).toBeInTheDocument();
    expect(screen.getByLabelText('Free')).toBeInTheDocument();
    expect(screen.getByLabelText('View Only')).toBeInTheDocument();
    
    // Check if sort dropdown is rendered
    expect(screen.getByText('Sort by')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('loads and displays content items', async () => {
    renderComponent();
    
    // Wait for content to load
    await waitFor(() => {
      expect(screen.getByText('Test Content 1')).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText('Test Content 2')).toBeInTheDocument();
    });
  });

  it('filters content based on pricing options', async () => {
    renderComponent();
    
    // Wait for initial content to load
    await waitFor(() => {
      expect(screen.getByText('Test Content 1')).toBeInTheDocument();
    });

    // Check Paid filter
    const paidCheckbox = screen.getByLabelText('Paid');
    fireEvent.click(paidCheckbox);
    
    await waitFor(() => {
      expect(screen.getByText('$9.99')).toBeInTheDocument();
    });
  });

  it('sorts content based on selected option', async () => {
    renderComponent();
    
    // Wait for initial content to load
    await waitFor(() => {
      expect(screen.getByText('Test Content 1')).toBeInTheDocument();
    });

    // Change sort option to higher price
    const sortSelect = screen.getByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: 'high' } });
    
    // Verify the content is sorted (you might need to adjust this based on your actual sorting logic)
    await waitFor(() => {
      const items = screen.getAllByRole('img');
      expect(items[0]).toHaveAttribute('alt', 'Test Content 1');
    });
  });

  it('handles search input correctly', async () => {
    renderComponent();
    
    const searchInput = screen.getByPlaceholderText("Find the items you're looking for");
    fireEvent.change(searchInput, { target: { value: 'Test' } });
    
    // Verify search query is updated
    expect(searchInput).toHaveValue('Test');
  });

  it('resets filters when reset button is clicked', async () => {
    renderComponent();
    
    // Check Paid filter
    const paidCheckbox = screen.getByLabelText('Paid');
    fireEvent.click(paidCheckbox);
    
    // Click reset button
    const resetButton = screen.getByText('RESET');
    fireEvent.click(resetButton);
    
    // Verify filters are reset
    expect(paidCheckbox).not.toBeChecked();
  });

  it('handles error state', async () => {
    // Mock fetchContents to reject
    (fetchContents as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
    
    renderComponent();
    
    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
  });
}); 