// src/locales/translations.ts

export type Language = "en" | "bn";

export const translations = {
  en: {
    brand: "RBAC Auth",
    nav: {
      home: "Home",
      about: "About",
      gallery: "Gallery",
      notice: "Notice",
      contact: "Contact",
      login: "Login",
      signup: "Sign Up",
      logout: "Log Out",
    },
    hero: {
      title: "Secure Access Management",
      subtitle: "Enterprise-grade role-based access control built for scale.",
      getStarted: "Get Started",
      learnMore: "Learn More",
    },
    features: {
      title: "Key Features",
      subtitle:"Everything you need to secure your users, roles, and administrative routes.",
      list: [
        { title: "Biometric Auth", desc: "Passkey and WebAuthn integration." },
        { title: "Encryption", desc: "End-to-end zero-knowledge security." },
        { title: "Role Management", desc: "Granular access control policies." },
      ],
    },
    whyUs: {
      title: "Why Choose Us",
      ai: { title: "AI Powered", desc: "Automated threat monitoring." },
      speed: { title: "Ultra Fast", desc: "Low-latency auth verification." },
      api: { title: "REST & GraphQL", desc: "Seamless developer experience." },
      custom: { title: "Customizable", desc: "Adaptable to enterprise needs." },
    },
    cta: {
      title: "Ready to upgrade your security?",
      subtitle: "Join thousands of teams securing their applications today.",
      button: "Create Free Account",
    },
    dashboard: {
      sidebar: ["Overview", "Profile", "Settings"],
      tab1: "Welcome to your security dashboard overview.",
      tab2: "Manage your account credentials and personal details.",
      tab3: "Configure system preferences and notification settings.",
    },
  },
  bn: {
    brand: "আরবিএসি অথ",
    nav: {
      home: "হোম",
      about: "আমাদের সম্পর্কে",
      gallery: "গ্যালারি",
      notice: "নোটিশ",
      contact: "যোগাযোগ",
      login: "লগইন",
      signup: "সাইন আপ",
      logout: "লগআউট",
    },
    hero: {
      title: "নিরাপদ অ্যাক্সেস ম্যানেজমেন্ট",
      subtitle: "সহজ ও নিরাপদ রোল-ভিত্তিক অ্যাক্সেস কন্ট্রোল সিস্টেম।",
      getStarted: "শুরু করুন",
      learnMore: "আরও জানুন",
    },
    features: {
      title: "মূল বৈশিষ্ট্যসমূহ",
      subtitle:"আপনার ব্যবহারকারী, রোল এবং প্রশাসনিক রুটগুলোকে সুরক্ষিত করার জন্য প্রয়োজনীয় সবকিছু।",
      list: [
        { title: "বায়োমেট্রিক অথ", desc: "পাসকি এবং ওয়েব-অথেন সমর্থন।" },
        { title: "এন্ক্রিপশন", desc: "সম্পূর্ণ নিরাপদ এন্ড-টু-এন্ড সিকিউরিটি।" },
        { title: "রোল ম্যানেজমেন্ট", desc: "সঠিক ব্যবহারকারী অনুমতি ব্যবস্থাপনা।" },
      ],
    },
    whyUs: {
      title: "কেন আমাদের বেছে নেবেন",
      ai: { title: "এআই চালিত", desc: "স্বয়ংক্রিয় হুমকি পর্যবেক্ষণ।" },
      speed: { title: "দ্রুতগতি সম্পন্ন", desc: "দ্রুততম অথেনটিকেশন প্রসেস।" },
      api: { title: "এপিআই সাপোর্ট", desc: "সহজ ডেভেলপার ইন্টিগ্রেশন।" },
      custom: { title: "কাস্টমাইজযোগ্য", desc: "আপনার চাহিদা অনুযায়ী সাজান।" },
    },
    cta: {
      title: "নিরাপত্তা উন্নত করতে প্রস্তুত?",
      subtitle: "আজই যুক্ত হন আমাদের প্ল্যাটফর্মে।",
      button: "ফ্রি অ্যাকাউন্ট তৈরি করুন",
    },
    dashboard: {
      sidebar: ["ওভারভিউ", "প্রোফাইল", "সেটিংস"],
      tab1: "আপনার সিকিউরিটি ড্যাশবোর্ডে স্বাগতম।",
      tab2: "আপনার ব্যক্তিগত তথ্য ও প্রোফাইল পরিচালনা করুন।",
      tab3: "সিস্টেমের পছন্দসমূহ এবং সেটিংস নিয়ন্ত্রণ করুন।",
    },
  },
} as const;