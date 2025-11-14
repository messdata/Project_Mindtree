"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Github, Linkedin, Mail, MessageCircle, ArrowRight } from "lucide-react";

// --- Animated Form Field Component ---

type FormFieldProps = {
    label: string;
    id: string;
    name: string;
    type: "text" | "email" | "select" | "textarea";
    placeholder: string;
    required: boolean;
    value: string;
    onChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => void;
    options?: { value: string; label: string }[];
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const AnimatedFormField: React.FC<FormFieldProps> = ({
    label,
    id,
    name,
    type,
    placeholder,
    required,
    value,
    onChange,
    options,
}) => {
    let InputElement: React.ElementType = "input";
    const baseClasses =
        "w-full rounded-lg border border-neutral-700/50 bg-neutral-900/30 backdrop-blur-sm px-4 py-3 text-sm text-neutral-100 outline-none ring-0 transition duration-300 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 hover:border-neutral-600/50 placeholder:text-neutral-600";
    const labelClasses =
        "text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 transition duration-300";

    if (type === "textarea") {
        InputElement = "textarea";
    } else if (type === "select") {
        InputElement = "select";
    }

    return (
        <motion.div variants={itemVariants} className="space-y-2">
            <label htmlFor={id} className={labelClasses}>
                {label}
            </label>
            <motion.div
                className="relative"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
            >
                <InputElement
                    id={id}
                    name={name}
                    type={type === "email" || type === "text" ? type : undefined}
                    required={required}
                    value={value}
                    onChange={onChange}
                    className={baseClasses}
                    placeholder={placeholder}
                    rows={type === "textarea" ? 5 : undefined}
                >
                    {type === "select" && options
                        ? options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))
                        : null}
                </InputElement>
                {/* Animated border glow on focus */}
                <motion.div
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileFocus={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        background: "radial-gradient(circle at top right, rgba(6, 182, 212, 0.1), transparent 60%)",
                    }}
                />
            </motion.div>
        </motion.div>
    );
};

// --- Contact Card Component (for social links) ---

type ContactCardProps = {
    icon: React.ReactNode;
    label: string;
    value: string;
    href: string;
    isEmail?: boolean;
    index: number;
};

