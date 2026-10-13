import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  Banknote,
  Building2,
  ClipboardCheck,
  ClipboardList,
  FileCheck2,
  FileText,
  HardHat,
  KeyRound,
  MapPin,
  MessageCircleMore,
  type LucideIcon,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import "./LandShareJourney.css";

const journeySteps: {
  icon: LucideIcon;
  title: Record<Language, string>;
  description: Record<Language, string>;
}[] = [
  {
    icon: MapPin,
    title: {
      en: "Project Visit & Site Inspection",
      bn: "প্রজেক্ট পরিদর্শন ও জমি দেখা",
    },
    description: {
      en: "Visit the project site and understand the location, surroundings, and accessibility.",
      bn: "প্রকল্পস্থলে সরেজমিনে গিয়ে এলাকার অবস্থান, আশপাশের পরিবেশ, যাতায়াতের সুবিধা এবং প্রকল্পের সামগ্রিক প্রেক্ষাপট সম্পর্কে পরিষ্কার ধারণা নিন।",
    },
  },
  {
    icon: FileCheck2,
    title: {
      en: "Land Document Verification",
      bn: "জমির কাগজপত্র যাচাই",
    },
    description: {
      en: "Have qualified legal and land professionals review ownership, title deeds, land records, and other relevant documents before proceeding.",
      bn: "এগিয়ে যাওয়ার আগে অভিজ্ঞ আইনজীবী ও ভূমি-সংক্রান্ত পেশাজীবীর সহায়তায় মালিকানার তথ্য, স্বত্বের দলিল, ভূমি রেকর্ড এবং অন্যান্য প্রাসঙ্গিক নথি যাচাই করুন।",
    },
  },
  {
    icon: MessageCircleMore,
    title: {
      en: "Share Selection & Consultation",
      bn: "শেয়ার নির্বাচন ও আলোচনা",
    },
    description: {
      en: "Discuss how many shares you wish to take, their price, the ownership terms, payment conditions, and how a flat will be allocated under the project.",
      bn: "কতটি শেয়ার নেবেন, প্রতিটির মূল্য, মালিকানার শর্ত, কিস্তি বা পরিশোধের নিয়ম এবং প্রকল্পে ফ্ল্যাট বরাদ্দের পদ্ধতি—সবকিছু আগেই বিস্তারিত আলোচনা করে নিন।",
    },
  },
  {
    icon: ClipboardList,
    title: {
      en: "Booking Application",
      bn: "বুকিং আবেদন",
    },
    description: {
      en: "Complete the booking application, provide the requested supporting documents, and pay the agreed booking amount. Ask for and keep an official receipt.",
      bn: "বুকিং আবেদনটি যথাযথভাবে পূরণ করে চাওয়া নথিপত্র জমা দিন। সম্মত বুকিং অর্থ পরিশোধের পর অবশ্যই প্রতিষ্ঠানের আনুষ্ঠানিক রসিদ সংগ্রহ করে সংরক্ষণ করুন।",
    },
  },
  {
    icon: FileText,
    title: {
      en: "Agreement & Legal Formalities",
      bn: "চুক্তি ও আইনি আনুষ্ঠানিকতা",
    },
    description: {
      en: "Read and clarify the agreement before signing, then complete the ownership documentation, legal formalities, and registration procedures that apply to your transaction.",
      bn: "স্বাক্ষরের আগে চুক্তির প্রতিটি শর্ত পড়ে বুঝে নিন এবং প্রয়োজনে যোগ্য আইনজীবীর পরামর্শ নিন। এরপর প্রযোজ্য মালিকানা-সংক্রান্ত নথি, আইনি আনুষ্ঠানিকতা ও নিবন্ধন প্রক্রিয়া সম্পন্ন করুন।",
    },
  },
  {
    icon: Banknote,
    title: {
      en: "Installment Payments",
      bn: "কিস্তি পরিশোধ",
    },
    description: {
      en: "Pay installments according to the agreed schedule, keep each receipt and payment record, and check your account regularly to confirm any remaining balance.",
      bn: "সম্মত সময়সূচি অনুযায়ী কিস্তি পরিশোধ করুন। প্রতিটি রসিদ ও লেনদেনের নথি যত্নে রাখুন এবং বকেয়া আছে কি না নিশ্চিত হতে নিয়মিত হিসাব মিলিয়ে নিন।",
    },
  },
  {
    icon: HardHat,
    title: {
      en: "Project Progress Updates",
      bn: "প্রকল্পের অগ্রগতির আপডেট",
    },
    description: {
      en: "Stay informed through official project communications about land development, relevant approvals, and construction milestones as the work progresses.",
      bn: "কাজ এগোনোর সঙ্গে সঙ্গে জমি উন্নয়ন, প্রাসঙ্গিক অনুমোদন এবং নির্মাণের বিভিন্ন পর্যায় সম্পর্কে প্রকল্প কর্তৃপক্ষের আনুষ্ঠানিক আপডেট জেনে রাখুন।",
    },
  },
  {
    icon: Building2,
    title: {
      en: "Flat Allocation",
      bn: "ফ্ল্যাট বরাদ্দ",
    },
    description: {
      en: "The flat is allocated using the method disclosed for the project and recorded in your signed agreement—for example, a lottery or an agreed selection process, where applicable.",
      bn: "প্রকল্পের জন্য আগে থেকে জানানো এবং স্বাক্ষরিত চুক্তিতে উল্লেখিত পদ্ধতিতেই ফ্ল্যাট বরাদ্দ হবে। প্রযোজ্য ক্ষেত্রে এ পদ্ধতিতে লটারি বা পারস্পরিক সম্মতিতে নির্বাচন থাকতে পারে।",
    },
  },
  {
    icon: ClipboardCheck,
    title: {
      en: "Final Inspection & Settlement",
      bn: "চূড়ান্ত পরিদর্শন ও হিসাব নিষ্পত্তি",
    },
    description: {
      en: "Inspect the allocated flat, compare its condition and agreed specifications with your documents, settle any applicable dues, and carefully review the handover paperwork.",
      bn: "বরাদ্দকৃত ফ্ল্যাটটি সরেজমিনে দেখে চুক্তিতে উল্লেখিত বৈশিষ্ট্য ও কাজের সঙ্গে মিলিয়ে নিন। প্রযোজ্য বকেয়া নিষ্পত্তি করে হ্যান্ডওভার-সংক্রান্ত নথিগুলোও ভালোভাবে যাচাই করুন।",
    },
  },
  {
    icon: KeyRound,
    title: {
      en: "Flat Handover",
      bn: "ফ্ল্যাট হ্যান্ডওভার",
    },
    description: {
      en: "Complete the agreed handover formalities, receive the keys and relevant property documents, and confirm how utility connections, shared facilities, and ongoing maintenance will be managed.",
      bn: "সম্মত হ্যান্ডওভার আনুষ্ঠানিকতা সম্পন্ন করে ফ্ল্যাটের চাবি ও প্রাসঙ্গিক নথি বুঝে নিন। ইউটিলিটি সংযোগ, যৌথ সুবিধা এবং পরবর্তী রক্ষণাবেক্ষণের ব্যবস্থাও স্পষ্টভাবে জেনে নিন।",
    },
  },
];

