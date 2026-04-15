/**
 * Builder configuration utilities.
 *
 * Purpose:
 * - keep config shape consistent between legacy and newer multi-page format
 * - provide safe helpers for active-page editing in the visual builder
 * - apply theme fallbacks so components render with sensible defaults
 */
import { getDefaultLayout } from "./puckConfig";

const DEFAULT_THEME = {
  primaryColor: "#4f6bed",
  secondaryColor: "#2f36b8",
  textColor: "#1f2937",
  backgroundColor: "#ffffff",
};

const DEFAULT_NAV_MENU = ["Home", "About", "Programs", "Contact"];

// Baseline props used to prefill missing values in older saved configs.
const DEFAULT_COMPONENT_PROPS = (getDefaultLayout().content ?? []).reduce(
  (accumulator, block) => {
    if (!block?.type) return accumulator;
    accumulator[block.type] = { ...(block.props ?? {}) };
    return accumulator;
  },
  {},
);

/**
 * Normalize content blocks before sending them to Puck.
 * This prevents runtime crashes when old saved data contains missing/invalid entries.
 */
function sanitizeContentItems(content = []) {
  return (Array.isArray(content) ? content : [])
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      if (typeof item.type !== "string" || item.type.length === 0) return null;

      return {
        ...item,
        id: item.id ?? `${item.type.toLowerCase()}-${index + 1}`,
        props: item.props && typeof item.props === "object" ? item.props : {},
      };
    })
    .filter(Boolean);
}

function parseMaybeString(value) {
  if (typeof value !== "string") return value;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

/**
 * Normalizes raw config from API/local state to a stable builder shape.
 * Supports legacy { content: [] } and current { site, pages, activePageId }.
 */
export function ensureBuilderShape(rawConfig, fallbackContent = []) {
  const parsed = parseMaybeString(rawConfig) ?? rawConfig;

  if (!parsed || typeof parsed !== "object") {
    return {
      site: {
        theme: { ...DEFAULT_THEME },
        navigation: { menu: [...DEFAULT_NAV_MENU] },
      },
      pages: [
        {
          id: "home",
          title: "Home",
          slug: "home",
          content: [...fallbackContent],
        },
      ],
      activePageId: "home",
      // Backward compatibility for older consumers
      content: [...fallbackContent],
    };
  }

  const hasPages = Array.isArray(parsed.pages) && parsed.pages.length > 0;
  const legacyContent = Array.isArray(parsed.content)
    ? parsed.content
    : [...fallbackContent];

  const pages = hasPages
    ? parsed.pages.map((page, idx) => ({
        id: page?.id ?? `page-${idx + 1}`,
        title: page?.title ?? `Page ${idx + 1}`,
        slug: page?.slug ?? `page-${idx + 1}`,
        content: Array.isArray(page?.content) ? page.content : [],
      }))
    : [{ id: "home", title: "Home", slug: "home", content: legacyContent }];

  const activePageId =
    typeof parsed.activePageId === "string" &&
    pages.some((p) => p.id === parsed.activePageId)
      ? parsed.activePageId
      : pages[0].id;

  const activePage = pages.find((page) => page.id === activePageId) ?? pages[0];

  return {
    site: {
      theme: {
        ...DEFAULT_THEME,
        ...(parsed.site?.theme ?? {}),
      },
      navigation: {
        menu: Array.isArray(parsed.site?.navigation?.menu)
          ? parsed.site.navigation.menu
          : [...DEFAULT_NAV_MENU],
      },
    },
    pages,
    activePageId,
    content: Array.isArray(activePage.content) ? activePage.content : [],
  };
}

/**
 * Applies theme-level fallback colors to individual blocks.
 * Block-specific props still override these defaults.
 */
function withThemeDefaults(item, theme) {
  const defaultProps = DEFAULT_COMPONENT_PROPS[item.type] ?? {};
  const props = { ...defaultProps, ...(item.props ?? {}) };

  switch (item.type) {
    case "Header":
      props.accentColor ??= theme.primaryColor;
      props.textColor ??= theme.textColor;
      break;
    case "Hero":
      props.bgColor ??= theme.secondaryColor;
      props.textColor ??= "#ffffff";
      break;
    case "About":
    case "Programs":
    case "Announcement":
    case "Contact":
      props.textColor ??= theme.textColor;
      break;
    case "AdmissionsCta":
      props.bgColor ??= theme.primaryColor;
      props.textColor ??= "#ffffff";
      break;
    case "Footer":
      props.bgColor ??= theme.textColor;
      props.textColor ??= "#ffffff";
      break;
    default:
      break;
  }

  return { ...item, props };
}

/**
 * Returns the active page content in Puck-compatible format.
 */
export function getActivePageData(builderConfig) {
  const current = ensureBuilderShape(builderConfig);
  const activePage =
    current.pages.find((page) => page.id === current.activePageId) ??
    current.pages[0];

  const themedContent = sanitizeContentItems(activePage.content).map((item) =>
    withThemeDefaults(item, current.site.theme),
  );

  return { content: themedContent };
}

/**
 * Merges edited active-page data back into full builder config.
 */
export function mergeActivePageData(builderConfig, pageData) {
  const current = ensureBuilderShape(builderConfig);
  const activePage =
    current.pages.find((page) => page.id === current.activePageId) ??
    current.pages[0];

  // Important: preserve existing content when editor payload is partial.
  // Puck can emit intermediate data shapes during drag/delete operations.
  const incomingHasContentArray = Array.isArray(pageData?.content);
  const nextContent = incomingHasContentArray
    ? sanitizeContentItems(pageData.content)
    : sanitizeContentItems(activePage?.content);

  const pages = current.pages.map((page) =>
    page.id === current.activePageId ? { ...page, content: nextContent } : page,
  );

  return {
    ...current,
    pages,
    content: nextContent,
  };
}
