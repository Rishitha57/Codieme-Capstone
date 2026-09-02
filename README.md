# 🔥 TaskLoom

**TaskLoom** is a modern, minimalist task management application built with React and TypeScript. It helps you organize your tasks with style, featuring a sleek glassmorphism UI, real-time analytics, and smart task sorting.

## ✨ Features

### Core Functionality
- **📝 Task Management**: Create, edit, delete, and complete tasks effortlessly
- **📅 Schedule Tasks**: Add optional due dates and times to stay organized
- **🔍 Smart Search**: Quickly find tasks with real-time search filtering
- **🏷️ Filter Views**: Switch between All, Active, and Completed tasks
- **💾 Local Storage**: All tasks are automatically saved to browser local storage
- **🎯 Edit Mode**: Click edit to modify existing tasks seamlessly

### Analytics Dashboard
- **📊 Total Tasks**: Track all your tasks at a glance
- **⚡ Active Tasks**: Monitor pending items
- **✅ Completed Tasks**: View your accomplishments
- **📈 Efficiency Score**: See your completion rate percentage

### Smart Features
- **🔄 Auto-Sort**: Tasks are automatically sorted by:
  - Completion status (active tasks first)
  - Due date and time (earliest first)
  - Creation time (newest first for tasks without dates)
- **🗑️ Bulk Actions**: Clear all completed tasks with one click
- **💫 Smooth Animations**: Polished UI with pulse effects on stat updates
- **🌙 Modern UI**: Beautiful glassmorphism design with gradient accents

## 🛠️ Technology Stack

- **Frontend Framework**: React 19.2.3
- **Language**: TypeScript 5.8.2
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS (inline utility classes)
- **State Management**: React Hooks (useState, useEffect, useMemo)
- **Storage**: Browser LocalStorage API
- **Icons**: SVG (Heroicons style)

## 🏗️ Project Structure

```
taskloom/
├── components/
│   ├── TaskForm.tsx       # Form for adding/editing tasks
│   ├── TaskCard.tsx       # Individual task display card
│   └── EmptyState.tsx     # Empty state UI when no tasks
├── App.tsx                # Main application component
├── types.ts               # TypeScript interfaces
├── index.tsx              # Application entry point
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## 🚀 How It Works

### Data Flow
1. **Initialization**: On app load, tasks are retrieved from localStorage
2. **State Management**: React state manages tasks, filters, and search query
3. **Task Operations**: All CRUD operations update state and trigger localStorage sync
4. **Auto-Save**: useEffect hook automatically saves tasks to localStorage on every change
5. **Filtering**: useMemo optimizes task filtering and sorting based on selected filters

### Task Lifecycle
```
Create → Add to state → Save to localStorage
   ↓
Edit → Update in state → Save to localStorage
   ↓
Complete → Toggle completion → Save to localStorage
   ↓
Delete → Remove from state → Save to localStorage
```

### Component Architecture
- **App.tsx**: Main container managing state and orchestrating child components
- **TaskForm**: Handles task input with validation and edit mode
- **TaskCard**: Displays individual tasks with action buttons
- **EmptyState**: Shows when no tasks match current filters

### Key Features Implementation

**Smart Sorting Algorithm**:
```typescript
// Tasks are sorted by:
1. Completion status (active first)
2. Due date/time (earliest first)
3. Creation timestamp (newest first)
```

**Analytics Calculation**:
- Total: All tasks count
- Active: Uncompleted tasks
- Completed: Finished tasks
- Efficiency: (Completed / Total) × 100

**Local Storage Persistence**:
- Data key: `taskloom_data`
- Auto-save on every task modification
- Hydrates state on initial load

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher recommended)
- **npm** or **yarn**

### Installation Steps

1. **Clone or download the project**
   ```bash
   cd taskloom
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎮 Usage Guide

### Adding a Task
1. Enter task title in the input field
2. Optionally add a due date and time
3. Click "Add Task" button or press Enter

### Editing a Task
1. Click the edit icon (✏️) on any task card
2. Modify the task details in the form
3. Click "Update Task" to save changes

### Completing a Task
- Click the checkbox icon on any task card to toggle completion status

### Deleting a Task
- Click the trash icon (🗑️) on any task card
- Task will be removed immediately

### Filtering Tasks
- Click filter buttons: **All**, **Active**, or **Completed**

### Searching Tasks
- Type in the search bar to filter tasks by title

### Clearing Completed Tasks
- Click "Clear Archive" button (appears when you have completed tasks)

## 🎨 UI/UX Features

- **Glassmorphism Design**: Modern frosted glass effect
- **Gradient Accents**: Beautiful indigo to violet gradients
- **Responsive Layout**: Works on mobile, tablet, and desktop
- **Accessibility**: Semantic HTML and keyboard navigation support
- **Visual Feedback**: Hover effects, active states, and animations
- **Stat Animations**: Numbers pulse when updated for visual feedback

## 🔒 Data Privacy

- **100% Local**: All data is stored in your browser's localStorage
- **No Backend**: No external servers or databases
- **No Tracking**: No analytics or user tracking
- **Offline First**: Works completely offline once loaded

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements!

## 📄 License

This project is open source and available under the MIT License.

## 🌟 Credits

Built with ❤️ using React, TypeScript, and Vite.

---

<div align="center">
  <p><em>"The way to get started is to quit talking and begin doing."</em></p>
  <p><strong>TaskLoom</strong> • Secure Local Store • Precision Sorted</p>
</div>
