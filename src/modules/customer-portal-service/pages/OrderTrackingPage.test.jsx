import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { apiClient } from '@core/http/apiClient.js'

// Mock the apiClient BEFORE importing the component
vi.mock('@core/http/apiClient.js', () => ({
  apiClient: {
    get: vi.fn()
  }
}))

import { OrderTrackingPage } from './OrderTrackingPage'

describe('OrderTrackingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('calls backend API and displays order when found', async () => {
    const user = userEvent.setup()

    // Mock successful API response matching order-service OrderResponse
    apiClient.get.mockResolvedValueOnce({
      data: {
        orderNumber: 'ORD2607010010',
        status: 'APPROVED',
        subtotal: 36000,
        total: 36000,
        discount: 0,
        createdAt: '2026-07-01T00:12:11.095Z',
        timeline: [],
        items: [{ medicineName: 'Paracetamol 500mg', quantity: 2, unitPrice: 18000 }]
      }
    })

    render(
      <BrowserRouter>
        <OrderTrackingPage />
      </BrowserRouter>
    )

    await user.type(screen.getByPlaceholderText(/ORD-.../i), 'ORD2607010010')
    await user.type(screen.getByPlaceholderText(/0912 345 678/i), '0912345684')
    await user.click(screen.getByRole('button', { name: /tra cứu/i }))

    expect(apiClient.get).toHaveBeenCalledWith('/orders/number/ORD2607010010')
    expect(screen.getByText('ORD2607010010')).toBeInTheDocument()
    expect(screen.queryByText(/không tìm thấy/i)).not.toBeInTheDocument()
  })

  it('shows not-found message when API fails', async () => {
    const user = userEvent.setup()

    apiClient.get.mockRejectedValueOnce(new Error('Not found'))

    render(
      <BrowserRouter>
        <OrderTrackingPage />
      </BrowserRouter>
    )

    await user.type(screen.getByPlaceholderText(/ORD-.../i), 'INVALID')
    await user.type(screen.getByPlaceholderText(/0912 345 678/i), '0000000000')
    await user.click(screen.getByRole('button', { name: /tra cứu/i }))

    expect(screen.getByText(/không tìm thấy đơn hàng/i)).toBeInTheDocument()
  })
})
