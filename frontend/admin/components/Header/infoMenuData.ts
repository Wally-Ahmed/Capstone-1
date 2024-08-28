import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    path: "/info",
    newTab: false,
  },
  {
    id: 2,
    title: "About",
    path: "/info/about",
    newTab: false,
  },
  {
    id: 4,
    title: "Blog",
    path: "/info/blog",
    newTab: false,
  },
  {
    id: 5,
    title: "Support",
    path: "/info/contact",
    newTab: false,
  },
  {
    id: 6,
    title: "Pages",
    newTab: false,
    submenu: [
      // {
      //   id: 11,
      //   title: "About Page",
      //   path: "/info/about",
      //   newTab: false,
      // },
      // {
      //   id: 12,
      //   title: "Contact Page",
      //   path: "/info/contact",
      //   newTab: false,
      // },
      // {
      //   id: 13,
      //   title: "Blog Grid Page",
      //   path: "/info/blog",
      //   newTab: false,
      // },
      {
        id: 14,
        title: "Blog Sidebar Page",
        path: "/info/blog/blog-sidebar",
        newTab: false,
      },
      {
        id: 15,
        title: "Blog Details Page",
        path: "/info/blog/blog-details",
        newTab: false,
      },
      // {
      //   id: 16,
      //   title: "Sign In Page",
      //   path: "/signin",
      //   newTab: false,
      // },
      // {
      //   id: 17,
      //   title: "Sign Up Page",
      //   path: "/signup",
      //   newTab: false,
      // },
    ],
  },
];
export default menuData;
