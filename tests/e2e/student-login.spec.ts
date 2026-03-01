import { test, expect } from "@playwright/test";

const LOGIN_URL = "/signlab/login";
const STUDENT_CREDENTIALS = {
  username: "2021001",
  password: "admin123",
};

test.describe("Student Login", () => {
  test("should login successfully with valid student credentials",
    { tag: ["@critical", "@e2e", "@student", "@STUDENT-LOGIN-001"] },
    async ({ page }) => {
      await page.goto(LOGIN_URL);

      // Fill student credentials
      await page.locator('input[type="text"]').fill(STUDENT_CREDENTIALS.username);
      await page.locator('input[type="password"]').fill(STUDENT_CREDENTIALS.password);

      // Click login button
      await page.getByRole("button", { name: "登录" }).click();

      // Wait for redirect to student home
      await page.waitForURL(/\/student$/);

      // Verify navigation to student home page
      await expect(page).toHaveURL(/\/student$/);

      // Verify student home page content
      await expect(page.getByRole("heading", { name: "我的课程" })).toBeVisible();
    }
  );

  test("should show error with invalid password",
    { tag: ["@critical", "@e2e", "@student", "@STUDENT-LOGIN-002"] },
    async ({ page }) => {
      await page.goto(LOGIN_URL);

      // Fill credentials with wrong password
      await page.locator('input[type="text"]').fill(STUDENT_CREDENTIALS.username);
      await page.locator('input[type="password"]').fill("wrongpassword");

      // Click login button
      await page.getByRole("button", { name: "登录" }).click();

      // Verify error message appears
      await expect(page.getByText("密码错误")).toBeVisible({ timeout: 5000 });

      // Verify still on login page
      await expect(page).toHaveURL(/\/login$/);
    }
  );

  test("should validate empty username",
    { tag: ["@high", "@e2e", "@student", "@STUDENT-LOGIN-003"] },
    async ({ page }) => {
      await page.goto(LOGIN_URL);

      // Only fill password, leave username empty
      await page.locator('input[type="password"]').fill(STUDENT_CREDENTIALS.password);

      // Click login button
      await page.getByRole("button", { name: "登录" }).click();

      // Verify warning message appears
      await expect(page.getByText(/请输入用户名/)).toBeVisible({ timeout: 5000 });
    }
  );

  test("should validate empty password",
    { tag: ["@high", "@e2e", "@student", "@STUDENT-LOGIN-004"] },
    async ({ page }) => {
      await page.goto(LOGIN_URL);

      // Only fill username, leave password empty
      await page.locator('input[type="text"]').fill(STUDENT_CREDENTIALS.username);

      // Click login button
      await page.getByRole("button", { name: "登录" }).click();

      // Verify warning message appears
      await expect(page.getByText(/请输入密码/)).toBeVisible({ timeout: 5000 });
    }
  );

  test("should maintain login state after page refresh",
    { tag: ["@high", "@e2e", "@student", "@STUDENT-LOGIN-005"] },
    async ({ page }) => {
      // Login first
      await page.goto(LOGIN_URL);
      await page.locator('input[type="text"]').fill(STUDENT_CREDENTIALS.username);
      await page.locator('input[type="password"]').fill(STUDENT_CREDENTIALS.password);
      await page.getByRole("button", { name: "登录" }).click();

      // Wait for redirect to student home
      await page.waitForURL(/\/student$/);

      // Refresh the page
      await page.reload();

      // Verify still on student home page (not redirected to login)
      await expect(page).toHaveURL(/\/student$/);
      await expect(page.getByRole("heading", { name: "我的课程" })).toBeVisible();
    }
  );

  test("should redirect to student page based on role",
    { tag: ["@high", "@e2e", "@student", "@STUDENT-LOGIN-006"] },
    async ({ page }) => {
      await page.goto(LOGIN_URL);

      // Login as student
      await page.locator('input[type="text"]').fill(STUDENT_CREDENTIALS.username);
      await page.locator('input[type="password"]').fill(STUDENT_CREDENTIALS.password);
      await page.getByRole("button", { name: "登录" }).click();

      // Wait for redirect
      await page.waitForURL(/\/student$/);

      // Verify redirected to student page (not teacher)
      await expect(page).toHaveURL(/\/student$/);
      await expect(page).not.toHaveURL(/\/teacher/);
    }
  );
});
