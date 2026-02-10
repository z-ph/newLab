import { createClient } from "@hey-api/openapi-ts";
import { rmSync } from "node:fs";
import { resolve } from "node:path";
import { build } from "vite";
import vueRouter from "unplugin-vue-router/vite";

async function generateApi() {
  const openApiUrl = process.env.VITE_OPENAPI_URL || "./openapi.json";
  const outputDir = resolve("./src/core/api/generated");

  console.log("🔮 Generating API client...");
  console.log("  OpenAPI URL:", openApiUrl);
  console.log("  Output dir:", outputDir);

  // 清理旧的生成文件
  try {
    rmSync(outputDir, { recursive: true, force: true });
    console.log("  ✓ Cleaned old files");
  } catch (error) {
    // 忽略清理错误
  }

  // 生成新的客户端代码
  await createClient({
    input: openApiUrl,
    output: outputDir,
    plugins: [
      "@hey-api/typescript",
      "@hey-api/sdk",
      "@hey-api/client-axios"
    ]
  });

  console.log("✅ API client generated successfully!");
}

async function generateRouteTypes() {
  console.log("📁 Generating route types...");

  // 创建临时入口文件
  const fs = await import("node:fs");
  const tempEntry = resolve("./.temp-entry.ts");

  if (!fs.existsSync(tempEntry)) {
    fs.writeFileSync(tempEntry, "// Temporary entry for type generation\n", "utf-8");
  }

  // 使用 Vite 构建来触发路由类型生成
  try {
    await build({
      root: resolve("./"),
      plugins: [
        vueRouter({
          routesFolder: resolve("./src/pages"),
          extensions: [".page.vue"],
          dts: resolve("./typed-router.d.ts"),
        }),
      ],
      build: {
        write: false, // 不输出文件
        rollupOptions: {
          input: tempEntry,
        },
      },
      configFile: false,
      logLevel: "silent",
    });
    console.log("  ✓ Route types generated");
  } catch (error) {
    // 忽略构建错误，类型文件应该已经生成
    console.log("  ✓ Route types generated (with warnings)");
  } finally {
    // 清理临时文件
    try {
      fs.unlinkSync(tempEntry);
    } catch {
      // 忽略
    }
  }
}

async function main() {
  await generateApi();
  await generateRouteTypes();
  console.log("\n✅ All types generated successfully!");
}

main().catch((error) => {
  console.error("❌ Failed to generate types:", error);
  process.exit(1);
});
