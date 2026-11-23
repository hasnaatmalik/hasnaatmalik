import type { CSSProperties } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import Bookshelf from "@/components/Bookshelf";
import Critters from "@/components/Critters";
import ContributionGraph from "@/components/ContributionGraph";
import { ArrowRight, ArrowUpRight, BrandIcon, Moon, Pin, Sun } from "@/components/Icon";
import Mascot from "@/components/Mascot";
import Section from "@/components/Section";
import SiteFrame from "@/components/SiteFrame";
import SpotifyEmbed from "@/components/SpotifyEmbed";
import MovieDeck from "@/components/Tickets";
import { InkText, Scribble, Shimmer, Wave } from "@/components/TextFx";
import { experience } from "@/constants/experience";
import { galleryPhotos } from "@/constants/gallery";
import { profile, socials, stack } from "@/constants/profile";
import { projectsByYear } from "@/constants/projects";
import { asset } from "@/lib/asset";
import { dayPart, useGreeting, useLahoreTime } from "@/lib/time";

export const Route = createFileRoute("/")({
  component: Home,
});

const external = { target: "_blank", rel: "noopener noreferrer" } as const;
const stagger = (i: number) => ({ "--rd": `${i * 55}ms` }) as CSSProperties;

const previewPhotos = [
  "purple-peaks-dusk",
  "forest-light-rays",
  "rickshaw-bougainvillea",
  "night-stream",
  "yurts-mountains",
  "city-night",
].flatMap((name) => galleryPhotos.filter((p) => p.src.includes(name)));

function Home() {
  return (
    <SiteFrame home>
      <Hero />
      <Work />
      <Experience />
      <Stack />
      <About />
      <Activity />
      <Books />
      <Movies />
      <Music />
      <Photos />
      <Elsewhere />
      <Quote />
      <Socials />
    </SiteFrame>
  );
}

/* Home base: the chai shop down the road, at night, in the rain. */
function Hero() {
  const time = useLahoreTime();
  const current = experience.find((e) => e.current);
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="banner">
        <img
          className="banner-gif"
          src={asset("/gifs/chai-shop.gif")}
          alt="Pixel-art chai shop on a rainy night in Lahore"
          width={400}
          height={400}
        />
        <span className="banner-tag mono">
          <span className="rec" aria-hidden="true" />
          live from lahore{time ? ` · ${time.label}` : ""}
        </span>
      </div>

      <div className="profile-row">
        <Mascot size={118} talk greet className="hero-mascot" label="Hasnaat, illustrated" />
        <div className="profile-actions" data-reveal="" style={stagger(4)}>
          <a href={asset("/cv.pdf")} {...external} className="btn">
            Résumé
          </a>
          <a href={`mailto:${profile.email}`} className="btn btn-primary">
            Say hello
          </a>
        </div>
      </div>

      <div className="hero-copy">
        <div className="hero-meta">
          <h1 id="hero-title" className="hero-name">
            <InkText text={profile.name} delay={250} />
            <Wave />
          </h1>
          <span className="dot-sep" aria-hidden="true" />
          <span className="hero-place" data-reveal="" style={stagger(2)}>
            <Pin />
            {profile.location}
          </span>
        </div>
        <p className="hero-line" data-reveal="" style={stagger(4)}>
          I build <Scribble delay={700}>AI systems</Scribble> and{" "}
          <Scribble delay={950}>full-stack products</Scribble>.
        </p>
        <p className="hero-bio" data-reveal="" style={stagger(6)}>
          {current ? (
            <>
              {current.role} at{" "}
              <a href={current.href} {...external} className="text-link">
                {current.company}
              </a>
              , working on AI for healthcare
            </>
          ) : (
            "Software engineer"
          )}
          . I like taking an idea from a rough prototype to something people actually use. Away from
          the keyboard, I shoot film.
        </p>
        <p className="status" data-reveal="" style={stagger(8)}>
          <span className="status-dot" aria-hidden="true" />
          <Shimmer>Open to remote work and freelance</Shimmer>
        </p>
      </div>
    </section>
  );
}

