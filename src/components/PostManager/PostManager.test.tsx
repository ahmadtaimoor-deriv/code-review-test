import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostManager } from './PostManager';
import { Post } from '../types/post.types';
import '@testing-library/jest-dom';

// Mock data
const mockPost: Post = {
  id: '1',
  content: 'Test post content',
  images: [],
  status: 'draft'
};

const mockFile = new File(['test'], 'test.png', { type: 'image/png' });

// Mock URL.createObjectURL
window.URL.createObjectURL = jest.fn(() => 'mock-url');
window.URL.revokeObjectURL = jest.fn();

describe('PostManager', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('renders post editor with empty state', () => {
    render(<PostManager />);
    
    expect(screen.getByPlaceholderText("What's on your mind?")).toBeInTheDocument();
    expect(screen.getByText('0/280')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Schedule' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Publish Now' })).toBeDisabled();
  });

  it('validates post content length', async () => {
    render(<PostManager initialPosts={[mockPost]} />);
    const textarea = screen.getByPlaceholderText("What's on your mind?");
    
    // Test empty content
    expect(screen.getByRole('button', { name: 'Publish Now' })).toBeDisabled();
    
    // Test valid content
    await userEvent.type(textarea, 'Valid post content');
    expect(screen.getByDisplayValue('Valid post content')).toBeInTheDocument();
    expect(screen.getByText('19/280')).toBeInTheDocument();
    
    // Test content exceeding limit
    const longContent = 'a'.repeat(281);
    await userEvent.clear(textarea);
    await userEvent.type(textarea, longContent);
    expect(textarea).toHaveValue(longContent.slice(0, 280));
  });

  it('handles image upload', async () => {
    render(<PostManager initialPosts={[mockPost]} />);
    const input = screen.getByLabelText(/upload image/i);
    
    // Upload image
    await userEvent.upload(input, mockFile);
    
    // Check preview
    expect(screen.getByAltText('Upload 1')).toHaveAttribute('src', 'mock-url');
    
    // Check progress bar
    expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
    
    // Fast-forward upload simulation
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    // Check upload completed
    expect(screen.queryByTestId('progress-bar')).not.toBeInTheDocument();
  });

  it('saves draft automatically', async () => {
    const { rerender } = render(<PostManager initialPosts={[mockPost]} />);
    const textarea = screen.getByPlaceholderText("What's on your mind?");
    
    // Type content
    await userEvent.type(textarea, 'Draft content');
    
    // Wait for debounce
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Unmount and remount to test persistence
    rerender(<PostManager initialPosts={[mockPost]} />);
    
    // Check if draft is loaded
    expect(screen.getByDisplayValue('Draft content')).toBeInTheDocument();
  });

  it('schedules post successfully', async () => {
    const onPostScheduled = jest.fn();
    render(
      <PostManager
        initialPosts={[mockPost]}
        onPostScheduled={onPostScheduled}
      />
    );
    
    // Fill content
    await userEvent.type(
      screen.getByPlaceholderText("What's on your mind?"),
      'Scheduled post content'
    );
    
    // Click schedule
    await userEvent.click(screen.getByRole('button', { name: 'Schedule' }));
    
    // Check if callback was called
    expect(onPostScheduled).toHaveBeenCalledWith(
      expect.objectContaining({
        content: 'Scheduled post content',
        status: 'scheduled'
      })
    );
  });

  it('updates analytics in real-time', async () => {
    render(<PostManager initialPosts={[{ ...mockPost, status: 'published' }]} />);
    
    // Initial analytics
    expect(screen.getByText('Views')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    
    // Wait for analytics update
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    // Check if analytics updated
    await waitFor(() => {
      expect(screen.getByText(/[1-9][0-9]*/)).toBeInTheDocument();
    });
  });

  it('handles publish flow correctly', async () => {
    const onPostPublished = jest.fn();
    render(
      <PostManager
        initialPosts={[mockPost]}
        onPostPublished={onPostPublished}
      />
    );
    
    // Fill content
    await userEvent.type(
      screen.getByPlaceholderText("What's on your mind?"),
      'Post to publish'
    );
    
    // Click publish
    await userEvent.click(screen.getByRole('button', { name: 'Publish Now' }));
    
    // Check loading state
    expect(screen.getByText('Publishing...')).toBeInTheDocument();
    
    // Wait for publish
    await waitFor(() => {
      expect(onPostPublished).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'Post to publish',
          status: 'published'
        })
      );
    });
  });
});
