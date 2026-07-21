import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MotionConfig } from 'motion/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { appRoutes } from '@/app/router'
import { reasons } from '@/content/reasons'

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      cardTitle: 'Meus poemas',
      poems: [
        { id: 'poem-1', title: 'Maré', body: 'Primeiro poema de teste.' },
        { id: 'poem-2', title: 'Farol', body: 'Segundo poema de teste.' },
      ],
    }),
  }))
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function renderRoute(pathname = '/', state?: Record<string, unknown>) {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: [{ pathname, state }],
  })

  render(
    <MotionConfig reducedMotion="always">
      <RouterProvider router={router} />
    </MotionConfig>,
  )

  return router
}

async function expectDialogVisible() {
  const dialog = await screen.findByRole('dialog')
  await waitFor(() => expect(dialog).toBeVisible())
  return dialog
}

describe('ocean invitation', () => {
  it('renders the shortened invitation and all six accessible bubbles', () => {
    renderRoute()

    expect(screen.getByRole('heading', { name: /por que você deveria dar uma chance a mim/i })).toBeVisible()
    expect(screen.getByText('Eai, mereço uma chance?')).toBeVisible()
    expect(screen.getByRole('button', { name: /tocar música/i })).toBeVisible()
    expect(screen.getByRole('slider', { name: /volume da música/i })).toBeVisible()
    expect(screen.queryByText('Cada bolha guarda uma pequena resposta.')).not.toBeInTheDocument()
    for (const reason of reasons) {
      expect(screen.getByRole('link', { name: new RegExp(reason.bubbleLabel, 'i') })).toBeVisible()
    }
    expect(screen.getAllByRole('link')).toHaveLength(6)
  })

  it.each(reasons)('maps /motivos/$slug to its centralized content', async (reason) => {
    renderRoute(`/motivos/${reason.slug}`)

    await expectDialogVisible()
    expect(screen.getByRole('heading', { name: reason.title })).toBeVisible()
    expect(screen.getByText(reason.introduction)).toBeVisible()
  })

  it('opens a reason without remounting the ocean and closes back to home', async () => {
    const user = userEvent.setup()
    const router = renderRoute()
    const ocean = screen.getByTestId('ocean-layout')

    await user.click(screen.getByRole('link', { name: /Poesia/i }))

    expect(router.state.location.pathname).toBe('/motivos/poesia')
    await expectDialogVisible()
    expect(screen.getByTestId('ocean-layout')).toBe(ocean)

    await user.click(screen.getByRole('button', { name: /Voltar ao oceano/i }))

    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes with Escape and restores focus to the selected bubble', async () => {
    const user = userEvent.setup()
    const router = renderRoute()
    const poetryBubble = screen.getByRole('link', { name: /Poesia/i })

    poetryBubble.focus()
    await user.keyboard('{Enter}')
    await expectDialogVisible()
    await waitFor(() => expect(screen.getByRole('heading', { name: reasons[1].title })).toHaveFocus())

    await user.keyboard('{Escape}')

    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
    await waitFor(() => expect(poetryBubble).toHaveFocus())
  })

  it('closes a directly opened reason safely to the homepage', async () => {
    const user = userEvent.setup()
    const router = renderRoute('/motivos/lol-e-jogos')

    await expectDialogVisible()
    await user.click(screen.getByRole('button', { name: /Fechar painel/i }))

    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
  })

  it('keeps the Encontros images in a controllable carousel', async () => {
    const user = userEvent.setup()
    renderRoute('/motivos/encontros')

    await expectDialogVisible()
    expect(screen.getByRole('region', { name: /Fotos de Encontros/i })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Exibir imagem 1 de 7' })).toHaveAttribute('aria-current', 'true')

    await user.click(screen.getByRole('button', { name: 'Próxima imagem' }))

    await waitFor(() => expect(screen.getByRole('button', { name: 'Exibir imagem 2 de 7' })).toHaveAttribute('aria-current', 'true'))
  })

  it('uses the real image proportions in the Sites adaptive gallery', async () => {
    renderRoute('/motivos/sites')

    await expectDialogVisible()
    const gallery = screen.getByLabelText('Espaços reservados para suas imagens')
    expect(gallery).toHaveAttribute('data-gallery', 'sites')
    expect(gallery.querySelector('[data-media-id="sites-liva"]')).toHaveAttribute('data-aspect', 'landscape')
    expect(gallery.querySelector('[data-media-id="sites-rpg"]')).toHaveAttribute('data-aspect', 'landscape')
  })

  it('loads and switches poems delivered by the Vercel Function', async () => {
    const user = userEvent.setup()
    renderRoute('/motivos/poesia')

    await expectDialogVisible()
    expect(await screen.findByText('Primeiro poema de teste.')).toBeVisible()

    await user.selectOptions(screen.getByRole('combobox', { name: /Escolha um poema/i }), '1')

    expect(screen.getByText('Segundo poema de teste.')).toBeVisible()
  })

  it('redirects an unknown route without breaking', async () => {
    const unknownPathRouter = renderRoute('/um-lugar-inexistente')
    await waitFor(() => expect(unknownPathRouter.state.location.pathname).toBe('/'))
    expect(screen.getByRole('heading', { name: /por que você deveria dar uma chance a mim/i })).toBeVisible()
  })

  it('redirects an unknown reason slug without opening an empty dialog', async () => {
    const unknownReasonRouter = renderRoute('/motivos/slug-invalido')
    await waitFor(() => expect(unknownReasonRouter.state.location.pathname).toBe('/'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Sites/i })).toBeVisible()
  })
})
