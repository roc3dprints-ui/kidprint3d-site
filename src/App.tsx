import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, X, Star, ChevronLeft, ChevronRight, ShieldCheck, ChevronDown } from "lucide-react";

const SITE = { name: "KidPrint", url: "https://kidprint3d.com" };

const PRODUCTS = [
  { id: "printer-tina2s", name: "Tina2S 3D Printer", price: 259, compareAt: 299, desc: "Compact enclosed printer; quiet, beginner-friendly.", badges: ["Kid-Friendly", "Auto-Level", "Wi-Fi"], specs: ["100×120×100 mm", "0.4 mm nozzle", "PLA"], art: "tina2s", category: "Printers", rating: 4.8, reviews: 312, stock: "In stock" },
  { id: "printer-enclosed", name: "Enclosed Kid Printer", price: 399, compareAt: 449, desc: "Safe and quiet printer with a fully enclosed build area.", badges: ["Kid-Friendly", "Auto-Level", "Quiet"], specs: ["120×120×120 mm", "0.4 mm nozzle", "PLA/TPU"], art: "enclosed", category: "Printers", rating: 4.7, reviews: 201, stock: "In stock" },
];

const STLS = [
  { id: "stl-benchy", name: "Benchy (test boat)", size: "~60 × 31 × 48", desc: "Calibration boat for first prints.", download: "#" },
  { id: "stl-bookmark", name: "Bookmark Tab (120 × 35 × 2)", size: "120 × 35 × 2", desc: "Rounded bookmark.", download: "#" },
  { id: "stl-gears", name: "Gear Pair", size: "Ø60 • Ø40", desc: "Two demo gears.", download: "#" },
];

const currency = (n: number) => `$${n.toFixed(2)}`;

function useSEO(tab: "home" | "shop" | "stls" | "learn") {
  useEffect(() => {
    const titles = {
      home: `${SITE.name} — Kid-friendly 3D printing: printers & verified STLs`,
      shop: `Shop printers & kits — ${SITE.name}`,
      stls: `Verified kid-friendly STL library — ${SITE.name}`,
      learn: `Parents & Teachers guide — ${SITE.name}`,
    } as const;
    const descs = {
      home: "Enclosed, quiet 3D printers plus a curated, kid-safe STL library and free guides for parents and teachers.",
      shop: "Beginner-friendly printers and classroom bundles with 1-year warranty and fast shipping.",
      stls: "Classroom-safe STL files reviewed for content and printability. Free Benchy and more.",
      learn: "Plain-English 3D printing guides for families, teachers, and schools.",
    } as const;
    document.title = titles[tab];
    let m = document.querySelector('meta[name="description"]');
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
    }
    m.setAttribute("content", descs[tab]);
  }, [tab]);
}

const SLIDES = [
  { id: "printers", title: "Enclosed printers built for families.", subtitle: "Quiet, auto-level, and ready in 10 minutes." },
  { id: "stls", title: "Verified kid-friendly STL library.", subtitle: "Curated by humans. Classroom-safe. Free to start." },
];

