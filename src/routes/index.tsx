import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView, useSpring } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  Play,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Star,
  ChevronDown,
  MessageCircle,
  Trophy,
  Users,
  Award,
  Calendar,
  Waves,
  Dumbbell,
  ArrowUpRight,
  Check,
  Newspaper,
  ExternalLink,
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

/* ---------- LOCAL STORAGE HELPERS & BACKEND SYNC ---------- */
const LANDING_API = (import.meta.env.VITE_API_BASE || "https://egyacaback.vercel.app") + "/api/landing-settings";

async function fetchLandingSettings(): Promise<Record<string, unknown>> {
  try {
    const res = await fetch(LANDING_API, { cache: "no-store" });
    if (res.ok) {
      const payload = await res.json();
      return (payload?.data as Record<string, unknown>) ?? {};
    }
  } catch {}
  return {};
}

function useLocalStorageData<T>(key: string, fallback: T): T {
  const [data, setData] = useState<T>(() => {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    let cancelled = false;

    const applyValue = (val: unknown) => {
      if (cancelled || val === undefined) return;
      setData(val as T);
      try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
    };

    const syncFromApi = async () => {
      const settings = await fetchLandingSettings();
      if (settings[key] !== undefined) applyValue(settings[key]);
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      try {
        if (e.newValue) setData(JSON.parse(e.newValue) as T);
      } catch {}
    };

    // BroadcastChannel for same-origin cross-tab sync
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("landing_settings_sync");
      bc.onmessage = (e: MessageEvent) => {
        const msg = e.data as Record<string, unknown>;
        if (msg[key] !== undefined) applyValue(msg[key]);
      };
    } catch {}

    syncFromApi();
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", syncFromApi);

    return () => {
      cancelled = true;
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", syncFromApi);
      bc?.close();
    };
  }, [key]);

  return data;
}

function useLocalStorageString(key: string, fallback = ""): string {
  const [data, setData] = useState<string>(() => {
    if (typeof window === "undefined") return fallback;
    return localStorage.getItem(key) || fallback;
  });

  useEffect(() => {
    let cancelled = false;

    const applyValue = (val: string) => {
      if (cancelled) return;
      setData(val);
      try { localStorage.setItem(key, val); } catch {}
    };

    const syncFromApi = async () => {
      const settings = await fetchLandingSettings();
      const val = settings[key];
      if (typeof val === "string") applyValue(val);
      else setData(localStorage.getItem(key) || fallback);
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      setData(e.newValue || fallback);
    };

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("landing_settings_sync");
      bc.onmessage = (e: MessageEvent) => {
        const msg = e.data as Record<string, unknown>;
        if (typeof msg[key] === "string") applyValue(msg[key] as string);
      };
    } catch {}

    syncFromApi();
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", syncFromApi);

    return () => {
      cancelled = true;
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", syncFromApi);
      bc?.close();
    };
  }, [key, fallback]);

  return data;
}

