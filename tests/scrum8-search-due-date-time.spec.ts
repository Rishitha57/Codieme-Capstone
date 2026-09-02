import { test, expect, Page } from "@playwright/test";

async function clearAppState(page: Page) {
  await page.addInitScript(() => {
    localStorage.removeItem("taskloom_data");
  });
}

async function addTask(
  page: Page,
  title: string,
  date?: string,
  time?: string
) {
  const titleInput = page.getByPlaceholder("e.g. Design system architecture");
  await titleInput.fill(title);
  if (date) {
    await page.locator("input[type=date]").fill(date);
  }
  if (time) {
    await page.locator("input[type=time]").fill(time);
  }
  await page.getByRole("button", { name: /add to loom/i }).click();
  await expect(page.locator("h3").filter({ hasText: title })).toBeVisible({
    timeout: 5000,
  });
}

async function searchFor(page: Page, query: string) {
  await page.getByPlaceholder("Search your tasks...").fill(query);
  await page.waitForTimeout(200);
}

async function clearSearch(page: Page) {
  await page.getByPlaceholder("Search your tasks...").clear();
  await page.waitForTimeout(200);
}

async function getFormattedDate(page: Page, isoDate: string): Promise<string> {
  return page.evaluate((d: string) => {
    return new Date(d).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }, isoDate);
}

test.describe("SCRUM-8: Task search includes due date and time", () => {
  test.beforeEach(async ({ page }) => {
    await clearAppState(page);
    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  });

  test("Scenario 1: Search by title still works after the extension", async ({
    page,
  }) => {
    await addTask(page, "Buy groceries");
    await searchFor(page, "groceries");
    await expect(page.locator("h3").filter({ hasText: "Buy groceries" })).toBeVisible();
  });

  test("Scenario 2: Search by formatted due date (short month) finds the task", async ({
    page,
  }) => {
    const isoDate = "2026-09-15";
    await addTask(page, "Doctor appointment", isoDate);
    const formatted = await getFormattedDate(page, isoDate);
    const monthAbbr = formatted.split(/[\s,]+/)[0];
    await searchFor(page, monthAbbr);
    await expect(page.locator("h3").filter({ hasText: "Doctor appointment" })).toBeVisible();
  });

  test("Scenario 3: Search by time value HH:MM finds the task", async ({
    page,
  }) => {
    await addTask(page, "Team standup", undefined, "09:30");
    await searchFor(page, "09:30");
    await expect(page.locator("h3").filter({ hasText: "Team standup" })).toBeVisible();
  });

  test("Scenario 4: Date-based search hides tasks that do not match the date", async ({
    page,
  }) => {
    const isoDate = "2026-09-15";
    await addTask(page, "Doctor appointment", isoDate);
    await addTask(page, "Buy groceries");
    const formatted = await getFormattedDate(page, isoDate);
    const monthAbbr = formatted.split(/[\s,]+/)[0];
    await searchFor(page, monthAbbr);
    await expect(page.locator("h3").filter({ hasText: "Doctor appointment" })).toBeVisible();
    await expect(page.locator("h3").filter({ hasText: "Buy groceries" })).not.toBeVisible();
  });

  test("Scenario 5: Time-based search hides tasks that have no time", async ({
    page,
  }) => {
    await addTask(page, "Team standup", undefined, "09:30");
    await addTask(page, "Buy groceries");
    await searchFor(page, "09:30");
    await expect(page.locator("h3").filter({ hasText: "Team standup" })).toBeVisible();
    await expect(page.locator("h3").filter({ hasText: "Buy groceries" })).not.toBeVisible();
  });

  test("Scenario 6: Clearing the search input restores all tasks", async ({
    page,
  }) => {
    await addTask(page, "Task Alpha", "2026-09-15");
    await addTask(page, "Task Beta");
    await searchFor(page, "Sep");
    await expect(page.locator("h3").filter({ hasText: "Task Alpha" })).toBeVisible();
    await expect(page.locator("h3").filter({ hasText: "Task Beta" })).not.toBeVisible();
    await clearSearch(page);
    await expect(page.locator("h3").filter({ hasText: "Task Alpha" })).toBeVisible();
    await expect(page.locator("h3").filter({ hasText: "Task Beta" })).toBeVisible();
  });

  test("Scenario 7: Date search is case-insensitive", async ({ page }) => {
    const isoDate = "2026-09-15";
    await addTask(page, "Doctor appointment", isoDate);
    const formatted = await getFormattedDate(page, isoDate);
    const lowerMonth = formatted.split(/[\s,]+/)[0].toLowerCase();
    await searchFor(page, lowerMonth);
    await expect(page.locator("h3").filter({ hasText: "Doctor appointment" })).toBeVisible();
  });

  test("Scenario 8: Empty search shows all tasks", async ({ page }) => {
    await addTask(page, "Task Alpha", "2026-09-15");
    await addTask(page, "Task Beta", undefined, "14:00");
    await addTask(page, "Task Gamma");
    await expect(page.locator("h3").filter({ hasText: "Task Alpha" })).toBeVisible();
    await expect(page.locator("h3").filter({ hasText: "Task Beta" })).toBeVisible();
    await expect(page.locator("h3").filter({ hasText: "Task Gamma" })).toBeVisible();
  });
});
