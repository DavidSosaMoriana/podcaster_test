import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchFilter from '../SearchFilter';

describe('SearchFilter', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with initial value', () => {
    render(
      <SearchFilter
        value="test search"
        onChange={mockOnChange}
        totalCount={10}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('test search');
  });

  it('should display total count correctly', () => {
    render(<SearchFilter value="" onChange={mockOnChange} totalCount={25} />);

    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('should handle input changes', () => {
    render(<SearchFilter value="" onChange={mockOnChange} totalCount={0} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new search' } });

    expect(mockOnChange).toHaveBeenCalledWith('new search');
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('should have correct accessibility attributes', () => {
    render(<SearchFilter value="" onChange={mockOnChange} totalCount={0} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute(
      'aria-label',
      'Filter podcasts by name or author'
    );
    expect(input).toHaveAttribute('type', 'text');
  });

  it('should display correct placeholder text', () => {
    render(<SearchFilter value="" onChange={mockOnChange} totalCount={0} />);

    const input = screen.getByPlaceholderText('Filter podcasts...');
    expect(input).toBeInTheDocument();
  });

  it('should apply correct CSS classes', () => {
    const { container } = render(
      <SearchFilter value="" onChange={mockOnChange} totalCount={5} />
    );

    expect(container.firstChild).toHaveClass('search-filter');
    expect(screen.getByText('5')).toHaveClass('search-filter__counter');
    expect(screen.getByRole('textbox')).toHaveClass('search-filter__input');
  });

  it('should update display when count changes', () => {
    const { rerender } = render(
      <SearchFilter value="" onChange={mockOnChange} totalCount={10} />
    );

    expect(screen.getByText('10')).toBeInTheDocument();

    rerender(<SearchFilter value="" onChange={mockOnChange} totalCount={0} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should clear value when external state changes (integration with Header)', () => {
    const { rerender } = render(
      <SearchFilter
        value="some search"
        onChange={mockOnChange}
        totalCount={5}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('some search');

    // Simular que el Header limpió el filtro
    rerender(<SearchFilter value="" onChange={mockOnChange} totalCount={10} />);

    expect(input.value).toBe('');
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should handle controlled component behavior correctly', () => {
    render(
      <SearchFilter
        value="controlled value"
        onChange={mockOnChange}
        totalCount={3}
      />
    );

    const input = screen.getByRole('textbox') as HTMLInputElement;

    // Verificar que el valor inicial es el controlado
    expect(input.value).toBe('controlled value');

    // Simular cambio en el input
    fireEvent.change(input, { target: { value: 'new value' } });

    // Verificar que se llamó el onChange pero el valor no cambió hasta que el padre lo actualice
    expect(mockOnChange).toHaveBeenCalledWith('new value');
  });
});
