import { motion } from "motion/react";
import { certificates, competencies } from "../content.js";
import Reveal from "./Reveal.jsx";

const list = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = {
  hidden: { opacity: 0, scale: 0.92, y: 12 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Skills() {
  return (
    <section id="skills" className="section">
      <Reveal as="p" className="eyebrow">Competencies</Reveal>
      <Reveal as="h2" delay={0.05}>보유 경험 및 역량</Reveal>
      <div className="cards">
        {competencies.map((c, i) => (
          <Reveal key={c.area} delay={0.1 * i}>
            <div className="glass card comp">
              <h3>{c.area}</h3>
              <ul className="tags">
                {c.items.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal as="h2" delay={0.05} className="sub-h">자격사항</Reveal>
      <motion.ul
        className="chips"
        variants={list}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        {certificates.map((c) => (
          <motion.li key={c.name} variants={item} className={`glass chip ${c.done ? "done" : "todo"}`}>
            <span aria-hidden="true">{c.done ? "✓" : "○"}</span>
            {c.name}
            <span className="sr-only">{c.done ? " (취득)" : " (취득 예정)"}</span>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
