import { test, expect, Page } from "@playwright/test";

async function clearAppState(page: Page) {
  await page.addInitScript(() => {
    localStorage.removeItem("taskloom_data");
  });
}

async function addTask(page: Page, title: string) {
  const titleInput = page.getByPlaceholder("e.g. Design system architecture");
  await titleInput.fill(title);
  await page.getByRole("button", { name: /add to loom/i }).click();
  await expect(page.locator("h3").filter({ hasText: title })).toBeVisible({
    timeout: 5000,
  });
}

async function deleteTask(page: Page, title: string) {
  const card = page.locator(".group").filter({ hasText: title });
  await card.hover();
  page.once("dialog", dialog => dialog.accept());
  await card.getByTitle("Remove Permanently").click();
}

test.describe("SCRUM-14: Undo delete toast", () => {
  test.beforeEach(async ({ page }) => {
    await clearAppState(page);
    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  });

  test("Scenario 1: Confirmed deletion removes the task and shows the undo toast", async ({
    page,
  }) => {
    await addTask(page, "Water the plants");
    await deleteTask(page, "Water the plants");

    await expect(page.locator("h3").filter({ hasText: "Water the plants" })).not.toBeVisible();
    await expect(page.getByText("Task deleted")).toBeVisible();
    await expect(page.getByRole("button", { name: "Undo" })).toBeVisible();
  });

  test("Scenario 2: Clicking Undo restores the deleted task and hides the toast", async ({
    page,
  }) => {
    await addTask(page, "Pay the electricity bill");
    await deleteTask(page, "Pay the electricity bill");

    await page.getByRole("button", { name: "Undo" }).click();

    await expect(page.locator("h3").filter({ hasText: "Pay the electricity bill" })).toBeVisible();
    await expect(page.getByText("Task deleted")).not.toBeVisible();
  });

  test("Scenario 3: Toast auto-dismisses after the timeout and undo is no longer available", async ({
    page,
  }) => {
    await addTask(page, "Renew the passport");
    await deleteTask(page, "Renew the passport");

    await expect(page.getByText("Task deleted")).toBeVisible();
    await expect(page.getByText("Task deleted")).not.toBeVisible({ timeout: 8000 });
    await expect(page.locator("h3").filter({ hasText: "Renew the passport" })).not.toBeVisible();
  });

  test("Scenario 4: Deleting a second task while the toast is visible retargets undo to the newest deletion", async ({
    page,
  }) => {
    await addTask(page, "Task Alpha");
    await addTask(page, "Task Beta");

    await deleteTask(page, "Task Alpha");
    await expect(page.getByText("Task deleted")).toBeVisible();

    await deleteTask(page, "Task Beta");
    await expect(page.getByText("Task deleted")).toBeVisible();

    await page.getByRole("button", { name: "Undo" }).click();

    await expect(page.locator("h3").filter({ hasText: "Task Beta" })).toBeVisible();
    await expect(page.locator("h3").filter({ hasText: "Task Alpha" })).not.toBeVisible();
  });
});
