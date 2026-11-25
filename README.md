# Sean Marion Velasco: AI Video Production Portfolio

Portfolio site for Sean Marion Velasco, AI Video Production Lead: DTC and UGC ads, AI video workflows, and short-form and YouTube editing.

- LinkedIn: https://www.linkedin.com/in/sean-marion-velasco-890544318/
- Upwork: https://www.upwork.com/freelancers/~01c5be6cda3726622f

## What is on the site

- **Hero:** intro, featured AI presenter video, key Upwork stats.
- **Work:** sample videos by category. Click one to watch it.
- **Tools:** the editing software, AI tools and workflow tools I use, with a popup explaining each.
- **Contact:** inquiry form.

## Add or change videos

Edit `src/data/work.js`. Put video files and poster images in `public/work/`, or use full URLs.

## Run locally

```bash
npm install
npm run dev
```

Build for production with `npm run build`.

## Tech

React 19, Vite, Framer Motion, Firebase (admin dashboard and analytics), deployed on Vercel.

Firebase and chatbot keys go in a local `.env` file (see `.env.example`). Never commit real keys.
