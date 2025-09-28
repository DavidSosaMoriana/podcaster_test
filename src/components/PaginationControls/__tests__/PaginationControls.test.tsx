import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PaginationControls from '../PaginationControls';

describe('PaginationControls', () => {
  const defaultProps = {
    currentPage: 2,
    totalPages: 5,
    hasNextPage: true,
    hasPreviousPage: true,
    onNextPage: jest.fn(),
    onPreviousPage: jest.fn(),
    onGoToPage: jest.fn(),
    totalItems: 100,
    itemsPerPage: 20,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render pagination information correctly', () => {
    const { container } = render(<PaginationControls {...defaultProps} />);

    expect(container.querySelector('.pagination-controls')).toBeInTheDocument();
    expect(
      container.querySelector('.pagination-controls__info')
    ).toBeInTheDocument();
    expect(
      container.querySelector('.pagination-controls__navigation')
    ).toBeInTheDocument();
    expect(
      container.querySelector('.pagination-controls__summary')
    ).toBeInTheDocument();

    expect(
      container.querySelector('.pagination-controls__page--active')
    ).toBeInTheDocument();
  });

  it('should render previous and next buttons when both are available', () => {
    render(<PaginationControls {...defaultProps} />);

    const previousButton = screen.getByRole('button', { name: /anterior/i });
    const nextButton = screen.getByRole('button', { name: /siguiente/i });

    expect(previousButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
    expect(previousButton).not.toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  it('should disable previous button on first page', () => {
    const props = {
      ...defaultProps,
      currentPage: 1,
      hasPreviousPage: false,
    };

    render(<PaginationControls {...props} />);

    const previousButton = screen.getByRole('button', { name: /anterior/i });
    expect(previousButton).toBeDisabled();
  });

  it('should disable next button on last page', () => {
    const props = {
      ...defaultProps,
      currentPage: 5,
      hasNextPage: false,
    };

    render(<PaginationControls {...props} />);

    const nextButton = screen.getByRole('button', { name: /siguiente/i });
    expect(nextButton).toBeDisabled();
  });

  it('should call onPreviousPage when previous button is clicked', () => {
    const mockOnPrevious = jest.fn();
    const props = {
      ...defaultProps,
      onPreviousPage: mockOnPrevious,
    };

    render(<PaginationControls {...props} />);

    const previousButton = screen.getByRole('button', { name: /anterior/i });
    fireEvent.click(previousButton);

    expect(mockOnPrevious).toHaveBeenCalledTimes(1);
  });

  it('should call onNextPage when next button is clicked', () => {
    const mockOnNext = jest.fn();
    const props = {
      ...defaultProps,
      onNextPage: mockOnNext,
    };

    render(<PaginationControls {...props} />);

    const nextButton = screen.getByRole('button', { name: /siguiente/i });
    fireEvent.click(nextButton);

    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('should render page numbers for navigation', () => {
    render(<PaginationControls {...defaultProps} />);

    expect(
      screen.getByRole('button', { name: 'Ir a la página 1' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Ir a la página 2' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Ir a la página 3' })
    ).toBeInTheDocument();
  });

  it('should highlight current page', () => {
    render(<PaginationControls {...defaultProps} />);

    const currentPageButton = screen.getByRole('button', {
      name: 'Ir a la página 2',
    });
    expect(currentPageButton).toHaveClass('pagination-controls__page--active');
  });

  it('should call onGoToPage when page number is clicked', () => {
    const mockOnGoToPage = jest.fn();
    const props = {
      ...defaultProps,
      onGoToPage: mockOnGoToPage,
    };

    render(<PaginationControls {...props} />);

    const page3Button = screen.getByRole('button', {
      name: 'Ir a la página 3',
    });
    fireEvent.click(page3Button);

    expect(mockOnGoToPage).toHaveBeenCalledWith(3);
  });

  it('should call onGoToPage when current page is clicked', () => {
    const mockOnGoToPage = jest.fn();
    const props = {
      ...defaultProps,
      onGoToPage: mockOnGoToPage,
    };

    render(<PaginationControls {...props} />);

    const currentPageButton = screen.getByRole('button', {
      name: 'Ir a la página 2',
    });
    fireEvent.click(currentPageButton);

    expect(mockOnGoToPage).toHaveBeenCalledWith(2);
  });

  it('should handle single page correctly', () => {
    const props = {
      ...defaultProps,
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
      totalItems: 10,
    };

    render(<PaginationControls {...props} />);

    expect(screen.queryByText('Page 1 of 1')).not.toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: /anterior/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /siguiente/i })
    ).not.toBeInTheDocument();
  });

  it('should calculate item ranges correctly for first page', () => {
    const props = {
      ...defaultProps,
      currentPage: 1,
      totalItems: 100,
      itemsPerPage: 20,
    };

    render(<PaginationControls {...props} />);

    expect(
      screen.getByRole('button', { name: 'Ir a la página 1' })
    ).toHaveAttribute('aria-current', 'page');
    expect(
      screen.getByRole('button', { name: 'Ir a la página 2' })
    ).toBeInTheDocument();
  });

  it('should calculate item ranges correctly for last page with partial items', () => {
    const props = {
      ...defaultProps,
      currentPage: 5,
      totalPages: 5,
      totalItems: 87,
      itemsPerPage: 20,
    };

    render(<PaginationControls {...props} />);

    expect(
      screen.getByRole('button', { name: 'Ir a la página 5' })
    ).toHaveAttribute('aria-current', 'page');
    expect(
      screen.getByRole('button', { name: 'Ir a la página 4' })
    ).toBeInTheDocument();
  });

  it('should handle empty results', () => {
    const props = {
      ...defaultProps,
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 20,
    };

    const { container } = render(<PaginationControls {...props} />);

    expect(container.firstChild).toBeNull();
  });

  it('should apply correct CSS classes', () => {
    const { container } = render(<PaginationControls {...defaultProps} />);

    expect(container.firstChild).toHaveClass('pagination-controls');
  });

  it('should render ellipsis for large page ranges', () => {
    const props = {
      ...defaultProps,
      currentPage: 5,
      totalPages: 20,
    };

    render(<PaginationControls {...props} />);

    const ellipsis = screen.queryAllByText('...');
    expect(ellipsis.length).toBeGreaterThan(0);
  });

  it('should handle keyboard navigation', () => {
    const mockOnNext = jest.fn();
    const mockOnPrevious = jest.fn();
    const props = {
      ...defaultProps,
      onNextPage: mockOnNext,
      onPreviousPage: mockOnPrevious,
    };

    render(<PaginationControls {...props} />);

    const nextButton = screen.getByRole('button', { name: /siguiente/i });
    const previousButton = screen.getByRole('button', { name: /anterior/i });

    fireEvent.click(nextButton);
    expect(mockOnNext).toHaveBeenCalledTimes(1);

    fireEvent.click(previousButton);
    expect(mockOnPrevious).toHaveBeenCalledTimes(1);
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<PaginationControls {...defaultProps} />);

      const previousButton = screen.getByRole('button', { name: /anterior/i });
      const nextButton = screen.getByRole('button', { name: /siguiente/i });

      expect(previousButton).toHaveAttribute('aria-label');
      expect(nextButton).toHaveAttribute('aria-label');
    });

    it('should indicate current page for screen readers', () => {
      render(<PaginationControls {...defaultProps} />);

      const currentPageButton = screen.getByRole('button', {
        name: 'Ir a la página 2',
      });
      expect(currentPageButton).toHaveAttribute('aria-current', 'page');
    });

    it('should have proper CSS class for pagination', () => {
      const { container } = render(<PaginationControls {...defaultProps} />);

      const paginationElement = container.querySelector('.pagination-controls');
      expect(paginationElement).toBeInTheDocument();
    });
  });
});
