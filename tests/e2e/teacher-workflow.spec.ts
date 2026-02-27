import { test, expect } from "@playwright/test";

const PREFIX_PATH = process.env.VITE_PREFIX_PATH || "";
const TEACHER_URL = `${PREFIX_PATH}/teacher`;
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
    // Navigate to course management
    await page.goto(`${TEACHER_URL}/courses/`);

    // Create course
    await page.getByRole("button", { name: "新建课程" }).click();

    // Wait for dialog to appear
    await expect(page.getByRole("dialog", { name: "新建课程" })).toBeVisible();

    // Fill course form - use getByRole for textbox
    const courseName = "E2E测试数据结构" + Date.now();
    await page.getByRole("textbox", { name: "请输入课程名称" }).fill(courseName);
    await page.getByRole("dialog", { name: "新建课程" }).getByRole("button", { name: "创建" }).click();

    // Wait for the dialog to close
    await expect(page.getByRole("dialog")).toBeHidden();

    // Verify course is created
    await expect(page.getByRole("cell", { name: courseName }).first()).toBeVisible();
  });

  test("should create topics with different types", async ({ page }) => {
    // Navigate to topic management
    await page.goto(`${TEACHER_URL}/topics/list`);

    // Create single choice topic (单选题)
    await page.getByRole("button", { name: "新增题目" }).click();
    await expect(page.getByRole("dialog", { name: "新增题目" })).toBeVisible();

    // Select topic type - click combobox then select option
    await page.getByRole("combobox", { name: "请选择题目类型" }).click();
    await page.getByRole("option", { name: "单选题" }).click();

    // Fill topic content
    await page.getByRole("textbox", { name: "请输入题目内容" }).fill("E2E测试单选题：以下哪个是线性数据结构？");

    // Fill options - use getByRole for textbox
    await page.getByRole("textbox", { name: "选项 A" }).fill("数组");
    await page.getByRole("textbox", { name: "选项 B" }).fill("树");
    await page.getByRole("textbox", { name: "选项 C" }).fill("图");
    await page.getByRole("textbox", { name: "选项 D" }).fill("哈希表");

    // Set correct answer by clicking the label text
    await page.getByRole("dialog").getByText("A: 数组").click();

    // Select subject tag (required) - MultiSelect
    await page.locator("div").filter({ hasText: /^选择学科标签$/ }).first().click();
    await page.getByRole("option").first().click();
    // Click outside to close the overlay
    await page.keyboard.press("Escape");
    await page.locator(".p-multiselect-overlay").waitFor({ state: "hidden", timeout: 3000 });
    // Wait for DOM to stabilize after overlay closes
    await page.waitForTimeout(500);

    // Select difficulty tag (required) - MultiSelect
    await page.locator("div").filter({ hasText: /^选择难度标签$/ }).first().click({ force: true });
    await page.waitForSelector(".p-multiselect-overlay", { state: "visible", timeout: 5000 });
    await page.locator(".p-multiselect-overlay [role='option']").first().click();
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: "确定" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    // Verify topic is visible
    await expect(page.getByText("E2E测试单选题").first()).toBeVisible();

    // Create multiple choice topic (多选题)
    await page.getByRole("button", { name: "新增题目" }).click();
    await expect(page.getByRole("dialog", { name: "新增题目" })).toBeVisible();

    await page.getByRole("combobox", { name: "请选择题目类型" }).click();
    await page.getByRole("option", { name: "多选题" }).click();

    await page.getByRole("textbox", { name: "请输入题目内容" }).fill("E2E测试多选题：以下哪些是排序算法？");
    await page.getByRole("textbox", { name: "选项 A" }).fill("冒泡排序");
    await page.getByRole("textbox", { name: "选项 B" }).fill("快速排序");
    await page.getByRole("textbox", { name: "选项 C" }).fill("二分查找");
    await page.getByRole("textbox", { name: "选项 D" }).fill("归并排序");

    // Set correct answers for multiple choice by clicking labels
    await page.getByRole("dialog").getByText("A: 冒泡排序").click();
    await page.getByRole("dialog").getByText("B: 快速排序").click();
    await page.getByRole("dialog").getByText("D: 归并排序").click();

    // Select tags (required)
    await page.locator("div").filter({ hasText: /^选择学科标签$/ }).first().click();
    await page.getByRole("option").first().click();
    await page.keyboard.press("Escape");
    await page.locator(".p-multiselect-overlay").waitFor({ state: "hidden", timeout: 3000 });
    // Small delay to ensure DOM is stable after overlay closes
    await page.waitForTimeout(300);

    // Select difficulty tag (required) - MultiSelect
    await page.locator("div").filter({ hasText: /^选择难度标签$/ }).first().click({ timeout: 10000 });
    await page.waitForSelector(".p-multiselect-overlay", { state: "visible", timeout: 3000 });
    await page.locator(".p-multiselect-overlay [role='option']").first().click();
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: "确定" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    // Create true/false topic (判断题)
    await page.getByRole("button", { name: "新增题目" }).click();
    await expect(page.getByRole("dialog", { name: "新增题目" })).toBeVisible();

    await page.getByRole("combobox", { name: "请选择题目类型" }).click();
    await page.getByRole("option", { name: "判断题" }).click();

    await page.getByRole("textbox", { name: "请输入题目内容" }).fill("E2E测试判断题：栈是先进先出的数据结构");

    // Set correct answer for true/false - click "错误" label
    await page.getByRole("dialog").getByText("错误").click();

    // Select tags (required)
    await page.locator("div").filter({ hasText: /^选择学科标签$/ }).first().click();
    await page.getByRole("option").first().click();
    await page.keyboard.press("Escape");
    await page.locator(".p-multiselect-overlay").waitFor({ state: "hidden", timeout: 3000 });
    // Small delay to ensure DOM is stable after overlay closes
    await page.waitForTimeout(300);

    // Select difficulty tag (required) - MultiSelect
    await page.locator("div").filter({ hasText: /^选择难度标签$/ }).first().click({ timeout: 10000 });
    await page.waitForSelector(".p-multiselect-overlay", { state: "visible", timeout: 3000 });
    await page.locator(".p-multiselect-overlay [role='option']").first().click();
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: "确定" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    // Verify topics are visible
    await expect(page.getByText("E2E测试多选题").first()).toBeVisible();
    await expect(page.getByText("E2E测试判断题").first()).toBeVisible();
  });

  test("should create experiment templates", async ({ page }) => {
    // Navigate to experiment management
    await page.goto(`${TEACHER_URL}/experiments/list`);

    // Create experiment template - this navigates to create page, not a dialog
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

    // Close the DatePicker panel by pressing Escape
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: "保存" }).click();

    // Wait for navigation back to list or success
    await page.waitForURL(/\/experiments\/list/);

    // Verify experiment is visible in the list
    await expect(page.getByText(experimentName)).toBeVisible();
  });

  test("should add steps to experiment", async ({ page }) => {
    await page.goto(`${TEACHER_URL}/experiments/list`);

    // Wait for the table to load
    await page.waitForSelector("table");

    // Find the first experiment row and click edit button
    const firstRow = page.getByRole("row").nth(1); // Skip header row
    await firstRow.locator("button").first().click();

    // Wait for edit page to load - just check for "实验信息" heading
    await expect(page.getByRole("heading", { name: "实验信息" })).toBeVisible();

    // Add data collection step - table data (表格数据)
    await page.getByRole("button", { name: "添加步骤" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    // Select step type: 数据收集
    await page.locator("div").filter({ hasText: /^数据收集学生按要求收集实验数据$/ }).nth(1).click();

    // Wait for the form to load
    await expect(page.getByRole("dialog", { name: "添加数据收集步骤" })).toBeVisible();

    // Fill step description
    const stepName = "E2E步骤" + Date.now();
    await page.getByRole("textbox", { name: "请输入步骤描述" }).fill(stepName);

    // Select data type: 关键数据 (simpler than 表格数据)
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

  test.skip("should bind experiment to class", async ({ page }) => {
    // Navigate to class experiment binding page
    await page.goto(`${TEACHER_URL}/classes/bind`);

    // Wait for page to load
    await expect(page.getByRole("heading", { name: "绑定实验" })).toBeVisible();

    // Select course - use combobox role
    await page.getByRole("combobox", { name: "请选择课程" }).click();
    // Select first available course
    await page.getByRole("option").first().click();

    // Select experiment (should be filtered by course)
    await page.getByRole("combobox", { name: /请选择实验|请先选择课程/ }).click();
    // Select first available experiment
    await page.getByRole("option").first().click();

    // Select class (multi-select)
    await page.locator("div").filter({ hasText: /^请选择班级（可多选）$/ }).first().click();
    // Select first available class
    await page.getByRole("option").first().click();
    await page.keyboard.press("Escape");

    // Set start and end time
    const now = new Date();
    const startTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
    const endTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Next week

    // Click start time picker
    await page.getByRole("combobox", { name: "选择开始时间" }).click();
    await page.getByText(startTime.getDate().toString(), { exact: true }).first().click();
    await page.keyboard.press("Escape");

    // Click end time picker
    await page.getByRole("combobox", { name: "选择结束时间" }).click();
    await page.getByText(endTime.getDate().toString(), { exact: true }).first().click();
    await page.keyboard.press("Escape");

    // Set experiment location
    await page.getByRole("textbox", { name: "请输入实验地点" }).fill("E2E测试实验室");

    // Save binding
    await page.getByRole("button", { name: "保存" }).click();

    // Should navigate to class list after success
    await expect(page).toHaveURL(/\/classes\/list/);
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
    await page.goto(`${TEACHER_URL}/courses/`);

    const courseName = "刷新测试课程" + Date.now();

    // Create a new course
    await page.getByRole("button", { name: "新建课程" }).click();
    await expect(page.getByRole("dialog", { name: "新建课程" })).toBeVisible();

    await page.getByRole("textbox", { name: "请输入课程名称" }).fill(courseName);
    await page.getByRole("button", { name: "创建" }).click();

    // Wait for dialog to close
    await expect(page.getByRole("dialog")).toBeHidden();

    // Verify new course appears without manual refresh
    await expect(page.getByRole("cell", { name: courseName }).first()).toBeVisible();
  });

  test("topic list should refresh after creating a topic", async ({ page }) => {
    await page.goto(`${TEACHER_URL}/topics/list`);

    // Create a new topic
    await page.getByRole("button", { name: "新增题目" }).click();
    await expect(page.getByRole("dialog", { name: "新增题目" })).toBeVisible();

    await page.getByRole("combobox", { name: "请选择题目类型" }).click();
    await page.getByRole("option", { name: "单选题" }).click();

    const topicName = "刷新测试题目" + Date.now();
    await page.getByRole("textbox", { name: "请输入题目内容" }).fill(topicName);
    await page.getByRole("textbox", { name: "选项 A" }).fill("选项A");
    await page.getByRole("textbox", { name: "选项 B" }).fill("选项B");

    // Select correct answer
    await page.getByRole("dialog").getByText("A: 选项A").click();

    // Wait for dialog to stabilize
    await page.waitForTimeout(500);

    // Select subject tag (required) - MultiSelect
    await page.locator("div").filter({ hasText: /^选择学科标签$/ }).first().click();
    await page.getByRole("option").first().click();
    await page.keyboard.press("Escape");

    // Wait for overlay to close and DOM to stabilize
    await page.locator(".p-multiselect-overlay").waitFor({ state: "hidden", timeout: 3000 });
    await page.waitForTimeout(500);

    // Select difficulty tag (required) - MultiSelect
    await page.locator("div").filter({ hasText: /^选择难度标签$/ }).first().click({ force: true });
    await page.waitForSelector(".p-multiselect-overlay", { state: "visible", timeout: 5000 });
    await page.locator(".p-multiselect-overlay [role='option']").first().click();
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: "确定" }).click();
    await expect(page.getByRole("dialog")).toBeHidden();

    // Verify new topic appears without manual refresh
    await expect(page.getByText(topicName)).toBeVisible();
  });

  test("experiment list should refresh after creating an experiment", async ({ page }) => {
    await page.goto(`${TEACHER_URL}/experiments/list`);

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

    // Close the DatePicker panel
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: "保存" }).click();
    await page.waitForURL(/\/experiments\/list/);

    // Verify new experiment appears without manual refresh
    await expect(page.getByText(experimentName)).toBeVisible();
  });
});
