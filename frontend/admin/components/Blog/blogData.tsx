import { Blog } from "@/types/blog";

const blogData: Blog[] = [
  {
    id: 1,
    title: "Top 10 Tips for a Memorable Dining Experience",
    paragraph:
      "Discover the secrets to creating unforgettable dining experiences that will keep your guests coming back for more.",
    image: "/images/blog/blog-01.jpg",
    author: {
      name: "Samuyl Joshi",
      image: "/images/blog/author-01.png",
      designation: "Hospitality Consultant",
    },
    tags: ["dining", "hospitality"],
    publishDate: "2025",
  },
  {
    id: 2,
    title: "How to Design a Restaurant Menu That Sells",
    paragraph:
      "Learn how to craft a menu that not only looks good but also maximizes your restaurant's revenue.",
    image: "/images/blog/blog-02.jpg",
    author: {
      name: "Musharof Chy",
      image: "/images/blog/author-02.png",
      designation: "Menu Designer",
    },
    tags: ["menu", "design"],
    publishDate: "2025",
  },
  {
    id: 3,
    title: "The Importance of Customer Service in Restaurants",
    paragraph:
      "Explore why exceptional customer service is key to success in the restaurant industry and how to train your staff.",
    image: "/images/blog/blog-03.jpg",
    author: {
      name: "Lethium Deo",
      image: "/images/blog/author-03.png",
      designation: "Customer Service Expert",
    },
    tags: ["customer service", "training"],
    publishDate: "2025",
  },
];
export default blogData;
