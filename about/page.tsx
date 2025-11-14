'use client';

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import React, { useEffect, useState, useRef } from "react";
import { LinkPreview } from "@/components/ui/link-preview";


// --- CONSTANTS ---
const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

// --- COMPONENTS ---

// 1. FloatingNav Component (EDITED to accept scrollTarget)
function FloatingNav({ scrollTarget }: { scrollTarget: React.RefObject<HTMLElement> }) {
  // Use scrollY tracking the custom container
  const { scrollY } = useScroll({ container: scrollTarget });
  const [elevated, setElevated] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    setElevated(y > 8);

    const diff = y - lastY;
    const delta = Math.abs(diff);
    if (delta > 5) {
      if (diff > 0) {
        setHidden(y > 80);
      } else {
        setHidden(false);
      }
    }
    setLastY(y);
  });

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="fixed left-1/2 top-4 z-[1000] -translate-x-1/2"
    >
      <motion.div
        animate={{
          boxShadow: elevated
            ? "0 10px 30px rgba(0,0,0,0.35)"
            : "0 2px 10px rgba(0,0,0,0.15)",
          opacity: hidden ? 0 : 1,
          y: hidden ? -100 : 0,
        }}
        transition={{ duration: 0.25 }}
        className="flex items-center gap-2 rounded-full border border-white/20 dark:border-black/90 bg-transparent px-3 py-2 text-sm text-white shadow-lg "
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full px-3 py-1 text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/cv"
          className="ml-1 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-white/90 transition hover:bg-cyan-500/20"
        >
          Resume
        </Link>
      </motion.div>
    </motion.nav>
  );
}


// 2. ScrollIndicatorDots Component (Unchanged)
const ScrollIndicatorDots = ({
  count,
  activeIndex,
  onDotClick,
}: {
  count: number;
  activeIndex: number;
  onDotClick: (index: number) => void;
}) => {
  return (
    <div className="fixed right-4 top-1/2 z-[999] -translate-y-1/2 flex flex-col space-y-3 p-2">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`
            w-3 h-3 rounded-full transition-all duration-300 ease-in-out 
            ${index === activeIndex ? 'bg-white scale-125 shadow-md' : 'bg-white/40 hover:bg-white/70'}
          `}
          aria-label={`Go to section ${index + 1}`}
        />
      ))}
    </div>
  );
};


