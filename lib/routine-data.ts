export interface RoutineItem {
  id: string
  time: string
  title: string
  description: string
  duration: string
  category: "morning" | "deep-work" | "midday" | "afternoon" | "evening"
}

export const routineItems: RoutineItem[] = [
  {
    id: "wake",
    time: "06:30",
    title: "Wake & Hydrate",
    description:
      "Drink a full glass of water. Sit up, take 3 deep breaths, smile for 10 seconds.",
    duration: "5 min",
    category: "morning",
  },
  {
    id: "bed-tidy",
    time: "06:35",
    title: "Make the Bed + 2-Min Tidy",
    description: "Small win to start momentum.",
    duration: "5 min",
    category: "morning",
  },
  {
    id: "movement",
    time: "06:40",
    title: "Movement",
    description:
      "Quick bodyweight routine, brisk walk, or short HIIT. Move so you sweat a little and wake the brain.",
    duration: "30 min",
    category: "morning",
  },
  {
    id: "shower",
    time: "07:10",
    title: "Cold-ish Shower & Grooming",
    description:
      "Short cold rinse if you can -- great for focus and breaking low-energy habits.",
    duration: "15 min",
    category: "morning",
  },
  {
    id: "breakfast",
    time: "07:25",
    title: "Healthy Breakfast",
    description:
      "Protein + complex carbs + fruit/veg. Avoid heavy sugar first thing.",
    duration: "20 min",
    category: "morning",
  },
  {
    id: "planning",
    time: "07:45",
    title: "Daily Planning",
    description:
      "Write your 1-3 MITs (Most Important Tasks) for the day. Set a clear endpoint for each.",
    duration: "15 min",
    category: "morning",
  },
  {
    id: "deep-work-1",
    time: "08:00",
    title: "Deep Work Block 1",
    description:
      "Focused coding / main work. Use Pomodoro: 52/17 or 25/5. Eliminate notifications. One MIT only.",
    duration: "2 hr",
    category: "deep-work",
  },
  {
    id: "break-1",
    time: "10:00",
    title: "Short Break",
    description: "Stretch, water, quick walk.",
    duration: "15 min",
    category: "midday",
  },
  {
    id: "deep-work-2",
    time: "10:15",
    title: "Deep Work Block 2",
    description:
      "Continue or start the second MIT / important project work.",
    duration: "1.75 hr",
    category: "deep-work",
  },
  {
    id: "lunch",
    time: "12:00",
    title: "Lunch + Walk",
    description: "Eat mindfully. Brief walk outside to reset.",
    duration: "1 hr",
    category: "midday",
  },
  {
    id: "admin",
    time: "13:00",
    title: "Meetings / Admin / Smaller Tasks",
    description: "Email, reviews, PRs, light tasks. Batch small things.",
    duration: "2 hr",
    category: "afternoon",
  },
  {
    id: "coffee-break",
    time: "15:00",
    title: "Coffee Break",
    description: "Do something non-screen for a few minutes.",
    duration: "20 min",
    category: "afternoon",
  },
  {
    id: "deep-work-3",
    time: "15:20",
    title: "Focused Session",
    description:
      "Coding, learning, freelancing. Aim to complete one concrete deliverable.",
    duration: "1.7 hr",
    category: "deep-work",
  },
  {
    id: "wrap-up",
    time: "17:00",
    title: "Daily Wrap-Up",
    description:
      "Save work, write quick notes, list tomorrow's 1-3 MITs. Celebrate tiny wins.",
    duration: "30 min",
    category: "afternoon",
  },
  {
    id: "hobbies",
    time: "18:00",
    title: "Hobbies & Learning",
    description:
      "Practice Go, read Web3 notes, study a small module. Keep this joyful.",
    duration: "1 hr",
    category: "evening",
  },
  {
    id: "dinner",
    time: "19:00",
    title: "Dinner + Social Time",
    description:
      "Connect with someone or relax -- no work talk if possible.",
    duration: "1 hr",
    category: "evening",
  },
  {
    id: "light-activity",
    time: "20:00",
    title: "Light Activity",
    description:
      "Walk, stretch, play music, or short creative work (writing, drawing).",
    duration: "1 hr",
    category: "evening",
  },
  {
    id: "unwind",
    time: "21:00",
    title: "Unwind Routine",
    description:
      "Journaling: 5-10 minutes. Three things you did well; one thing to improve.",
    duration: "30 min",
    category: "evening",
  },
  {
    id: "digital-sunset",
    time: "21:30",
    title: "Digital Sunset",
    description:
      "Reduce screens; switch phone to Do Not Disturb. Remove apps or block triggers.",
    duration: "30 min",
    category: "evening",
  },
  {
    id: "bedtime",
    time: "22:00",
    title: "Bedtime Routine",
    description:
      "Breathing, low light, prepare tomorrow. Aim to sleep by 22:30-23:00.",
    duration: "30 min",
    category: "evening",
  },
]

