import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Banner from '../Banner';

describe('Banner', () => {
  it('renders with default props', () => {
    render(<Banner />);
    expect(screen.getByText('Welcome to our application!')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    const message = 'Test message';
    render(<Banner message={message} />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('renders with different types', () => {
    const { rerender } = render(<Banner type="success" />);
    expect(screen.getByRole('alert')).toHaveClass('bg-green-100');

    rerender(<Banner type="error" />);
    expect(screen.getByRole('alert')).toHaveClass('bg-red-100');

    rerender(<Banner type="warning" />);
    expect(screen.getByRole('alert')).toHaveClass('bg-yellow-100');

    rerender(<Banner type="info" />);
    expect(screen.getByRole('alert')).toHaveClass('bg-blue-100');
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<Banner onClose={onClose} />);
    
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not render close button when onClose is not provided', () => {
    render(<Banner />);
    expect(screen.queryByLabelText('Close')).not.toBeInTheDocument();
  });
});
