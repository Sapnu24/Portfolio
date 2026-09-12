import React from "react";
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaBootstrap,
  FaPhp,
  FaLaravel,
  FaDatabase,
  FaGitAlt,
  FaGithub,
  FaWordpress,
  FaDocker,
  FaAws,
  FaNodeJs,
  FaJava,
  FaCode,
  FaLinux,
  FaAndroid,
  FaApple,
  FaSass,
  FaFigma,
} from "react-icons/fa";
import {
  SiPython,
  SiTailwindcss,
  SiTypescript,
  SiNextdotjs,
  SiVite,
  SiFirebase,
  SiFlutter,
  SiDart,
  SiXampp,
  SiVuedotjs,
  SiAngular,
  SiSvelte,
  SiNuxt,
  SiKotlin,
  SiSwift,
  SiPostgresql,
  SiMongodb,
  SiSqlite,
  SiRedis,
  SiSupabase,
  SiGraphql,
  SiExpress,
  SiNestjs,
  SiDjango,
  SiFlask,
  SiSpringboot,
  SiDotnet,
  SiCplusplus,
  SiJquery,
  SiRedux,
  SiPostman,
  SiNginx,
  SiApache,
  SiVercel,
  SiNetlify,
  SiPrisma,
  SiJira,
  SiIonic,
  SiCloudflare,
  SiCloudflarepages,
  SiCloudflareworkers,
  SiRender,
  SiRailway,
  SiDigitalocean,
  SiGooglecloud,
  SiKubernetes,
  SiGithubactions,
  SiGitlab,
  SiGo,
  SiRust,
  SiBun,
  SiDeno,
  SiFastapi,
  SiAstro,
  SiRubyonrails,
  SiRuby,
  SiDaisyui,
  SiSwagger,
  SiVitest,
  SiJest,
  SiCypress,
  SiStripe,
  SiResend,
  SiPnpm,
} from "react-icons/si";
import { GrHeroku } from "react-icons/gr";
import { TbBrandCSharp, TbBrandOpenai } from "react-icons/tb";

/**
 * Master Registry of Tech Stacks (Mobile, Web, Backend, Cloud & Database)
 */
