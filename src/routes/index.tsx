import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import {
  Menu, X, ArrowRight, Play, MapPin, Phone, Mail, Instagram, Twitter, Facebook,
  Youtube, Star, ChevronDown, MessageCircle, Trophy, Users, Award, Calendar,
  Waves, Dumbbell, ArrowUpRight,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

import { useIsMobile } from "@/hooks/use-is-mobile";
import heroPoster from "@/assets/hero-poster.jpg";
import aboutImg from "@/assets/about.jpg";
import sFootball from "@/assets/sport-football.jpg";
import sSwimming from "@/assets/sport-swimming.jpg";
import sBasketball from "@/assets/sport-basketball.jpg";
import sVolleyball from "@/assets/sport-volleyball.jpg";
import sKarate from "@/assets/sport-karate.jpg";
import sGymnastics from "@/assets/sport-gymnastics.jpg";
import sFitness from "@/assets/sport-fitness.jpg";
import coach1 from "@/assets/coach-1.jpg";
import coach2 from "@/assets/coach-2.jpg";
import coach3 from "@/assets/coach-3.jpg";
import coach4 from "@/assets/coach-4.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";

const Lightbox = lazy(async () => {
  await import("yet-another-react-lightbox/styles.css");
  return import("yet-another-react-lightbox");
});


export const Route = createFileRoute("/")({
  component: LandingPage,
});

const HERO_VIDEO =
  "https://assets.mixkit.co/videos/preview/mixkit-athlete-running-in-a-track-1543-large.mp4";

function LandingPage() {
  const isMobile = useIsMobile();
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <Navbar />
      <Hero isMobile={isMobile} />
      <About isMobile={isMobile} />
      <Sports isMobile={isMobile} />
      <Branches />
      <Gallery />
      <Coaches />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

/* ---------- NAVBAR ---------- */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    ["About", "#about"],
    ["Sports", "#sports"],
    ["Branches", "#branches"],
    ["Gallery", "#gallery"],
    ["Coaches", "#coaches"],
    ["Contact", "#contact"],
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "py-3 backdrop-blur-xl bg-background/70 border-b border-white/5"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <a href="#top" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: "var(--gradient-brand)" }}>
              <Trophy className="h-4 w-4 text-white" strokeWidth={2.5} />
            </span>
            APEX<span className="text-gradient">.</span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {links.map(([label, href]) => (
              <a key={href} href={href} className="text-sm font-medium text-white/80 transition-colors hover:text-white">
                {label}
              </a>
            ))}
          </nav>
          <div className="hidden md:block">
            <a href="#contact" className="btn-primary text-sm">
              Join Now <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex items-center justify-between p-6">
              <span className="font-display text-lg font-bold">APEX<span className="text-gradient">.</span></span>
              <button aria-label="Close" onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center rounded-full border border-white/15">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-2 px-6 pt-8">
              {links.map(([label, href]) => (
                <a key={href} href={href} onClick={() => setOpen(false)} className="border-b border-white/5 py-5 font-display text-3xl">
                  {label}
                </a>
              ))}
              <a href="#contact" onClick={() => setOpen(false)} className="btn-primary mt-8 self-start">
                Join Now <ArrowRight className="h-4 w-4" />
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------- HERO ---------- */
function Hero({ isMobile }: { isMobile: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative h-[100svh] w-full overflow-hidden">
      <motion.div style={isMobile ? undefined : { y, scale }} className="absolute inset-0">
        {!isMobile && (
          <video
            autoPlay muted loop playsInline preload="none"
            poster={heroPoster}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
        )}
        <img
          src={heroPoster}
          alt=""
          fetchPriority="high"
          className={`absolute inset-0 h-full w-full object-cover ${isMobile ? "" : "opacity-0"}`}
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0" style={{ background: "var(--gradient-radial)" }} />
      </motion.div>

      <motion.div style={isMobile ? undefined : { opacity }} className="relative z-10 flex h-full flex-col justify-end px-6 pb-24 md:justify-center md:pb-0">
        <div className="mx-auto w-full max-w-7xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="eyebrow mb-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.75_0.2_55)] animate-pulse" />
            Multi-Sport Academy · Est. 2009
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.9 }}
            className="max-w-5xl font-display text-[13vw] font-bold leading-[0.9] tracking-tight md:text-[7.5rem] lg:text-[9rem]"
          >
            Train like <br />
            you <span className="text-gradient italic">mean</span> it.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="mt-8 max-w-xl text-base text-white/70 md:text-lg"
          >
            Seven disciplines. Six branches. One relentless standard. Apex is where the next generation of athletes is built — from first steps to podium finishes.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a href="#contact" className="btn-primary">
              Join Now <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#branches" className="btn-ghost">
              <MapPin className="h-4 w-4" /> View Branches
            </a>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown className="h-4 w-4 text-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ---------- Reveal helper ---------- */
