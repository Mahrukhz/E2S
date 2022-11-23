import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import Dashboard from '../src/components/pages/Dashboard'


test('should render dashboard title element', () => {
    // Given
    render(<Dashboard />);
    // When
    const dashboardElement = screen.getByText("Dashboard")

    // Then
    expect(dashboardElement).toBeInTheDocument();
});

