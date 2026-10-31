# Task & Group Randomizer

A modern, interactive web application for randomly forming student teams and distributing tasks or variants among them. Built with **React**, **TypeScript**, and **Framer Motion**, it features smooth drag-and-drop animations and flexible task assignment logic.

![React](https://img.shields.io/badge/React-18.x-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.x-purple?logo=vite)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.x-pink?logo=framer)

## Features

- **Smart Group Formation**: Automatically splits a list of students into groups of specified sizes (1–4 students). Handles incomplete groups gracefully.
- **Multiple Task Lists**: Support for multiple independent lists of tasks (e.g., "Files", "Methods", "Topics").
- **Fair Distribution Logic**:
  - If tasks ≥ groups: Each group gets a **unique** task.
  - If tasks < groups: Tasks are distributed **evenly** with minimal repetition.
- **Interactive Drag & Drop**:
  - Drag student cards between groups to manually adjust teams.
  - **Swap Mechanism**: Dropping a student onto another swaps their positions.
  - Smooth spring-physics animations via Framer Motion.
- **Flexible Configuration**:
  - Toggle between using standard numbered variants or custom task lists.
  - Combine both variants and custom tasks if needed.
- **Modern UI**: Clean, responsive design with visual feedback for drag operations and task assignments.

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/saintninja/TaskRandomizer.git
cd TaskRandomizer

npm install
```

### Development

Run the local development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```

The optimized static files will be generated in the `dist/` directory. You can preview the production build locally:

```bash
npm run preview
```

## How to Use

1. **Enter Students**: Paste a list of student names (one per line) into the text area.
2. **Configure Groups**: Select the desired group size (1–4 students).
3. **Add Tasks (Optional)**:
   - Click **"Add List"** to create a new task list (e.g., "Lab Files").
   - Enter tasks one per line. You can add multiple lists (e.g., "Files", "Algorithms").
4. **Choose Assignment Mode**:
   - If you added task lists, a checkbox **"Use Variants"** appears. Uncheck it if you only want to use custom tasks.
   - If no task lists are present, the app defaults to assigning numbered variants (1–N).
5. **Form Groups**: Click **"Form Groups"**. Students will animate into their respective groups.
6. **Assign Tasks**: Click **"Assign Tasks"**. Tasks/variants will be randomly distributed to each group.
7. **Manual Adjustments**: Drag and drop student cards between groups to swap members manually.

## Tech Stack

- **Core**: React 18, TypeScript 5
- **Build Tool**: Vite 5
- **Animations**: Framer Motion 11 (Layout animations, Spring physics)
- **Styling**: CSS Modules / Standard CSS
- **State Management**: React Hooks (`useState`, `useMemo`, `useCallback`)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ControlsPanel/   # Input controls for students and settings
│   ├── TaskListsPanel/  # Management of multiple task lists
│   ├── StudentCard/     # Draggable student card
│   ├── GroupContainer/  # Container for a single group
│   └── ...
├── hooks/               # Custom React hooks
│   └── useDragAndDrop.ts # Logic for drag-and-drop with swap
├── types/               # TypeScript interfaces
├── utils/               # Pure functions for array manipulation
│   ├── array.ts         # Shuffle, chunk, and assignment algorithms
│   └── constants.ts
├── styles/              # Global CSS styles
└── App.tsx              # Main application component
```

## Key Algorithms

### Task Assignment
The app uses a two-step strategy for fairness:
1. **Shuffle**: The list of tasks is randomly shuffled.
2. **Distribute**:
   - If `tasks.length >= groups.length`: The first N unique tasks are assigned.
   - If `tasks.length < groups.length`: Tasks are assigned cyclically (`index % tasks.length`) to ensure even distribution.

### Drag & Drop Swap
- Uses Pointer Events API for cross-device compatibility (mouse + touch).
- `setPointerCapture` ensures drag events continue even if the cursor leaves the element.
- Visual feedback includes opacity changes for the dragged item and highlighting for the drop target.

## License

MIT License – feel free to use this project for educational purposes or personal projects.


---

> **Note**: This project was designed for educational demonstrations, allowing teachers to quickly randomize lab assignments while keeping the process transparent and interactive for students.
