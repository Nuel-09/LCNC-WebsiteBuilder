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
          title: "Welcome to School Builder",
          subtitle: "Create your school website visually",
        },
      },
      {
        type: "Hero",
        props: {
          heading: "Inspiring Excellence in Every Student",
          description:
            "A modern learning environment focused on growth, values and academic strength.",
          buttonText: "Apply Now",
          buttonUrl: "/admissions",
        },
      },
      {
        type: "About",
        props: {
          title: "About Our School",
          description:
            "We provide a safe and inclusive environment where students build confidence, leadership and academic success.",
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
        },
      },
      {
        type: "AdmissionsCta",
        props: {
          heading: "Admissions Open for 2026/2027",
          buttonText: "Start Application",
          buttonUrl: "/admissions",
        },
      },
      {
        type: "Contact",
        props: {
          email: "contact@school.com",
          phone: "+1 (555) 000-0000",
          address: "Your School Address",
        },
      },
      {
        type: "Footer",
        props: { copyrightText: "© 2026 Your School. All rights reserved." },
      },
    ],
  };
}
