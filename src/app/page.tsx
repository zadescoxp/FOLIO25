import EmojiWindow from "@/components/site/EmojiWindow";
import Hero from "@/components/site/Hero";
import Swarm from "@/components/site/Swarm";
import WorkList from "@/components/site/WorkList";
import { links } from "@/content/site";

export default function Home() {
  return (
    <>
      <nav className="site-nav" aria-label="Main">
        <a href="#work">Work</a>
        <a href="#contact">Contact</a>
      </nav>

      <main>
        <Hero />

        <section id="work" className="work-section">
          <h2 className="sr-only">Selected work</h2>
          <WorkList />
        </section>

        <section id="contact" className="contact">
          <h2 className="sr-only">Contact</h2>
          <div className="contact-art" data-build="Mood">
            <EmojiWindow />
          </div>

          <ul className="socials">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" data-build={link.label}>
                  <span className="social-fill" aria-hidden="true" />
                  <span className="social-body">
                    <span className="social-name" data-type="">{link.label}<span className="social-arrow" aria-hidden="true">↗</span></span>
                    <span className="social-handle" data-type="">{link.handle}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <footer className="contact-foot">
            <span>Zade © 2026</span>
            <span>Based in Bengaluru</span>
          </footer>
        </section>
      </main>

      <Swarm />
    </>
  );
}
