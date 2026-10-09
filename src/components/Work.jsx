import { motion } from "motion/react";
import { highlights } from "../content.js";
import Reveal from "./Reveal.jsx";

export default function Work() {
  return (
    <section id="work" className="section">
      <Reveal as="p" className="eyebrow">Key Achievements</Reveal>
      <Reveal as="h2" delay={0.05}>주요 성과</Reveal>
      <div className="cards">
        {highlights.map((p, i) => (
          <Reveal key={p.no} delay={0.1 * i}>
            <motion.article
              className="glass card"
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <span className="card-index">{p.no}</span>
              <h3>{p.title}</h3>
              <p className="role">{p.role}</p>
              <p className="metric">{p.metric}</p>
              <ul className="tags">
                {p.tags.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
