import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatsCard from '../../components/admin/StatsCard';

describe('StatsCard Component', () => {
  it('should render stats card with all props', () => {
    render(
      <StatsCard
        title="Total Users"
        value={100}
        icon="👥"
        color="blue"
        subtitle="Active users"
      />
    );

    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('👥')).toBeInTheDocument();
    expect(screen.getByText('Active users')).toBeInTheDocument();
  });

  it('should render without subtitle', () => {
    render(
      <StatsCard
        title="Total Fields"
        value={50}
        icon="🏟️"
        color="green"
      />
    );

    expect(screen.getByText('Total Fields')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('should handle zero value', () => {
    render(
      <StatsCard
        title="Pending Bookings"
        value={0}
        icon="📋"
        color="yellow"
      />
    );

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should handle large numbers', () => {
    render(
      <StatsCard
        title="Total Revenue"
        value="50,000,000"
        icon="💰"
        color="purple"
        subtitle="VNĐ"
      />
    );

    expect(screen.getByText('50,000,000')).toBeInTheDocument();
  });

  it('should apply correct color class', () => {
    const { container } = render(
      <StatsCard
        title="Test"
        value={10}
        icon="✅"
        color="red"
      />
    );

    // Check if the color class is applied
    const statsCard = container.querySelector('.stats-card');
    expect(statsCard).toHaveClass('color-red');
  });
});
