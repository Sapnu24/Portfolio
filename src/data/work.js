// Edit this file to add or change videos. Files live in /public/work (or use a full URL).
export const SITE = {
  name: "Sean Marion Velasco",
  role: "AI Video Production Lead",
  bio: "I produce DTC ads and short-form video with AI-assisted workflows: brief to generated assets to edit to review to delivery, with checks before credits are spent and a cost ledger per video. I also lead the video editing team at Specialty Vision.",
  email: "seanmarionvelasco@gmail.com",
  linkedin: "https://www.linkedin.com/in/sean-marion-velasco-890544318/",
  upwork: "https://www.upwork.com/freelancers/~01c5be6cda3726622f",
  github: "https://github.com/Sapnu24",
};

export const WORK = [
  {
    id: "ugc-foodcycler",
    category: "UGC Ads",
    title: "FoodCycler: Meat and Bones Myth-Buster",
    video: "/work/ugc-foodcycler.mp4",
    poster: "/work/ugc-foodcycler.jpg",
    role: "Edit: hook, word-synced captions, product demo cuts, b-roll and sound.",
    note: "Vertical UGC ad, 9:16.",
  },
  {
    id: "ugc-cleanliving",
    category: "UGC Ads",
    title: "Meal delivery UGC ad (version 3 of 3)",
    video: "/work/ugc-cleanliving.mp4",
    poster: "/work/ugc-cleanliving.jpg",
    role: "Edit: captions, offer card, b-roll. Delivered as three versions for testing.",
    note: "Vertical UGC ad, 9:16.",
  },
  {
    id: "avner-presenter",
    category: "AI Video",
    title: "AI presenter video (first 45 s)",
    video: "/work/avner-presenter.mp4",
    poster: "/work/avner-presenter.jpg",
    role: "Owned the pipeline: script, generation, checks, edit. The voice is a cloned voice approved by the presenter.",
    note: "Made with the FLOW 11 pipeline for Specialty Vision.",
  },
  {
    id: "documentary-desert",
    category: "Documentary",
    title: "Documentary-style explainer (first 45 s)",
    video: "/work/documentary-desert.mp4",
    poster: "/work/documentary-desert.jpg",
    role: "Edit and animation, AI narration, matched to a reference style.",
    note: "Trial video for a client.",
  },
];

export const CASE_STUDY = {
  title: "Case study: the FLOW 11 presenter video pipeline",
  intro:
    "A gated workflow that turns an approved script into a finished presenter video, with minimal manual editing and a cost record for every video.",
  steps: [
    ["Script", "Short lines, one idea per 8-second clip, claims only from approved sources. I approve it."],
    ["Stills", "Presenter stills are generated at no cost and approved at full size before any video credits are used."],
    ["Prompt lint and QC", "A script checks every prompt against locked wording, then a separate QC agent tries to break each prompt."],
    ["Pilot, then batch", "Two clips are generated and joined first. The batch only runs after I approve the join."],
    ["Clip checks", "Every clip goes through two Whisper passes (whole clip and 3-second windows) to catch repeats, ad-libs and bad starts or ends."],
    ["Tight cut and voice", "Silence and restarts are cut frame-exactly, then the voice is swapped to the approved voice in ElevenLabs."],
    ["Edit and shorts", "Word-timed zooms and the logo are applied. Shorts are cut from the finished video with no new generation."],
  ],
  owned:
    "I own the process, the rules, every approval, the credit ledger and clip review. Claude Code writes the scripts under my direction. Google Flow generates the video, ElevenLabs the voice, and Whisper does the checking.",
  results: [
    ["24", "AI clips in video 11"],
    ["~300", "Flow credits for the long form"],
    ["7", "blocked sends, all refunded"],
    ["0", "extra credits for the shorts"],
  ],
  lessons:
    "Every failure became a rule. An x4 setting once cost 90 credits, so every send now gets a settings check. 10-second clips left spare time that the model filled with repeats, so clips are 8 seconds.",
};
