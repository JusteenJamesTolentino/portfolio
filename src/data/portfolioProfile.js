export const portfolioProfile = {
  name: 'Justeen',
  brand: 'JusteenDev',
  role: 'Fullstack Web Developer',
  email: 'justeen0x24@gmail.com',
  bio: 'I believe simplicity is the shortest path to reliable software. I build complete web applications, from responsive frontends to APIs and the databases behind them.',
  freelance: 'I am a Computer Engineering student at Quezon City University and a full-stack engineer who also works on hardware projects and IoT systems.',
};

export const technologyGroups = [
  {
    title: 'Frontend',
    technologies: ['Frontend', 'React', 'Tailwind CSS', 'JavaScript'],
  },
  {
    title: 'Backend & Databases',
    technologies: ['Backend', 'Node.js', 'MySQL', 'MariaDB'],
  },
  {
    title: 'Programming Languages',
    technologies: ['Python', 'C++', 'C', 'C#', 'Java'],
  },
  {
    title: 'Deployment & Hosting',
    technologies: ['Vercel', 'Render', 'Firebase'],
  },
];

export const technologies = technologyGroups.flatMap(group => group.technologies);
