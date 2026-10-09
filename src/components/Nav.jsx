import { motion, useScroll, useSpring } from "motion/react";
import { profile } from "../content.js";

export default function Nav() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  return (
    <nav className="nav glass" aria-label="주요 메뉴">
      <a href="#top" className="brand">{profile.name}</a>
      <ul>
        <li><a href="#about">About</a></li>
        <li><a href="#work">Work</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <motion.span className="progress" style={{ scaleX }} aria-hidden="true" />
    </nav>
  );
}
