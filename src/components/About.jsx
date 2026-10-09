import { animate, useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { profile, stats } from "../content.js";
import Reveal from "./Reveal.jsx";

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix]);

  return <span ref={ref}>{value + suffix}</span>;
}

export default function About() {
  return (
    <section id="about" className="section">
      <Reveal as="p" className="eyebrow">About</Reveal>
      <Reveal as="h2" delay={0.05}>{profile.intro}</Reveal>
      <div className="stats">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={0.1 * i} className="glass stat">
            <strong><Counter value={s.value} suffix={s.suffix} /></strong>
            <span>{s.label}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
