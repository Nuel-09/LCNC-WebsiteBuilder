import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@puckeditor/plugin-ai", () => ({
  createAiPlugin: vi.fn((opts) => ({ __pluginOpts: opts })),
}));

describe("createBuilderAiPlugin", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns null when required context is missing", async () => {
    const { createBuilderAiPlugin } = await import("./aiProvider");

    expect(createBuilderAiPlugin({ token: "", projectId: "p1" })).toBeNull();
    expect(
      createBuilderAiPlugin({ token: "token-1", projectId: "" }),
    ).toBeNull();
  });

  it("builds plugin and prepares request with auth and projectId", async () => {
    const { createBuilderAiPlugin } = await import("./aiProvider");

    const plugin = createBuilderAiPlugin({
      token: "jwt-token",
      projectId: "p1",
    });
    expect(plugin).toBeTruthy();

    const prepared = await plugin.__pluginOpts.prepareRequest({
      headers: { "Content-Type": "application/json" },
      body: { chatId: "", trigger: "submit-message" },
    });

    expect(prepared.headers.get("Authorization")).toBe("Bearer jwt-token");
    expect(prepared.body.projectId).toBe("p1");
    expect(prepared.body.chatId).toBeUndefined();
    expect(prepared.credentials).toBe("same-origin");
  });
});
