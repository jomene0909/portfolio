import { links, profile } from "../content.js";
import Reveal from "./Reveal.jsx";

export default function Contact() {
  return (
    <section id="contact" className="section contact">
      <Reveal as="p" className="eyebrow">Contact</Reveal>
      <Reveal as="h2" delay={0.05}>함께 만들어볼까요?</Reveal>
      <Reveal delay={0.15} className="glass contact-card">
        <a className="mail" href={`mailto:${profile.email}`}>{profile.email}</a>
        <ul className="links">
          {links.map((l) => (
            <li key={l.label}><a href={l.href}>{l.label}</a></li>
          ))}
        </ul>
      </Reveal>
      <footer>© {new Date().getFullYear()} {profile.name}</footer>
    </section>
  );
}
