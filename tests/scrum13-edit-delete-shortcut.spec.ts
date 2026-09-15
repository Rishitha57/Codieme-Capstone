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

async function startEditing(page: Page, title: string) {
  const card = page.locator(".group").filter({ hasText: title });
  await card.hover();
  await card.getByTitle("Edit Name & Details").click();
  await expect(page.getByText("Editing")).toBeVisible();
}

test.describe("SCRUM-13: Ctrl/Cmd+Backspace deletes task while editing", () => {
  test.beforeEach(async ({ page }) => {
    await clearAppState(page);
    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  });

  test("Scenario 1: Ctrl+Backspace shows the delete confirmation while editing", async ({
    page,
  }) => {
    await addTask(page, "Ship the release notes");
    await startEditing(page, "Ship the release notes");

    let dialogMessage = "";
    page.once("dialog", async dialog => {
      dialogMessage = dialog.message();
      await dialog.dismiss();
    });

    const titleInput = page.getByPlaceholder("e.g. Design system architecture");
    await titleInput.press("Control+Backspace");

    expect(dialogMessage).toBe("Are you sure you want to delete this task?");
  });

  test("Scenario 2: Confirming the shortcut deletes the task and closes the editor", async ({
    page,
  }) => {
    await addTask(page, "Retire the legacy service");
    await startEditing(page, "Retire the legacy service");

    page.once("dialog", dialog => dialog.accept());

    const titleInput = page.getByPlaceholder("e.g. Design system architecture");
    await titleInput.press("Control+Backspace");

    await expect(page.locator("h3").filter({ hasText: "Retire the legacy service" })).not.toBeVisible();
    await expect(page.getByText("Editing")).not.toBeVisible();
  });

  test("Scenario 3: Cancelling the shortcut keeps the task and the editor open", async ({
    page,
  }) => {
    await addTask(page, "Draft the quarterly report");
    await startEditing(page, "Draft the quarterly report");

    page.once("dialog", dialog => dialog.dismiss());

    const titleInput = page.getByPlaceholder("e.g. Design system architecture");
    await titleInput.press("Control+Backspace");

    await expect(page.locator("h3").filter({ hasText: "Draft the quarterly report" })).toBeVisible();
    await expect(page.getByText("Editing")).toBeVisible();
  });

  test("Scenario 4: The shortcut does nothing when not editing a task", async ({
    page,
  }) => {
    await addTask(page, "Just a regular task");

    let dialogFired = false;
    page.once("dialog", async dialog => {
      dialogFired = true;
      await dialog.dismiss();
    });

    const titleInput = page.getByPlaceholder("e.g. Design system architecture");
    await titleInput.press("Control+Backspace");
    await page.waitForTimeout(200);

    expect(dialogFired).toBe(false);
    await expect(page.locator("h3").filter({ hasText: "Just a regular task" })).toBeVisible();
  });

  test("Scenario 5: Cmd (Meta)+Backspace also shows the delete confirmation while editing", async ({
    page,
  }) => {
    await addTask(page, "Review the design doc");
    await startEditing(page, "Review the design doc");

    let dialogMessage = "";
    page.once("dialog", async dialog => {
      dialogMessage = dialog.message();
      await dialog.dismiss();
    });

    const titleInput = page.getByPlaceholder("e.g. Design system architecture");
    await titleInput.press("Meta+Backspace");

    expect(dialogMessage).toBe("Are you sure you want to delete this task?");
  });
});
