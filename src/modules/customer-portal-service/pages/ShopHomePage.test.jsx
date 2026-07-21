import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const mockGetShopHome = vi.fn()

vi.mock('../api/shopApi', () => ({
  getShopHome: () => mockGetShopHome(),
}))

import { ShopHomePage } from './ShopHomePage'

const buildHomeData = (overrides = {}) => ({
  heroBanners: [],
  bestSellers: [],
  featuredCategories: [],
  quickLinks: [],
  flashSales: [],
  ...overrides,
})

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

describe('ShopHomePage — QuickLinks onClick handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders QuickLink with correct href for valid route', async () => {
    mockGetShopHome.mockResolvedValue(buildHomeData({
      quickLinks: [
        { id: '1', label: 'Thuốc', icon: 'pill', href: '/search' },
      ],
    }))

    renderWithProviders(<ShopHomePage />)

    const link = await screen.findByRole('link', { name: /Thuốc/i })
    expect(link).toBeInTheDocument()
    expect(link.getAttribute('href')).toBe('/search')
  })

  it('prevents default for invalid QuickLink href', async () => {
    mockGetShopHome.mockResolvedValue(buildHomeData({
      quickLinks: [
        { id: '1', label: 'Cẩm nang Thuốc', icon: 'Stethoscope', href: '/cam-nang' },
      ],
    }))

    renderWithProviders(<ShopHomePage />)

    const link = await screen.findByRole('link', { name: /Cẩm nang/i })
    expect(link).toBeInTheDocument()

    const prevented = !fireEvent.click(link)

    expect(prevented).toBe(true)
  })

  it('does NOT prevent default for valid QuickLink href', async () => {
    mockGetShopHome.mockResolvedValue(buildHomeData({
      quickLinks: [
        { id: '1', label: 'Đơn của tôi', icon: 'FileText', href: '/my-orders' },
      ],
    }))

    renderWithProviders(<ShopHomePage />)

    const link = await screen.findByRole('link', { name: /Đơn của tôi/i })
    expect(link).toBeInTheDocument()

    const prevented = !fireEvent.click(link)

    expect(prevented).toBe(false)
  })

  it('mixed: invalid hrefs are blocked, valid hrefs navigate', async () => {
    mockGetShopHome.mockResolvedValue(buildHomeData({
      quickLinks: [
        { id: '1', label: 'Thuốc', icon: 'pill', href: '/search' },
        { id: '2', label: 'Vaccine', icon: 'vaccine', href: '/vaccines' },
        { id: '3', label: 'Đơn của tôi', icon: 'FileText', href: '/my-orders' },
        { id: '4', label: 'Sức khỏe', icon: 'health', href: '/health-articles' },
      ],
    }))

    renderWithProviders(<ShopHomePage />)

    const vaccineLink = await screen.findByRole('link', { name: /Vaccine/i })
    expect(!fireEvent.click(vaccineLink)).toBe(true)

    const ordersLink = screen.getByRole('link', { name: /Đơn của tôi/i })
    expect(!fireEvent.click(ordersLink)).toBe(false)
  })
})
