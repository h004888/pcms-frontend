import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const mockApiGet = vi.fn()

vi.mock('@core/http/apiClient.js', () => ({
  apiClient: {
    get: (...args) => mockApiGet(...args),
  },
}))

import { StoreLocatorPage } from './StoreLocatorPage'

function renderWithProviders(ui) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </QueryClientProvider>,
  )
}

describe('StoreLocatorPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders province dropdown from API', async () => {
    mockApiGet.mockResolvedValue({ data: ['Đà Nẵng', 'Hà Nội', 'Hồ Chí Minh'] })

    renderWithProviders(<StoreLocatorPage />)

    await waitFor(() => {
      const select = screen.getByRole('combobox', { name: /Tỉnh\/Thành/i })
      const options = Array.from(select.querySelectorAll('option')).map(o => o.textContent)
      expect(options).toContain('Đà Nẵng')
      expect(options).toContain('Hà Nội')
      expect(options).toContain('Hồ Chí Minh')
    })
  })
})
