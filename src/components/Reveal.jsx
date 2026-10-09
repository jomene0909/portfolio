import { motion } from "motion/react";

// 스크롤로 뷰포트에 들어올 때 한 번만 떠오르는 래퍼
export default function Reveal({ children, delay = 0, y = 32, as = "div", ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