function Work() {
  return (
    <Section id="work" title="Work" note="Things I've built" noteSide="left">
      <div className="work">
        {projectsByYear.map(({ year, items }) => (
          <div key={year} className="work-year">
            <div className="year-tab" data-reveal="">
              <Folder />
              <span>{year}</span>
            </div>
            <ul className="work-list">
              {items.map((p, i) => (
                <li key={p.name} data-reveal="" style={stagger(i + 1)}>
                  <a href={p.href} {...external} className="work-row">
                    <span className="work-name">{p.name}</span>
                    <span className="work-tagline">{p.tagline}</span>
                    {p.isNew && <span className="badge">new</span>}
                    <span className="work-arrow">
                      <ArrowUpRight size={13} />
                    </span>
                    <span className="work-detail">
                      <span>
                        {p.description}
                        <span className="mono"> {p.stack.join(" · ")}</span>
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Folder() {
  return (
    <svg viewBox="0 0 28 22" width="26" height="20" aria-hidden="true" className="folder">
      <path
        d="M2 4.5A2.5 2.5 0 0 1 4.5 2h6l2.4 2.6h10.6A2.5 2.5 0 0 1 26 7.1V18a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 2 18z"
        className="folder-back"
      />
      <path d="M4 6.5h20v4H4z" className="folder-paper" />
      <path
        d="M2 9.5A2 2 0 0 1 4 7.5h20a2 2 0 0 1 2 2V18a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 2 18z"
        className="folder-front"
      />
    </svg>
  );
}

function Experience() {
  return (
    <Section id="experience" title="Experience">
      <ul className="rows">
        {experience.map((e, i) => (
          <li key={e.company} data-reveal="" style={stagger(i)}>
            <a href={e.href} {...external} className="row exp-row">
              <span className="logo-tile" data-fallback={!e.logo} aria-hidden="true">
                {e.logo ? (
                  <img src={e.logo} alt="" width={36} height={36} loading="lazy" />
                ) : (
                  e.company.slice(0, 1)
                )}
              </span>
              <span className="row-main">
                <span className="row-title">
                  {e.role} <span className="muted">at</span> {e.company}
                  {e.current && <span className="badge badge-live">now</span>}
                </span>
                <span className="row-period mono">{e.period}</span>
                <span className="row-sub">{e.description}</span>
              </span>
              <span className="row-end mono">{e.period}</span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Socials() {
  return (
    <Section id="socials" title="Socials">
      <ul className="grid-2">
        {socials.map((s, i) => {
          const opensTab = s.href.startsWith("http") || s.href.endsWith(".pdf");
          return (
            <li key={s.label} data-reveal="" style={stagger(i)}>
              <a href={s.href} {...(opensTab ? external : {})} className="row">
                <span className="icon-tile" data-brand={s.label.toLowerCase()}>
                  <BrandIcon glyph={s.icon} size={15} />
                </span>
                <span className="row-main">
                  <span className="row-title">{s.label}</span>
                  <span className="row-sub mono">{s.handle}</span>
                </span>
                <span className="row-arrow">
                  <ArrowRight size={13} />
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

function Stack() {
  return (
    <Section id="stack" title="Stack" note="What I reach for" noteSide="right">
      <dl className="stack">
        {stack.map((group, i) => (
          <div key={group.group} className="stack-row" data-reveal="" style={stagger(i)}>
            <dt className="mono">
              <span className="muted">{String(i + 1).padStart(2, "0")}</span> {group.group}
            </dt>
            <dd>
              {group.items.map((item) => (
                <span key={item.name} className="chip">
                  <BrandIcon glyph={item.icon} size={14} />
                  {item.name}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

function About() {
  const greeting = useGreeting();
  const time = useLahoreTime();
  const lahoreNight = time
    ? dayPart(time.hour) === "night" || dayPart(time.hour) === "evening"
    : false;
  return (
    <section className="about" aria-labelledby="about-title">
      <div className="about-head" data-reveal="">
        <Mascot size={52} talk className="about-mascot" />
        <h2 id="about-title" className="greeting" data-part={greeting?.part}>
          {greeting ? (greeting.part === "night" ? greeting.text : `${greeting.text}!`) : "Hello!"}
        </h2>
        {time && (
          <span className="about-clock mono" title="My local time">
            {lahoreNight ? <Moon size={13} /> : <Sun size={13} />}
            {time.label} in Lahore
          </span>
        )}
      </div>
      <ul className="about-list">
        <li data-reveal="" style={stagger(1)}>
          <strong>I'm Hasnaat, and I like owning a problem end to end</strong>: understanding what
          people actually need, then shaping the data, the APIs and the interface until it holds up
          in real use. Lately that means AI in healthcare, RAG pipelines, and tools for small
          businesses.
        </li>
        <li data-reveal="" style={stagger(2)}>
          <strong>I care about the unglamorous parts</strong>: good APIs, reliable data, sensible
          architecture, and systems that hold up once the demo is over.
        </li>
        <li data-reveal="" style={stagger(3)}>
          <strong>Away from the keyboard, I shoot film</strong>: mostly mountains, streets and night
          light around Pakistan, usually with a chai nearby.
        </li>
      </ul>
    </section>
  );
}

function Activity() {
  return (
    <Section
      id="activity"
      title="Activity"
      aside={
        <a href={profile.github} {...external} className="aside-link mono">
          @{profile.githubUser} <ArrowUpRight size={12} />
        </a>
      }
    >
      <Critters start={[2, 3]} />
      <div data-reveal="">
        <ContributionGraph />
      </div>
    </Section>
  );
}

function Books() {
  return (
    <Section id="books" title="Bookshelf" note="Books I keep coming back to" noteSide="right">
      <Bookshelf />
    </Section>
  );
}

function Movies() {
  return (
    <Section id="movies" title="Movies" note="Rewatched more than I'll admit" noteSide="left">
      <p className="lead movies-lead" data-reveal="">
        Old Bollywood has my heart: big families, bigger songs, and friends who'd cross the country
        for you. The rest are comfort rewatches I never get tired of. In no particular order.
      </p>
      <MovieDeck />
    </Section>
  );
}

function Music() {
  return (
    <Section id="music" title="On repeat" note="What I code to" noteSide="right">
      <div className="music">
        <p className="lead" data-reveal="">
          Music changes depending on what I'm building. This is what's playing lately.
        </p>
        <div data-reveal="" style={stagger(2)}>
          <SpotifyEmbed />
        </div>
      </div>
    </Section>
  );
}

function Photos() {
  return (
    <Section
      id="photos"
      title="Behind the lens"
      note="Light, strangers, small moments"
      noteSide="right"
      footer={
        <Link to="/photography" className="foot-link">
          See all {galleryPhotos.length} photos <ArrowRight size={12} />
        </Link>
      }
    >
      <Link to="/photography" className="photo-strip" aria-label="Open the photography page">
        {previewPhotos.map((p, i) => (
          <span
            key={p.src}
            className="photo-strip-item"
            data-reveal=""
            style={{ ...stagger(i), ["--i" as string]: i }}
          >
            <img src={p.src} alt={p.alt} loading="lazy" decoding="async" />
          </span>
        ))}
      </Link>
    </Section>
  );
}

/* Writing = the hands on the keyboard. Contact = the one window that's always lit. */
function Elsewhere() {
  return (
    <section className="cards" aria-label="Writing and contact">
      <a href={profile.blog} {...external} className="card" data-reveal="">
        <img
          className="card-gif"
          src={asset("/gifs/desk.gif")}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <span className="card-body">
          <span className="card-kicker mono">Notes</span>
          <span className="card-title">
            Writing about engineering, AI, and bugs that took too long.
          </span>
          <span className="card-cta">
            Read on Medium <ArrowUpRight size={12} />
          </span>
        </span>
      </a>
      <a href={`mailto:${profile.email}`} className="card" data-reveal="" style={stagger(2)}>
        <img
          className="card-gif"
          src={asset("/gifs/night-block.gif")}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <span className="card-body">
          <span className="card-kicker mono">Say hello</span>
          <span className="card-title">If a window's still lit, it's probably mine. Say hi.</span>
          <span className="card-cta">
            {profile.email} <ArrowRight size={12} />
          </span>
        </span>
      </a>
    </section>
  );
}

function Quote() {
  return (
    <figure className="quote" data-reveal="">
      <img
        className="quote-mask"
        src={asset("/gifs/spider-mask.gif")}
        alt=""
        loading="lazy"
        decoding="async"
      />
      <span className="quote-kicker mono">Pinned above the desk</span>
      <blockquote>
        “With great power comes great <Scribble>responsibility</Scribble>.”
      </blockquote>
      <figcaption className="muted">Ben Parker</figcaption>
    </figure>
  );
}