const ContactCard: React.FC<ContactCardProps> = ({
    icon,
    label,
    value,
    href,
    isEmail = false,
    index,
}) => {
    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 20, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: "easeOut",
                delay: 0.3 + index * 0.08,
            },
        },
        hover: {
            y: -4,
            boxShadow: "0 20px 25px -5px rgba(6, 182, 212, 0.15)",
            transition: { duration: 0.3 },
        },
    };

    return (
        <motion.a
            href={href}
            target={isEmail ? undefined : "_blank"}
            rel={isEmail ? undefined : "noreferrer"}
            variants={cardVariants}
            whileHover="hover"
            className="group relative overflow-hidden rounded-xl border border-neutral-800/50 bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 p-6 backdrop-blur-sm transition duration-300 hover:border-cyan-400/30 cursor-pointer"
        >
            {/* Background gradient on hover */}
            <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500"
                style={{
                    background: "radial-gradient(circle at top right, rgba(6, 182, 212, 0.1), transparent 70%)",
                }}
            />

            <div className="relative z-10 flex items-center gap-4">
                <motion.div
                    className="flex-shrink-0"
                    whileHover={{ scale: 1.1, rotate: 6 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 text-cyan-300 transition group-hover:from-cyan-500/30 group-hover:to-emerald-500/30">
                        {icon}
                    </div>
                </motion.div>

                <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 group-hover:text-neutral-400 transition">
                        {label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-neutral-100 truncate group-hover:text-cyan-300 transition">
                        {value}
                    </p>
                </div>

                <motion.div
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition"
                    initial={{ x: 4, opacity: 0 }}
                    whileHover={{ x: 8 }}
                >
                    <ArrowRight size={18} className="text-cyan-400" />
                </motion.div>
            </div>

            {/* Animated bottom border */}
            <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 via-emerald-400 to-indigo-400"
                initial={{ width: "0%" }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.5 }}
            />
        </motion.a>
    );
};

// --- Main Contact Page Component ---

export default function ContactPage() {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        topic: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call delay
        setTimeout(() => {
            console.log("Contact form submitted:", formState);
            setSubmitSuccess(true);

            setFormState({
                name: "",
                email: "",
                topic: "",
                message: "",
            });

            // Reset success message after 3 seconds
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 3000);

            setIsSubmitting(false);
        }, 1200);
    };

    const containerVariants: Variants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.08,
            },
        },
    };

    const selectOptions = [
        { value: "", label: "Select a topic" },
        { value: "role-opportunity", label: "Role / Opportunity" },
        { value: "project-collab", label: "Project collaboration" },
        { value: "portfolio-feedback", label: "Portfolio feedback" },
        { value: "data-discussion", label: "Data / Analytics discussion" },
        { value: "other", label: "Something else" },
    ];

    const contactCards = [
        {
            icon: <Mail size={20} />,
            label: "Email",
            value: "chinmay.patil@example.com",
            href: "mailto:chinmay.patil@example.com",
            isEmail: true,
        },
        {
            icon: <Linkedin size={20} />,
            label: "LinkedIn",
            value: "chinmay-patil",
            href: "https://www.linkedin.com/in/chinmay-patil-055a41104/",
        },
        {
            icon: <Github size={20} />,
            label: "GitHub",
            value: "messdata",
            href: "https://github.com/messdata",
        },
    ];

    // Header animation variants
    const headerVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    const subheaderVariants: Variants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: 0.1, ease: "easeOut" },
        },
    };

    return (
        <main className="relative min-h-screen bg-neutral-950 text-neutral-100 overflow-hidden">

            {/* Animated gradient orbs */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0.3, 0.5, 0.3], scale: [0.8, 1.1, 0.8] }}
                transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-900/20 to-emerald-900/20 rounded-full blur-3xl pointer-events-none"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0.2, 0.4, 0.2], scale: [0.9, 1.2, 0.9] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-1/3 -left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-900/20 to-cyan-900/20 rounded-full blur-3xl pointer-events-none"
            />

            <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-16 md:px-8 lg:px-12">

                {/* HEADER SECTION */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={headerVariants}
                    className="mb-4"
                >
                    <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
                        Contact
                    </p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={subheaderVariants}
                    className="mb-12 max-w-3xl"
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                        Let&apos;s{" "}
                        <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">
                            connect
                        </span>
                        {" "}and{" "}
                        <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                            collaborate
                        </span>
                        .
                    </h1>
                    <p className="mt-6 text-base md:text-lg text-neutral-400 leading-relaxed max-w-2xl">
                        Exploring opportunities in data, analytics, and product thinking. Whether it's a role, a project, or just a conversation—I'm always open to connecting.
                    </p>
                </motion.div>

                {/* MAIN GRID LAYOUT */}
                <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] flex-1">

                    {/* LEFT: CONTACT CHANNELS */}
                    <motion.aside
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-4"
                    >
                        <div className="mb-6">
                            <p className="text-xs uppercase tracking-[0.18em] text-neutral-500 mb-4">
                                Quick channels
                            </p>
                        </div>

                        {contactCards.map((card, index) => (
                            <ContactCard
                                key={card.label}
                                {...card}
                                index={index}
                            />
                        ))}

                        {/* Info Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.55 }}
                            className="mt-8 rounded-xl border border-neutral-800/50 bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 p-5 backdrop-blur-sm"
                        >
                            <h3 className="text-sm font-semibold mb-3 text-neutral-100">About me</h3>
                            <p className="text-xs text-neutral-400 leading-relaxed">
                                6+ years in e-commerce &amp; FMCG. Passionate about bridging business, data, and product. Located in Ireland, open to hybrid/remote opportunities.
                            </p>
                            <p className="text-xs text-neutral-500 mt-3">
                                ⏱️ Usually reply within 2-3 business days
                            </p>
                        </motion.div>
                    </motion.aside>

                    {/* RIGHT: CONTACT FORM */}
                    <motion.section
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className="rounded-xl border border-neutral-800/50 bg-gradient-to-br from-neutral-900/50 to-neutral-950/50 p-8 backdrop-blur-sm shadow-2xl shadow-black/20"
                    >
                        <motion.form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >

                            {/* Name Field */}
                            <AnimatedFormField
                                label="Full name"
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formState.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                            />

                            {/* Email Field */}
                            <AnimatedFormField
                                label="Email address"
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formState.email}
                                onChange={handleChange}
                                placeholder="name@company.com"
                            />

                            {/* Topic Select */}
                            <AnimatedFormField
                                label="What's this about?"
                                id="topic"
                                name="topic"
                                type="select"
                                required={false}
                                value={formState.topic}
                                onChange={handleChange}
                                options={selectOptions}
                                placeholder="Select a topic"
                            />

                            {/* Message Field */}
                            <AnimatedFormField
                                label="Your message"
                                id="message"
                                name="message"
                                type="textarea"
                                required
                                value={formState.message}
                                onChange={handleChange}
                                placeholder="Tell me about your project, opportunity, or thoughts..."
                            />

                            {/* Success Message */}
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{
                                    opacity: submitSuccess ? 1 : 0,
                                    height: submitSuccess ? "auto" : 0,
                                }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="rounded-lg border border-emerald-800/50 bg-emerald-900/20 backdrop-blur-sm p-4">
                                    <p className="text-sm text-emerald-300 font-medium">
                                        ✓ Message sent successfully! I'll get back to you soon.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Submit Button */}
                            <motion.div variants={itemVariants} className="pt-2">
                                <motion.button
                                    whileHover={{
                                        y: -2,
                                        boxShadow: "0 20px 25px -5px rgba(6, 182, 212, 0.3)",
                                    }}
                                    whileTap={{ scale: 0.97 }}
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="relative w-full group inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 via-emerald-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-neutral-950 shadow-lg transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
                                >
                                    {/* Animated background gradient shift */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500 opacity-0 group-hover:opacity-100"
                                        transition={{ duration: 0.5 }}
                                    />

                                    <span className="relative flex items-center justify-center">
                                        {isSubmitting ? (
                                            <>
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{
                                                        duration: 1,
                                                        repeat: Infinity,
                                                        ease: "linear",
                                                    }}
                                                    className="mr-2 h-4 w-4 border-2 border-t-transparent border-neutral-950 rounded-full"
                                                />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                Send message
                                                <motion.span
                                                    className="ml-2 inline-block"
                                                    whileHover={{ x: 4 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <ArrowRight size={16} />
                                                </motion.span>
                                            </>
                                        )}
                                    </span>
                                </motion.button>
                            </motion.div>

                            {/* Help text */}
                            <motion.p
                                variants={itemVariants}
                                className="text-xs text-center text-neutral-500"
                            >
                                We'll never share your email. Typically respond within 48 hours.
                            </motion.p>
                        </motion.form>
                    </motion.section>
                </div>
            </section>
        </main>
    );
}