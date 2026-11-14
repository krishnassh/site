export const profile = {
  // canonical origin, override with NEXT_PUBLIC_SITE_URL when deploying elsewhere
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://krishnassh.com",
  jobTitle: "Software Engineer",
  name: "Krishna Gopal",
  // shown under the name until the github bio loads (or if it fails)
  tagline: "dead internet theory",
  description:
    "Programmer who likes to build things. Projects, links and open source work by Krishna Gopal.",
  avatar: "https://avatars.githubusercontent.com/u/125943937?v=4",
  github: "krishnassh",

  // one string per paragraph
  about: [
    "Hi, I'm Krishna Gopal (known as kwynx or krishnassh on internet)",
    "someone who loves tinkering with machines and contributing to projects that cater my own needs",
    "started programming in 6th grade and still in touch with these things",
    "currently a freshman CS undergrad",
    "I do Systems-programming and DevOps",
  ],

  // the animated name card up top
  nameCardColor: "#2f5ff5",
};