export const TECH_REGISTRY = {
  // Mobile Development
  flutter: { name: "Flutter", icon: SiFlutter, category: "mobile", color: "#02569B" },
  dart: { name: "Dart", icon: SiDart, category: "mobile", color: "#0175C2" },
  reactnative: { name: "React Native", icon: FaReact, category: "mobile", color: "#61DAFB" },
  android: { name: "Android", icon: FaAndroid, category: "mobile", color: "#3DDC84" },
  ios: { name: "iOS", icon: FaApple, category: "mobile", color: "#000000" },
  swift: { name: "Swift", icon: SiSwift, category: "mobile", color: "#F05138" },
  kotlin: { name: "Kotlin", icon: SiKotlin, category: "mobile", color: "#7F52FF" },
  ionic: { name: "Ionic", icon: SiIonic, category: "mobile", color: "#3880FF" },

  // Web Frontend
  react: { name: "React", icon: FaReact, category: "frontend", color: "#61DAFB" },
  reactjs: { name: "React JS", icon: FaReact, category: "frontend", color: "#61DAFB" },
  nextjs: { name: "Next.js", icon: SiNextdotjs, category: "frontend", color: "#000000" },
  vue: { name: "Vue.js", icon: SiVuedotjs, category: "frontend", color: "#4FC08D" },
  angular: { name: "Angular", icon: SiAngular, category: "frontend", color: "#DD0031" },
  svelte: { name: "Svelte", icon: SiSvelte, category: "frontend", color: "#FF3E00" },
  html5: { name: "HTML5", icon: FaHtml5, category: "frontend", color: "#E34F26" },
  html: { name: "HTML", icon: FaHtml5, category: "frontend", color: "#E34F26" },
  css3: { name: "CSS3", icon: FaCss3Alt, category: "frontend", color: "#1572B6" },
  css: { name: "CSS", icon: FaCss3Alt, category: "frontend", color: "#1572B6" },
  javascript: { name: "JavaScript", icon: FaJs, category: "frontend", color: "#F7DF1E" },
  js: { name: "JS", icon: FaJs, category: "frontend", color: "#F7DF1E" },
  typescript: { name: "TypeScript", icon: SiTypescript, category: "frontend", color: "#3178C6" },
  ts: { name: "TS", icon: SiTypescript, category: "frontend", color: "#3178C6" },
  tailwind: { name: "Tailwind CSS", icon: SiTailwindcss, category: "frontend", color: "#06B6D4" },
  tailwindcss: { name: "Tailwind CSS", icon: SiTailwindcss, category: "frontend", color: "#06B6D4" },
  bootstrap: { name: "Bootstrap", icon: FaBootstrap, category: "frontend", color: "#7952B3" },
  sass: { name: "Sass", icon: FaSass, category: "frontend", color: "#CC6699" },
  jquery: { name: "jQuery", icon: SiJquery, category: "frontend", color: "#0769AD" },
  redux: { name: "Redux", icon: SiRedux, category: "frontend", color: "#764ABC" },
  vite: { name: "Vite", icon: SiVite, category: "frontend", color: "#646CFF" },
  wordpress: { name: "WordPress", icon: FaWordpress, category: "frontend", color: "#21759B" },

  // Backend & Servers
  php: { name: "PHP", icon: FaPhp, category: "backend", color: "#777BB4" },
  laravel: { name: "Laravel", icon: FaLaravel, category: "backend", color: "#FF2D20" },
  laravelphp: { name: "Laravel PHP", icon: FaLaravel, category: "backend", color: "#FF2D20" },
  nodejs: { name: "Node.js", icon: FaNodeJs, category: "backend", color: "#339933" },
  node: { name: "Node", icon: FaNodeJs, category: "backend", color: "#339933" },
  express: { name: "Express.js", icon: SiExpress, category: "backend", color: "#000000" },
  nestjs: { name: "NestJS", icon: SiNestjs, category: "backend", color: "#E0234E" },
  python: { name: "Python", icon: SiPython, category: "backend", color: "#3776AB" },
  django: { name: "Django", icon: SiDjango, category: "backend", color: "#092E20" },
  flask: { name: "Flask", icon: SiFlask, category: "backend", color: "#000000" },
  java: { name: "Java", icon: FaJava, category: "backend", color: "#007396" },
  springboot: { name: "Spring Boot", icon: SiSpringboot, category: "backend", color: "#6DB33F" },
  csharp: { name: "C#", icon: TbBrandCSharp, category: "backend", color: "#239120" },
  dotnet: { name: ".NET", icon: SiDotnet, category: "backend", color: "#512BD4" },
  cplusplus: { name: "C++", icon: SiCplusplus, category: "backend", color: "#00599C" },
  graphql: { name: "GraphQL", icon: SiGraphql, category: "backend", color: "#E10098" },

  // Local Server & Tools
  xampp: { name: "XAMPP", icon: SiXampp, category: "tools", color: "#FB7A24" },
  apache: { name: "Apache", icon: SiApache, category: "tools", color: "#D22128" },
  nginx: { name: "Nginx", icon: SiNginx, category: "tools", color: "#009639" },

  // Databases
  mysql: { name: "MySQL", icon: FaDatabase, category: "database", color: "#4479A1" },
  postgresql: { name: "PostgreSQL", icon: SiPostgresql, category: "database", color: "#4169E1" },
  postgres: { name: "Postgres", icon: SiPostgresql, category: "database", color: "#4169E1" },
  mongodb: { name: "MongoDB", icon: SiMongodb, category: "database", color: "#47A248" },
  sqlite: { name: "SQLite", icon: SiSqlite, category: "database", color: "#003B57" },
  redis: { name: "Redis", icon: SiRedis, category: "database", color: "#DC382D" },
  firebase: { name: "Firebase", icon: SiFirebase, category: "database", color: "#FFCA28" },
  supabase: { name: "Supabase", icon: SiSupabase, category: "database", color: "#3ECF8E" },
  prisma: { name: "Prisma", icon: SiPrisma, category: "database", color: "#2D3748" },

  // DevOps & Cloud
  cloudflare: { name: "Cloudflare", icon: SiCloudflare, category: "devops", color: "#F38020" },
  cloudflarepages: { name: "Cloudflare Pages", icon: SiCloudflarepages, category: "devops", color: "#F38020" },
  cloudflareworkers: { name: "Cloudflare Workers", icon: SiCloudflareworkers, category: "devops", color: "#F38020" },
  render: { name: "Render", icon: SiRender, category: "devops", color: "#46E3B7" },
  railway: { name: "Railway", icon: SiRailway, category: "devops", color: "#0B0D0E" },
  git: { name: "Git", icon: FaGitAlt, category: "devops", color: "#F05032" },
  github: { name: "GitHub", icon: FaGithub, category: "devops", color: "#181717" },
  docker: { name: "Docker", icon: FaDocker, category: "devops", color: "#2496ED" },
  aws: { name: "AWS", icon: FaAws, category: "devops", color: "#FF9900" },
  vercel: { name: "Vercel", icon: SiVercel, category: "devops", color: "#000000" },
  netlify: { name: "Netlify", icon: SiNetlify, category: "devops", color: "#00C7B7" },
  heroku: { name: "Heroku", icon: GrHeroku, category: "devops", color: "#430098" },
  digitalocean: { name: "DigitalOcean", icon: SiDigitalocean, category: "devops", color: "#0080FF" },
  googlecloud: { name: "Google Cloud", icon: SiGooglecloud, category: "devops", color: "#4285F4" },
  kubernetes: { name: "Kubernetes", icon: SiKubernetes, category: "devops", color: "#326CE5" },
  githubactions: { name: "GitHub Actions", icon: SiGithubactions, category: "devops", color: "#2088FF" },
  gitlab: { name: "GitLab", icon: SiGitlab, category: "devops", color: "#FC6D26" },
  linux: { name: "Linux", icon: FaLinux, category: "devops", color: "#FCC624" },

  // Design & Utilities
  figma: { name: "Figma", icon: FaFigma, category: "design", color: "#F24E1E" },
  nuxt: { name: "Nuxt.js", icon: SiNuxt, category: "frontend", color: "#00DC82" },
  astro: { name: "Astro", icon: SiAstro, category: "frontend", color: "#BC52EE" },
  daisyui: { name: "DaisyUI", icon: SiDaisyui, category: "frontend", color: "#1AD1A5" },
  jira: { name: "Jira", icon: SiJira, category: "tools", color: "#0052CC" },
  postman: { name: "Postman", icon: SiPostman, category: "tools", color: "#FF6C37" },
  swagger: { name: "Swagger", icon: SiSwagger, category: "tools", color: "#85EA2D" },
  bun: { name: "Bun", icon: SiBun, category: "tools", color: "#18181B" },
  pnpm: { name: "pnpm", icon: SiPnpm, category: "tools", color: "#F69220" },
  vitest: { name: "Vitest", icon: SiVitest, category: "tools", color: "#729B1B" },
  jest: { name: "Jest", icon: SiJest, category: "tools", color: "#C21325" },
  cypress: { name: "Cypress", icon: SiCypress, category: "tools", color: "#69D3A7" },
  stripe: { name: "Stripe", icon: SiStripe, category: "tools", color: "#635BFF" },
  resend: { name: "Resend", icon: SiResend, category: "tools", color: "#000000" },
  ai: { name: "AI / LLM", icon: TbBrandOpenai, category: "tools", color: "#10A37F" },

  // Additional Languages & Frameworks
  go: { name: "Go", icon: SiGo, category: "backend", color: "#00ADD8" },
  golang: { name: "Golang", icon: SiGo, category: "backend", color: "#00ADD8" },
  rust: { name: "Rust", icon: SiRust, category: "backend", color: "#DEA584" },
  deno: { name: "Deno", icon: SiDeno, category: "backend", color: "#000000" },
  fastapi: { name: "FastAPI", icon: SiFastapi, category: "backend", color: "#009688" },
  rubyonrails: { name: "Ruby on Rails", icon: SiRubyonrails, category: "backend", color: "#CC0000" },
  ruby: { name: "Ruby", icon: SiRuby, category: "backend", color: "#CC342D" },
};

