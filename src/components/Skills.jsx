import { motion } from "motion/react";
import { skills } from "../content.js";
import Reveal from "./Reveal.jsx";

const list = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = {
  hidden: { opacity: 0, scale: 0.9, y: 12 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Skills() {
  return (
    <section id="skills" className="section">
      <Reveal as="p" className="eyebrow">Skills</Reveal>
      <Reveal as="h2" delay={0.05}>도구와 기술</Reveal>
      <motion.ul
        className="chips"
        variants={list}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        {skills.map((s) => (
          <motion.li key={s} variants={item} className="glass chip">{s}</motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
