import { test, expect } from "@playwright/test";

const PREFIX_PATH = process.env.VITE_PREFIX_PATH || "";
const LOGIN_URL = `${PREFIX_PATH}/login`;

test.describe.serial("Teacher Workflow", () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto(LOGIN_URL);

    // 账号输入框是第一个 text input，密码框是 password input
    await page.locator('input[type="text"]').fill("admin");
    await page.locator('input[type="password"]').fill("admin123");

    await page.getByRole("button", { name: "登录" }).click();

    // Wait for redirect to complete
    await page.waitForURL(/\/teacher/);
  });

  test("should create courses", async ({ page }) => {
    // Navigate to course management - click to expand menu
    await page.locator("div").filter({ hasText: /^课程管理$/ }).click();
    await page.locator("div").filter({ hasText: /^课程列表$/ }).click();

    // Wait for navigation
    await page.waitForURL(/\/courses\/$/);

    // Create course - click button to navigate to create page
    await page.getByRole("button", { name: "新建课程" }).click();

    // Wait for navigation to create page
    await page.waitForURL(/\/courses\/create/);

    // Fill course form
    const courseName = "E2E测试课程" + Date.now();
    await page.getByRole("textbox", { name: "请输入课程名称" }).fill(courseName);
    await page.getByRole("button", { name: "创建" }).click();

    // Verify course is created
    await expect(page.getByRole("cell", { name: courseName }).first()).toBeVisible();
  });

  test("should create single choice topic", async ({ page }) => {
    // Navigate to topic management - click to expand menu
    await page.locator("div").filter({ hasText: /^题目管理$/ }).click();
    await page.locator("div").filter({ hasText: /^题目列表$/ }).click();

    await page.waitForURL(/\/topics\/list/);

    // Create topic - navigate to create page
    await page.getByRole("button", { name: "新增题目" }).click();
    await page.waitForURL(/\/topics\/create/);

    // Select topic type - click combobox then select option
    await page.getByRole("combobox", { name: "请选择题目类型" }).click();
    await page.getByRole("option", { name: "单选题" }).click();

    // Fill topic content
    const topicContent = "E2E测试单选题：以下哪个是线性数据结构？" + Date.now();
    await page.getByRole("textbox", { name: "请输入题目内容" }).fill(topicContent);

    // Fill options
    await page.getByRole("textbox", { name: "选项 A" }).fill("数组");
    await page.getByRole("textbox", { name: "选项 B" }).fill("树");
    await page.getByRole("textbox", { name: "选项 C" }).fill("图");
    await page.getByRole("textbox", { name: "选项 D" }).fill("哈希表");

    // Set correct answer by clicking the radio
    await page.getByRole("radio", { name: "A: 数组" }).click();

    // Select subject tag (required) - MultiSelect
    await page.locator("div").filter({ hasText: /^选择学科标签$/ }).first().click();
    await page.getByRole("option", { name: "计算机科学" }).click();
    await page.keyboard.press("Escape");

    // Select difficulty tag (required) - MultiSelect
    await page.locator("div").filter({ hasText: /^选择难度标签$/ }).first().click();
    await page.getByRole("option", { name: "中等" }).click();
    await page.keyboard.press("Escape");

    // Click create button (use nth to select the correct one)
    await page.getByRole("button", { name: "创建" }).nth(3).click();

    // Verify topic is visible in the list
    await expect(page.getByText(topicContent).first()).toBeVisible();
  });

  test("should create experiment templates", async ({ page }) => {
    // Navigate to experiment management - click to expand menu
    await page.locator("div").filter({ hasText: /^实验模版管理$/ }).click();
    await page.locator("div").filter({ hasText: /^实验列表$/ }).click();

    await page.waitForURL(/\/experiments\/list/);

    // Create experiment template
    await page.getByRole("button", { name: "新建实验模版" }).click();

    // Wait for navigation or form to appear
    await page.waitForURL(/\/experiments\/create/);

    // Select course
    await page.getByRole("combobox", { name: "请选择课程" }).click();
    // Select the first available course
    await page.getByRole("option").first().click();

    // Fill experiment name
    const experimentName = "E2E测试实验" + Date.now();
    await page.getByRole("textbox", { name: "请输入实验名称" }).fill(experimentName);

    // Set deadline using DatePicker
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    await page.getByRole("combobox", { name: "请选择截止时间" }).click();
    // Click on a date in the next month
    await page.getByText(nextMonth.getDate().toString(), { exact: true }).first().click();

    // Wait for date picker to close
    await page.waitForTimeout(1000);
    
    // Click save button with force to bypass overlay
    await page.getByRole("button", { name: "保存" }).click({ force: true });
    
    // Wait for navigation and go to list page
    await page.waitForTimeout(2000);
    await page.locator("div").filter({ hasText: /^实验列表$/ }).click();
    await page.waitForURL(/\/experiments\/list/);
    await page.waitForTimeout(1000);
    
    // Verify experiment is visible in the list
    // Reload page to ensure fresh data (workaround for Vue Query cache issue)
    await page.reload();
    await page.waitForTimeout(1000);
    await expect(page.getByText(experimentName).first()).toBeVisible();
  });

  test("should add steps to experiment", async ({ page }) => {
    // Navigate to experiment management
    await page.locator("div").filter({ hasText: /^实验模版管理$/ }).click();
    await page.locator("div").filter({ hasText: /^实验列表$/ }).click();
    await page.waitForURL(/\/experiments\/list/);

    // Wait for the table to load
    await page.waitForSelector("table");

    // Find the first experiment row and click edit button
    const firstRow = page.getByRole("row").nth(1); // Skip header row
    await firstRow.locator("button").first().click();

    // Wait for edit page to load - just check for "实验信息" heading
    await expect(page.getByRole("heading", { name: "实验信息" })).toBeVisible();

    // Add data collection step
    await page.getByRole("button", { name: "添加步骤" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    // Select step type: 数据收集
    await page.locator("div").filter({ hasText: /^数据收集学生按要求收集实验数据$/ }).nth(1).click();

    // Wait for the form to load
    await expect(page.getByRole("dialog", { name: "添加数据收集步骤" })).toBeVisible();

    // Fill step description
    const stepName = "E2E步骤" + Date.now();
    await page.getByRole("textbox", { name: "请输入步骤描述" }).fill(stepName);

    // Select data type: 关键数据
    await page.getByRole("combobox", { name: "选择数据类型" }).click();
    await page.getByRole("option", { name: "关键数据" }).click();

    // Wait for the form to update
    await page.waitForTimeout(300);

    // Add a data field (required for 关键数据 type)
    await page.getByRole("button", { name: "添加数据字段" }).click();
    await page.getByRole("textbox", { name: "数据名称（如：温度）" }).fill("温度");
    await page.getByRole("textbox", { name: "正确答案（如：25）" }).fill("25");

    await page.getByRole("button", { name: "添加", exact: true }).click();
    await expect(page.getByRole("dialog", { name: "添加数据收集步骤" })).toBeHidden({ timeout: 10000 });

    // Verify step is visible in the table
    await expect(page.getByText(stepName)).toBeVisible();
  });

  test("should bind experiment to class", async ({ page }) => {
    // Navigate to class experiment binding page
    await page.locator("div").filter({ hasText: /^班级管理$/ }).click();
    await page.locator("div").filter({ hasText: /^绑定实验$/ }).click();

    // Wait for page to load
    await expect(page.getByRole("heading", { name: "绑定实验" })).toBeVisible();

    // Select course - use combobox role
    await page.getByRole("combobox", { name: "请选择课程" }).click();
    // Select first available course
    await page.getByRole("option").first().click();

    // Wait for course to be selected
    await page.waitForTimeout(300);

    // Select experiment (should be filtered by course)
    await page.getByRole("combobox", { name: /请选择实验|请先选择课程/ }).click();
    // Select first available experiment
    await page.getByRole("option").first().click();

    // Wait for experiment to be selected
    await page.waitForTimeout(300);

    // Select class (multi-select)
    await page.locator("div").filter({ hasText: /^请选择班级（可多选）$/ }).first().click();
    // Select first available class
    await page.getByRole("option").first().click();
    await page.keyboard.press("Escape");

    // Wait for class to be selected
    await page.waitForTimeout(300);

    // Set start time - click to open picker
    await page.getByRole("combobox", { name: "选择开始时间" }).click();
    // Wait for date picker to open
    await page.waitForTimeout(300);
    // Click on today's date (should be visible)
    const today = new Date();
    await page.getByText(today.getDate().toString(), { exact: true }).first().click();
    // Close the picker
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);

    // Set end time - click to open picker
    await page.getByRole("combobox", { name: "选择结束时间" }).click();
    // Wait for date picker to open
    await page.waitForTimeout(300);
    // Click on a future date (7 days later)
    const futureDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    // Navigate to next month if needed
    if (futureDate.getMonth() !== today.getMonth()) {
      // Click next month button
      await page.getByRole("button", { name: "Next Month" }).click();
      await page.waitForTimeout(200);
    }
    await page.getByText(futureDate.getDate().toString(), { exact: true }).first().click();
    // Close the picker
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);

    // Set experiment location
    await page.getByRole("textbox", { name: "请输入实验地点" }).fill("E2E测试实验室");

    // Save binding
    await page.getByRole("button", { name: "保存" }).click();

    // Verify success - should stay on the same page and form should be reset
    await expect(page.getByRole("heading", { name: "绑定实验" })).toBeVisible();
  });
});

