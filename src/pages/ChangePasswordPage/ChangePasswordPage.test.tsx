import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChangePasswordPage from './ChangePasswordPage';
import toast from 'react-hot-toast';

// Mock the react-hot-toast library
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe('ChangePasswordPage', () => {
  beforeEach(() => {
    // Clear all mocks before each test to prevent state from leaking
    jest.clearAllMocks();
  });

  it('should render the form with all fields and the title', () => {
    render(<ChangePasswordPage />);
    
    // Check for the main heading
    expect(screen.getByRole('heading', { name: /change password/i })).toBeInTheDocument();

    // Check for all three password input fields using more specific queries
    expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^New Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Confirm New Password$/i)).toBeInTheDocument();

    // Check for the submit button
    expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
  });

  it('should show an error toast and not reset the form if new passwords do not match', () => {
    render(<ChangePasswordPage />);

    // Get input elements using more specific queries
    const currentPasswordInput = screen.getByLabelText(/^Current Password$/i);
    const newPasswordInput = screen.getByLabelText(/^New Password$/i);
    const confirmNewPasswordInput = screen.getByLabelText(/^Confirm New Password$/i);
    const submitButton = screen.getByRole('button', { name: /change password/i });

    // Simulate user typing into the fields
    fireEvent.change(currentPasswordInput, { target: { value: 'oldpass123' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newpass456' } });
    fireEvent.change(confirmNewPasswordInput, { target: { value: 'newpass789' } }); // Mismatch

    // Submit the form
    fireEvent.click(submitButton);

    // Assert that the error toast was called
    expect(toast.error).toHaveBeenCalledWith('New password and confirm password do not match.');
    
    // Assert that the success toast was NOT called
    expect(toast.success).not.toHaveBeenCalled();

    // Assert that the form fields were NOT reset
    expect(currentPasswordInput).toHaveValue('oldpass123');
    expect(newPasswordInput).toHaveValue('newpass456');
    expect(confirmNewPasswordInput).toHaveValue('newpass789');
  });

  it('should show a success toast and reset the form if new passwords match', () => {
    render(<ChangePasswordPage />);

    // Get input elements using more specific queries
    const currentPasswordInput = screen.getByLabelText(/^Current Password$/i);
    const newPasswordInput = screen.getByLabelText(/^New Password$/i);
    const confirmNewPasswordInput = screen.getByLabelText(/^Confirm New Password$/i);
    const submitButton = screen.getByRole('button', { name: /change password/i });

    // Simulate user typing into the fields with matching new passwords
    fireEvent.change(currentPasswordInput, { target: { value: 'oldpass123' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newpass456' } });
    fireEvent.change(confirmNewPasswordInput, { target: { value: 'newpass456' } }); // Match

    // Submit the form
    fireEvent.click(submitButton);

    // Assert that the success toast was called
    expect(toast.success).toHaveBeenCalledWith('Password change request submitted! (Mock)');

    // Assert that the error toast was NOT called
    expect(toast.error).not.toHaveBeenCalled();

    // Assert that the form fields were reset to empty strings
    expect(currentPasswordInput).toHaveValue('');
    expect(newPasswordInput).toHaveValue('');
    expect(confirmNewPasswordInput).toHaveValue('');
  });
});