import { motion, useScroll, useTransform } from "motion/react";
import { profile } from "../content.js";

const ease = [0.22, 1, 0.36, 1];

export default function Hero() {
  const { scrollY } = useScroll();
  const orbY = useTransform(scrollY, [0, 800], [0, 160]);
  const textY = useTransform(scrollY, [0, 600], [0, -60]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <header className="hero" id="top">
      <motion.div className="orb orb-a" style={{ y: orbY }} aria-hidden="true" />
      <motion.div className="orb orb-b" style={{ y: orbY }} aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <motion.div className="hero-inner" style={{ y: textY, opacity: fade }}>
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          {profile.role}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 0.15, ease }}
        >
          {profile.name}
          <span className="h1-sub">{profile.tagline}</span>
        </motion.h1>
        <motion.div
          className="hero-cta"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease }}
        >
          <a className="btn btn-primary" href="#work">주요 성과 보기</a>
          <a className="btn btn-glass" href="#activities">주요 활동</a>
        </motion.div>
      </motion.div>

      <motion.div
        className="scroll-cue"
        style={{ opacity: fade }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        aria-hidden="true"
      >
        <span />
      </motion.div>
    </header>
  );
}
