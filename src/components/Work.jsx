import { motion } from "motion/react";
import { projects } from "../content.js";
import Reveal from "./Reveal.jsx";

export default function Work() {
  return (
    <section id="work" className="section">
      <Reveal as="p" className="eyebrow">Selected Work</Reveal>
      <Reveal as="h2" delay={0.05}>대표 프로젝트</Reveal>
      <div className="cards">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={0.1 * i}>
            <motion.a
              href={p.href}
              className="glass card"
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <span className="card-index">0{i + 1}</span>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <ul className="tags">
                {p.tags.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </motion.a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
