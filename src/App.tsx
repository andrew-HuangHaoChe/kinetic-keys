"use client";
import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";

const whiteKeys = [
  { note: "C", hz: 261.63, key: "A" }, { note: "D", hz: 293.66, key: "S" }, { note: "E", hz: 329.63, key: "D" },
  { note: "F", hz: 349.23, key: "F" }, { note: "G", hz: 392, key: "G" }, { note: "A", hz: 440, key: "H" }, { note: "B", hz: 493.88, key: "J" },
];
const blackKeys = [
  { note: "C♯", hz: 277.18, key: "W", left: 10.2 }, { note: "D♯", hz: 311.13, key: "E", left: 24.5 },
  { note: "F♯", hz: 369.99, key: "T", left: 53 }, { note: "G♯", hz: 415.3, key: "Y", left: 67.3 }, { note: "A♯", hz: 466.16, key: "U", left: 81.6 },
];
type AudioWindow = Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };

function cinematicProgress(progress: number) {
  if (progress >= 1) return 1;
  const scenes = 3;
  const position = progress * scenes;
  const scene = Math.floor(position);
  const local = position - scene;
  const moving = Math.max(0, Math.min(1, (local - .2) / .6));
  const eased = moving * moving * (3 - 2 * moving);
  return (scene + eased) / scenes;
}

