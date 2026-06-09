# Aether AI - Enterprise Infrastructure Platform Website

A production-ready, highly responsive static showcase website for **Aether AI**, built as part of WeIntern Week 2 Task 1: Responsive Company Website.

---

## Project Overview

Aether AI is an enterprise-grade AI infrastructure platform. This repository contains the complete static frontend codebase structured using modular CSS3 architecture and clean vanilla JavaScript. It delivers pixel-accurate styling, accessibility tags, and cross-device responsive support.

## Features

- **Responsive Viewport Support**: Seamless fluid layout transitions across desktop, tablet, and mobile breakpoints.
- **Unified Navigation Header**: Sticky navigation header with active page indicator tracking.
- **Newsletter Subscription Block**: Standalone deep-green high-contrast subscription banner.
- **Real-Time Input Validation**: Dynamic form validation with custom error tooltips and success indicators.
- **Details/Summary Accordions**: Custom JS FAQ accordion wrappers for client queries.
- **Scroll Entry Animations**: Smooth fade-in transitions utilizing `IntersectionObserver`.

---

## Folder Structure

```
aether-ai-website/
│
├── index.html              (Home Page Showcase)
├── about.html              (Company Story & Technical Leadership Node Grid)
├── services.html           (Service Specs & FAQ Accordions)
├── contact.html            (Contact Channels, Location Cards, & Newsletter)
├── 404.html                (Fallback Error Page)
│
├── css/
│   ├── base.css            (Custom properties, typography defaults, core resets)
│   ├── layout.css          (Containers, spacing system, grid and flex setups)
│   ├── components.css      (Buttons, inputs, navbars, cards, forms)
│   ├── pages.css           (Page-specific overrides and unique layout offsets)
│   ├── responsive.css      (Media queries and viewport stacking rules)
│   └── utilities.css       (Shadow depths, opacity levels, utility spacing classes)
│
├── js/
│   ├── navigation.js       (Navbar stickiness, active page highlight, hamburger trigger)
│   ├── forms.js            (Inquiry checks, email regex, mock submit spinners)
│   ├── animations.js       (Intersection observer, accordion height transitions)
│   └── main.js             (DOM load event trigger entrypoint)
│
├── assets/
│   ├── images/
│   │   ├── home/
│   │   ├── about/
│   │   ├── services/
│   │   └── contact/
│   ├── icons/
│   └── logo/
│
├── screenshots/            (Mock screenshots of the interface)
│
├── docs/
│   └── design-decisions.md (Architectural choices log file)
│
├── README.md               (This documentation file)
├── .gitignore              (Git repository exclude rules)
└── favicon.ico             (Vector SVG/ICO brand favicon link)
```

---

## Installation Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/aether-ai-website.git
   cd aether-ai-website
   ```

2. **Serve Locally**:
   You can serve the static files locally using any local web server. For example, using Python or Node.js:
   - **Python 3**:
     ```bash
     python -m http.server 8000
     ```
   - **Node.js (serve)**:
     ```bash
     npx serve
     ```
   - Open your browser and navigate to `http://localhost:8000` or `http://localhost:3000`.

---

## Deployment Instructions

To deploy to static hosting environments:

- **GitHub Pages**: Go to Repository Settings -> Pages, select the root directory of your branch, and hit Save.
- **Vercel / Netlify**: Connect this repository to your Vercel or Netlify account, select the project directory, leave the build command empty (since it is a static site), and deploy.

---

## Screenshots Section

*Add mockup screenshots showing the responsive design across Desktop, Tablet, and Mobile layouts.*

---

## Technologies Used

- **HTML5**: Structured semantic layout nodes (`header`, `main`, `section`, `footer`).
- **CSS3**: Variables, Flexbox, CSS Grid, Media Queries, Custom transitions.
- **Vanilla JavaScript**: DOM Manipulation, event routing, IntersectionObserver.
