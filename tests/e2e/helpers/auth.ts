import { type Page } from "@playwright/test";

const LOGIN_URL = "/login";

export async function loginAsTeacher(page: Page) {
  await page.goto(LOGIN_URL);
  await page.getByLabel("账号").fill("admin");
  await page.getByLabel("密码").fill("admin123");
  await page.getByRole("button", { name: "登录" }).click();

  // Wait for redirect to complete
  await page.waitForURL(/\/signlab\/teacher/);
}
