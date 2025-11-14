"use client";

import React from "react";
// 1. New Import: Replacing Lamp with the new SpotlightBackground component
import SpotlightBackground from "../ui/spotlight";
import WelcomeButton from "./welcomeButton";

// PHRASES kept here for reference, though WelcomeButton uses its own array.
const PHRASES = [
    "WELCOME", "स्वागत है", "स्वागतम्", "স্বাগতম", "வரவேற்கிறோம்", "أهلاً وسهلاً",
    "欢迎", "ようこそ", "환영합니다", "bienvenido", "bienvenue", "willkommen",
];

export default function WelcomeHero() {
    return (
        <section
            id="welcome"
            className="relative flex min-h-[100svh] w-full items-center justify-center"
            role="region"
            aria-label="Welcome"
        >
            {/* 2. Using the new SpotlightBackground component */}
            <SpotlightBackground className="min-h-[100svh] flex items-center justify-center">
                <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 pt-28 text-center">

                    {/* Title */}
                    <h1 className="text-balance text-4xl font-semibold leading-tight text-white md:text-6xl">
                    </h1>

                    {/* Subtitle */}
                    <p className="max-w-prose text-pretty text-base text-slate-300 md:text-lg">
                        Hi, I am Chinmay Patil.
                    </p>

                    {/* Welcome CTA with rotating text */}
                    <WelcomeButton className="mt-6" />

                    {/* Scroll hint */}
                    <div
                        aria-hidden="true"
                        className="mt-10 animate-pulse text-xs uppercase tracking-widest text-blue-300/70"
                    >
                        CLICK HERE ↑
                    </div>
                </div>
            </SpotlightBackground>
        </section>
    );
}