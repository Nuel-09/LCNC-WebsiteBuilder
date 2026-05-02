import {
  ensureBuilderShape,
  getActivePageData,
  mergeActivePageData,
} from "./builderConfigUtils";

describe("builderConfigUtils", () => {
  it("normalizes legacy single-page config into stable builder shape", () => {
    const result = ensureBuilderShape({
      content: [{ type: "Header", props: { title: "Legacy Title" } }],
    });

    expect(result.pages).toHaveLength(1);
    expect(result.activePageId).toBe("home");
    expect(result.pages[0].content).toHaveLength(1);
    expect(result.pages[0].content[0].type).toBe("Header");
    expect(result.pages[0].content[0].props.title).toBe("Legacy Title");
    expect(result.pages[0].content[0].id).toBeDefined();
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("Header");
    expect(result.content[0].props.title).toBe("Legacy Title");
  });

  it("returns sanitized active page content with generated IDs", () => {
    const data = getActivePageData({
      pages: [
        {
          id: "home",
          title: "Home",
          slug: "home",
          content: [
            { type: "Header", props: { title: "Title" } },
            null,
            { type: "", props: {} },
          ],
        },
      ],
      activePageId: "home",
      site: { theme: {} },
    });

    expect(data.content).toHaveLength(1);
    expect(data.content[0].id).toBe("header-1");
    expect(data.content[0].props.title).toBe("Title");
  });

  it("preserves existing page content when incoming pageData has no content array", () => {
    const existing = {
      pages: [
        {
          id: "home",
          title: "Home",
          slug: "home",
          content: [{ type: "Hero", props: { heading: "Old" } }],
        },
      ],
      activePageId: "home",
      site: { theme: {} },
    };

    const merged = mergeActivePageData(existing, { root: {} });

    expect(merged.pages[0].content).toHaveLength(1);
    expect(merged.pages[0].content[0].type).toBe("Hero");
    expect(merged.content[0].type).toBe("Hero");
  });

  it("isolates content references across pages", () => {
    const sharedContent = [
      { type: "Header", props: { title: "Shared Header", menu: ["Home"] } },
    ];

    const result = ensureBuilderShape({
      pages: [
        { id: "home", title: "Home", slug: "home", content: sharedContent },
        {
          id: "contact",
          title: "Contact",
          slug: "contact",
          content: sharedContent,
        },
      ],
      activePageId: "home",
      site: { theme: {} },
    });

    result.pages[0].content[0].props.title = "Home Header";
    result.pages[0].content[0].props.menu.push("About");

    expect(result.pages[1].content[0].props.title).toBe("Shared Header");
    expect(result.pages[1].content[0].props.menu).toEqual(["Home"]);
  });
});