export default function HomePage() {
  const audioRef = useRef<AudioContext | null>(null);
  const horizontalRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const [scroll, setScroll] = useState(0);
  const [journey, setJourney] = useState(0);
  const cinematicJourney = cinematicProgress(journey);
  const play = (note: string, hz: number) => {
    const AC = window.AudioContext || (window as AudioWindow).webkitAudioContext;
    if (!AC) return;
    const ctx = audioRef.current || new AC(); audioRef.current = ctx; void ctx.resume();
    const osc = ctx.createOscillator(), gain = ctx.createGain(), filter = ctx.createBiquadFilter();
    osc.type = "triangle"; osc.frequency.value = hz; filter.type = "lowpass"; filter.frequency.value = 1800;
    gain.gain.setValueAtTime(.0001, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.24, ctx.currentTime + .018); gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + 1.15);
    osc.connect(filter).connect(gain).connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 1.2);
    setActive(note); window.setTimeout(() => setActive(v => v === note ? null : v), 180);
  };
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, lerp: .06, wheelMultiplier: .72, smoothWheel: true, syncTouch: false });
    const move = (e: PointerEvent) => { const s = document.documentElement.style; s.setProperty("--mx", `${e.clientX}px`); s.setProperty("--my", `${e.clientY}px`); s.setProperty("--nx", `${(e.clientX / innerWidth - .5) * 2}`); s.setProperty("--ny", `${(e.clientY / innerHeight - .5) * 2}`); };
    const scrolling = () => {
      setScroll(scrollY);
      const section = horizontalRef.current;
      if (section) {
        const distance = section.offsetHeight - innerHeight;
        setJourney(Math.max(0, Math.min(1, (scrollY - section.offsetTop) / distance)));
      }
    };
    const keyboard = (e: KeyboardEvent) => { if (e.repeat) return; const k = [...whiteKeys, ...blackKeys].find(x => x.key === e.key.toUpperCase()); if (k) play(k.note, k.hz); };
    addEventListener("pointermove", move); addEventListener("scroll", scrolling, { passive: true }); addEventListener("keydown", keyboard);
    scrolling();
    return () => { lenis.destroy(); removeEventListener("pointermove", move); removeEventListener("scroll", scrolling); removeEventListener("keydown", keyboard); };
  }, []);
  return <main>
    <div className="cursor-dot" aria-hidden="true"/><div className="grain" aria-hidden="true"/>
    <nav><a className="wordmark" href="#top">K／K</a><span>SCROLL STUDY · 01</span><a href="#instrument">PLAY THE KEYS ↘</a></nav>
    <section className="hero" id="top">
      <div className="hero-copy" style={{ transform: `translateY(${scroll * .12}px)` }}><p className="eyebrow">A STUDY IN MOTION & SOUND</p><h1>KINETIC<br/><i>KEYS</i></h1><p className="intro">Scroll slowly. Move freely.<br/>Let shape become rhythm.</p></div>
      <div className="geometry hero-geometry" aria-hidden="true"><span className="orb"/><span className="ring"/><span className="bar"/><span className="diamond"/></div><div className="scroll-cue"><span>SCROLL</span><i/></div>
    </section>
    <section className="transition" aria-label="Motion interlude"><p>01 — SHAPE</p><h2>EVERY MOVEMENT<br/>LEAVES <em>A TRACE.</em></h2><div className="marquee"><span>MOVE · LISTEN · RESPOND · MOVE · LISTEN · RESPOND ·&nbsp;</span><span>MOVE · LISTEN · RESPOND · MOVE · LISTEN · RESPOND ·&nbsp;</span></div><div className="floating-shape fs-one"/><div className="floating-shape fs-two"/></section>
    <section className="sideways" ref={horizontalRef} aria-label="Horizontal geometry journey">
      <div className="sideways-sticky">
        <div className="sideways-track" style={{transform:`translate3d(${-cinematicJourney * 75}%,0,0)`}}>
          <article className="side-panel panel-start"><span>02 — DIRECTION</span><h2 style={{transform:`translate3d(${cinematicJourney*160}px,${cinematicJourney*-45}px,0)`}}>DOWN<br/>BECOMES <i>ACROSS.</i></h2><div className="scene-disc" style={{transform:`translate3d(${cinematicJourney*420}px,${cinematicJourney*-90}px,0) rotate(${cinematicJourney*180}deg)`}}/><p>Keep scrolling ↓</p></article>
          <article className="side-panel panel-run"><span>THE FIRST LEAP</span><div className="huge-index" style={{transform:`translateX(${(cinematicJourney-.33)*-380}px)`}}>01</div><div className="scene-cross" style={{transform:`translate3d(${(cinematicJourney-.33)*420}px,${Math.sin(cinematicJourney*Math.PI*4)*70}px,0) rotate(${cinematicJourney*360}deg)`}}/><p>Momentum turns a square<br/>into a little traveler.</p></article>
          <article className="side-panel panel-glide"><span>GRAVITY / RHYTHM</span><div className="orbit-mark" style={{transform:`translate3d(${(cinematicJourney-.66)*-280}px,${Math.cos(cinematicJourney*Math.PI*3)*55}px,0) rotate(${cinematicJourney*220}deg)`}}/><p>Rise. Fall. Land.<br/>Continue.</p></article>
          <article className="side-panel panel-exit"><span>NEXT — SOUND</span><h2 style={{transform:`translate3d(${(1-cinematicJourney)*-150}px,0,0)`}}>LAND ON<br/><i>THE BEAT.</i></h2><div className="scene-stripe" style={{transform:`translateX(${(1-cinematicJourney)*350}px) rotate(-18deg)`}}/><p>Vertical flow resumes →</p></article>
        </div>
        <div className="platforms" aria-hidden="true"><i/><i/><i/><i/></div>
        <div className="runner" aria-hidden="true" style={{transform:`translate3d(${cinematicJourney * Math.max(0, (typeof window !== "undefined" ? window.innerWidth : 1200) - 180)}px,${-Math.abs(Math.sin(cinematicJourney * Math.PI * 3)) * 155}px,0) rotate(${cinematicJourney * 720}deg)`}}><b>◆</b></div>
        <div className="journey-meter"><span>HORIZONTAL</span><i><b style={{width:`${journey*100}%`}}/></i><strong>{String(Math.round(journey*100)).padStart(2,"0")}</strong></div>
      </div>
    </section>
    <section className="instrument" id="instrument">
      <div className="instrument-head"><div><p>03 — SOUND</p><h2>YOUR TURN<br/>TO <i>PLAY.</i></h2></div><p>Click, tap, or use<br/><b>A–J</b> & <b>W E T Y U</b></p></div>
      <div className="now-playing" aria-live="polite"><span>{active ? "NOW PLAYING" : "AWAITING TOUCH"}</span><strong>{active || "—"}</strong></div>
      <div className="piano" role="group" aria-label="Playable piano keyboard"><div className="white-row">{whiteKeys.map(x => <button key={x.note} onPointerDown={() => play(x.note,x.hz)} className={active===x.note?"pressed":""} aria-label={`Play ${x.note}`}><small>{x.key}</small><span>{x.note}</span></button>)}</div>{blackKeys.map(x => <button key={x.note} onPointerDown={() => play(x.note,x.hz)} style={{left:`${x.left}%`}} className={`black-key ${active===x.note?"pressed":""}`} aria-label={`Play ${x.note}`}><small>{x.key}</small><span>{x.note}</span></button>)}</div>
    </section>
    <section className="finale"><div className="geometry finale-geometry" aria-hidden="true"><span className="orb"/><span className="ring"/><span className="bar"/></div><p>04 — RESONANCE</p><h2>THE SPACE<br/>BETWEEN NOTES<br/><i>IS YOURS.</i></h2><a href="#top">RETURN TO START ↑</a></section>
    <footer><span>KINETIC KEYS © 2026</span><span>DESIGNED FOR PLAY</span></footer>
  </main>;
}
