import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Work from "./components/Work.jsx";
import Activities from "./components/Activities.jsx";
import Skills from "./components/Skills.jsx";
import Direction from "./components/Direction.jsx";

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <main>
        <About />
        <Work />
        <Activities />
        <Skills />
        <Direction />
      </main>
    </>
  );
}
