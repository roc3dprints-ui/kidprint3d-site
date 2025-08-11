import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingCart, X, Star, ChevronLeft, ChevronRight, ShieldCheck,
  ChevronDown, PackageCheck, Truck, Sparkles, Search, Filter, Mail,
  HelpCircle, GraduationCap, ClipboardCheck, ExternalLink, Share2, Link as LinkIcon
} from "lucide-react";

/* ------------ helpers ------------ */
const currency = (n: number) => `$${n.toFixed(2)}`;
const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
const mailto = (to: string, subject: string, body = "") =>
  `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

/* Small component that gracefully falls back if an image fails */
function Img({ src, alt, className, fallbackLabel }: { src?: string; alt: string; className?: string; fallbackLabel?: string }) {
  const [ok, setOk] = React.useState(true);
  if (src && ok) {
    return <img src={src} alt={alt} className={className} onError={() => setOk(false)} loading="lazy" />;
  }
  return (
    <div className={cx("grid place-items-center bg-gradient-to-br from-zinc-800 to-zinc-900 text-white/60", className)}>
      {fallbackLabel || "image"}
    </div>
  );
}

/* ------------ affiliates loader (edit links in /public/affiliates.json) ------------ */
type Affiliates = Record<string, string>;
function useAffiliates() {
  const [links, setLinks] = React.useState<Affiliates>({});
  React.useEffect(() => {
    fetch("/affiliates.json").then(r => r.ok ? r.json() : {}).then(setLinks).catch(()=>{});
  }, []);
  return links;
}
function buildAmazonSearch(q: string, tag?: string) {
  const urlQ = encodeURIComponent(q);
  return `https://www.amazon.com/s?k=${urlQ}${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`;
}
function buildAffiliateUrl(pName: string, direct?: string, amazonTag?: string) {
  if (direct && direct.trim()) return direct;
  return buildAmazonSearch(`${pName} 3D Printer`, amazonTag);
}

/* ------------ catalog ------------ */
type Product = {
  id: string; name: string; price: number; compareAt?: number; desc: string;
  badges: string[]; specs: string[]; img?: string; category: "Printers" | "Kits";
  rating: number; reviews: number; stock: "In stock" | "Backorder";
};
const PRODUCTS: Product[] = [
  { id: "printer-tina2s", name: "Tina2S 3D Printer", price: 259, compareAt: 299, desc: "Compact enclosed printer; quiet and beginner-friendly.",
    badges: ["Kid-Friendly", "Auto-Level", "Wi-Fi"], specs: ["100×120×100 mm", "0.4 mm nozzle", "PLA"], img: "/img/printer-tina2s.jpg",
    category: "Printers", rating: 4.8, reviews: 312, stock: "In stock" },
  { id: "enclosed-kid-printer", name: "Enclosed Kid Printer", price: 399, compareAt: 449, desc: "Fully enclosed, safer around curious hands.",
    badges: ["Quiet", "Auto-Level", "Touchscreen"], specs: ["120×120×120 mm", "0.4 mm nozzle", "PLA/TPU"], img: "/img/enclosed-kid-printer.jpg",
    category: "Printers", rating: 4.7, reviews: 201, stock: "In stock" },
  { id: "starter-kit", name: "Starter Classroom Kit", price: 89, desc: "PLA spools + tools + safety cards for first week.",
    badges: ["2× PLA", "Tools", "Safety Cards"], specs: ["2× 1kg PLA", "Snips", "Glue stick"], img: "/img/starter-kit.jpg",
    category: "Kits", rating: 4.6, reviews: 98, stock: "In stock" },
];

