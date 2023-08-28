import { test, BrowserContext, expect } from '@playwright/test'
import { icelandicAndNoPopupUrl, urls } from '../../../../support/urls'
import { session } from '../../../../support/session'
import { label } from '../../../../support/i18n'
import { messages } from '@island.is/service-portal/vehicles/messages'
import { m } from '@island.is/service-portal/core/messages'
import { disableI18n } from '../../../../support/disablers'

const homeUrl = `${urls.islandisBaseUrl}/minarsidur`
test.use({ baseURL: urls.islandisBaseUrl })

test.describe('MS - Work Machines', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await session({
      browser: browser,
      storageState: 'service-portal-amerika.json',
      homeUrl,
      phoneNumber: '0102989',
      idsLoginOn: true,
    })
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('work machines', async () => {
    const page = await context.newPage()
    await disableI18n(page)

    await test.step('should display data and filter overview', async () => {
      // Arrange
      await page.goto(icelandicAndNoPopupUrl('/minarsidur/okutaeki/vinnuvelar'))

      // Act
      const filterButton = page
        .locator(`role=button[name="${label(m.openFilter)}"]`)
        .first()
      const inputField = page.getByRole('textbox', {
        name: label(m.searchLabel),
      })
      await inputField.click()
      await inputField.type('hys', { delay: 200 })
      const actionCardButton = page
        .locator(`[data-testid="action-card-cta"]`)
        .getByRole('button')
        .first()

      await filterButton.click()

      // Assert
      await expect(filterButton).toBeVisible()
      await expect(actionCardButton).toBeVisible()
      await expect(
        page.locator(`text=${label(m.clearAllFilters)}`),
      ).toBeVisible()
    })

    await test.step('should display detail', async () => {
      // Arrange
      await page.goto(icelandicAndNoPopupUrl('/minarsidur/okutaeki/vinnuvelar'))
      await page.waitForLoadState('networkidle')

      // Act
      const actionCardButton = page
        .locator(`[data-testid="action-card-cta"]`)
        .getByRole('button')
        .first()
      await actionCardButton.click()

      const basicInfoText = page
        .getByText(label(messages.baseInfoWorkMachineTitle))
        .first()

      // Assert
      await expect(page).toHaveURL(/minarsidur\/okutaeki\/vinnuvelar\/.+\/.+/)
      await expect(basicInfoText).toBeVisible()
    })
  })
})
