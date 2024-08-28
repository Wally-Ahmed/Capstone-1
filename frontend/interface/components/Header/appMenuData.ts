import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Dashboard",
    path: "/app",
    newTab: false,
  },
  {
    id: 2,
    title: "Schedule",
    path: "/app/schedule",
    newTab: false,
  },
  {
    id: 3,
    title: "Menus",
    path: "/app/menus",
    newTab: false,
  },
  {
    id: 4,
    title: "Layouts",
    path: "/app/layouts",
    newTab: false,
  },
  {
    id: 5,
    title: "Employees",
    path: "/app/employees",
    newTab: false,
  },
  {
    id: 6,
    title: "Interfaces",
    path: "/app/interfaces",
    newTab: false,
  },
  {
    id: 7,
    title: "Info",
    newTab: false,
    submenu: [
      {
        id: 10,
        title: "Home Page",
        path: "/info",
        newTab: true,
      },
      {
        id: 11,
        title: "About Page",
        path: "/info/about",
        newTab: true,
      },
      {
        id: 12,
        title: "Contact Page",
        path: "/info/contact",
        newTab: true,
      },
      {
        id: 13,
        title: "Blog Grid Page",
        path: "/info/blog",
        newTab: true,
      },
      {
        id: 14,
        title: "Blog Sidebar Page",
        path: "/info/blog-sidebar",
        newTab: true,
      },
      {
        id: 15,
        title: "Blog Details Page",
        path: "/info/blog-details",
        newTab: true,
      },
    ],
  },
];
const data = [];
export default data;