/* ------------ bundles ------------ */
type Bundle = {
  id: string; name: string; subtitle: string;
  includes: { ref?: Product["id"]; custom?: string; search?: string }[];
  estPrice: number; bestFor: string;
};
const BUNDLES: Bundle[] = [
  {
    id: "bundle-home",
    name: "Home Starter Bundle",
    subtitle: "Perfect first setup for families",
    includes: [{ ref: "printer-tina2s" }, { search: "PLA 1.75mm 2 pack kid friendly" }, { custom: "Safety Cards (printable)" }],
    estPrice: 259 + 30, bestFor: "Ages 8+ with supervision"
  },
  {
    id: "bundle-classroom",
    name: "Classroom Essentials",
    subtitle: "One enclosed printer + classroom supplies",
    includes: [{ ref: "enclosed-kid-printer" }, { search: "PLA 1.75mm 4 pack classroom" }, { search: "Nozzle cleaning kit 0.4mm" }, { custom: "Safety Cards (printable)" }],
    estPrice: 399 + 55, bestFor: "1–2 small groups; curriculum pilots"
  },
  {
    id: "bundle-lab",
    name: "STEM Lab Pack",
    subtitle: "Two printers + consumables + quickstart",
    includes: [{ ref: "enclosed-kid-printer" }, { ref: "printer-tina2s" }, { search: "PLA 1.75mm assorted colors 6 pack" }, { search: "Spare 0.4mm brass nozzle 5 pack" }, { custom: "Safety Cards (printable)" }],
    estPrice: 399 + 259 + 90, bestFor: "Makerspaces & after-school"
  }
];

/* ------------ SEO ------------ */
function useSEO(tab: "home" | "shop" | "bundles" | "stls" | "learn") {
  React.useEffect(() => {
    const title = {
      home: "KidPrint — Kid-friendly 3D printing",
      shop: "Shop printers & kits — KidPrint",
      bundles: "School bundles — KidPrint",
      stls: "Verified kid-friendly STL library — KidPrint",
      learn: "Parents & Teachers guide — KidPrint",
    }[tab];
    document.title = title;

    const descText =
      "Enclosed, quiet 3D printers plus curated kid-safe STL models and free guides for parents and teachers. School bundles available.";
    let desc = document.querySelector('meta[name="description"]');
    if (!desc) { desc = document.createElement("meta"); desc.setAttribute("name", "description"); document.head.appendChild(desc); }
    desc.setAttribute("content", descText);

    const ldOrg = { "@context":"https://schema.org","@type":"Organization","name":"KidPrint","url":"https://kidprint3d.com","logo":"https://kidprint3d.com/favicon.svg" };
    document.querySelectorAll("script[data-ld]").forEach(n => n.remove());
    const s1 = document.createElement("script"); s1.type="application/ld+json"; s1.dataset.ld="org"; s1.text = JSON.stringify(ldOrg);
    document.head.appendChild(s1);
  }, [tab]);
}

/* ------------ hero & shared UI ------------ */
const SLIDES = [
  { id: "printers", h1: "Enclosed printers built for families.", p: "Quiet, auto-level, and ready in 10 minutes.", img: "/img/hero-printer.jpg" },
  { id: "stls", h1: "Verified kid-friendly STL library.", p: "Curated by humans. Classroom-safe. Free to start.", img: "/img/hero-stls.jpg" },
];

