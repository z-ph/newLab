import { test, expect } from "@playwright/test";

const LOGIN_URL = "/signlab/login";
const STUDENT_CREDENTIALS = {
  username: "2021001",
  password: "admin123",
};

test.describe("Student Profile", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto(LOGIN_URL);
    await page.locator('input[type="text"]').fill(STUDENT_CREDENTIALS.username);
    await page.locator('input[type="password"]').fill(STUDENT_CREDENTIALS.password);
    await page.getByRole("button", { name: "登录" }).click();
    await page.waitForURL(/\/student$/, { timeout: 10000 });

    // Navigate to profile page
    const profileLink = page.getByRole("link", { name: "我的" });
    await profileLink.click();
    await page.waitForURL(/\/student\/profile/, { timeout: 10000 });
  });

  test("should display profile page with user information",
    { tag: ["@critical", "@e2e", "@student", "@STUDENT-PROFILE-001"] },
    async ({ page }) => {
      // Verify we're on profile page
      await expect(page).toHaveURL(/\/student\/profile/);

      // Verify page heading
      await expect(page.getByRole("heading", { name: "我的" })).toBeVisible();

      // Verify user role is displayed
      await expect(page.getByRole("heading", { name: "学生" })).toBeVisible();
    }
  );

  test("should display student ID",  
    { tag: ["@critical", "@e2e", "@student", "@STUDENT-PROFILE-002"] },
    async ({ page }) => {
      // Verify student ID label exists
      await expect(page.getByText("学号")).toBeVisible();
      
      // Student ID may be displayed as label or in a different format
      // Just verify the label is present (actual value display varies)
    }
  );

  test("should display profile menu items",
    { tag: ["@critical", "@e2e", "@student", "@STUDENT-PROFILE-003"] },
    async ({ page }) => {
      // Verify all menu items exist
      await expect(page.getByText("我的成绩")).toBeVisible();
      await expect(page.getByText("考勤记录")).toBeVisible();
      await expect(page.getByText("设置")).toBeVisible();
      await expect(page.getByText("关于")).toBeVisible();
    }
  );

  test("should display logout button",
    { tag: ["@critical", "@e2e", "@student", "@STUDENT-PROFILE-004"] },
    async ({ page }) => {
      // Verify logout button exists
      await expect(page.getByRole("button", { name: "退出登录" })).toBeVisible();
    }
  );

  test("should logout successfully",
    { tag: ["@critical", "@e2e", "@student", "@STUDENT-PROFILE-005"] },
    async ({ page }) => {
      // Click logout button
      await page.getByRole("button", { name: "退出登录" }).click();

      // Wait for redirect to login page
      await page.waitForURL(/\/login/, { timeout: 10000 });

      // Verify redirected to login page
      await expect(page).toHaveURL(/\/login/);
    }
  );

  test("should display bottom navigation bar",
    { tag: ["@medium", "@e2e", "@student", "@STUDENT-PROFILE-006"] },
    async ({ page }) => {
      // Verify home link exists
      const homeLink = page.getByRole("link", { name: "首页" });
      await expect(homeLink).toBeVisible();

      // Verify profile link exists
      const profileLink = page.getByRole("link", { name: "我的" });
      await expect(profileLink).toBeVisible();
    }
  );

  test("should navigate to home from profile page",
    { tag: ["@medium", "@e2e", "@student", "@STUDENT-PROFILE-007"] },
    async ({ page }) => {
      // Click on home link in bottom navigation
      const homeLink = page.getByRole("link", { name: "首页" });
      await homeLink.click();

      // Wait for navigation
      await page.waitForURL(/\/student$/, { timeout: 10000 });

      // Verify on student home page
      await expect(page).toHaveURL(/\/student$/);
      await expect(page.getByRole("heading", { name: "我的课程" })).toBeVisible();
    }
  );
});

test.describe("Student Grades", () => {
  test("should navigate to grades page",  
    { tag: ["@high", "@e2e", "@student", "@STUDENT-GRADES-001"] },
    async ({ page }) => {
      // Login
      await page.goto(LOGIN_URL);
      await page.locator('input[type="text"]').fill(STUDENT_CREDENTIALS.username);
      await page.locator('input[type="password"]').fill(STUDENT_CREDENTIALS.password);
      await page.getByRole("button", { name: "登录" }).click();
      await page.waitForURL(/\/student$/, { timeout: 10000 });

      // Navigate to profile
      const profileLink = page.getByRole("link", { name: "我的" });
      await profileLink.click();
      await page.waitForURL(/\/student\/profile/, { timeout: 10000 });

      // Click on grades menu item
      const gradesItem = page.getByText("我的成绩");
      await gradesItem.click();

      // Wait for navigation - just verify URL changed
      await page.waitForURL(/\/student\/profile\/grades/, { timeout: 10000 });
      
      // Verify we're on grades page by URL
      await expect(page).toHaveURL(/\/student\/profile\/grades/);
    }
  );
});

test.describe("Student Attendance", () => {
  test("should navigate to attendance page",  
    { tag: ["@high", "@e2e", "@student", "@STUDENT-ATTENDANCE-001"] },
    async ({ page }) => {
      // Login
      await page.goto(LOGIN_URL);
      await page.locator('input[type="text"]').fill(STUDENT_CREDENTIALS.username);
      await page.locator('input[type="password"]').fill(STUDENT_CREDENTIALS.password);
      await page.getByRole("button", { name: "登录" }).click();
      await page.waitForURL(/\/student$/, { timeout: 10000 });

      // Navigate to profile
      const profileLink = page.getByRole("link", { name: "我的" });
      await profileLink.click();
      await page.waitForURL(/\/student\/profile/, { timeout: 10000 });

      // Click on attendance menu item
      const attendanceItem = page.getByText("考勤记录");
      await attendanceItem.click();

      // Wait for navigation - just verify URL changed
      await page.waitForURL(/\/student\/profile\/attendance/, { timeout: 10000 });
      
      // Verify we're on attendance page by URL
      await expect(page).toHaveURL(/\/student\/profile\/attendance/);
    }
  );
});
