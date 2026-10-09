import { activities } from "../content.js";
import Reveal from "./Reveal.jsx";

export default function Activities() {
  return (
    <section id="activities" className="section">
      <Reveal as="p" className="eyebrow">Experience</Reveal>
      <Reveal as="h2" delay={0.05}>주요 활동</Reveal>
      <ol className="timeline">
        {activities.map((a, i) => (
          <Reveal as="li" key={a.title} delay={0.05 * i} className="glass activity">
            <h3>{a.title}</h3>
            <p>{a.desc}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
