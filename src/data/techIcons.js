import { FaJava, FaLaptopCode, FaServer } from 'react-icons/fa';
import { SiC, SiCplusplus, SiFirebase, SiJavascript, SiMariadb, SiMysql, SiNodedotjs, SiPython, SiReact, SiRender, SiTailwindcss, SiVercel } from 'react-icons/si';

export const TECH_ICONS = {
  Frontend: { Icon: FaLaptopCode, color: '#38bdf8' },
  React: { Icon: SiReact, color: '#61dafb' },
  'Node.js': { Icon: SiNodedotjs, color: '#68a063' },
  Firebase: { Icon: SiFirebase, color: '#ffca28' },
  'Tailwind CSS': { Icon: SiTailwindcss, color: '#38bdf8' },
  JavaScript: { Icon: SiJavascript, color: '#f7df1e' },
  Backend: { Icon: FaServer, color: '#a78bfa' },
  MySQL: { Icon: SiMysql, color: '#4479a1' },
  MariaDB: { Icon: SiMariadb, color: '#c77b46' },
  Python: { Icon: SiPython, color: '#4b8bbe' },
  'C++': { Icon: SiCplusplus, color: '#659ad2' },
  C: { Icon: SiC, color: '#a8b9cc' },
  'C#': { monogram: 'C#', color: '#9b4f96' },
  Java: { Icon: FaJava, color: '#f89820' },
  Vercel: { Icon: SiVercel, color: '#ffffff' },
  Render: { Icon: SiRender, color: '#46e3b7' },
};