function ShareRibbon() {
  const url = "https://kidprint3d.com/?ref=share";
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); alert("Link copied!"); } catch { prompt("Copy this link:", url); }
  };
  const twitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent("Kid-safe 3D printing: printers, guides, and verified STL models.")}&url=${encodeURIComponent(url)}`;
  const email = mailto("","KidPrint — kid-safe 3D printing",`Check this out: ${url}`);
  return (
    <div className="mx-auto max-w-7xl px-6 pt-2">
      <div className="mb-3 flex items-center justify-center gap-2 rounded-xl border border-indigo-400/40 bg-indigo-500/10 px-3 py-2 text-sm text-indigo-200">
        <Share2 className="h-4 w-4" />
        <span><strong>Share KidPrint:</strong> help a teacher or parent find safe 3D printing.</span>
        <button onClick={copy} className="inline-flex items-center gap-1 underline"><LinkIcon className="h-3 w-3" /> Copy link</button>
        <a href={email} className="underline">Email</a>
        <a href={twitter} target="_blank" rel="noopener" className="underline">Tweet</a>
      </div>
    </div>
  );
}

function HeroSlider({ goTab }: { goTab: (t: "shop" | "stls" | "bundles") => void }) {
  const [i, setI] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  React.useEffect(() => { if (paused) return; const t = setTimeout(() => setI(n => (n+1)%SLIDES.length), 6000); return () => clearTimeout(t); }, [i, paused]);

  const slide = SLIDES[i];

  return (
    <section className="relative isolate">
      <ShareRibbon />

      <div className="mx-auto max-w-7xl px-6 pb-12 md:pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-0 backdrop-blur">
          {/* background image */}
          <div className="absolute inset-0 -z-10">
            <Img src={slide.img} alt="" className="h-full w-full object-cover opacity-35" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0e] via-[#0b0b0e]/30 to-transparent" />
          </div>

          <div className="p-6 md:p-10">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] text-white/90">
              <ShieldCheck className="h-4 w-4" /> Verified kid-friendly
            </span>

            <AnimatePresence mode="wait">
              <motion.div key={slide.id} initial={{opacity:0,x:-30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:30}} transition={{duration:0.45,ease:"easeOut"}} className="min-h-[140px]">
                <h1 className="mb-3 text-4xl font-black leading-tight text-white md:text-5xl">{slide.h1}</h1>
                <p className="mb-6 text-white/85">{slide.p}</p>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => goTab("shop")} className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-black hover:bg-emerald-400">Shop Printers</button>
                  <button onClick={() => goTab("stls")} className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 font-semibold hover:bg-white/10">Explore STLs</button>
                  <button onClick={() => goTab("bundles")} className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 font-semibold text-emerald-200 hover:bg-emerald-500/20">School Bundles</button>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-2">{SLIDES.map((s,k)=>(
                <button key={s.id} onClick={()=>setI(k)} className={cx("h-1.5 w-8 rounded-full transition-all", k===i?"bg-white":"bg-white/30 hover:bg-white/50")} />
              ))}</div>
              <div className="flex items-center gap-2">
                <button className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/90 hover:bg-white/10" onClick={()=>setI(n=>(n+SLIDES.length-1)%SLIDES.length)} aria-label="Prev"><ChevronLeft className="h-5 w-5"/></button>
                <button className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/90 hover:bg-white/10" onClick={()=>setI(n=>(n+1)%SLIDES.length)} aria-label="Next"><ChevronRight className="h-5 w-5"/></button>
                <button className={cx("rounded-lg border border-white/10 p-2", paused?"bg-white/20":"bg-white/5 hover:bg-white/10")} onClick={()=>setPaused(p=>!p)} aria-label={paused?"Play":"Pause"}>{paused ? "▶" : "❚❚"}</button>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-white/80">
              <HelpCircle className="h-4 w-4" />
              <span>Kid-Safe Promise: we list beginner printers and manually review STL content. Use “Report” on each model.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const items = [
    { icon: <Truck className="h-5 w-5" />, t: "Fast shipping", s: "Free over $50" },
    { icon: <PackageCheck className="h-5 w-5" />, t: "1-year warranty", s: "U.S. support" },
    { icon: <ShieldCheck className="h-5 w-5" />, t: "Kid-safe STL checks", s: "Reviewed by humans" },
    { icon: <Sparkles className="h-5 w-5" />, t: "Easy profiles", s: "Great first prints" },
  ];
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-6 pb-10 pt-2 md:grid-cols-4">
      {items.map(x=>(
        <div key={x.t} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-white/90">
          <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/10">{x.icon}</div>
          <div><div className="text-sm font-semibold">{x.t}</div><div className="text-xs text-white/70">{x.s}</div></div>
        </div>
      ))}
    </div>
  );
}

function Rating({ value }: { value: number }) {
  const full = Math.floor(value);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cx("h-4 w-4", i < full ? "fill-yellow-400 text-yellow-400" : "text-white/30")} />
      ))}
      <span className="text-xs text-white/70">{value.toFixed(1)}</span>
    </div>
  );
}

/* ------------ SHOP ------------ */
function Shop({ onAdd, links }: { onAdd: (id: string) => void; links: Record<string,string> }) {
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState<"All" | Product["category"]>("All");
  const [sort, setSort] = React.useState<"popular" | "price-asc" | "price-desc">("popular");

  const amazonTag = (links["amazon_tag"] || "").trim();
  let items = PRODUCTS.filter(p => (cat==="All" || p.category===cat) && p.name.toLowerCase().includes(q.toLowerCase()));
  if (sort==="price-asc") items = items.sort((a,b)=>a.price-b.price);
  if (sort==="price-desc") items = items.sort((a,b)=>b.price-a.price);

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-6 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-3xl font-extrabold text-white">Shop printers & kits</h2>
        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
          <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <Search className="h-4 w-4 text-white/60" />
            <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search…" className="w-56 bg-transparent text-sm text-white outline-none placeholder:text-white/50" />
          </label>
          <div className="flex items-center gap-2">
            <select className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm" value={cat} onChange={(e)=>setCat(e.target.value as any)}>
              <option>All</option><option>Printers</option><option>Kits</option>
            </select>
            <select className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm" value={sort} onChange={(e)=>setSort(e.target.value as any)}>
              <option value="popular">Sort: Popular</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map(p=>{
          const save = p.compareAt ? p.compareAt - p.price : 0;
          const direct = links[p.id];
          const url = buildAffiliateUrl(p.name, direct, amazonTag);
          return (
            <div key={p.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white backdrop-blur-sm">
              <div className="mb-3">
                <Img src={p.img} alt={p.name} fallbackLabel={p.name} className="aspect-[4/3] w-full rounded-xl border border-white/10 object-cover" />
              </div>
              <div className="mb-1 flex items-center justify-between"><h3 className="text-lg font-semibold">{p.name}</h3><Rating value={p.rating}/></div>
              <p className="mb-2 text-xs text-white/60">{p.reviews.toLocaleString()} reviews • {p.stock}</p>
              <p className="mb-3 text-sm text-white/80">{p.desc}</p>
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <div className="text-xl font-extrabold">{currency(p.price)}</div>
                  {p.compareAt && <div className="text-xs text-white/50 line-through">{currency(p.compareAt)}</div>}
                  {save>0 && <div className="text-xs text-emerald-400">Save {currency(save)}</div>}
                </div>
                <div className="flex gap-2">
                  <a href={url} target="_blank" rel="nofollow sponsored noopener" className="rounded-xl bg-emerald-500 px-3 py-2 font-semibold text-black hover:bg-emerald-400">Buy now</a>
                  <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10" onClick={()=>onAdd(p.id)}>Add to cart</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">{p.badges.map(b=><span key={b} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px]">{b}</span>)}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
        <strong>Image note:</strong> Use your own or manufacturer-provided photos. Don’t use Amazon product photos unless fetched via their official API.
      </div>
    </section>
  );
}

/* ------------ BUNDLES ------------ */
function Bundles({ links }: { links: Record<string,string> }) {
  const amazonTag = (links["amazon_tag"] || "").trim();
  const linkFor = (inc: Bundle["includes"][number]) => {
    if (inc.ref) {
      const p = PRODUCTS.find(x=>x.id===inc.ref)!;
      return buildAffiliateUrl(p.name, links[p.id], amazonTag);
    }
    if (inc.search) return buildAmazonSearch(inc.search, amazonTag);
    return "#";
  };
  const emailPO = (b: Bundle) => mailto(
    "hello@kidprint3d.com",
    `School quote: ${b.name}`,
    `Hi KidPrint team,\n\nWe'd like a formal quote / PO assistance for:\nBundle: ${b.name}\nBest for: ${b.bestFor}\nEstimated total: ~$${b.estPrice}\n\nSchool name:\nContact name:\nQuantity:\nTimeline:\nNotes:\n`
  );

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="mb-2 text-3xl font-extrabold text-white flex items-center gap-2"><GraduationCap className="h-7 w-7"/> School Bundles</h2>
      <p className="mb-6 text-white/80">Pick a bundle, request a quote (POs welcome), or buy items individually via Amazon.</p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {BUNDLES.map(b=>(
          <div key={b.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white">
            <div className="mb-1 text-lg font-semibold">{b.name}</div>
            <div className="text-sm text-white/70">{b.subtitle}</div>
            <div className="mt-3 text-sm">
              <div className="mb-1 font-semibold">Includes:</div>
              <ul className="space-y-1">
                {b.includes.map((inc, idx)=>{
                  if (inc.ref) {
                    const p = PRODUCTS.find(x=>x.id===inc.ref)!;
                    const u = linkFor(inc);
                    return (
                      <li key={idx} className="flex items-center justify-between gap-2">
                        <span>• {p.name}</span>
                        <a href={u} target="_blank" rel="nofollow sponsored noopener" className="inline-flex items-center gap-1 text-xs underline">
                          Buy <ExternalLink className="h-3 w-3"/>
                        </a>
                      </li>
                    );
                  }
                  if (inc.search) {
                    const u = linkFor(inc);
                    return (
                      <li key={idx} className="flex items-center justify-between gap-2">
                        <span>• {inc.search}</span>
                        <a href={u} target="_blank" rel="nofollow sponsored noopener" className="inline-flex items-center gap-1 text-xs underline">
                          Search <ExternalLink className="h-3 w-3"/>
                        </a>
                      </li>
                    );
                  }
                  return <li key={idx}>• {inc.custom}</li>;
                })}
              </ul>
            </div>

            <div className="mt-3 text-sm text-white/70">Best for: {b.bestFor}</div>
            <div className="mt-2 text-xl font-extrabold">Est. ${b.estPrice.toFixed(0)}</div>

            <div className="mt-4 flex gap-2">
              <a href={emailPO(b)} className="rounded-xl bg-emerald-500 px-3 py-2 font-semibold text-black hover:bg-emerald-400">Request school quote</a>
              <a href={mailto("hello@kidprint3d.com","Bundle questions: "+b.name)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">Ask a question</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------ STL library (unchanged structure) ------------ */
function STLPage() {
  type STL = { id: string; name: string; size: string; desc: string; download: string; thumb?: string; tags?: string[]; level?: "Easy" | "Intermediate" | "Advanced" };
  const FALLBACK: STL[] = [
    { id: "stl-benchy", name: "Benchy (test boat)", size: "~60 × 31 × 48", desc: "Calibration boat for first prints.", download: "#", thumb: "/stls/benchy.svg", tags: ["Calibration"], level: "Easy" },
    { id: "stl-bookmark", name: "Bookmark Tab", size: "120 × 35 × 2", desc: "Rounded bookmark.", download: "#", thumb: "/stls/bookmark.svg", tags: ["School"], level: "Easy" },
    { id: "stl-gears", name: "Gear Pair", size: "Ø60 • Ø40", desc: "Two demo gears.", download: "#", thumb: "/stls/gears.svg", tags: ["STEM"], level: "Intermediate" },
  ];
  const [items, setItems] = React.useState<STL[]>(FALLBACK);
  const [q, setQ] = React.useState("");
  const [level, setLevel] = React.useState<"All" | "Easy" | "Intermediate" | "Advanced">("All");

  React.useEffect(() => {
    fetch("/stls.json").then(r => r.ok ? r.json() : FALLBACK).then((arr: STL[]) => setItems(arr.length ? arr : FALLBACK)).catch(() => setItems(FALLBACK));
  }, []);

  const list = items.filter(s =>
    (level === "All" || s.level === level) &&
    (s.name.toLowerCase().includes(q.toLowerCase()) || (s.tags || []).some(t => t.toLowerCase().includes(q.toLowerCase())))
  );

  const reportLink = (s: STL) => mailto(
    "hello@kidprint3d.com",
    `Report STL: ${s.name} (${s.id})`,
    `Model: ${s.name}\nID: ${s.id}\nReason: (e.g., inappropriate content, unsafe design)\nDetails: `
  );

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-6 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-white">STL Library</h2>
          <p className="text-sm text-white/80">Verified kid-friendly models. Every STL is reviewed for content and printability.</p>
        </div>
        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
          <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <Search className="h-4 w-4 text-white/60" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search models…" className="w-56 bg-transparent text-sm text-white outline-none placeholder:text-white/50" />
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <Filter className="h-4 w-4 text-white/60" />
            <select className="bg-transparent text-sm" value={level} onChange={(e) => setLevel(e.target.value as any)}>
              <option>All</option><option>Easy</option><option>Intermediate</option><option>Advanced</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {list.map((s) => (
          <div key={s.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white">
            {s.thumb && <Img src={s.thumb} alt={s.name} className="mb-3 aspect-[4/3] w-full rounded-xl border border-white/10 object-cover" fallbackLabel={s.name} />}
            <div className="mb-1 font-semibold">{s.name}</div>
            <div className="text-xs text-white/70">{s.size} {s.level && <span className="ml-2 rounded border border-white/10 px-1 py-0.5">{s.level}</span>}</div>
            <p className="mt-2 text-sm text-white/80">{s.desc}</p>
            <div className="mt-2 flex flex-wrap gap-1">{(s.tags || []).map(t => <span key={t} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px]">{t}</span>)}</div>
            <div className="mt-3 flex gap-2">
              <a href={s.download} className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15" download>Download STL</a>
              <a href={reportLink(s)} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">Report</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------ Safety Cards ------------ */
function printSafetyCards() {
  const html = `<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>KidPrint Safety Cards</title>
<style>
  body{font:16px/1.5 system-ui;margin:24px;color:#111}
  h1{font-size:24px;margin:0 0 8px}
  .card{border:1px solid #333;border-radius:12px;padding:16px;margin:12px 0}
  .grid{display:grid;gap:12px;grid-template-columns:repeat(2,minmax(0,1fr))}
  @media print {.print{display:none}}
</style>
<body>
  <h1>KidPrint Safety Cards</h1>
  <p>Post near your printer. Keep PLA only for home/classroom. Adult supervision required.</p>
  <div class="grid">
    <div class="card"><b>1. Supervise</b><br>Adults nearby during printing. No hands inside the printer while moving.</div>
    <div class="card"><b>2. Enclosed</b><br>Keep door closed. Never touch the hot nozzle/bed.</div>
    <div class="card"><b>3. Filament</b><br>Use PLA only. Ventilate room. Store spools away from kids.</div>
    <div class="card"><b>4. Cleanup</b><br>Snips are sharp. Sweep small bits. Unplug when done.</div>
    <div class="card"><b>5. Content</b><br>Only kid-safe models. Report anything questionable.</div>
    <div class="card"><b>6. Profiles</b><br>Layer 0.2 mm, 15% infill. Supports only when needed.</div>
  </div>
  <button class="print" onclick="window.print()">Print</button>
</body></html>`;
  const w = window.open("", "_blank", "noopener,noreferrer");
  if (w) { w.document.write(html); w.document.close(); }
}
/* ------------ FAQ + Safety Cards (printable) ------------ */
function printSafetyCards() {
  const html = `<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>KidPrint Safety Cards</title>
<style>
  body{font:16px/1.5 system-ui;margin:24px;color:#111}
  h1{font-size:24px;margin:0 0 8px}
  .card{border:1px solid #333;border-radius:12px;padding:16px;margin:12px 0}
  .grid{display:grid;gap:12px;grid-template-columns:repeat(2,minmax(0,1fr))}
  @media print {.print{display:none}}
</style>
<body>
  <h1>KidPrint Safety Cards</h1>
  <p>Post near your printer. Keep PLA only for home/classroom. Adult supervision required.</p>
  <div class="grid">
    <div class="card"><b>1. Supervise</b><br>Adults nearby during printing. No hands inside the printer while moving.</div>
    <div class="card"><b>2. Enclosed</b><br>Keep door closed. Never touch the hot nozzle/bed.</div>
    <div class="card"><b>3. Filament</b><br>Use PLA only. Ventilate room. Store spools away from kids.</div>
    <div class="card"><b>4. Cleanup</b><br>Snips are sharp. Sweep small bits. Unplug when done.</div>
    <div class="card"><b>5. Content</b><br>Only kid-safe models. Report anything questionable.</div>
    <div class="card"><b>6. Profiles</b><br>Layer 0.2 mm, 15% infill. Supports only when needed.</div>
  </div>
  <button class="print" onclick="window.print()">Print</button>
</body></html>`;
  const w = window.open("", "_blank", "noopener,noreferrer");
  if (w) { w.document.write(html); w.document.close(); }
}

function FAQ() {
  const faqs = [
    { q: "Is 3D printing safe for kids?", a: "With supervision, enclosed printers, and PLA filament, it can be classroom-friendly. We verify models and provide printable Safety Cards." },
    { q: "What slicer should I use?", a: "We link beginner profiles that work out-of-the-box. Start 0.2 mm layer, 15% infill, supports only when needed." },
    { q: "Do you provide school pricing?", a: "Yes—use the School Bundles page to request a quote or email hello@kidprint3d.com." },
    { q: "How do you verify STLs?", a: "We check for content appropriateness, risky mechanisms, and printability. Community can report with one click." },
  ];
  const [open, setOpen] = React.useState<string | null>(faqs[0].q);
  return (
    <section className="mx-auto max-w-5xl px-6 pb-12">
      <h3 className="mb-4 text-center text-2xl font-extrabold text-white">FAQ</h3>
      <div className="mb-4 flex justify-center">
        <button onClick={printSafetyCards} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white hover:bg-white/10">
          <ClipboardCheck className="h-4 w-4"/> Print Safety Cards
        </button>
      </div>
      <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5">
        {faqs.map(f=>(
          <button key={f.q} onClick={()=>setOpen(open===f.q?null:f.q)} className="w-full p-4 text-left text-white">
            <div className="flex items-center justify-between"><span className="font-semibold">{f.q}</span><ChevronDown className={`h-4 w-4 transition-transform ${open===f.q ? "rotate-180" : ""}`} /></div>
            {open===f.q && <p className="mt-2 text-sm text-white/80">{f.a}</p>}
          </button>
        ))}
      </div>
    </section>
  );
}
/* ------------ APP ------------ */
export default function App() {
  const [tab, setTab] = React.useState<"home" | "shop" | "bundles" | "stls" | "learn">("home");
  const [cartOpen, setCartOpen] = React.useState(false);
  const [cart, setCart] = React.useState<{ id: string; qty: number }[]>([]);
  const [showPrivacy, setShowPrivacy] = React.useState(false);
  const [showTerms, setShowTerms] = React.useState(false);
  const affiliates = useAffiliates();
  useSEO(tab);

  const count = cart.reduce((a, i) => a + i.qty, 0);
  const add = (id: string) => { setCart(c => (c.find(x => x.id === id) ? c.map(x => x.id === id ? { ...x, qty: x.qty + 1 } : x) : [...c, { id, qty: 1 }])); setCartOpen(true); };

  const Logo = () => (
    <div className="flex items-center gap-2">
      <Img src="/img/logo.svg" alt="KidPrint" className="h-7 w-7 object-contain" />
      <span className="font-black">KidPrint</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0b0e]/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <button className="text-left" onClick={() => setTab("home")} aria-label="KidPrint home">
            <Logo />
          </button>
          <nav className="hidden items-center gap-2 md:flex">
            {(["home", "shop", "bundles", "stls", "learn"] as const).map(t => (
              <button key={t} className={cx("rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-semibold hover:bg-white/10", tab === t && "bg-white/15")} onClick={() => setTab(t)}>
                {t === "stls" ? "STL Library" : t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href={mailto("hello@kidprint3d.com","Hello from KidPrint visitor")} className="hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 md:inline-flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email us
            </a>
            <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-semibold hover:bg-white/10" onClick={() => setCartOpen(true)}>
              <ShoppingCart className="h-4 w-4" /> Cart ({count})
            </button>
          </div>
        </div>
      </header>

      {tab === "home" && (<><HeroSlider goTab={(v) => setTab(v)} /><TrustBar /><FAQ /></>)}
      {tab === "shop" && <Shop onAdd={add} links={affiliates} />}
      {tab === "bundles" && <Bundles links={affiliates} />}
      {tab === "stls" && <STLPage />}
      {tab === "learn" && (
        <section className="mx-auto max-w-5xl px-6 py-12">
          <h2 className="mb-2 text-3xl font-extrabold">Parents & Teachers</h2>
          <p className="mb-6 text-white/80">Plain-English guidance for home and classroom use.</p>
          <ul className="grid list-none grid-cols-1 gap-4 md:grid-cols-2">
            {[
              { t: "Quickstart (10 minutes)", d: "Unbox, auto-level, load PLA, first print Benchy." },
              { t: "Safety basics", d: "Supervision, enclosed printers, PLA only, ventilation, bed temps." },
              { t: "Classroom setup", d: "Traffic flow, signage, roles, cleanup checklist." },
              { t: "Print settings", d: "Layer 0.2mm, 15% infill, supports only when needed." },
            ].map(x => (
              <li key={x.t} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="font-semibold">{x.t}</div>
                <div className="text-sm text-white/80">{x.d}</div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a onClick={printSafetyCards} className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white hover:bg-white/10">
              <ClipboardCheck className="h-4 w-4"/> Print Safety Cards
            </a>
            <a href={mailto("hello@kidprint3d.com","School pricing request","Tell us your school name, quantity, and timeframe.")} className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-black hover:bg-emerald-400">
              <Mail className="h-4 w-4" /> Email school pricing
            </a>
          </div>
        </section>
      )}

      <footer className="border-t border-white/10 py-8 text-center text-sm text-white/70">
        <div className="mx-auto max-w-7xl px-6">
          © {new Date().getFullYear()} KidPrint • hello@kidprint3d.com
          <div className="mt-2 text-xs text-white/60">
            Disclosure: As an Amazon Associate we earn from qualifying purchases. Some “Buy” links are affiliate links.
            <span className="mx-2">•</span>
            <button className="underline" onClick={() => setShowPrivacy(true)}>Privacy</button>
            <span className="mx-2">•</span>
            <button className="underline" onClick={() => setShowTerms(true)}>Terms</button>
          </div>
        </div>
      </footer>

      {/* Cart drawer */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/50" onClick={() => setCartOpen(false)} />
            <motion.aside initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }} transition={{ type: "tween", duration: 0.25 }}
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-zinc-900 text-white shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 p-4">
                <h3 className="text-lg font-semibold">Your Cart</h3>
                <button className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10" onClick={() => setCartOpen(false)} aria-label="Close"><X className="h-5 w-5" /></button>
              </div>
              <div className="flex h-[calc(100%-140px)] flex-col gap-3 overflow-auto p-4">
                {cart.length === 0 && <p className="text-sm text-zinc-300">Your cart is empty.</p>}
                {cart.map(it => {
                  const p = PRODUCTS.find(x => x.id === it.id)!;
                  return (
                    <div key={it.id} className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-sm text-zinc-300">{it.qty} × {currency(p.price)}</div>
                      </div>
                      <button className="rounded-lg border border-white/10 px-2 py-1 text-sm hover:bg-white/10" onClick={() => setCart(c => c.filter(x => x.id !== it.id))}>Remove</button>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-white/10 p-4">
                <button className="w-full rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-black hover:bg-emerald-400">Checkout (demo)</button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy modal */}
      <AnimatePresence>
        {showPrivacy && (
          <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowPrivacy(false)} />
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              className="absolute left-1/2 top-20 w-[92vw] max-w-xl -translate-x-1/2 rounded-2xl border border-white/10 bg-zinc-900 p-5 text-sm">
              <div className="mb-2 flex items-center justify-between"><div className="text-lg font-semibold">Privacy</div><button onClick={() => setShowPrivacy(false)} className="rounded-md border border-white/10 px-2 py-1">Close</button></div>
              <p className="text-white/80">We don’t sell personal data. If you email us, we use your email only to reply. For analytics we recommend privacy-friendly Cloudflare Web Analytics. Request deletion anytime: hello@kidprint3d.com.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terms modal */}
      <AnimatePresence>
        {showTerms && (
          <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowTerms(false)} />
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              className="absolute left-1/2 top-20 w-[92vw] max-w-xl -translate-x-1/2 rounded-2xl border border-white/10 bg-zinc-900 p-5 text-sm">
              <div className="mb-2 flex items-center justify-between"><div className="text-lg font-semibold">Terms</div><button onClick={() => setShowTerms(false)} className="rounded-md border border-white/10 px-2 py-1">Close</button></div>
              <p className="text-white/80">All content provided “as-is.” Always supervise kids around printers. Use PLA for school/home. Some links are affiliate links; they do not change our recommendations.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
