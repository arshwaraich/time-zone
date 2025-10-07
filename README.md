# Time Zone Visualizer

An interactive time zone visualization showing Toronto and New Delhi times on an animated sun path chart. Built as a PWA with Next.js, React, and Tailwind CSS.

<img width="773" height="608" alt="Screenshot 2025-10-07 at 12 52 04 am" src="https://github.com/user-attachments/assets/8e722655-3259-4fce-9687-fde337653541" />


## Features

- 🌍 Real-time display of Toronto and New Delhi local times
- 🌅 Beautiful sun path visualization showing day/night cycles
- ⭐ Animated twinkling stars during night sections
- 🎚️ Interactive dial to scrub through time
- 📱 Fully responsive mobile-first design
- 🔄 Progressive Web App (PWA) support

## Tech Stack

- **Framework:** Next.js 15.5.4 with Turbopack
- **UI Library:** React 19.1.0
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

Build for production:

```bash
npm run build
npm start
```

## How It Works

The visualization uses a sine wave to represent the sun's path throughout a 24-hour day. Cities are positioned along this wave based on their current local time:

- **Above the horizon:** Daytime
- **Below the horizon:** Nighttime
- **Interactive dial:** Drag to travel through time and see how the cities' positions change

## License

MIT
