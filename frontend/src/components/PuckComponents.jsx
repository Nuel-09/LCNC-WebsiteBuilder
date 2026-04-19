/**
 * School Builder Components for Puck Visual Editor
 *
 * These components define the building blocks available in the visual editor.
 * Each component has:
 * - render: How it appears in the canvas
 * - fields: What properties can be edited in the sidebar
 * - defaultProps: Starting values
 */

/**
 * Normalize color values for <input type="color">.
 * Browsers only accept strict hex values in this control.
 */
function toColorInputValue(value) {
  if (typeof value !== "string") return "#000000";

  const trimmed = value.trim();
  const isShortHex = /^#[0-9a-fA-F]{3}$/.test(trimmed);
  const isLongHex = /^#[0-9a-fA-F]{6}$/.test(trimmed);

  if (isShortHex || isLongHex) {
    return trimmed;
  }

  return "#000000";
}

/**
 * Reusable custom field that provides a visual picker plus manual hex input.
 */
function colorPickerField(label, exampleValue = "#4f6bed") {
  return {
    type: "custom",
    label,
    render: ({ field, value, onChange, readOnly }) => (
      <div style={{ display: "grid", gap: "6px" }}>
        {/* Custom fields in this Puck version may not auto-render labels, so we render it explicitly. */}
        <label
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#4b5563",
          }}
        >
          {field?.label ?? label}
        </label>
        <input
          type="color"
          value={toColorInputValue(value)}
          disabled={readOnly}
          onChange={(event) => onChange(event.target.value)}
          style={{ height: "34px", width: "100%", cursor: "pointer" }}
        />
        <input
          type="text"
          value={typeof value === "string" ? value : ""}
          disabled={readOnly}
          onChange={(event) => onChange(event.target.value)}
          placeholder={exampleValue}
          style={{
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            padding: "8px 10px",
            fontSize: "13px",
          }}
        />
        <small style={{ color: "#6b7280", fontSize: "11px" }}>
          Example: {exampleValue}
        </small>
      </div>
    ),
  };
}

