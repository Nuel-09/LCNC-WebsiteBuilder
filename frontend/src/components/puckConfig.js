import {
  About,
  AdmissionsCta,
  Announcement,
  Contact,
  Footer,
  Header,
  Hero,
  Programs,
} from "./PuckComponents";

export const puckConfig = {
  components: {
    Header: {
      render: Header,
      fields: Header.puckFields,
    },
    Hero: {
      render: Hero,
      fields: Hero.puckFields,
    },
    About: {
      render: About,
      fields: About.puckFields,
    },
    Programs: {
      render: Programs,
      fields: Programs.puckFields,
    },
    Announcement: {
      render: Announcement,
      fields: Announcement.puckFields,
    },
    AdmissionsCta: {
      render: AdmissionsCta,
      fields: AdmissionsCta.puckFields,
    },
    Contact: {
      render: Contact,
      fields: Contact.puckFields,
    },
    Footer: {
      render: Footer,
      fields: Footer.puckFields,
    },
  },
};

export function getDefaultLayout() {
  return {
    content: [
      {
        type: "Header",
        props: {
          title: "EduFlow",
          subtitle: "Academy",
          menuItems: "Home,About,Programs,Why Us,Contact",
          ctaLabel: "Enroll Now",
          ctaUrl: "#",
          bgColor: "#ffffff",
          textColor: "#1f2937",
          accentColor: "#4f6bed",
          titleSize: 30,
          subtitleSize: 16,
          align: "left",
          sticky: false,
        },
      },
      {
        type: "Hero",
        props: {
          heading: "Shaping the Leaders of Tomorrow",
          description:
            "A world-class learning environment where every student is empowered to discover their potential, build character, and achieve excellence.",
          buttonText: "Explore Programs",
          buttonUrl: "#programs",
          secondaryButtonText: "Contact Us",
          secondaryButtonUrl: "#contact",
          bgColor: "#3f51d7",
          textColor: "#ffffff",
          highlightColor: "#f2dd63",
          headingSize: 72,
          bodySize: 24,
          verticalPadding: 80,
          showStats: true,
          stat1: "1,200+ Students Enrolled",
          stat2: "80+ Expert Teachers",
          stat3: "25+ Years of Excellence",
          stat4: "98% Pass Rate",
        },
      },
      {
        type: "About",
        props: {
          title: "About Our School",
          description:
            "We provide a safe and inclusive environment where students build confidence, leadership and academic success.",
          bgColor: "#ffffff",
          headingColor: "#1f2937",
          textColor: "#4b5563",
          titleSize: 32,
          bodySize: 18,
          verticalPadding: 48,
          align: "center",
        },
      },
      {
        type: "Programs",
        props: {
          title: "Academic Programs",
          items: [
            {
              name: "Early Years",
              summary: "Strong foundation in literacy and numeracy.",
            },
            {
              name: "Primary School",
              summary: "Balanced academics, creativity and social growth.",
            },
            {
              name: "STEM Club",
              summary: "Hands-on science and technology projects.",
            },
          ],
          bgColor: "#f8fafc",
          cardColor: "#ffffff",
          titleColor: "#1f2937",
          textColor: "#4b5563",
          titleSize: 32,
          columns: 3,
          verticalPadding: 48,
        },
      },
      {
        type: "Announcement",
        props: {
          title: "Latest Updates",
          items: [
            {
              date: "Today",
              title: "Welcome",
              content: "Customize this announcement with your news",
            },
          ],
          bgColor: "#fff9e6",
          titleColor: "#333333",
          textColor: "#666666",
          accentColor: "#ffc107",
          titleSize: 28,
          verticalPadding: 40,
        },
      },
      {
        type: "AdmissionsCta",
        props: {
          heading: "Admissions Open for 2026/2027",
          buttonText: "Start Application",
          buttonUrl: "/admissions",
          bgColor: "#1d4ed8",
          textColor: "#ffffff",
          buttonColor: "#ffffff",
          buttonTextColor: "#1f2937",
          headingSize: 30,
          verticalPadding: 44,
        },
      },
      {
        type: "Contact",
        props: {
          sectionTitle: "Contact Us",
          email: "contact@school.com",
          phone: "+1 (555) 000-0000",
          address: "Your School Address",
          bgColor: "#f5f5f5",
          titleColor: "#333333",
          textColor: "#333333",
          linkColor: "#667eea",
          columns: 3,
          verticalPadding: 40,
        },
      },
      {
        type: "Footer",
        props: {
          copyrightText: "© 2026 Your School. All rights reserved.",
          bgColor: "#333333",
          textColor: "#ffffff",
          verticalPadding: 30,
        },
      },
    ],
    site: {
      theme: {
        primaryColor: "#4f6bed",
        secondaryColor: "#2f36b8",
        textColor: "#1f2937",
        backgroundColor: "#ffffff",
      },
    },
  };
}
