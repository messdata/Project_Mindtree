// "use client"

// import Script from "next/script"
// import WelcomeButton from "./welcome/welcomeButton"
// import ScrollHint from "./ui/microComp"
// import { useEffect, useRef, useState } from 'react'; // ⬅️ Import useEffect, useRef, useState


// declare global {
//   interface Window {
//     VANTA?: any
//     THREE?: typeof import("three");
//   }
// }

// export default function Background() {
//   const vantaRef = useRef<HTMLDivElement>(null); // ⬅️ Use ref for the target element
//   const [vantaEffect, setVantaEffect] = useState<any>(null); // State to hold the Vanta instance
//   const [threeReady, setThreeReady] = useState(false)
//   const [vantaReady, setVantaReady] = useState(false)

//   useEffect(() => {
//     if (typeof window === 'undefined') return
//     if (!threeReady || !vantaReady) return
//     if (vantaEffect || !vantaRef.current) return

//     const effect = window.VANTA?.NET?.({
//       el: vantaRef.current,
//       mouseControls: true,
//       touchControls: true,
//       gyroControls: false,
//       minHeight: 200.0,
//       minWidth: 200.0,
//       scale: 1.0,
//       scaleMobile: 1.0,
//       color: 0x392123,
//       backgroundColor: 0x000000,
//       points: 11.0,
//       maxDistance: 23.0,
//       spacing: 12.0,
//       THREE: window.THREE,
//     })

//     setVantaEffect(effect)

//     return () => {
//       try { effect?.destroy?.() } catch { }
//     }
//   }, [threeReady, vantaReady, vantaEffect])

//   return (<>
//     {/* 1. Load Three.js (Must be first) */}
//     <Script
//       src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
//       strategy="beforeInteractive" // ⬅️ Load early to ensure it's defined
//       onLoad={() => setThreeReady(true)}
//     />

//     {/* 2. Load VANTA (Must be second) */}
//     <Script
//       src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"
//       strategy="beforeInteractive" // ⬅️ Load early
//       onLoad={() => setVantaReady(true)}
//     />

//     <div
//       ref={vantaRef} // ⬅️ Use the ref here
//       id="animate-bg" // Keep ID for fallback/debugging
//       className="min-h-dvh w-full relative flex items-center justify-center text-white bg-black"
//     >
//       <WelcomeButton />
//       <ScrollHint />
//     </div>
//   </>
//   )
// }