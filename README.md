
 Portfolio MindTree

An Interactive Mind-Map Portfolio built with Next.js + Framer Motion

Portfolio MindTree is a reimagined personal portfolio experience — transforming a traditional website into a fully interactive mind-map.
Every section of the portfolio is represented as a node, animated with smooth curves, micro-interactions, and dynamic layout logic.

Instead of scrolling through pages, the user explores you.

⸻

 Demo

Coming soon — deployed version link will be added here.

⸻

Features

 Interactive Explore Hub

A central hub that expands into four primary branches:
	•	About
	•	Projects
	•	Resume
	•	Contact

Each node:
	•	Animates outward
	•	Connects via curved SVG paths
	•	Reacts to hover with color-matched glow + icon micro-rotation
	•	Offers smooth placement / retract animations

⸻

 Contact Micro-Hub

Clicking Contact reveals a second layer of child-nodes:
	•	Leave a Message (contact form)
	•	GitHub
	•	LinkedIn
	•	Gmail

Child nodes:
	•	Fan out around the Contact node
	•	Use animated connection curves
	•	Have gradient badges & glow effects
	•	Appear with staggered reveal motion

⸻

Animated Link System

Custom <MindMapLink /> component provides:
	•	Ambient glow layer
	•	Gradient primary stroke
	•	Hover-activated particle trail
	•	Curve shaping with curveFactor
	•	Draw-in / draw-out animations (pathLength)

Super lightweight and GPU-friendly.

⸻

 Visual / Motion Design
	•	Sparkle background effect
	•	Tailwind + glassmorphism styling
	•	Icon rotation animations
	•	Color-coded nodes
	•	Smooth motion timings driven by Framer Motion
	•	Compact, snappy micro-interactions
	•	Highly responsive layout

⸻

Tech Stack

Layer	Technology
Framework	Next.js 14 (App Router)
UI / Styling	Tailwind CSS, Glass effects, Gradients
Animations	Framer Motion, custom SVG animations
Icons	Lucide React
Background Effects	Custom SparklesCore
Node Logic	React Hooks, useMemo, useCallback


⸻

Project Structure

app/
  components/
    mindmap/
      MindMapStage1.tsx       # Main interactive map
      MindMapLink.tsx         # SVG curve renderer + effects
      types.ts                # Shared node/edge typings
    ui/
      sparkles.tsx            # Background sparkle engine

  components/about/           # About section
  components/projects/        # Projects section
  components/contact/         # Contact form
  components/cv/              # Resume display

public/
  assets/                     # Images, icons, etc.

README.md


⸻

 Running Locally

Install dependencies:

npm install

Start dev server:

npm run dev

Build for production:

npm run build

Preview production build:

npm start


⸻

Roadmap
	•	Add multi-project sub-nodes (project clusters)
	•	Pan/zoom camera controls
	•	Email API route (Resend / Nodemailer)
	•	Themed skins (Festival mode, Neon mode)
	•	Blog micro-map
	•	Dynamic node editor (visual config UI)

⸻

 Contributing

Open to ideas, improvements, and creative extensions.
Feel free to fork, PR, or raise issues.

⸻

Author

Chinmay Patil
Building interactive portfolios, data stories, and AI-augmented products.

LinkedIn:
https://linkedin.com/in/chinmay-patil-055a41104

⸻

 License

This project is open for personal use and educational purposes.
For commercial use, please request permission or attribution.

Just say the word.
