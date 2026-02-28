/**
 * School Builder Components for Puck Visual Editor
 * 
 * These components define the building blocks available in the visual editor.
 * Each component has:
 * - render: How it appears in the canvas
 * - fields: What properties can be edited in the sidebar
 * - defaultProps: Starting values
 */

// Header Component - School name and navigation bar
export const Header = ({ title = "School Name", subtitle = "Welcome" }) => (
  <header
    style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      padding: "20px",
      textAlign: "center",
    }}
  >
    <h1 style={{ margin: "0 0 10px 0", fontSize: "2.5em" }}>{title}</h1>
    <p style={{ margin: 0, fontSize: "1.1em", opacity: 0.9 }}>{subtitle}</p>
  </header>
);

Header.defaultProps = { title: "School Name", subtitle: "Welcome" };
Header.puckFields = {
  title: { type: "text", label: "School Title" },
  subtitle: { type: "text", label: "Subtitle" },
};

// Hero Section - Main call-to-action banner
export const Hero = ({
  heading = "Welcome to Our School",
  description = "Providing quality education since 2000",
  buttonText = "Explore",
  buttonUrl = "#",
}) => (
  <section
    style={{
      background: "url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 400%22><rect fill=%22%23f0f4f8%22 width=%221200%22 height=%22400%22/></svg>')",
      backgroundSize: "cover",
      padding: "60px 20px",
      textAlign: "center",
      minHeight: "300px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    }}
  >
    <h2 style={{ fontSize: "2.5em", marginBottom: "20px", color: "#333" }}>
      {heading}
    </h2>
    <p style={{ fontSize: "1.2em", marginBottom: "30px", color: "#666" }}>
      {description}
    </p>
    <button
      style={{
        background: "#667eea",
        color: "white",
        padding: "12px 30px",
        border: "none",
        borderRadius: "5px",
        fontSize: "1em",
        cursor: "pointer",
        width: "fit-content",
        margin: "0 auto",
      }}
    >
      {buttonText}
    </button>
  </section>
);

Hero.defaultProps = {
  heading: "Welcome to Our School",
  description: "Providing quality education since 2000",
  buttonText: "Explore",
  buttonUrl: "#",
};
Hero.puckFields = {
  heading: { type: "text", label: "Main Heading" },
  description: { type: "textarea", label: "Description" },
  buttonText: { type: "text", label: "Button Text" },
  buttonUrl: { type: "text", label: "Button URL" },
};

// Announcement Component - News/updates section
export const Announcement = ({
  title = "Latest News",
  items = [
    { date: "Feb 28", title: "New Science Lab Opened", content: "State-of-the-art facilities" },
    { date: "Feb 25", title: "Sports Tournament", content: "Inter-school championship" },
  ],
}) => (
  <section style={{ padding: "40px 20px", background: "#fff9e6", borderLeft: "4px solid #ffc107" }}>
    <h3 style={{ color: "#333", marginBottom: "20px" }}>{title}</h3>
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
          <p style={{ margin: "0 0 5px 0", fontWeight: "bold", color: "#333" }}>
            {item.title}
          </p>
          <p style={{ margin: 0, color: "#666", fontSize: "0.95em" }}>
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
    { date: "Feb 28", title: "New Science Lab Opened", content: "State-of-the-art facilities" },
    { date: "Feb 25", title: "Sports Tournament", content: "Inter-school championship" },
  ],
};
Announcement.puckFields = {
  title: { type: "text", label: "Section Title" },
};

// Contact Component - Contact information section
export const Contact = ({
  email = "info@school.com",
  phone = "+1 (555) 123-4567",
  address = "123 Education Street, Learning City",
}) => (
  <section
    style={{
      padding: "40px 20px",
      background: "#f5f5f5",
      textAlign: "center",
    }}
  >
    <h3 style={{ color: "#333", marginBottom: "30px" }}>Contact Us</h3>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "30px",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <div>
        <p style={{ fontSize: "0.9em", color: "#999", marginBottom: "10px" }}>
          EMAIL
        </p>
        <p style={{ margin: 0, color: "#333", fontWeight: "bold" }}>
          <a href={`mailto:${email}`} style={{ color: "#667eea", textDecoration: "none" }}>
            {email}
          </a>
        </p>
      </div>
      <div>
        <p style={{ fontSize: "0.9em", color: "#999", marginBottom: "10px" }}>
          PHONE
        </p>
        <p style={{ margin: 0, color: "#333", fontWeight: "bold" }}>
          <a href={`tel:${phone}`} style={{ color: "#667eea", textDecoration: "none" }}>
            {phone}
          </a>
        </p>
      </div>
      <div>
        <p style={{ fontSize: "0.9em", color: "#999", marginBottom: "10px" }}>
          ADDRESS
        </p>
        <p style={{ margin: 0, color: "#333", fontSize: "0.95em" }}>
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
  email: { type: "text", label: "Email" },
  phone: { type: "text", label: "Phone Number" },
  address: { type: "text", label: "Address" },
};

// Footer Component - Footer section
export const Footer = ({ copyrightText = "© 2026 School Name. All rights reserved." }) => (
  <footer
    style={{
      background: "#333",
      color: "white",
      padding: "30px 20px",
      textAlign: "center",
    }}
  >
    <p style={{ margin: 0 }}>{copyrightText}</p>
  </footer>
);

Footer.defaultProps = { copyrightText: "© 2026 School Name. All rights reserved." };
Footer.puckFields = {
  copyrightText: { type: "text", label: "Copyright Text" },
};
