# GIF Search App

Web application for searching GIF animations using GIPHY API.

## About project

This project was done as a test task.

Author: Roman Onyshko  
Time spent: around 6 hours

The main goal was to create simple but clean application with search, preview and basic interactions with GIF files.

## Stack

React  
TypeScript  
Vite  
TanStack React Query  
CSS (without UI frameworks)

## Functionality

- Search GIFs by keyword
- Display results in masonry-like grid layout
- Select GIF and view additional information
- Smooth scroll to details block after selecting GIF
- Copy direct GIF link to clipboard
- Download GIF to local computer

## Project structure

src/
api/ - work with GIPHY API
components/ - React components
styles/ - global and app styles
utils/ - helper functions
types/ - TypeScript types
App.tsx
main.tsx

## How to run project

### Requirements

Node.js version 18 or higher is recommended.

### Installation

1. Install dependencies:

```bash
npm install
```

Create environment file in root of project:
you can use(VITE_GIPHY_API_KEY=ovBZPxGNeFkng3BtFko6Qh5Xx4LSADzc)

bash echo "VITE_GIPHY_API_KEY=YOUR_GIPHY_API_KEY" > .env.local
You can get API key on https://developers.giphy.com/

Start dev server:

bash

npm run dev
After that open browser. Vite will show local url in terminal.

Build
To build project for production:

bash
npm run build
npm run preview
Notes
Environment variables are stored in .env.local file and not commited to repository

No external UI libraries were used

Layout was implemented with pure CSS

Focus was more on logic and structure, not on perfect design