// Header Component - School name and navigation bar(customised for branding, menu and layout)
export const Header = ({
  title = "School Name",
  subtitle = "Academy",
  menuItems = "Home,About,Programs,Why Us,Contact",
  ctaLabel = "Enroll Now",
  ctaUrl = "#",
  bgColor = "#ffffff",
  textColor = "#1f2937",
  accentColor = "#4f6bed",
  titleSize = 30,
  subtitleSize = 16,
  align = "left",
  sticky = false,
}) => {
  // Convert comma-seperated menu text into an array
  const links = menuItems
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const isLeft = align === "left";

  const isSticky = sticky === true || sticky === "true";

  return (
    <header
      style={{
        background: bgColor,
        color: textColor,
        padding: "18px 28px",
        borderBottom: "1px solid #e5e7eb",
        position: isSticky ? "sticky" : "static",
        top: isSticky ? 0 : undefined,
        zIndex: isSticky ? 20 : undefined,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ textAlign: isLeft ? "left" : "center" }}>
          <h1
            style={{ margin: 0, fontSize: `${titleSize}px`, lineHeight: 1.1 }}
          >
            {title}
          </h1>
          <p style={{ margin: 0, opacity: 0.8, fontSize: `${subtitleSize}px` }}>
            {subtitle}
          </p>
        </div>

        <nav
          style={{
            display: "flex",
            gap: "18px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {links.map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
              style={{
                color: textColor,
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              {label}
            </a>
          ))}
          <a
            href={ctaUrl}
            style={{
              textDecoration: "none",
              background: accentColor,
              color: "white",
              padding: "10px 16px",
              borderRadius: "10px",
              fontWeight: 700,
            }}
          >
            {ctaLabel}
          </a>
        </nav>
      </div>
    </header>
  );
};

Header.puckFields = {
  title: { type: "text", label: "School Name", placeholder: "EduFlow" },
  subtitle: { type: "text", label: "Tagline", placeholder: "Academy" },
  menuItems: {
    type: "text",
    label: "Menu (comma separated)",
    placeholder: "Home,About,Programs,Contact",
  },
  ctaLabel: { type: "text", label: "CTA Label", placeholder: "Enroll Now" },
  ctaUrl: { type: "text", label: "CTA URL", placeholder: "#" },
  bgColor: colorPickerField("Background Color"),
  textColor: colorPickerField("Text Color"),
  accentColor: colorPickerField("Button Color"),
  titleSize: { type: "number", label: "Title Font Size" },
  subtitleSize: { type: "number", label: "Subtitle Font Size" },
  align: {
    type: "select",
    label: "Brand Alignment",
    options: [
      { label: "Left", value: "left" },
      { label: "Center", value: "center" },
    ],
  },
  sticky: {
    type: "select",
    label: "Sticky Header",
    options: [
      { label: "Off", value: false },
      { label: "On", value: true },
    ],
  },
};

// Hero Section - Main call-to-action banner
export const Hero = ({
  heading = "Shaping the Leaders of Tomorrow",
  description = "A world-class learning environment where every student is empowered to discover potential.",
  buttonText = "Explore Programs",
  buttonUrl = "#programs",
  secondaryButtonText = "Contact Us",
  secondaryButtonUrl = "#contact",
  bgColor = "#3f51d7",
  textColor = "#ffffff",
  highlightColor = "#f2dd63",
  headingSize = 72,
  bodySize = 24,
  verticalPadding = 80,
  showStats = true,
  stat1 = "1,200+ Students Enrolled",
  stat2 = "80+ Expert Teachers",
  stat3 = "25+ Years of Excellence",
  stat4 = "98% Pass Rate",
}) => {
  const statItems = [stat1, stat2, stat3, stat4];
  const shouldShowStats = showStats;

  return (
    <section
      style={{
        background: `linear-gradient(135deg, ${bgColor} 0%, #2f36b8 100%)`,
        color: textColor,
        padding: `${verticalPadding}px 20px`,
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2
          style={{
            fontSize: `${headingSize}px`,
            lineHeight: 1.05,
            margin: "0 0 22px 0",
            maxWidth: "900px",
          }}
        >
          {heading.split(" ").slice(0, -1).join(" ")}{" "}
          <span style={{ color: highlightColor }}>
            {heading.split(" ").slice(-1).join(" ")}
          </span>
        </h2>

        <p
          style={{
            fontSize: `${bodySize}px`,
            lineHeight: 1.5,
            margin: "0 0 28px 0",
            maxWidth: "880px",
            opacity: 0.9,
          }}
        >
          {description}
        </p>

        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            marginBottom: shouldShowStats ? "42px" : 0,
          }}
        >
          <a
            href={buttonUrl}
            style={{
              textDecoration: "none",
              background: "white",
              color: "#2f36b8",
              padding: "14px 22px",
              borderRadius: "12px",
              fontWeight: 700,
            }}
          >
            {buttonText}
          </a>
          <a
            href={secondaryButtonUrl}
            style={{
              textDecoration: "none",
              background: "transparent",
              color: textColor,
              border: "1px solid rgba(255,255,255,0.45)",
              padding: "14px 22px",
              borderRadius: "12px",
              fontWeight: 700,
            }}
          >
            {secondaryButtonText}
          </a>
        </div>

        {shouldShowStats && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0,1fr))",
              gap: "14px",
            }}
          >
            {statItems.map((value) => (
              <div
                key={value}
                style={{
                  background: "rgba(255,255,255,0.14)",
                  borderRadius: "14px",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <strong style={{ fontSize: "30px", display: "block" }}>
                  {value.split(" ").slice(0, 1)}
                </strong>
                <span style={{ opacity: 0.92 }}>
                  {value.split(" ").slice(1).join(" ")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

Hero.puckFields = {
  heading: {
    type: "text",
    label: "Heading",
    placeholder: "Shaping the Leaders of Tomorrow",
  },
  description: {
    type: "textarea",
    label: "Description",
    placeholder:
      "A world-class learning environment where every student is empowered...",
  },
  buttonText: {
    type: "text",
    label: "Primary Button Text",
    placeholder: "Explore Programs",
  },
  buttonUrl: {
    type: "text",
    label: "Primary Button URL",
    placeholder: "#programs",
  },
  secondaryButtonText: {
    type: "text",
    label: "Secondary Button Text",
    placeholder: "Contact Us",
  },
  secondaryButtonUrl: {
    type: "text",
    label: "Secondary Button URL",
    placeholder: "#contact",
  },
  bgColor: colorPickerField("Background Color"),
  textColor: colorPickerField("Text Color"),
  highlightColor: colorPickerField("Highlight Color"),
  headingSize: { type: "number", label: "Heading Size" },
  bodySize: { type: "number", label: "Body Size" },
  verticalPadding: { type: "number", label: "Vertical Padding" },
  showStats: {
    type: "select",
    label: "Show Stats",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
  stat1: {
    type: "text",
    label: "Stat 1",
    placeholder: "1,200+ Students Enrolled",
  },
  stat2: { type: "text", label: "Stat 2", placeholder: "80+ Expert Teachers" },
  stat3: {
    type: "text",
    label: "Stat 3",
    placeholder: "25+ Years of Excellence",
  },
  stat4: { type: "text", label: "Stat 4", placeholder: "98% Pass Rate" },
};

// About Component - School mission/overview
export const About = ({
  title = "About Our School",
  description = "We are committed to nurturing excellence, discipline and innovation.",
  bgColor = "#ffffff",
  textColor = "#4b5563",
  headingColor = "#1f2937",
  titleSize = 32,
  bodySize = 18,
  verticalPadding = 48,
  align = "center",
}) => (
  <section
    style={{ padding: `${verticalPadding}px 20px`, background: bgColor }}
  >
    <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: align }}>
      <h3
        style={{
          fontSize: `${titleSize}px`,
          marginBottom: "16px",
          color: headingColor,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: 0,
          color: textColor,
          lineHeight: 1.7,
          fontSize: `${bodySize}px`,
        }}
      >
        {description}
      </p>
    </div>
  </section>
);

About.defaultProps = {
  title: "About Our School",
  description:
    "We are committed to nurturing excellence, discipline and innovation.",
};
About.puckFields = {
  title: {
    type: "text",
    label: "Title",
    placeholder: "About Our School",
  },
  description: {
    type: "textarea",
    label: "Description",
    placeholder:
      "We provide a safe and inclusive environment where students thrive.",
  },
  bgColor: colorPickerField("Background Color"),
  headingColor: colorPickerField("Heading Color"),
  textColor: colorPickerField("Text Color"),
  titleSize: { type: "number", label: "Title Size" },
  bodySize: { type: "number", label: "Body Size" },
  verticalPadding: { type: "number", label: "Vertical Padding" },
  align: {
    type: "select",
    label: "Text Alignment",
    options: [
      { label: "Left", value: "left" },
      { label: "Center", value: "center" },
    ],
  },
};

// Programs Component - Academic offerings/cards
export const Programs = ({
  title = "Academic Programs",
  items = [
    {
      name: "Early Years",
      summary: "Foundation learning with play-based methods.",
    },
    {
      name: "Primary School",
      summary: "Strong academics with character formation.",
    },
    {
      name: "Creative Arts",
      summary: "Music, drama and fine arts for expression.",
    },
  ],
  bgColor = "#f8fafc",
  cardColor = "#ffffff",
  titleColor = "#1f2937",
  textColor = "#4b5563",
  titleSize = 32,
  columns = 3,
  verticalPadding = 48,
}) => (
  <section
    style={{ padding: `${verticalPadding}px 20px`, background: bgColor }}
  >
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <h3
        style={{
          fontSize: `${titleSize}px`,
          marginBottom: "24px",
          color: titleColor,
          textAlign: "center",
        }}
      >
        {title}
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.max(1, Math.min(4, Number(columns) || 3))}, minmax(0, 1fr))`,
          gap: "16px",
        }}
      >
        {items.map((item, idx) => (
          <article
            key={idx}
            style={{
              background: cardColor,
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "16px",
            }}
          >
            <h4 style={{ margin: "0 0 8px 0", color: titleColor }}>
              {item.name}
            </h4>
            <p style={{ margin: 0, color: textColor, fontSize: "0.95rem" }}>
              {item.summary}
            </p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

Programs.defaultProps = {
  title: "Academic Programs",
  items: [
    {
      name: "Early Years",
      summary: "Foundation learning with play-based methods.",
    },
    {
      name: "Primary School",
      summary: "Strong academics with character formation.",
    },
    {
      name: "Creative Arts",
      summary: "Music, drama and fine arts for expression.",
    },
  ],
};
Programs.puckFields = {
  title: {
    type: "text",
    label: "Section Title",
    placeholder: "Academic Programs",
  },
  bgColor: colorPickerField("Background Color"),
  cardColor: colorPickerField("Card Color"),
  titleColor: colorPickerField("Title Color"),
  textColor: colorPickerField("Text Color"),
  titleSize: { type: "number", label: "Title Size" },
  columns: { type: "number", label: "Columns (1-4)" },
  verticalPadding: { type: "number", label: "Vertical Padding" },
};

// Announcement Component - News/updates section
export const Announcement = ({
  title = "Latest News",
  items = [
    {
      date: "Feb 28",
      title: "New Science Lab Opened",
      content: "State-of-the-art facilities",
    },
    {
      date: "Feb 25",
      title: "Sports Tournament",
      content: "Inter-school championship",
    },
  ],
  bgColor = "#fff9e6",
  titleColor = "#333333",
  textColor = "#666666",
  accentColor = "#ffc107",
  verticalPadding = 40,
  titleSize = 28,
}) => (
  <section
    style={{
      padding: `${verticalPadding}px 20px`,
      background: bgColor,
      borderLeft: `4px solid ${accentColor}`,
    }}
  >
    <h3
      style={{
        color: titleColor,
        marginBottom: "20px",
        fontSize: `${titleSize}px`,
      }}
    >
      {title}
    </h3>
    <div>
      {items.map((item, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: "20px",
            paddingBottom: "20px",
            borderBottom: idx < items.length - 1 ? "1px solid #ddd" : "none",
          }}
        >
          <p style={{ margin: "0 0 5px 0", color: "#999", fontSize: "0.9em" }}>
            {item.date}
          </p>
          <p
            style={{
              margin: "0 0 5px 0",
              fontWeight: "bold",
              color: titleColor,
            }}
          >
            {item.title}
          </p>
          <p style={{ margin: 0, color: textColor, fontSize: "0.95em" }}>
            {item.content}
          </p>
        </div>
      ))}
    </div>
  </section>
);

Announcement.defaultProps = {
  title: "Latest News",
  items: [
    {
      date: "Feb 28",
      title: "New Science Lab Opened",
      content: "State-of-the-art facilities",
    },
    {
      date: "Feb 25",
      title: "Sports Tournament",
      content: "Inter-school championship",
    },
  ],
};
Announcement.puckFields = {
  title: {
    type: "text",
    label: "Section Title",
    placeholder: "Latest Updates",
  },
  bgColor: colorPickerField("Background Color"),
  titleColor: colorPickerField("Title Color"),
  textColor: colorPickerField("Text Color"),
  accentColor: colorPickerField("Accent Color"),
  titleSize: { type: "number", label: "Title Size" },
  verticalPadding: { type: "number", label: "Vertical Padding" },
};

// Admissions CTA Component
export const AdmissionsCta = ({
  heading = "Admissions Open for New Session",
  buttonText = "Apply Now",
  buttonUrl = "/admissions",
  bgColor = "#1d4ed8",
  textColor = "#ffffff",
  buttonColor = "#ffffff",
  buttonTextColor = "#1f2937",
  headingSize = 30,
  verticalPadding = 44,
}) => (
  <section
    style={{
      padding: `${verticalPadding}px 20px`,
      background: `linear-gradient(135deg, ${bgColor} 0%, #4338ca 100%)`,
      color: textColor,
      textAlign: "center",
    }}
  >
    <h3 style={{ margin: "0 0 16px 0", fontSize: `${headingSize}px` }}>
      {heading}
    </h3>
    <a
      href={buttonUrl}
      style={{
        display: "inline-block",
        textDecoration: "none",
        background: buttonColor,
        color: buttonTextColor,
        padding: "10px 20px",
        borderRadius: "8px",
        fontWeight: 700,
      }}
    >
      {buttonText}
    </a>
  </section>
);

AdmissionsCta.defaultProps = {
  heading: "Admissions Open for New Session",
  buttonText: "Apply Now",
  buttonUrl: "/admissions",
};
AdmissionsCta.puckFields = {
  heading: {
    type: "text",
    label: "Heading",
    placeholder: "Admissions Open for 2026/2027",
  },
  buttonText: {
    type: "text",
    label: "Button Text",
    placeholder: "Start Application",
  },
  buttonUrl: { type: "text", label: "Button URL", placeholder: "/admissions" },
  bgColor: colorPickerField("Background Color"),
  textColor: colorPickerField("Text Color"),
  buttonColor: colorPickerField("Button Color"),
  buttonTextColor: colorPickerField("Button Text Color"),
  headingSize: { type: "number", label: "Heading Size" },
  verticalPadding: { type: "number", label: "Vertical Padding" },
};

// Contact Component - Contact information section
export const Contact = ({
  sectionTitle = "Contact Us",
  email = "info@school.com",
  phone = "+1 (555) 123-4567",
  address = "123 Education Street, Learning City",
  bgColor = "#f5f5f5",
  titleColor = "#333333",
  textColor = "#333333",
  linkColor = "#667eea",
  columns = 3,
  verticalPadding = 40,
}) => (
  <section
    style={{
      padding: `${verticalPadding}px 20px`,
      background: bgColor,
      textAlign: "center",
    }}
  >
    <h3 style={{ color: titleColor, marginBottom: "30px" }}>{sectionTitle}</h3>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${Math.max(1, Math.min(3, Number(columns) || 3))}, minmax(0, 1fr))`,
        gap: "30px",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <div>
        <p style={{ fontSize: "0.9em", color: "#999", marginBottom: "10px" }}>
          EMAIL
        </p>
        <p style={{ margin: 0, color: textColor, fontWeight: "bold" }}>
          <a
            href={`mailto:${email}`}
            style={{ color: linkColor, textDecoration: "none" }}
          >
            {email}
          </a>
        </p>
      </div>
      <div>
        <p style={{ fontSize: "0.9em", color: "#999", marginBottom: "10px" }}>
          PHONE
        </p>
        <p style={{ margin: 0, color: textColor, fontWeight: "bold" }}>
          <a
            href={`tel:${phone}`}
            style={{ color: linkColor, textDecoration: "none" }}
          >
            {phone}
          </a>
        </p>
      </div>
      <div>
        <p style={{ fontSize: "0.9em", color: "#999", marginBottom: "10px" }}>
          ADDRESS
        </p>
        <p style={{ margin: 0, color: textColor, fontSize: "0.95em" }}>
          {address}
        </p>
      </div>
    </div>
  </section>
);

Contact.defaultProps = {
  email: "info@school.com",
  phone: "+1 (555) 123-4567",
  address: "123 Education Street, Learning City",
};
Contact.puckFields = {
  sectionTitle: {
    type: "text",
    label: "Section Title",
    placeholder: "Contact Us",
  },
  email: { type: "text", label: "Email", placeholder: "contact@school.com" },
  phone: {
    type: "text",
    label: "Phone Number",
    placeholder: "+1 (555) 000-0000",
  },
  address: {
    type: "text",
    label: "Address",
    placeholder: "Your School Address",
  },
  bgColor: colorPickerField("Background Color"),
  titleColor: colorPickerField("Title Color"),
  textColor: colorPickerField("Text Color"),
  linkColor: colorPickerField("Link Color"),
  columns: { type: "number", label: "Columns (1-3)" },
  verticalPadding: { type: "number", label: "Vertical Padding" },
};

// Footer Component - Footer section
export const Footer = ({
  copyrightText = "(c) 2026 School Name. All rights reserved.",
  bgColor = "#333333",
  textColor = "#ffffff",
  verticalPadding = 30,
}) => (
  <footer
    style={{
      background: bgColor,
      color: textColor,
      padding: `${verticalPadding}px 20px`,
      textAlign: "center",
    }}
  >
    <p style={{ margin: 0 }}>{copyrightText}</p>
  </footer>
);

Footer.defaultProps = {
  copyrightText: "(c) 2026 School Name. All rights reserved.",
};
Footer.puckFields = {
  copyrightText: {
    type: "text",
    label: "Copyright Text",
    placeholder: "(c) 2026 Your School. All rights reserved.",
  },
  bgColor: colorPickerField("Background Color"),
  textColor: colorPickerField("Text Color"),
  verticalPadding: { type: "number", label: "Vertical Padding" },
};
