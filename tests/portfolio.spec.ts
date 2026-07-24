import { expect, test } from "@playwright/test";

test.describe("portfolio navigation", () => {
  test("visits the main pages from the desktop navigation", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Mayur Patil/);
    await expect(page.getByRole("heading", { name: "Mayur Patil" })).toBeVisible();

    for (const destination of ["Projects", "Tools", "Skills", "Contact"]) {
      await page.getByRole("link", { name: destination, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`/${destination.toLowerCase()}$`));
      await expect(page.getByRole("heading", { name: new RegExp(destination) })).toBeVisible();
    }
  });

  test("opens the project tool from the projects page", async ({ page }) => {
    await page.goto("/projects");

    await page.getByRole("link", { name: /Open Tool/ }).click();
    await expect(page).toHaveURL(/\/tools$/);
    await expect(page.getByTitle("Circuit Line - Voltage Drop Tool")).toBeVisible();
  });

  test("persists the selected theme", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("body")).toHaveClass(/light-mode/);
    await page.getByTitle("Toggle theme").click();
    await expect(page.locator("body")).toHaveClass(/dark-mode/);

    await page.reload();
    await expect(page.locator("body")).toHaveClass(/dark-mode/);
    await expect(page.getByTitle("Toggle theme")).toBeVisible();
  });
});

test.describe("mobile navigation and contact", () => {
  test("opens and closes the mobile navigation", async ({ page }) => {
    await page.goto("/");

    const menuButton = page.getByRole("button", { name: "Toggle menu" });
    await menuButton.click();
    await expect(page.locator(".mobile-nav")).toBeVisible();

    await page.locator(".mobile-nav").getByRole("link", { name: "Contact", exact: true }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.getByRole("heading", { name: "Contact" })).toBeVisible();
  });

  test("requires all contact fields before submission", async ({ page }) => {
    await page.goto("/contact");

    const form = page.locator("form");
    await page.getByRole("button", { name: "Send Message" }).click();
    await expect(page).toHaveURL(/\/contact$/);

    await page.getByLabel("Name").fill("Test Visitor");
    await page.getByLabel("Email").fill("visitor@example.com");
    await page.getByLabel("Message").fill("Hello from the end-to-end test.");
    await expect(form).toBeVisible();
    await expect(page.getByRole("button", { name: "Send Message" })).toBeEnabled();
  });
});