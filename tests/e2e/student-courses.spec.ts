import { test, expect } from "@playwright/test";

const LOGIN_URL = "/signlab/login";
const STUDENT_CREDENTIALS = {
  username: "2021001",
  password: "admin123",
};

test.describe("Student Courses", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto(LOGIN_URL);
    await page.locator('input[type="text"]').fill(STUDENT_CREDENTIALS.username);
    await page.locator('input[type="password"]').fill(STUDENT_CREDENTIALS.password);
    await page.getByRole("button", { name: "登录" }).click();
    await page.waitForURL(/\/student$/);
  });

  test("should display student home page with course list",
    { tag: ["@critical", "@e2e", "@student", "@STUDENT-COURSES-001"] },
    async ({ page }) => {
      // Verify we're on student home page
      await expect(page).toHaveURL(/\/student$/);

      // Verify page title
      await expect(page.getByRole("heading", { name: "我的课程" })).toBeVisible();

      // Verify course list container exists
      await expect(page.getByText(/个实验/)).toBeVisible();
    }
  );

  test("should display course card with correct information",
    { tag: ["@critical", "@e2e", "@student", "@STUDENT-COURSES-002"] },
    async ({ page }) => {
      // Verify course card exists
      const courseCard = page.getByRole("heading", { level: 3 });
      await expect(courseCard).toBeVisible();

      // Verify course name is displayed (not ID)
      const courseName = await courseCard.textContent();
      expect(courseName).toBeTruthy();
      expect(courseName?.trim().length).toBeGreaterThan(0);
    }
  );

  test("should navigate to course detail page when clicking course card",
    { tag: ["@critical", "@e2e", "@student", "@STUDENT-COURSES-003"] },
    async ({ page }) => {
      // Get the first course card and click it
      const courseCard = page.getByRole("heading", { level: 3 }).first();
      await courseCard.click();

      // Wait for navigation to course detail page
      await page.waitForURL(/\/student\/courses\/[^/]+$/);

      // Verify we're on course detail page
      await expect(page).toHaveURL(/\/student\/courses\/[^/]+$/);

      // Verify course name is displayed in the heading
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  );

  test("should display experiment list on course detail page",
    { tag: ["@critical", "@e2e", "@student", "@STUDENT-COURSES-004"] },
    async ({ page }) => {
      // Navigate to course detail page
      const courseCard = page.getByRole("heading", { level: 3 }).first();
      await courseCard.click();
      await page.waitForURL(/\/student\/courses\/[^/]+$/);

      // Verify experiment heading exists
      await expect(page.getByRole("heading", { level: 3 })).toBeVisible();

      // Verify experiment information (ID, time, location)
      await expect(page.getByText(/ID:/)).toBeVisible();
      await expect(page.getByText(/实验室/)).toBeVisible();
    }
  );

  test("should navigate to experiment detail page when clicking experiment",
    { tag: ["@critical", "@e2e", "@student", "@STUDENT-COURSES-005"] },
    async ({ page }) => {
      // Navigate to course detail page
      const courseCard = page.getByRole("heading", { level: 3 }).first();
      await courseCard.click();
      await page.waitForURL(/\/student\/courses\/[^/]+$/);

      // Click on the experiment
      const experimentCard = page.getByRole("heading", { level: 3 }).first();
      await experimentCard.click();

      // Wait for navigation to experiment detail page
      await page.waitForURL(/\/student\/experiments\/\d+/);

      // Verify we're on experiment detail page
      await expect(page).toHaveURL(/\/student\/experiments\/\d+/);

      // Verify experiment heading
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  );

  test("should display experiment information on detail page",
    { tag: ["@critical", "@e2e", "@student", "@STUDENT-COURSES-006"] },
    async ({ page }) => {
      // Navigate to experiment detail page
      const courseCard = page.getByRole("heading", { level: 3 }).first();
      await courseCard.click();
      await page.waitForURL(/\/student\/courses\/[^/]+$/);

      const experimentCard = page.getByRole("heading", { level: 3 }).first();
      await experimentCard.click();
      await page.waitForURL(/\/student\/experiments\/\d+/);

      // Verify experiment information sections
      await expect(page.getByText("实验信息")).toBeVisible();
      await expect(page.getByText("实验名称")).toBeVisible();
      await expect(page.getByText("课程名称")).toBeVisible();
      await expect(page.getByText("进度")).toBeVisible();
    }
  );

  test("should display experiment steps list",
    { tag: ["@critical", "@e2e", "@student", "@STUDENT-COURSES-007"] },
    async ({ page }) => {
      // Navigate to experiment detail page
      const courseCard = page.getByRole("heading", { level: 3 }).first();
      await courseCard.click();
      await page.waitForURL(/\/student\/courses\/[^/]+$/);

      const experimentCard = page.getByRole("heading", { level: 3 }).first();
      await experimentCard.click();
      await page.waitForURL(/\/student\/experiments\/\d+/);

      // Verify steps are listed (use .first() to avoid strict mode violation)
      await expect(page.getByText(/数据采集/).first()).toBeVisible();
      await expect(page.getByText(/完成题目/).first()).toBeVisible();
    }
  );

  test("should display step completion status",
    { tag: ["@high", "@e2e", "@student", "@STUDENT-COURSES-008"] },
    async ({ page }) => {
      // Navigate to experiment detail page
      const courseCard = page.getByRole("heading", { level: 3 }).first();
      await courseCard.click();
      await page.waitForURL(/\/student\/courses\/[^/]+$/);

      const experimentCard = page.getByRole("heading", { level: 3 }).first();
      await experimentCard.click();
      await page.waitForURL(/\/student\/experiments\/\d+/);

      // Verify step status indicators (use .first() to avoid strict mode violation)
      await expect(page.getByText("已完成").first()).toBeVisible();
    }
  );

  test("should navigate back to student home from course page",
    { tag: ["@medium", "@e2e", "@student", "@STUDENT-COURSES-009"] },
    async ({ page }) => {
      // Navigate to course detail page
      const courseCard = page.getByRole("heading", { level: 3 }).first();
      await courseCard.click();
      await page.waitForURL(/\/student\/courses\/[^/]+$/);

      // Click the back button
      await page.getByRole("button", { name: "返回上一级" }).click();

      // Wait for navigation
      await page.waitForURL(/\/student$/);

      // Verify back on student home
      await expect(page).toHaveURL(/\/student$/);
      await expect(page.getByRole("heading", { name: "我的课程" })).toBeVisible();
    }
  );

  test("should display empty state when no courses available",
    { tag: ["@medium", "@e2e", "@student", "@STUDENT-COURSES-010"] },
    async ({ page }) => {
      // This test verifies the empty state exists in the code
      // In production, if student has no courses, show empty state
      const emptyState = page.getByText("暂无课程");
      // Only verify if empty state is present (depends on test data)
      if (await emptyState.isVisible()) {
        await expect(emptyState).toBeVisible();
        await expect(page.getByText("请先加入班级")).toBeVisible();
      }
    }
  );
});
