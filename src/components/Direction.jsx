import { flow } from "../content.js";
import Reveal from "./Reveal.jsx";

export default function Direction() {
  return (
    <section id="direction" className="section direction">
      <Reveal as="p" className="eyebrow">Direction</Reveal>
      <Reveal as="h2" delay={0.05}>진로 방향</Reveal>
      <Reveal delay={0.15} className="glass flow-card">
        <ol className="flow">
          {flow.map((f) => <li key={f}>{f}</li>)}
        </ol>
      </Reveal>
      <footer>© {new Date().getFullYear()} 김조은</footer>
    </section>
  );
}
