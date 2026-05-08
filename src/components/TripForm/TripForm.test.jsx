import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TripForm from './TripForm';
import { TripProvider } from '../../store/tripStore';

describe('TripForm', () => {
  it('renders form inputs correctly', () => {
    render(
      <TripProvider>
        <TripForm />
      </TripProvider>
    );
    expect(screen.getByPlaceholderText(/e.g. Kyoto, Japan/i)).toBeInTheDocument();
    expect(screen.getByText(/Duration \(Days\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Generate Itinerary/i)).toBeInTheDocument();
  });
});
