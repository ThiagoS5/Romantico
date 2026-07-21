import { expect, test, type Page } from '@playwright/test'
import { PNG } from 'pngjs'

function watchConsole(page: Page) {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(error.message))
  return errors
}

function overlaps(a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
}

function sampleImage(buffer: Buffer) {
  const image = PNG.sync.read(buffer)
  let energy = 0
  let visiblePixels = 0

  for (let index = 0; index < image.data.length; index += 4) {
    const red = image.data[index]
    const green = image.data[index + 1]
    const blue = image.data[index + 2]
    const alpha = image.data[index + 3]
    energy += red + green + blue
    if (alpha > 0 && red + green + blue > 8) visiblePixels += 1
  }

  return { energy, visiblePixels }
}

function imageDifference(firstBuffer: Buffer, secondBuffer: Buffer) {
  const first = PNG.sync.read(firstBuffer)
  const second = PNG.sync.read(secondBuffer)
  let difference = 0
  let comparedChannels = 0
  const left = Math.floor(first.width * 0.25)
  const right = Math.ceil(first.width * 0.75)
  const top = Math.floor(first.height * 0.25)
  const bottom = Math.ceil(first.height * 0.75)

  for (let y = top; y < bottom; y += 1) {
    for (let x = left; x < right; x += 1) {
      const index = (y * first.width + x) * 4
      difference += Math.abs(first.data[index] - second.data[index])
      difference += Math.abs(first.data[index + 1] - second.data[index + 1])
      difference += Math.abs(first.data[index + 2] - second.data[index + 2])
      comparedChannels += 3
    }
  }

  return difference / comparedChannels
}

test('desktop keeps the invitation clear while a routed panel opens and closes', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Desktop composition check')
  const consoleErrors = watchConsole(page)
  await page.goto('/')

  const invitation = page.locator('.invitation')
  const invitationBox = await invitation.boundingBox()
  expect(invitationBox).not.toBeNull()

  const bubbles = page.locator('[data-reason-bubble]')
  await expect(bubbles).toHaveCount(6)
  for (let index = 0; index < 6; index += 1) {
    const bubbleBox = await bubbles.nth(index).boundingBox()
    expect(bubbleBox).not.toBeNull()
    expect(overlaps(invitationBox!, bubbleBox!)).toBe(false)
  }

  const poetryBubble = page.getByRole('link', { name: /Poesia/i })
  await poetryBubble.hover()
  await expect(page.getByText('Talvez o próximo poema tenha o seu nome.')).toBeVisible()
  expect(await invitation.boundingBox()).toEqual(invitationBox)

  await poetryBubble.click()
  await expect(page).toHaveURL(/\/motivos\/poesia$/)
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Algumas coisas eu consigo dizer melhor escrevendo' })).toBeVisible()
  await expect(page.getByTestId('ocean-layout')).toBeVisible()

  await page.getByRole('button', { name: /Voltar ao oceano/i }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('link', { name: /Poesia/i })).toBeFocused()
  expect(consoleErrors).toEqual([])
})

test('direct URLs and Escape remain safe', async ({ page }) => {
  const consoleErrors = watchConsole(page)
  await page.goto('/motivos/lol-e-jogos')

  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Também posso ser seu duo' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page).toHaveURL(/\/$/)

  await page.goto('/motivos/slug-invalido')
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { name: /por que você deveria dar uma chance a mim/i })).toBeVisible()
  expect(consoleErrors).toEqual([])
})

test('mobile uses a scrollable two-column field and works without hover', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'Mobile composition check')
  const consoleErrors = watchConsole(page)
  await page.goto('/')

  await expect(page.locator('[data-reason-bubble]')).toHaveCount(6)
  await expect(page.getByText('Este lugar já é uma pequena demonstração.')).toBeVisible()
  await page.getByRole('link', { name: /Poesia/i }).click()
  await expect(page).toHaveURL(/\/motivos\/poesia$/)
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Algumas coisas eu consigo dizer melhor escrevendo' })).toBeVisible()
  await page.getByRole('button', { name: /Fechar painel/i }).click()
  await expect(page).toHaveURL(/\/$/)
  expect(consoleErrors).toEqual([])
})

test('desktop maps fish and cat cursors to their intended surfaces', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Fine-pointer cursor check')
  await page.goto('/')

  const fishCursor = await page.getByTestId('ocean-layout').evaluate((element) => getComputedStyle(element).cursor)
  const catCursor = await page.getByRole('link', { name: /Poesia/i }).evaluate((element) => getComputedStyle(element).cursor)
  const headingCursor = await page
    .getByRole('heading', { name: /por que você deveria dar uma chance a mim/i })
    .evaluate((element) => getComputedStyle(element).cursor)

  expect(fishCursor).toContain('peixe-32.png')
  expect(catCursor).toContain('gato-32.png')
  expect(headingCursor).toContain('peixe-32.png')

  await page.getByRole('link', { name: /Poesia/i }).click()
  const closeCursor = await page.getByRole('button', { name: /Fechar painel/i }).evaluate((element) => getComputedStyle(element).cursor)
  const dialogTextCursor = await page.locator('.reason-dialog__intro').evaluate((element) => getComputedStyle(element).cursor)

  expect(closeCursor).toContain('gato-32.png')
  expect(dialogTextCursor).toContain('peixe-32.png')
})

test('reduced motion disables continuous ocean animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  const animationName = await page.locator('.ocean-caustics').first().evaluate((element) => getComputedStyle(element).animationName)
  expect(animationName).toBe('none')
  await expect(page.locator('.water-ripple-effect__canvas')).toHaveCount(0)

  await page.getByRole('link', { name: /Sites/i }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
})

test('the WebGL water layer is nonblank and keeps moving', async ({ page }) => {
  await page.goto('/')
  const canvas = page.locator('.water-ripple-effect__canvas')
  await expect(canvas).toBeVisible()

  await page.waitForTimeout(500)
  const ambientStart = await canvas.screenshot()
  const firstSample = sampleImage(ambientStart)
  expect(firstSample.visiblePixels).toBeGreaterThan(0)

  await page.waitForTimeout(180)
  const ambientEnd = await canvas.screenshot()
  const ambientDifference = imageDifference(ambientStart, ambientEnd)
  expect(ambientDifference).toBeGreaterThan(0)
  const canvasBox = await canvas.boundingBox()
  expect(canvasBox).not.toBeNull()

  await page.mouse.move(canvasBox!.x + canvasBox!.width / 2, canvasBox!.y + canvasBox!.height / 2)
  await expect(page.locator('.water-ripple-effect')).toHaveAttribute('data-ripple-active', 'true')
  await page.waitForTimeout(180)
  const hoverFrame = await canvas.screenshot()
  const hoverDifference = imageDifference(ambientEnd, hoverFrame)
  const secondSample = sampleImage(hoverFrame)
  expect(secondSample.energy).not.toBe(firstSample.energy)
  expect(hoverDifference).toBeGreaterThan(0.1)
})
