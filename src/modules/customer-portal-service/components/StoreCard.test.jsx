import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { StoreCard } from './StoreCard'

describe('StoreCard', () => {
  afterEach(() => {
    cleanup()
  })

  it('shows map button when lat and lng are present', () => {
    render(<StoreCard store={{
      id: '1', code: 'DN-HC', name: 'CN Hải Châu',
      address: '321 Lê Duẩn', phone: '0236456789',
      lat: 16.0471, lng: 108.2068,
      openHours: '06:00 - 23:00',
    }} />)

    expect(screen.getByRole('button', { name: /Xem bản đồ/i })).toBeInTheDocument()
  })

  it('hides map button when lat or lng is null', () => {
    render(<StoreCard store={{
      id: '1', code: 'DN-HC', name: 'CN Hải Châu',
      address: '321 Lê Duẩn', phone: '0236456789',
      lat: null, lng: null,
    }} />)

    expect(screen.queryByRole('button', { name: /Xem bản đồ/i })).not.toBeInTheDocument()
  })

  it('renders store info with phone and hours', () => {
    render(<StoreCard store={{
      id: '1', code: 'DN-HC', name: 'CN Hải Châu',
      address: '321 Lê Duẩn, Hải Châu, Đà Nẵng',
      phone: '0236456789',
      openHours: '06:00 - 23:00',
    }} />)

    expect(screen.getByText(/0236456789/)).toBeInTheDocument()
    expect(screen.getByText(/06:00 - 23:00/)).toBeInTheDocument()
  })
})
