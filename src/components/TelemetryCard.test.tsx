import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TelemetryCard } from '../components/TelemetryCard'
import { TelemetryData } from '../types/telemetry'

describe('TelemetryCard', () => {
  const mockData: TelemetryData = {
    temp: 23.5,
    hum: 65.2,
    soil: 78.4,
    status: 'SAFE',
    ts: '2025-12-04T10:30:45.123Z',
  }

  it('renders temperature value correctly', () => {
    render(
      <TelemetryCard
        label="Temperature"
        value={mockData.temp}
        unit="temp"
        useFahrenheit={false}
      />
    )

    expect(screen.getByText('Temperature')).toBeInTheDocument()
    expect(screen.getByText('23.5°C')).toBeInTheDocument()
  })

  it('converts temperature to Fahrenheit when enabled', () => {
    render(
      <TelemetryCard
        label="Temperature"
        value={mockData.temp}
        unit="temp"
        useFahrenheit={true}
      />
    )

    // 23.5°C = 74.3°F
    expect(screen.getByText('74.3°F')).toBeInTheDocument()
  })

  it('renders humidity value correctly', () => {
    render(
      <TelemetryCard
        label="Humidity"
        value={mockData.hum}
        unit="hum"
      />
    )

    expect(screen.getByText('Humidity')).toBeInTheDocument()
    expect(screen.getByText('65.2%')).toBeInTheDocument()
  })

  it('displays min/max values when provided', () => {
    render(
      <TelemetryCard
        label="Soil Moisture"
        value={mockData.soil}
        unit="soil"
        min={50}
        max={95}
      />
    )

    expect(screen.getByText('Min')).toBeInTheDocument()
    expect(screen.getByText('50.0%')).toBeInTheDocument()
    expect(screen.getByText('Max')).toBeInTheDocument()
    expect(screen.getByText('95.0%')).toBeInTheDocument()
  })

  it('shows loading skeleton when isLoading is true', () => {
    const { container } = render(
      <TelemetryCard
        label="Temperature"
        value={0}
        unit="temp"
        isLoading={true}
      />
    )

    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('applies alert styling when isAlert is true', () => {
    const { container } = render(
      <TelemetryCard
        label="Temperature"
        value={mockData.temp}
        unit="temp"
        isAlert={true}
      />
    )

    const card = container.firstChild
    expect(card).toHaveClass('bg-red-50')
  })
})