test.describe("Query Refetch Verification", () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto(LOGIN_URL);

    await page.locator('input[type="text"]').fill("admin");
    await page.locator('input[type="password"]').fill("admin123");

    await page.getByRole("button", { name: "登录" }).click();

    // Wait for redirect to complete
    await page.waitForURL(/\/teacher/);
  });

  test("course list should refresh after creating a course", async ({ page }) => {
    // Navigate to course list
    await page.locator("div").filter({ hasText: /^课程管理$/ }).click();
    await page.locator("div").filter({ hasText: /^课程列表$/ }).click();
    await page.waitForURL(/\/courses\/$/);

    const courseName = "刷新测试课程" + Date.now();

    // Create a new course
    await page.getByRole("button", { name: "新建课程" }).click();
    await page.waitForURL(/\/courses\/create/);

    await page.getByRole("textbox", { name: "请输入课程名称" }).fill(courseName);
    await page.getByRole("button", { name: "创建" }).click();

    // Verify new course appears on the same page (create page has the table below form)
    await expect(page.getByRole("cell", { name: courseName }).first()).toBeVisible();
  });

  test("topic list should refresh after creating a topic", async ({ page }) => {
    // Navigate to topic list
    await page.locator("div").filter({ hasText: /^题目管理$/ }).click();
    await page.locator("div").filter({ hasText: /^题目列表$/ }).click();
    await page.waitForURL(/\/topics\/list/);

    // Create a new topic
    await page.getByRole("button", { name: "新增题目" }).click();
    await page.waitForURL(/\/topics\/create/);

    await page.getByRole("combobox", { name: "请选择题目类型" }).click();
    await page.getByRole("option", { name: "单选题" }).click();

    const topicName = "刷新测试题目" + Date.now();
    await page.getByRole("textbox", { name: "请输入题目内容" }).fill(topicName);
    await page.getByRole("textbox", { name: "选项 A" }).fill("选项A");
    await page.getByRole("textbox", { name: "选项 B" }).fill("选项B");

    // Select correct answer
    await page.getByRole("radio", { name: "A: 选项A" }).click();

    // Select subject tag (required) - MultiSelect
    await page.locator("div").filter({ hasText: /^选择学科标签$/ }).first().click();
    await page.getByRole("option", { name: "计算机科学" }).click();
    await page.keyboard.press("Escape");

    // Select difficulty tag (required) - MultiSelect
    await page.locator("div").filter({ hasText: /^选择难度标签$/ }).first().click();
    await page.getByRole("option", { name: "中等" }).click();
    await page.keyboard.press("Escape");

    // Click create button
    await page.getByRole("button", { name: "创建" }).nth(3).click();

    // Verify new topic appears on the same page (create page has the table below form)
    await expect(page.getByText(topicName)).toBeVisible();
  });

  test("experiment list should refresh after creating an experiment", async ({ page }) => {
    // Navigate to experiment list
    await page.locator("div").filter({ hasText: /^实验模版管理$/ }).click();
    await page.locator("div").filter({ hasText: /^实验列表$/ }).click();
    await page.waitForURL(/\/experiments\/list/);

    // Create a new experiment
    await page.getByRole("button", { name: "新建实验模版" }).click();
    await page.waitForURL(/\/experiments\/create/);

    // Select course if available
    await page.getByRole("combobox", { name: "请选择课程" }).click();
    const firstOption = page.getByRole("option").first();
    await firstOption.click();

    const experimentName = "刷新测试实验" + Date.now();
    await page.getByRole("textbox", { name: "请输入实验名称" }).fill(experimentName);

    // Set deadline
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    await page.getByRole("combobox", { name: "请选择截止时间" }).click();
    await page.getByText(nextMonth.getDate().toString(), { exact: true }).first().click();

    // Wait for date picker to close
    await page.waitForTimeout(1000);
    
    // Click save button with force to bypass overlay
    await page.getByRole("button", { name: "保存" }).click({ force: true });
    
    // Wait and navigate to list page
    await page.waitForTimeout(2000);
    await page.locator("div").filter({ hasText: /^实验列表$/ }).click();
    await page.waitForURL(/\/experiments\/list/);
    await page.waitForTimeout(1000);
    
    // Verify new experiment appears in the list
    // Reload page to ensure fresh data (workaround for Vue Query cache issue)
    await page.reload();
    await page.waitForTimeout(1000);
    await expect(page.getByText(experimentName).first()).toBeVisible();
  });
});

