import { createClient } from "@hey-api/openapi-ts";
import { rmSync } from "node:fs";
import { resolve } from "node:path";

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

generateApi().catch((error) => {
  console.error("❌ Failed to generate API client:", error);
  process.exit(1);
});
