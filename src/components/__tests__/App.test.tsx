import { render, screen } from '@testing-library/react';
import App from '../../App';

describe('App', () => {
  test('renders main layout components', () => {
    render(<App />);
    
    // Check for navbar
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    
    // Check for main content
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByText('Welcome to Image Gallery')).toBeInTheDocument();
    expect(screen.getByText(/Upload, share, and explore/)).toBeInTheDocument();
    
  });

  test('renders with proper layout classes', () => {
    render(<App />);
    
    // Check for flex layout
    const mainContainer = screen.getByTestId('app-container');
    expect(mainContainer).toHaveClass('min-h-screen', 'flex', 'flex-col');
    
    // Check for main content flex grow
    const mainContent = screen.getByRole('main');
    expect(mainContent).toHaveClass('flex-grow');
  });
});
