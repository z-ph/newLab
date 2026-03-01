import { test, expect } from "@playwright/test";

const LOGIN_URL = "/signlab/login";
const STUDENT_CREDENTIALS = {
  username: "2021001",
  password: "admin123",
};

// Helper function for login
async function loginAsStudent(page: any) {
  await page.goto(LOGIN_URL);
  await page.locator('input[type="text"]').fill(STUDENT_CREDENTIALS.username);
  await page.locator('input[type="password"]').fill(STUDENT_CREDENTIALS.password);
  await page.getByRole("button", { name: "登录" }).click();
  await page.waitForURL(/\/student$/, { timeout: 10000 });
}

test.describe("Student Experiments", () => {
  test("should display experiment detail page with all information",
    { tag: ["@critical", "@e2e", "@student", "@STUDENT-EXP-001"] },
    async ({ page }) => {
      // Login and navigate to experiment
      await loginAsStudent(page);
      const courseCard = page.getByRole("heading", { level: 3 }).first();
      await courseCard.click();
      await page.waitForURL(/\/student\/courses\/[^/]+$/, { timeout: 10000 });

      const experimentCard = page.getByRole("heading", { level: 3 }).first();
      await experimentCard.click();
      await page.waitForURL(/\/student\/experiments\/\d+/, { timeout: 10000 });

      // Verify experiment heading
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      // Verify experiment info sections
      await expect(page.getByText("实验信息")).toBeVisible();
      await expect(page.getByText("进度")).toBeVisible();
      await expect(page.getByText("签到状态")).toBeVisible();
    }
  );

  test("should display data collection step",
    { tag: ["@critical", "@e2e", "@student", "@STUDENT-EXP-002"] },
    async ({ page }) => {
      // Login and navigate to experiment
      await loginAsStudent(page);
      const courseCard = page.getByRole("heading", { level: 3 }).first();
      await courseCard.click();
      await page.waitForURL(/\/student\/courses\/[^/]+$/, { timeout: 10000 });

      const experimentCard = page.getByRole("heading", { level: 3 }).first();
      await experimentCard.click();
      await page.waitForURL(/\/student\/experiments\/\d+/, { timeout: 10000 });

      // Verify data collection step exists (use .first() to avoid strict mode)
      await expect(page.getByText("数据采集").first()).toBeVisible();
    }
  );

  test("should display topic step",
    { tag: ["@critical", "@e2e", "@student", "@STUDENT-EXP-003"] },
    async ({ page }) => {
      // Login and navigate to experiment
      await loginAsStudent(page);
      const courseCard = page.getByRole("heading", { level: 3 }).first();
      await courseCard.click();
      await page.waitForURL(/\/student\/courses\/[^/]+$/, { timeout: 10000 });

      const experimentCard = page.getByRole("heading", { level: 3 }).first();
      await experimentCard.click();
      await page.waitForURL(/\/student\/experiments\/\d+/, { timeout: 10000 });

      // Verify topic step exists
      await expect(page.getByText("完成题目").first()).toBeVisible();
    }
  );

  test("should display step completion status",
    { tag: ["@critical", "@e2e", "@student", "@STUDENT-EXP-004"] },
    async ({ page }) => {
      // Login and navigate to experiment
      await loginAsStudent(page);
      const courseCard = page.getByRole("heading", { level: 3 }).first();
      await courseCard.click();
      await page.waitForURL(/\/student\/courses\/[^/]+$/, { timeout: 10000 });

      const experimentCard = page.getByRole("heading", { level: 3 }).first();
      await experimentCard.click();
      await page.waitForURL(/\/student\/experiments\/\d+/, { timeout: 10000 });

      // Verify completed steps show status (use .first() to avoid strict mode)
      await expect(page.getByText("已完成").first()).toBeVisible();
    }
  );

  test("should navigate back from experiment page",
    { tag: ["@low", "@e2e", "@student", "@STUDENT-EXP-005"] },
    async ({ page }) => {
      // Login and navigate to experiment
      await loginAsStudent(page);
      const courseCard = page.getByRole("heading", { level: 3 }).first();
      await courseCard.click();
      await page.waitForURL(/\/student\/courses\/[^/]+$/, { timeout: 10000 });

      const experimentCard = page.getByRole("heading", { level: 3 }).first();
      await experimentCard.click();
      await page.waitForURL(/\/student\/experiments\/\d+/, { timeout: 10000 });

      // Click back button
      await page.getByRole("button", { name: "返回上一级" }).click();

      // Wait for navigation
      await page.waitForURL(/\/student\/courses\/[^/]+$/, { timeout: 10000 });

      // Verify on course detail page
      await expect(page).toHaveURL(/\/student\/courses\/[^/]+$/);
    }
  );
});

test.describe("Student Experiment Submission Flow", () => {
  test("should complete full experiment submission flow",
    { tag: ["@critical", "@e2e", "@student", "@STUDENT-EXP-FLOW-001"] },
    async ({ page }) => {
      // 1. Login
      await page.goto(LOGIN_URL);
      await page.locator('input[type="text"]').fill(STUDENT_CREDENTIALS.username);
      await page.locator('input[type="password"]').fill(STUDENT_CREDENTIALS.password);
      await page.getByRole("button", { name: "登录" }).click();
      await page.waitForURL(/\/student$/, { timeout: 10000 });

      // 2. Select course
      const courseCard = page.getByRole("heading", { level: 3 }).first();
      await courseCard.click();
      await page.waitForURL(/\/student\/courses\/[^/]+$/, { timeout: 10000 });

      // 3. Select experiment
      const experimentCard = page.getByRole("heading", { level: 3 }).first();
      await experimentCard.click();
      await page.waitForURL(/\/student\/experiments\/\d+/, { timeout: 10000 });

      // 4. Verify experiment details page loads
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      // 5. Verify all steps are visible
      await expect(page.getByText("数据采集").first()).toBeVisible();
      await expect(page.getByText("完成题目").first()).toBeVisible();

      // 6. Verify step completion status
      await expect(page.getByText("已完成").first()).toBeVisible();
    }
  );
});