function LandingPage() {
  const isMobile = useIsMobile();
  return (
    <div dir="rtl" className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <ScrollProgress />
      <Navbar />
      <Hero isMobile={isMobile} />
      <CinematicStatement
        phrase="مكان يصنع الأبطال"
        accentWord="الأبطال"
        sub="منذ 2009 — هنا تبدأ الرحلة"
      />
      <About isMobile={isMobile} />
      <Sports isMobile={isMobile} />
      <CinematicStatement
        phrase="هنا تبدأ القصة"
        accentWord="القصة"
        sub="كل بطل بدأ بخطوة واحدة — وهذه هي خطوتك"
      />
      <Branches />
      <Pricing />
      <Gallery />
      <Coaches />
      <Testimonials />
      <NewsSection />
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
  const generalSettings = useLocalStorageData<{ academyName?: string }>("system_settings_general", {});
  const brandName = generalSettings?.academyName || "APEX";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    ["من نحن", "#about"],
    ["الرياضات", "#sports"],
    ["الفروع", "#branches"],
    ["الأسعار", "#pricing"],
    ["المعرض", "#gallery"],
    ["المدربون", "#coaches"],
    ["تواصل معنا", "#contact"],
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "py-3 backdrop-blur-xl border-b border-white/10"
            : "py-6 bg-transparent"
        }`}
        style={scrolled ? { background: "rgba(26, 31, 62, 0.82)" } : undefined}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <a
            href="#top"
            className="flex items-center gap-2 font-display text-lg font-bold tracking-tight uppercase"
          >
            <span
              className="grid h-9 w-9 place-items-center rounded-xl animate-glow-pulse"
              style={{ background: "var(--gradient-brand)" }}
            >
              <Trophy className="h-4 w-4 text-white" strokeWidth={2.5} />
            </span>
            {brandName}<span className="text-gradient">.</span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-sm font-medium text-white/75 transition-all duration-200 hover:text-white hover:text-[var(--orange-light)]"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/join-as-coach" className="btn-ghost text-sm py-2.5 px-5">
              انضم كمدرب
            </Link>
            <a href="#contact" className="btn-primary text-sm py-2.5 px-5">
              انضم الآن <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <button
            aria-label="فتح القائمة"
            onClick={() => setOpen(true)}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/5 backdrop-blur-md md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] backdrop-blur-2xl md:hidden"
            style={{ background: "rgba(17, 24, 40, 0.97)" }}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/8">
              <span className="font-display text-lg font-bold">
                {brandName}<span className="text-gradient">.</span>
              </span>
              <button
                aria-label="إغلاق"
                onClick={() => setOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 px-6 pt-8">
              {links.map(([label, href], idx) => (
                <motion.a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 + 0.1 }}
                  className="border-b border-white/6 py-5 font-display text-3xl transition-colors hover:text-[var(--orange-light)]"
                >
                  {label}
                </motion.a>
              ))}
              <Link
                to="/join-as-coach"
                onClick={() => setOpen(false)}
                className="btn-ghost mt-8 w-full text-center"
              >
                انضم كمدرب
              </Link>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="btn-primary mt-4 w-full text-center justify-center"
              >
                انضم الآن <ArrowRight className="h-4 w-4" />
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

  const heroSettings = useLocalStorageData<{ title?: string; subtitle?: string; videoUrl?: string; bgType?: string; imageUrl?: string }>("landing_hero_settings", {});
  const heroImagePreview = useLocalStorageString("landing_hero_image", "");

  const displayVideo = heroSettings?.videoUrl || HERO_VIDEO;
  const displayImage = heroImagePreview || heroSettings?.imageUrl || heroPoster;
  const isImageMode = heroSettings?.bgType === "image" || Boolean(heroImagePreview || heroSettings?.imageUrl);

  return (
    <section id="top" ref={ref} className="relative h-[100svh] w-full overflow-hidden">
      <motion.div style={isMobile ? undefined : { y, scale }} className="absolute inset-0">
        {!isMobile && !isImageMode && (
          <video
            key={displayVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={displayImage}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={displayVideo} type="video/mp4" />
          </video>
        )}
        <img
          src={displayImage}
          alt=""
          fetchPriority="high"
          className={`absolute inset-0 h-full w-full object-cover ${(!isMobile && !isImageMode) ? "opacity-0" : ""}`}
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0" style={{ background: "var(--gradient-radial)" }} />
      </motion.div>

      <motion.div
        style={isMobile ? undefined : { opacity }}
        className="relative z-10 flex h-full flex-col justify-end px-6 pb-24 md:justify-center md:pb-0"
      >
        <div className="mx-auto w-full max-w-7xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="eyebrow mb-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.75_0.2_55)] animate-pulse" />
            أكاديمية رياضات متعددة · تأسست 2009
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9 }}
            className="max-w-5xl font-display text-[13vw] font-bold leading-[0.9] tracking-tight md:text-[7.5rem] lg:text-[9rem]"
          >
            {heroSettings?.title ? (
              heroSettings.title
            ) : (
              <>
                تدرّب وكأن <br />
                النتيجة <span className="text-gradient italic">تستحق</span>.
              </>
            )}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 max-w-xl text-base text-white/70 md:text-lg"
          >
            {heroSettings?.subtitle || "سبع رياضات. ستة فروع. معيار واحد لا يهادن. هنا يُصنع جيل الأبطال القادم — من الخطوة الأولى حتى منصة التتويج."}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a href="#contact" className="btn-primary">
              انضم الآن <ArrowRight className="h-4 w-4" />
            </a>
            <Link to="/join-as-coach" className="btn-ghost">
              انضم كمدرب
            </Link>
            <a
              href="#branches"
              className="btn-ghost border-transparent bg-white/5 hover:bg-white/10"
            >
              <MapPin className="h-4 w-4" /> عرض الفروع
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Cinematic orange line draws across on hero load */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 1.1, duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-0 right-0 h-px z-10"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,100,43,0.5) 25%, rgba(255,100,43,0.5) 75%, transparent 100%)",
          transformOrigin: "left",
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
          انزل
        </span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown className="h-4 w-4 text-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ---------- Reveal helper ---------- */
function Reveal({
  children,
  delay = 0,
  y = 32,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
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
    const start = 0;
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
  return (
    <span ref={ref}>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ---------- Scroll Progress Bar ---------- */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[200] h-[3px] origin-left"
      style={{
        scaleX,
        background: "var(--gradient-brand)",
      }}
    />
  );
}

/* ---------- Cinematic Statement Chapter Break ---------- */
function CinematicStatement({
  phrase,
  accentWord,
  sub,
  light = false,
}: {
  phrase: string;
  accentWord?: string;
  sub?: string;
  light?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.12, 0.88, 1], [0, 1, 1, 0]);
  const words = phrase.split(" ");

  return (
    <section
      ref={ref}
      className="relative flex h-screen items-center justify-center overflow-hidden"
      style={{ background: light ? "#f4f5fb" : "var(--navy-deepest)" }}
    >
      {/* Ambient orb */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[70vw] w-[70vw] rounded-full"
          style={{
            background: light
              ? "radial-gradient(circle, rgba(255,100,43,0.08) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(255,100,43,0.22) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
      </motion.div>

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none cinematic-grid"
        style={{ opacity: light ? 0.6 : 1 }}
      />

      <motion.div style={{ opacity: contentOpacity }} className="relative z-10 px-6 text-center max-w-6xl mx-auto">
        {/* Chapter eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <span className={light ? "eyebrow-dark" : "eyebrow"}>فصل جديد</span>
        </motion.div>

        {/* Word-by-word reveal */}
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1">
          {words.map((word, i) => (
            <div key={i} className="overflow-hidden pb-3">
              <motion.span
                initial={{ y: "110%", opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{
                  duration: 1.0,
                  delay: 0.25 + i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`block font-display font-bold tracking-tight leading-[0.92] text-[11vw] md:text-[7vw] lg:text-[5.5vw] ${
                  accentWord === word ? "text-gradient" : ""
                }`}
                style={{
                  color:
                    accentWord === word
                      ? undefined
                      : light
                      ? "var(--navy-deep)"
                      : "white",
                }}
              >
                {word}
              </motion.span>
            </div>
          ))}
        </div>

        {/* Orange accent line */}
        <div className="flex justify-center mt-8">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{
              duration: 1.1,
              delay: 0.25 + words.length * 0.12 + 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="h-[3px] w-28 rounded-full"
            style={{ transformOrigin: "center", background: "var(--gradient-brand)" }}
          />
        </div>

        {/* Sub text */}
        {sub && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.8,
              delay: 0.25 + words.length * 0.12 + 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-8 text-lg font-light tracking-wide"
            style={{ color: light ? "rgba(46,51,97,0.55)" : "rgba(255,255,255,0.5)" }}
          >
            {sub}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}

/* ---------- Wave Section Divider ---------- */
function WaveDivider({
  fromColor = "var(--navy-deep)",
  toColor = "var(--navy-mid)",
  flipY = false,
}: {
  fromColor?: string;
  toColor?: string;
  flipY?: boolean;
}) {
  return (
    <div className="relative overflow-hidden leading-[0]" style={{ background: toColor }}>
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        className="block w-full"
        style={{ height: "72px", transform: flipY ? "scaleY(-1)" : undefined }}
        aria-hidden="true"
      >
        <path
          d="M0,36 C360,72 720,0 1080,36 C1260,54 1380,36 1440,36 L1440,0 L0,0 Z"
          fill={fromColor}
        />
      </svg>
    </div>
  );
}

/* ---------- ABOUT ---------- */
function About({ isMobile }: { isMobile: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "12%"]);

  const timeline = [
    { year: "2009", text: "التأسيس بملعب كرة قدم واحد و40 طالباً." },
    { year: "2014", text: "التوسع نحو السباحة والسلة والكاراتيه؛ افتتاح الفرع الثاني." },
    { year: "2019", text: "ألقاب بطولية وطنية عبر أربع رياضات مختلفة." },
    { year: "2026", text: "ستة فروع، أكثر من 4,000 رياضي نشط، وكوادر تدريبية عالمية." },
  ];

  const stats = [
    { n: 4000, s: "+", label: "رياضي نشط" },
    { n: 6, s: "", label: "فروع" },
    { n: 120, s: "+", label: "مدرب معتمد" },
    { n: 47, s: "", label: "لقب وطني" },
  ];

  const ceoPhoto = useLocalStorageString("landing_ceo_photo", "") || useLocalStorageData<{ photo?: string }>("landing_ceo_settings", {}).photo;
  const displayAboutImg = ceoPhoto || aboutImg;

  return (
    <section id="about" ref={ref} className="section-pad relative" style={{ background: "var(--navy-deep)" }}>
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, rgba(255, 100, 43, 0.09), transparent 55%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="sticky top-32 overflow-hidden rounded-3xl"
                style={{ boxShadow: "0 24px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,100,43,0.12)" }}
              >
                {/* Clip-path reveal overlay that sweeps away on load */}
                <motion.img
                  src={displayAboutImg}
                  alt="Inside Academy"
                  loading="lazy"
                  width={1600}
                  height={1200}
                  style={isMobile ? undefined : { y: imgY, scale: 1.15 }}
                  className="h-[560px] w-full object-cover md:h-[680px]"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(17,24,40,0.7) 0%, transparent 60%)" }} />
                <div className="absolute bottom-6 left-6 right-6 glass-strong rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="grid h-11 w-11 place-items-center rounded-xl animate-glow-pulse"
                      style={{ background: "var(--gradient-brand)" }}
                    >
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-white/60">
                        تميز معتمد
                      </p>
                      <p className="text-sm font-semibold">معتمد من FIFA · FINA · FIBA</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div>
            <Reveal>
              <span className="eyebrow">من نحن</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl">
                سبعة عشر عاماً في صناعة <span className="text-gradient">الأبطال</span>.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                أكاديميتنا مؤسسة رياضية متعددة التخصصات، تؤمن بأن التدريب العالمي حق للجميع.
                رياضيونا لا يكتفون باللعب — بل يتدربون بنية وهدف وبالأدوات التي يستخدمها المحترفون.
              </p>
            </Reveal>

            <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((s, i) => (
                <Reveal key={s.label} delay={0.05 * i}>
                  <div
                    className="rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: "rgba(46, 51, 97, 0.5)",
                      border: "1px solid rgba(255, 100, 43, 0.18)",
                      boxShadow: "0 4px 24px -8px rgba(0,0,0,0.4)",
                    }}
                  >
                    <div
                      className="font-display text-4xl font-bold tracking-tight md:text-5xl text-gradient"
                    >
                      <Counter end={s.n} suffix={s.s} />
                    </div>
                    <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                      {s.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-16">
              <h3 className="font-display text-sm uppercase tracking-[0.3em] text-muted-foreground">
                مسيرتنا
              </h3>
              <ol className="mt-6 relative border-l-2 pl-8" style={{ borderColor: "rgba(255, 100, 43, 0.25)" }}>
                {timeline.map((t, i) => (
                  <Reveal key={t.year} delay={0.05 * i}>
                    <li className="relative pb-10 last:pb-0">
                      <span
                        className="absolute -left-[42px] top-1 grid h-6 w-6 place-items-center rounded-full"
                        style={{ background: "var(--gradient-brand)", boxShadow: "0 0 12px rgba(255,100,43,0.5)" }}
                      >
                        <span className="h-2 w-2 rounded-full bg-white" />
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
                <div
                  className="rounded-2xl p-6 h-full transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "rgba(46, 51, 97, 0.45)",
                    border: "1px solid rgba(255, 100, 43, 0.2)",
                    borderRight: "3px solid var(--orange)",
                  }}
                >
                  <p className="text-xs uppercase tracking-widest text-gradient">رسالتنا</p>
                  <p className="mt-3 text-base leading-relaxed text-white/80">
                    تمكين كل رياضي من خلال التدريب الاحترافي والمرافق المتطورة والمجتمع الداعم للوصول إلى أعلى مستوياته.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div
                  className="rounded-2xl p-6 h-full transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "rgba(46, 51, 97, 0.45)",
                    border: "1px solid rgba(255, 100, 43, 0.2)",
                    borderRight: "3px solid var(--orange)",
                  }}
                >
                  <p className="text-xs uppercase tracking-widest text-gradient">رؤيتنا</p>
                  <p className="mt-3 text-base leading-relaxed text-white/80">
                    أن نكون الأكاديمية الرياضية المتعددة الأكثر احتراماً في المنطقة — اسم مرادف للانضباط والنتائج.
                  </p>
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
  const defaultSports = [
    { name: "كرة القدم", tag: "جماعي · خارجي", img: sFootball, desc: "من الناشئين حتى الفرق الاحترافية مع تكتيكات المباريات." },
    { name: "السباحة", tag: "فردي · مائي", img: sSwimming, desc: "حمامات أولمبية وتحليل فيديو لتقنية السباحة." },
    { name: "كرة السلة", tag: "جماعي · صالة", img: sBasketball, desc: "الأساسيات والرشاقة والذكاء الرياضي." },
    { name: "الكرة الطائرة", tag: "جماعي · صالة/شاطئ", img: sVolleyball, desc: "القوة والدقة واللعب المنظومي." },
    { name: "الكاراتيه", tag: "فنون قتالية · انضباط", img: sKarate, desc: "الكاتا والكوميتيه والتقدم في الأحزمة." },
    { name: "الجمباز", tag: "فردي · فني", img: sGymnastics, desc: "القوة والمرونة والتحضير للبطولات." },
    { name: "اللياقة البدنية", tag: "قوة · تكييف", img: sFitness, desc: "مجموعات صغيرة وتمارين قوة ومرونة وهيت." },
  ];

  const customSports = useLocalStorageData<Array<{ name: string; tag: string; desc: string; image: string }>>("landing_sports", []);
  const customTitle = useLocalStorageString("landing_sports_title", "");

  const sports = (customSports && customSports.length > 0)
    ? customSports.map((s) => ({ name: s.name, tag: s.tag, img: s.image || sFootball, desc: s.desc }))
    : defaultSports;

  // Parse title: if it contains " · " or "." split into two parts for styling
  const titleParts = customTitle
    ? customTitle.split(/\n/)
    : ["سبع رياضات.", "معيار واحد."];
  const titleLine1 = titleParts[0] ?? "سبع رياضات.";
  const titleLine2 = titleParts[1] ?? "معيار واحد.";

  return (
    <section id="sports" className="section-pad relative" style={{ background: "var(--navy-mid)" }}>
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 80% 100%, rgba(255, 100, 43, 0.07), transparent 50%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Reveal>
              <span className="eyebrow">التخصصات</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl">
                {titleLine1} <br />
                <span className="text-gradient">{titleLine2}</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-muted-foreground">
              كل رياضة تسير وفق برنامج تدريبي دوري مصمم من متخصصين ويُنفَّذ من محترفين.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sports.map((s, i) => (
            <SportCard key={`${s.name}-${i}`} sport={s} index={i} disableTilt={isMobile} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SportCard({
  sport,
  index,
  disableTilt,
}: {
  sport: {
    name: string;
    tag: string;
    img: string;
    desc: string;
  };
  index: number;
  disableTilt: boolean;
}) {
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
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.15s ease-out, box-shadow 0.45s ease",
        }}
        className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-card"
        whileHover={{
          boxShadow: "0 0 0 2px rgba(255, 100, 43, 0.45), 0 20px 48px -12px rgba(255, 100, 43, 0.22)",
        }}
      >
        <img
          src={sport.img}
          alt={sport.name}
          loading="lazy"
          width={1200}
          height={1400}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/5" />
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: "linear-gradient(135deg, rgba(255, 100, 43, 0.28), transparent 65%)",
          }}
        />

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
  const defaultBranches = [
    { name: "Downtown Flagship", city: "Central District", addr: "127 Athletic Blvd", sports: "7 sports", map: "https://www.google.com/maps/search/?api=1&query=Central+District+Athletic", image: "" },
    { name: "Riverside Complex", city: "West Bank", addr: "88 Marina Way", sports: "5 sports", map: "https://www.google.com/maps/search/?api=1&query=Riverside+Sports", image: "" },
    { name: "Northgate Arena", city: "North Hills", addr: "12 Summit Ave", sports: "6 sports", map: "https://www.google.com/maps/search/?api=1&query=Northgate+Arena", image: "" },
    { name: "Coastal Center", city: "Bayside", addr: "540 Shoreline Dr", sports: "4 sports", map: "https://www.google.com/maps/search/?api=1&query=Coastal+Sports", image: "" },
    { name: "Eastside Hub", city: "Old Town", addr: "3 Heritage Sq", sports: "5 sports", map: "https://www.google.com/maps/search/?api=1&query=Eastside+Sports", image: "" },
    { name: "Highlands Elite", city: "The Highlands", addr: "600 Ridge Pkwy", sports: "6 sports", map: "https://www.google.com/maps/search/?api=1&query=Highlands+Sports", image: "" },
  ];

  const customBranches = useLocalStorageData<Array<{ name: string; description?: string; mapsUrl?: string; image?: string }>>("landing_branches", []);
  
  const branches = customBranches.length > 0
    ? customBranches.map((b) => ({
        name: b.name,
        city: "فرع الأكاديمية",
        addr: b.description || "العنوان والتفاصيل",
        sports: "متعدد الرياضات",
        map: b.mapsUrl || "https://maps.google.com",
        image: b.image || "",
      }))
    : defaultBranches;

  return (
    <section id="branches" className="section-pad relative" style={{ background: "#f4f5fb" }}>
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 85%, rgba(46,51,97,0.07) 0%, transparent 50%), radial-gradient(circle at 85% 15%, rgba(255,100,43,0.06) 0%, transparent 50%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <Reveal>
            <span className="eyebrow-dark">المواقع</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl" style={{ color: "var(--navy-deep)" }}>
              {branches.length} فروع. <br />
              <span className="text-gradient">عائلة واحدة.</span>
            </h2>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {branches.map((b, i) => (
            <Reveal key={`${b.name}-${i}`} delay={i * 0.05}>
              <div
                className="group relative overflow-hidden rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between"
                style={{
                  background: "white",
                  border: "1px solid rgba(46, 51, 97, 0.12)",
                  boxShadow: "0 4px 24px -8px rgba(46, 51, 97, 0.15)",
                }}
              >
                {b.image && (
                  <div className="absolute inset-0 -z-10 opacity-15 group-hover:opacity-25 transition-opacity">
                    <img src={b.image} alt={b.name} className="h-full w-full object-cover" />
                  </div>
                )}
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at top right, rgba(255, 100, 43, 0.07), transparent 60%)",
                  }}
                />
                <div
                  className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 rounded-b-3xl"
                  style={{ background: "var(--gradient-brand)" }}
                />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div
                      className="grid h-12 w-12 place-items-center rounded-2xl"
                      style={{ background: "rgba(46, 51, 97, 0.08)" }}
                    >
                      <MapPin className="h-5 w-5" style={{ color: "var(--navy-mid)" }} />
                    </div>
                    <span
                      className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest"
                      style={{ background: "rgba(255, 100, 43, 0.1)", color: "var(--orange)", border: "1px solid rgba(255, 100, 43, 0.25)" }}
                    >
                      {b.sports}
                    </span>
                  </div>
                  <h3 className="mt-8 font-display text-2xl font-bold" style={{ color: "var(--navy-deep)" }}>{b.name}</h3>
                  <p className="mt-1 text-sm text-gradient font-semibold">{b.city}</p>
                  <p className="mt-4 text-sm" style={{ color: "rgba(46, 51, 97, 0.6)" }}>{b.addr}</p>
                  <a
                    href={b.map}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                    style={{ color: "var(--navy-mid)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--orange)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--navy-mid)")}
                  >
                    افتح في الخرائط <ArrowUpRight className="h-4 w-4" />
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

/* ---------- PRICING ---------- */
function Pricing() {
  const customPlans = useLocalStorageData<Array<{ name: string; originalPrice?: string | null; price: string; features: string[]; isFeatured?: boolean }>>("landing_pricing_plans", []);
  if (!customPlans || customPlans.length === 0) return null;

  return (
    <section id="pricing" className="section-pad relative" style={{ background: "var(--navy-deepest)" }}>
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(255, 100, 43, 0.1), transparent 55%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <Reveal>
            <span className="eyebrow">باقات العضوية</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl">
              اختر <span className="text-gradient">مسارك</span>.
            </h2>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {customPlans.map((plan, i) => (
            <Reveal key={`${plan.name}-${i}`} delay={i * 0.05}>
              <div
                className={`relative flex flex-col justify-between overflow-hidden rounded-3xl p-8 transition-all duration-300 ${
                  plan.isFeatured
                    ? "scale-[1.03]"
                    : "hover:-translate-y-1"
                }`}
                style={plan.isFeatured ? {
                  background: "linear-gradient(145deg, var(--navy-mid), var(--navy-deep))",
                  border: "1.5px solid rgba(255, 100, 43, 0.6)",
                  boxShadow: "0 24px 64px -16px rgba(255, 100, 43, 0.35), 0 0 0 1px rgba(255,100,43,0.2)",
                } : {
                  background: "rgba(46, 51, 97, 0.4)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {plan.isFeatured && (
                  <span
                    className="absolute top-4 right-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    الأكثر طلباً
                  </span>
                )}
                <div>
                  <h3 className="font-display text-2xl font-bold">{plan.name}</h3>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="font-display text-4xl font-extrabold text-gradient">{plan.price}</span>
                    {plan.originalPrice && (
                      <span className="text-sm font-semibold text-muted-foreground line-through">
                        {plan.originalPrice}
                      </span>
                    )}
                  </div>
                  <ul className="mt-8 space-y-3">
                    {(Array.isArray(plan.features) ? plan.features : String(plan.features || "").split(",")).map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-white/80">
                        <div
                          className="grid h-5 w-5 shrink-0 place-items-center rounded-full"
                          style={{ background: "rgba(255, 100, 43, 0.2)", color: "var(--orange-light)" }}
                        >
                          <Check className="h-3 w-3" />
                        </div>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
                <a href="#contact" className={`btn-primary mt-10 w-full justify-center ${plan.isFeatured ? "" : "btn-ghost"}`}>
                  اشترك الآن <ArrowRight className="h-4 w-4" />
                </a>
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
  const defaultImages = [g1, g2, g3, g4, g5, g6];
  const customMedia = useLocalStorageData<Array<{ type: string; data: string }>>("landing_media", []);
  
  const images = (customMedia && customMedia.length > 0)
    ? customMedia.filter((m) => m.type.startsWith("image")).map((m) => m.data)
    : defaultImages;

  const displayImages = images.length > 0 ? images : defaultImages;
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="gallery" className="section-pad relative" style={{ background: "var(--navy-deepest)" }}>
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse at 50% 100%, rgba(255, 100, 43, 0.07), transparent 55%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Reveal>
              <span className="eyebrow">من داخل الأكاديمية</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl">
                لحظات <span className="text-gradient">تلهمنا</span>.
              </h2>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 columns-2 gap-4 md:columns-3 md:gap-6">
          {images.map((src, i) => (
            <motion.div
              key={i}
              className="mb-4 md:mb-6"
              initial={{ clipPath: "inset(100% 0 0 0)", opacity: 0.5 }}
              whileInView={{ clipPath: "inset(0% 0 0 0)", opacity: 1 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{
                duration: 0.95,
                delay: (i % 3) * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <button
                onClick={() => setOpenIdx(i)}
                className="block w-full overflow-hidden rounded-2xl"
              >
                <motion.img
                  src={src}
                  alt={`Gallery ${i + 1}`}
                  loading="lazy"
                  className="h-auto w-full"
                  initial={{ scale: 1.12 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1.3,
                    delay: (i % 3) * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.6 } }}
                />
              </button>
            </motion.div>
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
    {
      name: "Marco Diaz",
      role: "Head of Football",
      img: coach1,
      certs: ["UEFA A", "FIFA Youth"],
      socials: 3,
    },
    {
      name: "Sara Bennett",
      role: "Head of Swimming",
      img: coach2,
      certs: ["ASCA L4", "FINA"],
      socials: 2,
    },
    {
      name: "Andre Cole",
      role: "Head of Basketball",
      img: coach3,
      certs: ["FIBA", "NCAA"],
      socials: 3,
    },
    {
      name: "Lina Park",
      role: "Head of Karate",
      img: coach4,
      certs: ["WKF Black 5th Dan"],
      socials: 2,
    },
  ];

  return (
    <section id="coaches" className="section-pad relative" style={{ background: "var(--navy-mid)" }}>
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 80% 20%, rgba(255, 100, 43, 0.08), transparent 55%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <Reveal>
            <span className="eyebrow">الفريق التدريبي</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl">
              مدربون <span className="text-gradient">أثبتوا أنفسهم</span>.
            </h2>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {coaches.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.05}>
              <div className="group relative overflow-hidden rounded-3xl bg-card">
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={c.img}
                    alt={c.name}
                    loading="lazy"
                    width={900}
                    height={1100}
                    className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#111828] via-[rgba(17,24,40,0.8)] to-transparent p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gradient">
                    {c.role}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-bold">{c.name}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {c.certs.map((k) => (
                      <span
                        key={k}
                        className="rounded-full px-2.5 py-1 text-[10px] font-medium"
                        style={{ background: "rgba(255, 100, 43, 0.15)", border: "1px solid rgba(255, 100, 43, 0.3)", color: "var(--orange-light)" }}
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <a
                      aria-label="Instagram"
                      href="#"
                      className="grid h-8 w-8 place-items-center rounded-full transition-all duration-200"
                      style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--orange)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                    >
                      <Instagram className="h-3.5 w-3.5" />
                    </a>
                    <a
                      aria-label="Twitter"
                      href="#"
                      className="grid h-8 w-8 place-items-center rounded-full transition-all duration-200"
                      style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--orange)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                    >
                      <Twitter className="h-3.5 w-3.5" />
                    </a>
                    {c.socials > 2 && (
                      <a
                        aria-label="YouTube"
                        href="#"
                        className="grid h-8 w-8 place-items-center rounded-full transition-all duration-200"
                        style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "var(--orange)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                      >
                        <Youtube className="h-3.5 w-3.5" />
                      </a>
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
  const defaultItems = [
    { name: "جوليا ر.", role: "ولي أمر · سباحة", text: "ابنتي انتقلت من مبتدئة إلى متأهلة إقليمية في 18 شهراً. المنهج التدريبي لا يصدق.", rating: 5, image: "" },
    { name: "كريم س.", role: "رياضي · كرة قدم", text: "كل تدريب له هدف. تشعر بالاحترافية من لحظة دخولك.", rating: 5, image: "" },
    { name: "إيلينا ف.", role: "رياضية · جمباز", text: "المرافق تشبه المراكز الوطنية. والمدربون يهتمون فعلاً.", rating: 5, image: "" },
    { name: "توم ل.", role: "ولي أمر · كاراتيه", text: "انضباط واحترام ومهارة حقيقية. الأكاديمية غيّرت ثقة ابني بشكل كامل.", rating: 5, image: "" },
    { name: "نورا أ.", role: "رياضية · لياقة", text: "أفضل برنامج تدريبي اتبعته. مجموعات صغيرة ونتائج كبيرة.", rating: 5, image: "" },
  ];

  const customTestimonials = useLocalStorageData<Array<{ name: string; role?: string; text: string; rating?: string | number; image?: string }>>("landing_testimonials", []);
  
  const items = (customTestimonials && customTestimonials.length > 0)
    ? customTestimonials.map((t) => ({
        name: t.name,
        role: t.role || "أولياء أمور وأعضاء",
        text: t.text,
        rating: Number(t.rating) || 5,
        image: t.image || "",
      }))
    : defaultItems;

  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" });
  useEffect(() => {
    if (!embla) return;
    const id = window.setInterval(() => embla.scrollNext(), 4500);
    return () => window.clearInterval(id);
  }, [embla]);

  return (
    <section className="section-pad relative overflow-hidden" style={{ background: "var(--navy-deep)" }}>
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(255, 100, 43, 0.07), transparent 60%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <Reveal>
            <span className="eyebrow">آراء رياضيينا</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl">
              رياضيون حقيقيون. <br />
              <span className="text-gradient">نتائج حقيقية.</span>
            </h2>
          </Reveal>
        </div>

        <div className="mt-16 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {items.map((t, i) => (
              <div key={i} className="min-w-[85%] md:min-w-[46%] lg:min-w-[32%]">
                <div
                  className="h-full rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "rgba(46, 51, 97, 0.45)",
                    border: "1px solid rgba(255, 100, 43, 0.15)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <div>
                    <div className="flex gap-1">
                      {Array.from({ length: t.rating }).map((_, k) => (
                        <Star
                          key={k}
                          className="h-4 w-4"
                          style={{ fill: "var(--orange)", color: "var(--orange)" }}
                        />
                      ))}
                    </div>
                    <p className="mt-6 font-display text-xl leading-snug text-white/90">"{t.text}"</p>
                  </div>
                  <div className="mt-8 flex items-center gap-3">
                    {t.image ? (
                      <img src={t.image} alt={t.name} className="h-10 w-10 rounded-full object-cover border border-white/20" />
                    ) : (
                      <div
                        className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold"
                        style={{ background: "var(--gradient-brand)" }}
                      >
                        {t.name[0]}
                      </div>
                    )}
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

/* ---------- NEWS SECTION ---------- */
function NewsSection() {
  const customNews = useLocalStorageData<Array<{ title: string; category: string; date: string; link: string; image: string }>>("landing_news", []);
  if (!customNews || customNews.length === 0) return null;

  return (
    <section id="news" className="section-pad relative" style={{ background: "var(--navy-mid)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <Reveal>
            <span className="eyebrow">آخر الأخبار</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl">
              الأخبار & <span className="text-gradient">الإعلانات</span>.
            </h2>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {customNews.map((news, i) => (
            <Reveal key={`${news.title}-${i}`} delay={i * 0.05}>
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-card transition-all duration-300 hover:border-white/20 hover:-translate-y-1">
                {news.image && (
                  <div className="h-48 w-full overflow-hidden">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="rounded-full bg-white/10 px-3 py-1 font-medium text-white/80">
                      {news.category}
                    </span>
                    <span>{news.date}</span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold leading-snug">{news.title}</h3>
                  {news.link && news.link !== "#" && (
                    <a
                      href={news.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex items-center gap-2 text-xs font-semibold hover:underline"
                      style={{ color: "var(--orange-light)" }}
                    >
                      اقرأ المقال <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
function FAQ() {
  const faqs = [
    {
      q: "ما الأعمار التي تقبلونها؟",
      a: "ندرّب الرياضيين من سن 4 حتى البالغين، مع برامج مصممة لكل مرحلة — من الأساسيات حتى الأداء الاحترافي.",
    },
    {
      q: "هل أحتاج خبرة مسبقة للانضمام؟",
      a: "لا حاجة لأي خبرة. كل رياضة تضم مسارات للمبتدئين والمتوسطين والمتنافسين مع مدربين متخصصين.",
    },
    {
      q: "هل يمكنني تجربة حصة قبل الاشتراك؟",
      a: "بالطبع. كل رياضي جديد يحصل على حصة تجريبية مجانية للتعرف على المدرب والمنشأة.",
    },
    {
      q: "هل تتوفر فرق تنافسية؟",
      a: "نعم. لدينا فرق تنافسية في كرة القدم والسباحة والسلة والطائرة والكاراتيه والجمباز.",
    },
    {
      q: "ما الذي يشمله الاشتراك؟",
      a: "تدريب منظم وبرنامج دوري ودخول المرافق وتتبع التقدم وفعاليات المجتمع الرياضي.",
    },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="section-pad relative" style={{ background: "var(--navy-deep)" }}>
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <Reveal>
            <span className="eyebrow">الأسئلة الشائعة</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl">
              أسئلة <span className="text-gradient">وأجوبة</span>.
            </h2>
          </Reveal>
        </div>
        <div className="mt-16 space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div
                className="overflow-hidden rounded-2xl transition-all duration-300"
                style={{
                  background: open === i ? "rgba(46, 51, 97, 0.6)" : "rgba(46, 51, 97, 0.3)",
                  border: open === i ? "1px solid rgba(255, 100, 43, 0.35)" : "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left"
                >
                  <span className="font-display text-lg font-semibold md:text-xl">{f.q}</span>
                  <motion.span
                    animate={{ rotate: open === i ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors"
                    style={{
                      border: open === i ? "1px solid rgba(255,100,43,0.5)" : "1px solid rgba(255,255,255,0.15)",
                      color: open === i ? "var(--orange)" : "white",
                    }}
                  >
                    <span className="text-xl leading-none">+</span>
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="px-6 pb-6 text-white/70">{f.a}</p>
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
  const generalSettings = useLocalStorageData<{ whatsappNumber?: string }>("system_settings_general", {});
  const waNum = generalSettings?.whatsappNumber || "15550108842";
  const cleanWa = waNum.replace(/[^0-9]/g, "");

  return (
    <section id="contact" className="section-pad relative" style={{ background: "var(--navy-mid)" }}>
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 100% 100%, rgba(255, 100, 43, 0.1), transparent 55%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Reveal>
              <span className="eyebrow">تواصل معنا</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl">
                مستعد للـ <span className="text-gradient">تدريب</span>؟
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-muted-foreground">
                احجز حصة تجريبية أو اسألنا أي شيء. نرد خلال ساعات قليلة في أوقات العمل.
              </p>
            </Reveal>

            <div className="mt-10 space-y-4">
              {[
                {
                  icon: Phone,
                  label: "اتصل بنا",
                  val: cleanWa ? `+${cleanWa}` : "+1 (555) 010-8842",
                  href: cleanWa ? `tel:+${cleanWa}` : "tel:+15550108842",
                },
                {
                  icon: Mail,
                  label: "البريد الإلكتروني",
                  val: "hello@apexacademy.co",
                  href: "mailto:hello@apexacademy.co",
                },
                {
                  icon: MessageCircle,
                  label: "واتساب",
                  val: "تحدث معنا",
                  href: cleanWa ? `https://wa.me/${cleanWa}` : "https://wa.me/15550108842",
                },
              ].map((r) => (
                <a
                  key={r.label}
                  href={r.href}
                  className="group flex items-center gap-4 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: "rgba(26, 31, 62, 0.6)", border: "1px solid rgba(255,255,255,0.08)" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255, 100, 43, 0.35)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                >
                  <div
                    className="grid h-11 w-11 place-items-center rounded-xl"
                    style={{ background: "var(--gradient-brand)", boxShadow: "0 4px 16px -4px rgba(255, 100, 43, 0.4)" }}
                  >
                    <r.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      {r.label}
                    </p>
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
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="rounded-3xl p-8 md:p-10"
              style={{
                background: "rgba(26, 31, 62, 0.7)",
                border: "1px solid rgba(255, 100, 43, 0.2)",
                backdropFilter: "blur(24px)",
                boxShadow: "0 24px 64px -20px rgba(0,0,0,0.5)",
              }}
            >
              <h3 className="font-display text-2xl font-bold">أرسل رسالة</h3>
              <div className="mt-8 grid gap-5">
                <Field label="الاسم الكامل" name="name" />
                <Field label="البريد الإلكتروني" name="email" type="email" />
                <Field label="رقم الهاتف" name="phone" type="tel" />
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
                    الرياضة المفضلة
                  </label>
                  <select
                    className="w-full rounded-xl px-4 py-3 outline-none transition-colors"
                    style={{ background: "rgba(46, 51, 97, 0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(255, 100, 43, 0.5)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  >
                    {[
                      "كرة القدم",
                      "السباحة",
                      "كرة السلة",
                      "الكرة الطائرة",
                      "الكاراتيه",
                      "الجمباز",
                      "اللياقة البدنية",
                    ].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
                    رسالتك
                  </label>
                  <textarea
                    rows={4}
                    className="w-full resize-none rounded-xl px-4 py-3 outline-none transition-colors"
                    style={{ background: "rgba(46, 51, 97, 0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(255, 100, 43, 0.5)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>
                <button type="submit" className="btn-primary mt-2 w-full justify-center">
                  {sent ? "تم إرسال الرسالة ✓" : "إرسال الرسالة"}{" "}
                  {!sent && <ArrowRight className="h-4 w-4" />}
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
      <label
        htmlFor={name}
        className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className="w-full rounded-xl px-4 py-3 outline-none transition-colors"
        style={{ background: "rgba(46, 51, 97, 0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
        onFocus={e => (e.currentTarget.style.borderColor = "rgba(255, 100, 43, 0.5)")}
        onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
      />
    </div>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  const generalSettings = useLocalStorageData<{ academyName?: string }>("system_settings_general", {});
  const brandName = generalSettings?.academyName || "APEX";

  return (
    <footer className="relative py-16" style={{ background: "var(--navy-deepest)", borderTop: "1px solid rgba(255, 100, 43, 0.15)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <a href="#top" className="flex items-center gap-2 font-display text-xl font-bold uppercase">
              <span
                className="grid h-9 w-9 place-items-center rounded-xl"
                style={{ background: "var(--gradient-brand)" }}
              >
                <Trophy className="h-4 w-4 text-white" />
              </span>
              {brandName}<span className="text-gradient">.</span>
            </a>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              أكاديمية رياضية متعددة التخصصات، صُمّمت للرياضيين الذين يريدون أكثر.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((I, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social"
                  className="grid h-10 w-10 place-items-center rounded-full transition-all duration-200"
                  style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--orange)"; e.currentTarget.style.borderColor = "var(--orange)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                >
                  <I className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {[
            {
              t: "الرياضات",
              l: [
                "كرة القدم",
                "السباحة",
                "كرة السلة",
                "الكرة الطائرة",
                "الكاراتيه",
                "الجمباز",
                "اللياقة البدنية",
              ],
            },
            { t: "الأكاديمية", l: ["من نحن", "المدربون", "الفروع", "Careers", "الأخبار"] },
            { t: "الدعم", l: ["تواصل معنا", "الأسئلة الشائعة", "العضوية", "حصة تجريبية", "الشروط"] },
          ].map((col) => (
            <div key={col.t}>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                {col.t}
              </p>
              <ul className="mt-5 space-y-3">
                {col.l.map((x) => {
                  if (x === "Careers") {
                    return (
                      <li key={x}>
                        <Link
                          to="/join-as-coach"
                          className="text-sm text-white/80 hover:text-white"
                        >
                          انضم كمدرب
                        </Link>
                      </li>
                    );
                  }
                  return (
                    <li key={x}>
                      <a href="#" className="text-sm text-white/80 hover:text-white">
                        {x}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 md:flex-row md:items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {brandName} للأكاديمية الرياضية. جميع الحقوق محفوظة.
          </p>
          <p className="text-xs text-muted-foreground">صُنع للرياضيين.</p>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Floating WhatsApp ---------- */
function FloatingWhatsApp() {
  const generalSettings = useLocalStorageData<{ whatsappNumber?: string }>("system_settings_general", {});
  const waNum = generalSettings?.whatsappNumber || "15550108842";
  const cleanWa = waNum.replace(/[^0-9]/g, "");

  return (
    <a
      href={cleanWa ? `https://wa.me/${cleanWa}` : "https://wa.me/15550108842"}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full text-white shadow-xl transition-transform hover:scale-110 md:h-16 md:w-16"
      style={{
        background: "linear-gradient(135deg, #25D366, #128C7E)",
        boxShadow: "0 10px 40px -10px rgba(37,211,102,0.6)",
      }}
    >
      <span
        className="absolute inset-0 -z-10 rounded-full animate-pulse-glow"
        style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
      />
      <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
    </a>
  );
}
