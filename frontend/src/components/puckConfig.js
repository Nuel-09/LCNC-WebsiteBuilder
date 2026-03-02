import {
  Announcement,
  Contact,
  Footer,
  Header,
  Hero,
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
    Announcement: {
      render: Announcement,
      fields: Announcement.puckFields,
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
          heading: "Build Your School Website",
          description: "Drag and drop components to create a landing page",
          buttonText: "Get Started",
          buttonUrl: "#",
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
