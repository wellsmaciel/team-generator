const { test, expect } = require('@playwright/test');

async function generateTeams(page) {
  await page.getByRole('navigation', { name: 'Main', exact: true })
    .getByRole('button', { name: 'Players', exact: true }).click();
  for (const [name, score] of [['Ana', 4], ['Bia', 5], ['Caio', 6], ['Duda', 7]]) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel(/Estimated skill/).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }
  await page.getByRole('navigation', { name: 'Main', exact: true })
    .getByRole('button', { name: 'Match', exact: true }).click();
  await page.getByRole('button', { name: 'Select All Players', exact: true }).click();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
}

test('share actions have clear labels, hierarchy and mobile-sized targets', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { value: async () => {}, configurable: true });
  });
  await page.goto('/');
  await generateTeams(page);

  const share = page.getByRole('button', { name: 'Share teams', exact: true });
  const whatsapp = page.getByRole('link', { name: 'Share on WhatsApp', exact: true });
  const copy = page.getByRole('button', { name: 'Copy teams', exact: true });
  const preview = page.getByRole('textbox', { name: 'Message preview', exact: true });

  await expect(share).toBeVisible();
  await expect(whatsapp).toBeVisible();
  await expect(copy).toBeVisible();
  await expect(preview).toBeVisible();
  await expect(page.getByText(/Share with an app.*WhatsApp draft.*copy this message/i)).toBeVisible();

  const nativeStyle = await share.evaluate(element => getComputedStyle(element));
  const whatsappStyle = await whatsapp.evaluate(element => getComputedStyle(element));
  const copyStyle = await copy.evaluate(element => getComputedStyle(element));
  expect(nativeStyle.backgroundColor).toBe('rgb(181, 238, 122)');
  expect(whatsappStyle.color).not.toBe('rgb(0, 0, 238)');
  expect(whatsappStyle.minHeight).toBe('44px');
  expect(copyStyle.backgroundColor).not.toBe(nativeStyle.backgroundColor);

  for (const width of [360, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    for (const action of [share, whatsapp, copy]) {
      const box = await action.boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.width).toBeGreaterThanOrEqual(44);
      await action.focus();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Shift+Tab');
      await expect(action).toBeFocused();
      expect(await action.evaluate(element => element.matches(':focus-visible'))).toBe(true);
      expect(await action.evaluate(element => Number.parseFloat(getComputedStyle(element).outlineWidth))).toBeGreaterThan(0);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
    }
  }
});

test('unsupported device sharing keeps WhatsApp and copy available', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
  });
  await page.goto('/');
  await generateTeams(page);

  await expect(page.getByRole('button', { name: 'Share teams', exact: true })).toBeHidden();
  await expect(page.getByRole('link', { name: 'Share on WhatsApp', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Copy teams', exact: true })).toBeVisible();
});