function HeroSlider({ onNavigate }: { onNavigate: (action: any) => void }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const toRef = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    if (toRef.current) window.clearTimeout(toRef.current);
    toRef.current = window.setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), 6000);
    return () => { if (toRef.current) window.clearTimeout(toRef.current); };
  }, [index, paused]);

  const go = (d: number) => setIndex((i) => (i + d + SLIDES.length) % SLIDES.length);

  return (
    <section className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] text-white/90">
            <ShieldCheck className="h-4 w-4" /> Verified kid-friendly
          </span>
          <AnimatePresence mode="wait">
            <motion.div
              key={SLIDES[index].id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="min-h-[140px]"
            >
              <h1 className="mb-3 text-4xl font-black leading-tight text-white md:text-5xl">{SLIDES[index].title}</h1>
              <p className="mb-6 text-white/80">{SLIDES[index].subtitle}</p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => onNavigate({ type: "tab", value: "shop" })} className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-black hover:bg-emerald-400">
                  Shop Printers
                </button>
                <button onClick={() => onNavigate({ type: "tab", value: "stls" })} className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 font-semibold hover:bg-white/10">
                  Explore STLs
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {SLIDES.map((s, i) => (
                <button key={s.id} onClick={() => setIndex(i)} className={`h-1.5 w-8 rounded-full transition-all ${i === index ? "bg-white" : "bg-white/30 hover:bg-white/50"}`} aria-label={`Go to slide ${i + 1}`} />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/90 hover:bg-white/10" onClick={() => go(-1)} aria-label="Previous slide">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/90 hover:bg-white/10" onClick={() => go(1)} aria-label="Next slide">
                <ChevronRight className="h-5 w-5" />
              </button>
              <button className={`rounded-lg border border-white/10 p-2 ${paused ? "bg-white/20" : "bg-white/5 hover:bg-white/10"}`} onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play" : "Pause"}>
                {paused ? "▶" : "❚❚"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RatingStars({ value }: { value: number }) {
  const full = Math.floor(value);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < full ? "fill-yellow-400 text-yellow-400" : "text-white/30"}`} />
      ))}
      <span className="text-xs text-white/70">{value.toFixed(1)}</span>
    </div>
  );
}

function Shop({ onAdd }: { onAdd: (id: string) => void }) {
  return (
    <section id="shop" className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="mb-4 text-center text-3xl font-extrabold text-white">Printers & Kits</h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((p) => (
          <div key={p.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white backdrop-blur-sm">
            <div className="mb-3">
              <div className="grid aspect-[4/3] w-full place-items-center rounded-xl border border-white/10 bg-gradient-to-br from-zinc-800 to-zinc-900 text-white/60">{p.art}</div>
            </div>
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <RatingStars value={p.rating || 4.7} />
            </div>
            <p className="mb-2 text-xs text-white/60">{p.reviews?.toLocaleString()} reviews</p>
            <p className="mb-3 text-sm text-white/80">{p.desc}</p>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <div className="text-xl font-extrabold">{currency(p.price)}</div>
                {p.compareAt && <div className="text-xs text-white/50 line-through">{currency(p.compareAt)}</div>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => onAdd(p.id)} className="rounded-xl bg-emerald-500 px-3 py-2 font-semibold text-black hover:bg-emerald-400">Buy Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function STLPage() {
  type STL = { id: string; name: string; size: string; desc: string; download: string; thumb?: string };
  const FALLBACK: STL[] = [
    { id: "stl-benchy", name: "Benchy (test boat)", size: "~60 × 31 × 48", desc: "Calibration boat for first prints.", download: "#", thumb: "/stls/benchy.svg" },
    { id: "stl-bookmark", name: "Bookmark Tab", size: "120 × 35 × 2", desc: "Rounded bookmark.", download: "#", thumb: "/stls/bookmark.svg" },
    { id: "stl-gears", name: "Gear Pair", size: "Ø60 • Ø40", desc: "Two demo gears.", download: "#", thumb: "/stls/gears.svg" },
  ];
  const [items, setItems] = React.useState<STL[]>(FALLBACK);

  React.useEffect(() => {
    fetch("/stls.json").then(r => r.ok ? r.json() : FALLBACK).then(setItems).catch(() => setItems(FALLBACK));
  }, []);

  return (
    <section id="stls" className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-extrabold text-white">STL Library</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-white/80">
          Verified kid-friendly models. Every STL is reviewed for content and printability.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {items.map((s) => (
          <div key={s.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white">
            {s.thumb && <img src={s.thumb} alt={s.name} className="mb-3 aspect-[4/3] w-full rounded-xl border border-white/10 object-cover" />}
            <div className="mb-1 font-semibold">{s.name}</div>
            <div className="text-xs text-white/70">{s.size}</div>
            <p className="mt-2 text-sm text-white/80">{s.desc}</p>
            <a href={s.download} className="mt-3 inline-block rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15" download>
              Download STL
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "Is 3D printing safe for kids?", a: "With supervision, enclosed printers, and PLA filament, it can be classroom-friendly." },
    { q: "Do I need special software?", a: "You’ll use a slicer (many are free). We link simple profiles to get great prints fast." },
  ];
  const [open, setOpen] = useState<string | null>(faqs[0].q);
  return (
    <section className="mx-auto max-w-5xl px-6 py-8">
      <h3 className="mb-4 text-center text-2xl font-extrabold text-white">FAQ</h3>
      <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5">
        {faqs.map((f) => (
          <button key={f.q} onClick={() => setOpen(open === f.q ? null : f.q)} className="w-full p-4 text-left text-white">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{f.q}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${open === f.q ? "rotate-180" : ""}`} />
            </div>
            {open === f.q && <p className="mt-2 text-sm text-white/80">{f.a}</p>}
          </button>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [tab, setTab] = useState<"home" | "shop" | "stls" | "learn">("home");
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<{ id: string; qty: number }[]>([]);
  useSEO(tab);

  const count = cart.reduce((a, i) => a + i.qty, 0);
  const addToCart = (id: string) => {
    setCart((c) => {
      const ex = c.find((x) => x.id === id);
      if (ex) return c.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x));
      return [...c, { id, qty: 1 }];
    });
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0b0e]/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3"><span className="font-black">KidPrint</span></div>
          <nav className="hidden items-center gap-2 md:flex">
            <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-semibold text-white hover:bg-white/10" onClick={() => setTab("home")}>Home</button>
            <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-semibold text-white hover:bg-white/10" onClick={() => setTab("shop")}>Shop</button>
            <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-semibold text-white hover:bg-white/10" onClick={() => setTab("stls")}>STL Library</button>
            <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-semibold text-white hover:bg-white/10" onClick={() => setTab("learn")}>Learn</button>
          </nav>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-semibold hover:bg-white/10" onClick={() => setCartOpen(true)}>
              <ShoppingCart className="h-4 w-4" /> Cart ({count})
            </button>
          </div>
        </div>
      </header>

      {tab === "home" && (<><HeroSlider onNavigate={(a) => a?.type === "tab" && setTab(a.value)} /><FAQ /></>)}
      {tab === "shop" && <Shop onAdd={addToCart} />}
      {tab === "stls" && <STLPage />}
      {tab === "learn" && <div className="mx-auto max-w-4xl px-6 py-12 text-white">Free guides coming soon.</div>}

      <footer className="border-t border-white/10 py-8 text-center text-sm text-white/70">
        <div className="mx-auto max-w-7xl px-6">© {new Date().getFullYear()} KidPrint • kidprint3d.com</div>
      </footer>

      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setCartOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-full max-w-sm bg-zinc-900 text-white shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <h3 className="text-lg font-semibold">Your Cart</h3>
              <button className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10" onClick={() => setCartOpen(false)} aria-label="Close cart"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex h-[calc(100%-140px)] flex-col gap-3 overflow-auto p-4">
              {cart.length === 0 && <p className="text-sm text-zinc-300">Your cart is empty.</p>}
              {cart.map((it) => (
                <div key={it.id} className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
                  <div>
                    <div className="font-medium">{PRODUCTS.find((p) => p.id === it.id)?.name || it.id}</div>
                    <div className="text-sm text-zinc-300">{it.qty} × {currency(PRODUCTS.find((p) => p.id === it.id)?.price || 0)}</div>
                  </div>
                  <button className="rounded-lg border border-white/10 px-2 py-1 text-sm hover:bg-white/10" onClick={() => setCart((c) => c.filter((x) => x.id !== it.id))}>Remove</button>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 p-4">
              <button className="w-full rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-black hover:bg-emerald-400">Checkout (demo)</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