export const categoryLabels: Record<RoutineItem["category"], string> = {
  morning: "Morning",
  "deep-work": "Deep Work",
  midday: "Midday",
  afternoon: "Afternoon",
  evening: "Evening",
}

export const categoryColors: Record<RoutineItem["category"], string> = {
  morning: "text-primary",
  "deep-work": "text-accent",
  midday: "text-chart-3",
  afternoon: "text-chart-4",
  evening: "text-chart-5",
}

export const habitHacks = [
  {
    title: "Make breaking it hard",
    description:
      "Remove triggers (uninstall apps, hide snacks). Change the environment.",
  },
  {
    title: "Replace, don't only remove",
    description:
      "When craving, do the 2-minute rule -- two minutes of push-ups, or step outside. After 2 minutes you usually stop craving.",
  },
  {
    title: "Delay + reward",
    description:
      "Tell yourself 'I'll wait 10 minutes' -- often the urge fades. Then reward with something small (tea, 5-minute music).",
  },
  {
    title: "Accountability",
    description:
      "Send a daily 'I did it' message to yourself in notes or to one friend. Small friction, big help.",
  },
  {
    title: "Track streaks",
    description:
      "Visual streaks beat willpower. Mark a calendar every day you resist.",
  },
]

export const reflectionPrompts = [
  "What I finished today?",
  "What didn't work? One small fix for tomorrow.",
  "One thing I'm proud of.",
  "One thing I'm grateful for.",
]

export const weeklyChecklist = [
  "Review goals & earnings",
  "Pick 3 weekly priorities",
  "Plan deep-focus blocks for the week",
  "Clean workspace and backup important files",
]

export const microRoutines = [
  {
    title: "2-minute tidy",
    description: "2 minutes clears mental clutter.",
  },
  {
    title: "2-minute write",
    description: "Jot one idea for income or freelancing (tiny seed).",
  },
  {
    title: "5-10 min breathing",
    description: "After a stressful meeting. Reset your nervous system.",
  },
]

export interface EnergyMetric {
  id: string
  label: string
  icon: string
  unit: string
  max: number
}

export const energyMetrics: EnergyMetric[] = [
  { id: "sleep", label: "Sleep Hours", icon: "moon", unit: "hrs", max: 10 },
  { id: "water", label: "Water Intake", icon: "droplets", unit: "glasses", max: 8 },
  { id: "mood", label: "Mood", icon: "smile", unit: "/5", max: 5 },
  { id: "energy", label: "Energy Level", icon: "zap", unit: "/10", max: 10 },
]

export interface GrowthActivity {
  id: string
  type: "skill" | "income" | "product"
  label: string
  placeholder: string
}

export const growthActivities: GrowthActivity[] = [
  { id: "skill", type: "skill", label: "Skill Building", placeholder: "Go, DevOps, Django..." },
  { id: "income", type: "income", label: "Revenue / Freelance", placeholder: "Bids, clients, earnings..." },
  { id: "product", type: "product", label: "Product Dev", placeholder: "Features shipped, progress..." },
]