const copy: Record<
  Language,
  {
    title: string;
    description: string;
    eyebrow: string;
    processEyebrow: string;
    ctaEyebrow: string;
    languageSwitcherLabel: string;
    explore: string;
    processTitle: string;
    processDescription: string;
    stepLabel: string;
    progressLabel: string;
    progressValue: (step: number, total: number) => string;
    legalNote: string;
    ctaTitle: string;
    projects: string;
    contact: string;
  }
> = {
  en: {
    title: "From Land Share Booking to Flat Handover",
    description:
      "A clear, considered guide to each step of your property journey with DADL—from your first site visit to receiving the keys.",
    eyebrow: "Your property journey",
    processEyebrow: "THE JOURNEY",
    ctaEyebrow: "YOUR NEXT CHAPTER",
    languageSwitcherLabel: "Select page language",
    explore: "Explore the Process",
    processTitle: "A considered process, every step of the way",
    processDescription:
      "Get to know the key stages of a land share journey. Your project documents and signed agreement remain the source of the actual terms.",
    stepLabel: "STEP",
    progressLabel: "Your journey",
    progressValue: (step, total) => `Step ${step} of ${total}`,
    legalNote:
      "Actual terms, processes, and obligations depend on the signed agreement and applicable law.",
    ctaTitle: "Ready to Start Your Property Journey?",
    projects: "Explore Our Projects",
    contact: "Contact DADL",
  },
  bn: {
    title: "জমির শেয়ার বুকিং থেকে ফ্ল্যাট হ্যান্ডওভার পর্যন্ত",
    description:
      "DADL-এর সঙ্গে আপনার সম্পত্তির যাত্রার প্রতিটি ধাপের একটি সুস্পষ্ট নির্দেশিকা—প্রথমবার প্রকল্প পরিদর্শন থেকে চাবি বুঝে নেওয়া পর্যন্ত।",
    eyebrow: "আপনার সম্পত্তির যাত্রা",
    processEyebrow: "যাত্রাপথ",
    ctaEyebrow: "আপনার নতুন অধ্যায়",
    languageSwitcherLabel: "পেজের ভাষা নির্বাচন করুন",
    explore: "প্রক্রিয়াটি দেখুন",
    processTitle: "প্রতিটি ধাপে সুপরিকল্পিত প্রক্রিয়া",
    processDescription:
      "জমির শেয়ার থেকে ফ্ল্যাট পাওয়ার যাত্রার গুরুত্বপূর্ণ ধাপগুলো জেনে নিন। প্রকৃত শর্তাবলির জন্য আপনার প্রকল্পের নথি ও স্বাক্ষরিত চুক্তিই প্রযোজ্য।",
    stepLabel: "ধাপ",
    progressLabel: "আপনার যাত্রা",
    progressValue: (step, total) => `${total}টির মধ্যে ${step} নম্বর ধাপ`,
    legalNote:
      "প্রকৃত শর্তাবলি, প্রক্রিয়া ও দায়বদ্ধতা স্বাক্ষরিত চুক্তি এবং প্রযোজ্য আইনের ওপর নির্ভরশীল।",
    ctaTitle: "আপনার সম্পত্তির যাত্রা শুরু করতে প্রস্তুত?",
    projects: "আমাদের প্রকল্পগুলো দেখুন",
    contact: "DADL-এর সঙ্গে যোগাযোগ করুন",
  },
};