function Reveal({ children, delay = 0, y = 40 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Counter ---------- */
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const dur = 1800;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(start + (end - start) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

/* ---------- ABOUT ---------- */
function About({ isMobile }: { isMobile: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "12%"]);

  const timeline = [
    { year: "2009", text: "Founded with a single football pitch and 40 students." },
    { year: "2014", text: "Expanded to swimming, basketball & karate; opened branch #2." },
    { year: "2019", text: "National championship titles across four disciplines." },
    { year: "2026", text: "Six branches, 4,000+ active athletes, world-class staff." },
  ];

  const stats = [
    { n: 4000, s: "+", label: "Active athletes" },
    { n: 6, s: "", label: "Branches" },
    { n: 120, s: "+", label: "Certified coaches" },
    { n: 47, s: "", label: "National titles" },
  ];

  return (
    <section id="about" ref={ref} className="section-pad relative">
      <div className="absolute inset-0 -z-10" style={{ background: "radial-gradient(ellipse at 20% 0%, oklch(0.75 0.2 55 / 0.08), transparent 50%)" }} />
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <div className="relative">
            <div className="sticky top-32 overflow-hidden rounded-3xl" style={{ boxShadow: "var(--shadow-card)" }}>
              <motion.img
                src={aboutImg} alt="Inside Apex Academy" loading="lazy" width={1600} height={1200}
                style={isMobile ? undefined : { y: imgY, scale: 1.15 }}
                className="h-[560px] w-full object-cover md:h-[680px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 glass-strong rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: "var(--gradient-brand)" }}>
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/60">Certified Excellence</p>
                    <p className="text-sm font-semibold">FIFA · FINA · FIBA accredited</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Reveal><span className="eyebrow">About Apex</span></Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl">
                Seventeen years of building <span className="text-gradient">champions</span>.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                Apex is a multi-disciplinary sports institution built on the belief that world-class training belongs to everyone. Our athletes don't just play — they train with intention, structure, and the tools used by professionals.
              </p>
            </Reveal>

            <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={0.05 * i}>
                  <div className="glass rounded-2xl p-5">
                    <div className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                      <Counter end={s.n} suffix={s.s} />
                    </div>
                    <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-16">
              <h3 className="font-display text-sm uppercase tracking-[0.3em] text-muted-foreground">Our Journey</h3>
              <ol className="mt-6 relative border-l border-white/10 pl-8">
                {timeline.map((t, i) => (
                  <Reveal key={t.year} delay={0.05 * i}>
                    <li className="relative pb-10 last:pb-0">
                      <span className="absolute -left-[41px] top-1 grid h-5 w-5 place-items-center rounded-full" style={{ background: "var(--gradient-brand)" }}>
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      </span>
                      <p className="font-display text-2xl font-bold text-gradient">{t.year}</p>
                      <p className="mt-1 text-muted-foreground">{t.text}</p>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              <Reveal>
                <div className="glass rounded-2xl p-6">
                  <p className="text-xs uppercase tracking-widest text-gradient">Mission</p>
                  <p className="mt-3 text-base leading-relaxed">Empower every athlete with the coaching, facilities, and community to reach their absolute peak.</p>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="glass rounded-2xl p-6">
                  <p className="text-xs uppercase tracking-widest text-gradient">Vision</p>
                  <p className="mt-3 text-base leading-relaxed">The most respected multi-sports academy in the region — a name synonymous with discipline and results.</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- SPORTS ---------- */
function Sports({ isMobile }: { isMobile: boolean }) {
  const sports = [
    { name: "Football", tag: "Team · Outdoor", img: sFootball, desc: "Youth to elite squads with match-day tactics." },
    { name: "Swimming", tag: "Individual · Aquatic", img: sSwimming, desc: "Olympic-size pools, video stroke analysis." },
    { name: "Basketball", tag: "Team · Indoor", img: sBasketball, desc: "Fundamentals, athleticism, and IQ." },
    { name: "Volleyball", tag: "Team · Indoor/Beach", img: sVolleyball, desc: "Power, control, and system play." },
    { name: "Karate", tag: "Martial · Discipline", img: sKarate, desc: "Kata, kumite, and belt progression." },
    { name: "Gymnastics", tag: "Individual · Artistic", img: sGymnastics, desc: "Strength, flexibility, competition prep." },
    { name: "Fitness", tag: "Strength · Conditioning", img: sFitness, desc: "Small-group strength, mobility, HIIT." },
  ];

  return (
    <section id="sports" className="section-pad relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Reveal><span className="eyebrow">Disciplines</span></Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl">
                Seven sports. <br /><span className="text-gradient">One standard.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-muted-foreground">
              Each discipline runs on its own periodized program — designed by specialists, delivered by pros.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sports.map((s, i) => (
            <SportCard key={s.name} sport={s} index={i} disableTilt={isMobile} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SportCard({ sport, index, disableTilt }: { sport: any; index: number; disableTilt: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    if (disableTilt || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: y * -8, y: x * 8 });
  };
  const reset = () => setTilt({ x: 0, y: 0 });

  return (
    <Reveal delay={index * 0.05}>
      <motion.div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: "transform 0.15s ease-out" }}
        className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-card"
      >
        <img
          src={sport.img} alt={sport.name} loading="lazy" width={1200} height={1400}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "linear-gradient(135deg, oklch(0.75 0.2 55 / 0.25), transparent 60%)" }} />

        <div className="absolute left-6 right-6 top-6 flex items-start justify-between">
          <span className="rounded-full bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur-md">
            {sport.tag}
          </span>
          <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur-md transition-all group-hover:bg-white group-hover:text-black">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="absolute inset-x-6 bottom-6">
          <h3 className="font-display text-4xl font-bold leading-none">{sport.name}</h3>
          <p className="mt-3 max-w-[85%] text-sm text-white/70">{sport.desc}</p>
        </div>
      </motion.div>
    </Reveal>
  );
}

/* ---------- BRANCHES ---------- */
function Branches() {
  const branches = [
    { name: "Downtown Flagship", city: "Central District", addr: "127 Athletic Blvd", sports: 7, map: "https://www.google.com/maps/search/?api=1&query=Central+District+Athletic" },
    { name: "Riverside Complex", city: "West Bank", addr: "88 Marina Way", sports: 5, map: "https://www.google.com/maps/search/?api=1&query=Riverside+Sports" },
    { name: "Northgate Arena", city: "North Hills", addr: "12 Summit Ave", sports: 6, map: "https://www.google.com/maps/search/?api=1&query=Northgate+Arena" },
    { name: "Coastal Center", city: "Bayside", addr: "540 Shoreline Dr", sports: 4, map: "https://www.google.com/maps/search/?api=1&query=Coastal+Sports" },
    { name: "Eastside Hub", city: "Old Town", addr: "3 Heritage Sq", sports: 5, map: "https://www.google.com/maps/search/?api=1&query=Eastside+Sports" },
    { name: "Highlands Elite", city: "The Highlands", addr: "600 Ridge Pkwy", sports: 6, map: "https://www.google.com/maps/search/?api=1&query=Highlands+Sports" },
  ];

  return (
    <section id="branches" className="section-pad relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <Reveal><span className="eyebrow">Locations</span></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl">
              Six branches. <br /><span className="text-gradient">One family.</span>
            </h2>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {branches.map((b, i) => (
            <Reveal key={b.name} delay={i * 0.05}>
              <div className="group relative overflow-hidden rounded-3xl border border-white/5 bg-card p-8 transition-all duration-500 hover:border-white/15 hover:-translate-y-2" style={{ boxShadow: "var(--shadow-soft)" }}>
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(ellipse at top right, oklch(0.75 0.2 55 / 0.12), transparent 60%)" }} />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {b.sports} sports
                    </span>
                  </div>
                  <h3 className="mt-8 font-display text-2xl font-bold">{b.name}</h3>
                  <p className="mt-1 text-sm text-gradient font-semibold">{b.city}</p>
                  <p className="mt-4 text-sm text-muted-foreground">{b.addr}</p>
                  <a href={b.map} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors group-hover:text-[oklch(0.85_0.13_60)]">
                    Open in Maps <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- GALLERY ---------- */
function Gallery() {
  const images = [g1, g2, g3, g4, g5, g6];
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="gallery" className="section-pad relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Reveal><span className="eyebrow">Inside Apex</span></Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl">
                Moments that <span className="text-gradient">move</span> us.
              </h2>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 columns-2 gap-4 md:columns-3 md:gap-6">
          {images.map((src, i) => (
            <Reveal key={i} delay={(i % 3) * 0.05}>
              <button
                onClick={() => setOpenIdx(i)}
                className="mb-4 block w-full overflow-hidden rounded-2xl md:mb-6"
              >
                <img
                  src={src} alt={`Gallery ${i + 1}`} loading="lazy"
                  className="h-auto w-full transition-transform duration-700 hover:scale-105"
                />
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {openIdx !== null && (
        <Suspense fallback={null}>
          <Lightbox
            open={openIdx !== null}
            close={() => setOpenIdx(null)}
            index={openIdx}
            slides={images.map((src) => ({ src }))}
          />
        </Suspense>
      )}
    </section>
  );
}

/* ---------- COACHES ---------- */
function Coaches() {
  const coaches = [
    { name: "Marco Diaz", role: "Head of Football", img: coach1, certs: ["UEFA A", "FIFA Youth"], socials: 3 },
    { name: "Sara Bennett", role: "Head of Swimming", img: coach2, certs: ["ASCA L4", "FINA"], socials: 2 },
    { name: "Andre Cole", role: "Head of Basketball", img: coach3, certs: ["FIBA", "NCAA"], socials: 3 },
    { name: "Lina Park", role: "Head of Karate", img: coach4, certs: ["WKF Black 5th Dan"], socials: 2 },
  ];

  return (
    <section id="coaches" className="section-pad relative">
      <div className="absolute inset-0 -z-10" style={{ background: "radial-gradient(ellipse at 80% 20%, oklch(0.75 0.2 55 / 0.08), transparent 50%)" }} />
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <Reveal><span className="eyebrow">The Team</span></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl">
              Coaches who've <span className="text-gradient">done it</span>.
            </h2>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {coaches.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.05}>
              <div className="group relative overflow-hidden rounded-3xl bg-card">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={c.img} alt={c.name} loading="lazy" width={900} height={1100}
                    className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gradient">{c.role}</p>
                  <h3 className="mt-2 font-display text-2xl font-bold">{c.name}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {c.certs.map((k) => (
                      <span key={k} className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-medium text-white/70">{k}</span>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <a aria-label="Instagram" href="#" className="grid h-8 w-8 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white hover:text-black"><Instagram className="h-3.5 w-3.5" /></a>
                    <a aria-label="Twitter" href="#" className="grid h-8 w-8 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white hover:text-black"><Twitter className="h-3.5 w-3.5" /></a>
                    {c.socials > 2 && (
                      <a aria-label="YouTube" href="#" className="grid h-8 w-8 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white hover:text-black"><Youtube className="h-3.5 w-3.5" /></a>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- TESTIMONIALS ---------- */
function Testimonials() {
  const items = [
    { name: "Julia R.", role: "Parent · Swimming", text: "My daughter went from beginner to regional finalist in 18 months. The coaching structure is unreal.", rating: 5 },
    { name: "Kareem S.", role: "Athlete · Football", text: "Every session has a purpose. You feel the professional environment the moment you walk in.", rating: 5 },
    { name: "Elena V.", role: "Athlete · Gymnastics", text: "The facilities feel like a national training center. And the coaches actually care.", rating: 5 },
    { name: "Tom L.", role: "Parent · Karate", text: "Discipline, respect, and real skill. Apex has changed my son's confidence completely.", rating: 5 },
    { name: "Nora A.", role: "Athlete · Fitness", text: "Best programming I've followed. Small groups, big results.", rating: 5 },
  ];

  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" });
  useEffect(() => {
    if (!embla) return;
    const id = window.setInterval(() => embla.scrollNext(), 4500);
    return () => window.clearInterval(id);
  }, [embla]);

  return (
    <section className="section-pad relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <Reveal><span className="eyebrow">Testimonials</span></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl">
              Real athletes. <br /><span className="text-gradient">Real results.</span>
            </h2>
          </Reveal>
        </div>

        <div className="mt-16 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {items.map((t, i) => (
              <div key={i} className="min-w-[85%] md:min-w-[46%] lg:min-w-[32%]">
                <div className="glass h-full rounded-3xl p-8">
                  <div className="flex gap-1">
                    {Array.from({ length: t.rating }).map((_, k) => (
                      <Star key={k} className="h-4 w-4 fill-[oklch(0.85_0.15_75)] text-[oklch(0.85_0.15_75)]" />
                    ))}
                  </div>
                  <p className="mt-6 font-display text-xl leading-snug">"{t.text}"</p>
                  <div className="mt-8 flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold" style={{ background: "var(--gradient-brand)" }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
function FAQ() {
  const faqs = [
    { q: "What ages do you accept?", a: "We train athletes from age 4 through adult, with programs structured for every stage — from foundations to elite performance." },
    { q: "Do I need experience to start?", a: "No experience required. Every discipline runs beginner, intermediate, and competition tracks with dedicated coaches." },
    { q: "Can I try a class before enrolling?", a: "Yes. Every new athlete gets a complimentary trial session to meet the coach and experience the facility." },
    { q: "Do you offer competitive teams?", a: "Absolutely. We field competitive squads in football, swimming, basketball, volleyball, karate, and gymnastics." },
    { q: "What's included in membership?", a: "Structured coaching, program periodization, facility access, progress tracking, and community events." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="section-pad relative">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <Reveal><span className="eyebrow">FAQ</span></Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl">
              Questions, <span className="text-gradient">answered</span>.
            </h2>
          </Reveal>
        </div>
        <div className="mt-16 space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className="overflow-hidden rounded-2xl border border-white/8 bg-card">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left"
                >
                  <span className="font-display text-lg font-semibold md:text-xl">{f.q}</span>
                  <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15">
                    <span className="text-xl leading-none">+</span>
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="px-6 pb-6 text-muted-foreground">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- CONTACT ---------- */
function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" className="section-pad relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Reveal><span className="eyebrow">Get in Touch</span></Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl">
                Ready to <span className="text-gradient">train</span>?
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-muted-foreground">
                Book a trial session or ask us anything. We reply within a few hours during opening times.
              </p>
            </Reveal>

            <div className="mt-10 space-y-4">
              {[
                { icon: Phone, label: "Call us", val: "+1 (555) 010-8842", href: "tel:+15550108842" },
                { icon: Mail, label: "Email", val: "hello@apexacademy.co", href: "mailto:hello@apexacademy.co" },
                { icon: MessageCircle, label: "WhatsApp", val: "Chat with us", href: "https://wa.me/15550108842" },
              ].map((r) => (
                <a key={r.label} href={r.href} className="group flex items-center gap-4 rounded-2xl border border-white/8 bg-card p-4 transition-colors hover:border-white/20">
                  <div className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: "var(--gradient-brand)" }}>
                    <r.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">{r.label}</p>
                    <p className="font-semibold">{r.val}</p>
                  </div>
                  <ArrowUpRight className="ml-auto h-4 w-4 opacity-40 transition-opacity group-hover:opacity-100" />
                </a>
              ))}
            </div>

            <Reveal delay={0.2}>
              <div className="mt-8 aspect-[16/9] overflow-hidden rounded-3xl border border-white/8">
                <iframe
                  title="Apex map"
                  src="https://maps.google.com/maps?q=stadium&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  className="h-full w-full grayscale contrast-125"
                  loading="lazy"
                />
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="glass rounded-3xl p-8 md:p-10"
            >
              <h3 className="font-display text-2xl font-bold">Send a message</h3>
              <div className="mt-8 grid gap-5">
                <Field label="Full name" name="name" />
                <Field label="Email" name="email" type="email" />
                <Field label="Phone" name="phone" type="tel" />
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Sport of interest</label>
                  <select className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30">
                    {["Football","Swimming","Basketball","Volleyball","Karate","Gymnastics","Fitness"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Message</label>
                  <textarea rows={4} className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-white/30" />
                </div>
                <button type="submit" className="btn-primary mt-2 w-full justify-center">
                  {sent ? "Message sent ✓" : "Send message"} {!sent && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input id={name} name={name} type={type} className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition-colors focus:border-white/30" />
    </div>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-black/40 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <a href="#top" className="flex items-center gap-2 font-display text-xl font-bold">
              <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: "var(--gradient-brand)" }}>
                <Trophy className="h-4 w-4 text-white" />
              </span>
              APEX<span className="text-gradient">.</span>
            </a>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              A multi-sports academy built for athletes who want more from the process.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((I, i) => (
                <a key={i} href="#" aria-label="social" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 transition-colors hover:bg-white hover:text-black">
                  <I className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {[
            { t: "Sports", l: ["Football","Swimming","Basketball","Volleyball","Karate","Gymnastics","Fitness"] },
            { t: "Company", l: ["About","Coaches","Branches","Careers","Press"] },
            { t: "Support", l: ["Contact","FAQ","Membership","Trial Class","Terms"] },
          ].map((col) => (
            <div key={col.t}>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">{col.t}</p>
              <ul className="mt-5 space-y-3">
                {col.l.map((x) => (
                  <li key={x}><a href="#" className="text-sm text-white/80 hover:text-white">{x}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 md:flex-row md:items-center">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Apex Sports Academy. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Made for athletes.</p>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Floating WhatsApp ---------- */
function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/15550108842"
      target="_blank" rel="noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full text-white shadow-xl transition-transform hover:scale-110 md:h-16 md:w-16"
      style={{ background: "linear-gradient(135deg, #25D366, #128C7E)", boxShadow: "0 10px 40px -10px rgba(37,211,102,0.6)" }}
    >
      <span className="absolute inset-0 -z-10 rounded-full animate-pulse-glow" style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }} />
      <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
    </a>
  );
}