/**
 * Intelligent Auto-Detector: Given any freeform skill or tech name,
 * finds the closest matching tech key in the registry.
 */
export function detectTechKey(rawName = "") {
  if (!rawName) return "default";
  const cleaned = rawName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");

  // Direct match
  if (TECH_REGISTRY[cleaned]) {
    return cleaned;
  }

  // Cloud & Deployment matching (check specific pages/workers before generic cloudflare)
  if (cleaned.includes("cloudflarepage") || cleaned.includes("cfpage")) return "cloudflarepages";
  if (cleaned.includes("cloudflareworker") || cleaned.includes("cfworker")) return "cloudflareworkers";
  if (cleaned.includes("cloudflare") || cleaned === "cf") return "cloudflare";
  if (cleaned.includes("render")) return "render";
  if (cleaned.includes("railway")) return "railway";
  if (cleaned.includes("heroku")) return "heroku";
  if (cleaned.includes("digitalocean") || cleaned === "do") return "digitalocean";
  if (cleaned.includes("googlecloud") || cleaned.includes("gcp")) return "googlecloud";
  if (cleaned.includes("kubernet") || cleaned.includes("k8s")) return "kubernetes";
  if (cleaned.includes("githubaction") || cleaned.includes("ghaction")) return "githubactions";
  if (cleaned.includes("gitlab")) return "gitlab";

  // Alias & Substring heuristic mapping
  if (cleaned.includes("flutter")) return "flutter";
  if (cleaned.includes("dart")) return "dart";
  if (cleaned.includes("xampp")) return "xampp";
  if (cleaned.includes("reactnative")) return "reactnative";
  if (cleaned.includes("react")) return "react";
  if (cleaned.includes("nuxt")) return "nuxt";
  if (cleaned.includes("astro")) return "astro";
  if (cleaned.includes("laravel")) return "laravel";
  if (cleaned.includes("php")) return "php";
  if (cleaned.includes("mysql") || cleaned.includes("sql")) return "mysql";
  if (cleaned.includes("postgres")) return "postgresql";
  if (cleaned.includes("mongo")) return "mongodb";
  if (cleaned.includes("firebas")) return "firebase";
  if (cleaned.includes("supabas")) return "supabase";
  if (cleaned.includes("tailwind")) return "tailwind";
  if (cleaned.includes("daisyui") || cleaned.includes("daisy")) return "daisyui";
  if (cleaned.includes("bootstra")) return "bootstrap";
  if (cleaned.includes("next")) return "nextjs";
  if (cleaned.includes("vue")) return "vue";
  if (cleaned.includes("angular")) return "angular";
  if (cleaned.includes("svelte")) return "svelte";
  if (cleaned.includes("typescrip") || cleaned === "ts") return "typescript";
  if (cleaned.includes("javascrip") || cleaned === "js") return "javascript";
  if (cleaned.includes("html")) return "html5";
  if (cleaned.includes("css")) return "css3";
  if (cleaned.includes("node")) return "nodejs";
  if (cleaned.includes("express")) return "express";
  if (cleaned.includes("nest")) return "nestjs";
  if (cleaned.includes("python")) return "python";
  if (cleaned.includes("fastapi")) return "fastapi";
  if (cleaned.includes("django")) return "django";
  if (cleaned.includes("flask")) return "flask";
  if (cleaned.includes("spring")) return "springboot";
  if (cleaned.includes("java")) return "java";
  if (cleaned.includes("golang") || cleaned === "go") return "go";
  if (cleaned.includes("rust")) return "rust";
  if (cleaned.includes("rubyonrail") || cleaned.includes("rails")) return "rubyonrails";
  if (cleaned.includes("ruby")) return "ruby";
  if (cleaned.includes("csharp") || cleaned === "c#") return "csharp";
  if (cleaned.includes("dotnet") || cleaned === ".net") return "dotnet";
  if (cleaned.includes("cplus") || cleaned === "c++") return "cplusplus";
  if (cleaned.includes("docker")) return "docker";
  if (cleaned.includes("aws")) return "aws";
  if (cleaned.includes("git")) return cleaned.includes("github") ? "github" : "git";
  if (cleaned.includes("wordpres")) return "wordpress";
  if (cleaned.includes("figma")) return "figma";
  if (cleaned.includes("jira")) return "jira";
  if (cleaned.includes("postman")) return "postman";
  if (cleaned.includes("swagger") || cleaned.includes("openapi")) return "swagger";
  if (cleaned.includes("bun")) return "bun";
  if (cleaned.includes("deno")) return "deno";
  if (cleaned.includes("pnpm")) return "pnpm";
  if (cleaned.includes("vitest")) return "vitest";
  if (cleaned.includes("jest")) return "jest";
  if (cleaned.includes("cypress")) return "cypress";
  if (cleaned.includes("stripe")) return "stripe";
  if (cleaned.includes("resend")) return "resend";
  if (cleaned.includes("swift")) return "swift";
  if (cleaned.includes("kotlin")) return "kotlin";
  if (cleaned.includes("android")) return "android";
  if (cleaned.includes("ios") || cleaned.includes("apple")) return "ios";
  if (cleaned.includes("redis")) return "redis";
  if (cleaned.includes("graphql")) return "graphql";
  if (cleaned.includes("vite")) return "vite";

  return "default";
}