const LandShareJourney = () => {
  const { language, setLanguage } = useLanguage();
  const t = copy[language];
  const timelineRef = useRef<HTMLOListElement>(null);
  const [revealedSteps, setRevealedSteps] = useState<Set<number>>(
    () => new Set(),
  );
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const items = Array.from(
      timeline.querySelectorAll<HTMLElement>("[data-journey-step]"),
    );

    if (reducedMotion || !("IntersectionObserver" in window)) {
      setRevealedSteps(new Set(items.map((_, index) => index)));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        setRevealedSteps((current) => {
          const next = new Set(current);
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              next.add(Number((entry.target as HTMLElement).dataset.journeyStep));
            }
          });
          return next;
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const activeObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top - window.innerHeight * 0.4) -
              Math.abs(b.boundingClientRect.top - window.innerHeight * 0.4),
          );
        if (visible[0]) {
          setActiveStep(Number((visible[0].target as HTMLElement).dataset.journeyStep));
        }
      },
      { rootMargin: "-28% 0px -58% 0px", threshold: 0 },
    );

    items.forEach((item) => {
      revealObserver.observe(item);
      activeObserver.observe(item);
    });

    return () => {
      revealObserver.disconnect();
      activeObserver.disconnect();
    };
  }, []);

  const progress = ((activeStep + 1) / journeySteps.length) * 100;
  const handleExplore = () => {
    document.getElementById("journey-steps")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  };

  return (
    <>
      <Helmet>
        <title>{`${t.title} | DADL`}</title>
        <meta name="description" content={t.description} />
        <link
          rel="canonical"
          href={`${window.location.origin}/land-share-to-handover`}
        />
        <meta property="og:title" content={`${t.title} | DADL`} />
        <meta property="og:description" content={t.description} />
      </Helmet>

      <Navbar />

      <main
        lang={language}
        className={`journey-page${language === "bn" ? " font-bangla" : ""}`}
      >
        <section className="journey-hero">
          <div className="journey-hero-orb journey-hero-orb--one" />
          <div className="journey-hero-orb journey-hero-orb--two" />
          <div className="journey-container journey-hero-content">
            <p className="journey-eyebrow">
              <span className="journey-eyebrow-mark" aria-hidden="true" />
              {t.eyebrow}
            </p>
            <div
              className="journey-language-switcher"
              role="group"
              aria-label={t.languageSwitcherLabel}
            >
              <button
                type="button"
                lang="en"
                aria-pressed={language === "en"}
                onClick={() => setLanguage("en")}
              >
                EN
              </button>
              <span aria-hidden="true">|</span>
              <button
                type="button"
                lang="bn"
                aria-pressed={language === "bn"}
                onClick={() => setLanguage("bn")}
              >
                বাংলা
              </button>
            </div>
            <h1>{t.title}</h1>
            <p className="journey-hero-description">{t.description}</p>
            <button
              type="button"
              className="journey-primary-button"
              onClick={handleExplore}
              aria-label={t.explore}
            >
              {t.explore}
              <ArrowDown size={17} aria-hidden="true" />
            </button>
            <div className="journey-hero-note" aria-hidden="true">
              <span>01</span>
              <span className="journey-hero-note-line" />
              <span>10</span>
            </div>
          </div>
          <span className="journey-hero-side-label" aria-hidden="true">
            DADL · 
          </span>
        </section>

        <section className="journey-process" id="journey-steps">
          <div className="journey-container">
            <header className="journey-section-heading">
              <div>
                <p className="journey-section-kicker">{t.processEyebrow}</p>
                <h2>{t.processTitle}</h2>
                <p className="journey-section-description">
                  {t.processDescription}
                </p>
              </div>
              <div className="journey-progress-card">
                <div className="journey-progress-caption">
                  <span>{t.progressLabel}</span>
                  <strong>
                    {String(activeStep + 1).padStart(2, "0")}
                    <span> / {String(journeySteps.length).padStart(2, "0")}</span>
                  </strong>
                </div>
                <div
                  className="journey-progress-track"
                  role="progressbar"
                  aria-label={t.progressLabel}
                  aria-valuemin={1}
                  aria-valuemax={journeySteps.length}
                  aria-valuenow={activeStep + 1}
                  aria-valuetext={t.progressValue(
                    activeStep + 1,
                    journeySteps.length,
                  )}
                >
                  <span style={{ width: `${progress}%` }} />
                </div>
              </div>
            </header>

            <ol
              className="journey-timeline"
              ref={timelineRef}
              aria-label={t.processTitle}
              style={
                {
                  "--journey-progress-scale": (activeStep + 1) / journeySteps.length,
                } as CSSProperties
              }
            >
              {journeySteps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = activeStep === index;
                const number = String(index + 1).padStart(2, "0");

                return (
                  <li
                    key={step.title.en}
                    id={`journey-step-${index + 1}`}
                    data-journey-step={index}
                    className={`journey-step${revealedSteps.has(index) ? " is-visible" : ""}${isActive ? " is-active" : ""}`}
                  >
                    <span className="journey-step-node" aria-hidden="true">
                      {number}
                    </span>
                    <article className="journey-card">
                      <div className="journey-card-topline">
                        <span className="journey-step-count">
                          {t.stepLabel} {number}
                        </span>
                        <span className="journey-card-icon" aria-hidden="true">
                          <StepIcon size={21} strokeWidth={1.7} />
                        </span>
                      </div>
                      <h3 lang={language}>{step.title[language]}</h3>
                      <p className="journey-card-description" lang={language}>
                        {step.description[language]}
                      </p>
                    </article>
                  </li>
                );
              })}
            </ol>
            <p className="journey-legal-note">
              <BadgeCheck size={17} aria-hidden="true" />
              {t.legalNote}
            </p>
          </div>
        </section>

        <section className="journey-cta">
          <div className="journey-cta-decoration" aria-hidden="true" />
          <div className="journey-container journey-cta-content">
            <p className="journey-section-kicker">
              {t.ctaEyebrow}
            </p>
            <h2>{t.ctaTitle}</h2>
            <div className="journey-cta-actions">
              <Link to="/projects" className="journey-primary-button">
                {t.projects}
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link to="/contact" className="journey-secondary-button">
                {t.contact}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default LandShareJourney;