// 3. PageSection Component (EDITED for responsiveness and motion.div)
function PageSection({ item }: { item: any }) {
  const titleClass = item.textColorClass || 'text-white';
  const descriptionClass = item.textColorClass
    ? item.textColorClass.replace('text-', 'text-opacity-70 text-')
    : 'text-slate-300';

  return (
    <section
      className={`
        relative flex h-[100dvh] w-full 
        snap-start 
        flex-col lg:flex-row              /* Responsive: stack on mobile, row on desktop */
        items-center justify-center 
        gap-10 p-8 md:p-12 lg:p-16        /* Responsive padding/gap */
      `}
      style={{
        background: item.bgClass,
      }}
    >
      {/* Column 1: Text Content */}
      <div className="w-full lg:w-1/2 max-w-lg lg:max-w-2xl text-center lg:text-left">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className={`text-3xl md:text-4xl font-bold ${titleClass}`}
        >
          {item.title}
        </motion.h2>
        <motion.div  /* FIX: motion.div used instead of motion.p for better DOM structure with LinkPreview */
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className={`text-base md:text-lg mt-7 max-w-full ${descriptionClass}`}
        >
          {item.description}
        </motion.div>
      </div>

      {/* Column 2: Image/React Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
        className="
          w-full h-1/2                   /* Responsive size for mobile */
          max-w-sm md:max-w-md lg:w-96 lg:h-96  /* Desktop size constraints */
        "
      >
        {item.content ?? null}
      </motion.div>
    </section>
  );
}


// 4. AboutPage Component (Main)
export default function AboutPage() {
  const mainRef = useRef<HTMLElement>(null);
  const [activeCard, setActiveCard] = useState(0);

  // --- COLORFUL SPACE DUST (NEBULA) THEME (Multi-Chromatic Whirlpool) ---
  const pageGradients = [
    // 1st Section: Violet Base
    "linear-gradient(to bottom right, #160A1D, #2B143A)",
    // 2nd Section: Purple-Cyan Blend
    "linear-gradient(to bottom right, #4A0D4A, #1E4D4D)",
    // 3rd Section: Electric Swirl (Purple, Green, Yellow-Green)
    "linear-gradient(to bottom right, #3D004D, #006666, #808000)",
    // 4th Section: Fuchsia Stream (Vibrant Magenta/Pink)
    "linear-gradient(to bottom right, #660066, #993399)",
    // 5th Section: Dark Fade (Return to Deep Black)
    "linear-gradient(to bottom right, #0A0A0A, #1F1F1F)",
  ];

  // --- CONTENT ARRAY (WITH LINKPREVIEW and Image Container Fixes) ---
  const content = [
    {
      title: "Who Am I?",
      description:
        <>
          I am <b>Chinmay Patil</b>, born in <b>India</b>, BSC IT graduate batch - <b>2018</b>, and I began my professional experience in the same year. Like everyone else, I had no idea how things worked in a professional atmosphere.<br></br>
          <br></br>
          Since then, I've had numerous opportunities to learn and explore new things while working with some of the industry's greatest start-ups and mentors. <br></br>
          <br></br>
          Scroll down ↓  to learn more about me.</>,

      bgClass: pageGradients[0],
      textColorClass: 'text-white',
      content: (
        <div
          className="
        relative w-full h-full  /* FIX: w-full h-full */
        overflow-hidden
        rounded-md 
        shadow-[0_30px_50px_rgba(0,0,0,0.8)]
        ">
          <Image
            src="/images/profile.JPG"
            alt="Chinmay Patil"
            fill
            className="object-cover w-full h-full rounded-md"
            sizes="(max-width: 1024px) 50vw, 30vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transprent/10" />
        </div>
      ),
    },
    {
      title: "The Master’s",
      description: <>Moving to Ireland to pursue my MSc in Business Analytics was a turning point — it reshaped how I think about data, teamwork, and impact. <br></br> <br></br> At Maynooth University, I worked on multiple client projects like <b>Age Friendly Ireland(AFI) and Res4City</b>, applying analytics to real-world sustainability and policy challenges.<br></br> <br></br> These experiences deepened my understanding of AI, machine learning, and BI tools like Tableau, RapidMiner, and Python — and taught me how to make insights readable to produce profitable outputs.</>,
      bgClass: pageGradients[1],
      textColorClass: 'text-white',
      content: (
        <div className="relative w-full h-full overflow-visible rounded-md border border-white/50 shadow-[0_20px_80px_rgba(0,0,0,0.9)]"> {/* FIX: w-full h-full */}
          <Image
            src="/images/Masters_1.png"
            alt="Master’s at Maynooth — learning and projects"
            fill
            className="object-cover w-full h-full rounded-md"
            sizes="(max-width: 1024px) 40vw, 20vw"
          />
          <div className="absolute inset-00 bg-gradient-to-t from-black/10 via-black/10 to-transparent" />
        </div>
      ),
    },
    {
      title: "Life",
      description: <>
        I’m someone who enjoys building, learning, and reflecting. My happy space usually involves coffee, some code, and a playlist of calm beats.<br></br> <br></br> Outside work, I explore mythology, photography, and the art of storytelling — whether it’s through words, visuals, or analytics. <br></br><br></br><b> 'Its always about the prespective'. This is what I belive and it helps me shape my life well.</b></>,
      bgClass: pageGradients[2],
      textColorClass: 'text-white',
      content: (
        <div className="relative w-full h-full overflow-hidden rounded-md border border-white/10"> {/* FIX: w-full h-full */}
          <Image
            src="/images/Life.png"
            alt="Cozy + tech creative life visual"
            fill
            className="object-cover w-full h-full rounded-md"
            sizes="(max-width: 1024px) 70vw, 40vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        </div>
      ),
    },
    {
      title: "The Journey So Far",
      description: (
        <>
          Before my master’s, I spent 6+ years in the e-commerce and FMCG space — helping brands grow, optimise, and perform better.
          <br /><br />
          • <LinkPreview url="https://www.purplle.com/search?q=plum" className="!text-white font-bold">Purplle.com</LinkPreview> → Here I learned, the difference between good planning and recovering from the bad planning.
          <br />
          • <LinkPreview url="https://www.linkedin.com/company/dunzo-in/posts/?feedView=all" className="!text-white font-bold">Dunzo</LinkPreview> → In retail you always need to find the way out, there is practically no space for excuses here.
          <br />
          • <LinkPreview url="https://www.zomato.com" className="!text-white font-bold">Zomato</LinkPreview> → Just blessed to know how a single ‘Order Now’ button makes the journey till ‘Delivered On-time’.
          <br /><br />
          These experiences taught me speed, structure, and stakeholder empathy — lessons that I now combine with analytics to create value at scale.
        </>),
      bgClass: pageGradients[3],
      textColorClass: 'text-white',
      content: (
        <div className="relative w-full h-full overflow-hidden rounded-md border border-white/10"> {/* FIX: w-full h-full */}
          <Image
            src="/images/The journery so far.png"
            alt="Career journey visual"
            fill
            className="object-cover w-full h-full rounded-md"
            sizes="(max-width: 1024px) 80vw, 50vw"
          />
          <div className="absolute inset-00 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        </div>
      ),
    },
    {
      title: "Where I’m Headed",
      description: <>I want to keep building the bridge between analytics and human experience — making insights easier to understand and decisions more meaningful.<br></br> <br></br> In the longer term, I see myself driving data-led innovation in roles that connect people, processes, and technology — shaping ideas that truly make impact.</>,
      bgClass: pageGradients[4],
      textColorClass: 'text-white',
      content: (
        <div className="relative w-full h-full overflow-hidden rounded-md border border-white/10"> {/* FIX: w-full h-full */}
          <Image
            src="/images/Where am I headed.png"
            alt="Future path visual"
            fill
            className="object-cover w-full h-full rounded-md"
            sizes="(max-width: 1024px) 70vw, 40vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        </div>
      ),
    },
  ];

  // --- SCROLL LOGIC (Unchanged) ---
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = mainRef.current?.scrollTop || 0;
      const vh = window.innerHeight;

      const index = Math.round(scrollY / vh);

      if (index !== activeCard && index >= 0 && index < content.length) {
        setActiveCard(index);
      }
    };

    const mainElement = mainRef.current;
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [activeCard, content.length]);


  const scrollToPage = (index: number) => {
    if (mainRef.current) {
      const vh = window.innerHeight;
      mainRef.current.scrollTo({
        top: index * vh,
        behavior: 'smooth',
      });
      setActiveCard(index);
    }
  };


  return (
    // Add the ref to the main element to track its scroll position
    <main
      ref={mainRef}
      className="
        relative isolate z-0 w-full 
        h-[100dvh] 
        overflow-y-scroll 
        snap-y snap-mandatory
      "
    >
      {/* PASS THE REF TO FLOATINGNAV */}
      <FloatingNav scrollTarget={mainRef} />

      {/* Scroll Indicators */}
      <ScrollIndicatorDots
        count={content.length}
        activeIndex={activeCard}
        onDotClick={scrollToPage}
      />

      {/* Page Sections */}
      {content.map((item, index) => (
        <PageSection key={item.title + index} item={item} />
      ))}
    </main>
  );
}