/**
 * Return the rendered Icon component with auto-detection fallback
 */
export function getTechIcon(nameOrKey, size = 22, className = "") {
  const key = detectTechKey(nameOrKey);
  const entry = TECH_REGISTRY[key];

  if (entry && entry.icon) {
    const IconComp = entry.icon;
    return <IconComp size={size} className={className} />;
  }

  return <FaCode size={size} className={className} />;
}

/**
 * Return badge metadata (name, color, Icon component, and key) for tech tags & pills
 */
export function getTechBadgeData(nameOrKey) {
  const key = detectTechKey(nameOrKey);
  const entry = TECH_REGISTRY[key];

  if (entry) {
    return {
      name: entry.name || nameOrKey,
      color: entry.color || "#4f46e5",
      icon: entry.icon || FaCode,
      key,
    };
  }

  return {
    name: nameOrKey,
    color: "#4f46e5",
    icon: FaCode,
    key: "default",
  };
}

/**
 * Return all distinct options for Admin UI dropdowns
 */
export function getAllTechOptions() {
  const seenNames = new Set();
  const options = [];

  for (const [key, entry] of Object.entries(TECH_REGISTRY)) {
    if (!seenNames.has(entry.name)) {
      seenNames.add(entry.name);
      options.push({
        key,
        name: entry.name,
        category: entry.category,
        color: entry.color,
        icon: entry.icon,
      });
    }
  }

  return options.sort((a, b) => a.name.localeCompare(b.name));
}
