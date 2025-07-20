// utils/messages.ts
export function getDynamicMessage(noteCount: number): string {
  const messages = [
    "You're on fire! 🔥",
    "Keep the ideas flowing! 💡",
    "Note saved! Time for a coffee? ☕",
    "You're doing amazing work! ✨",
    "That's note #5! Milestone unlocked! 🏆",
    "Big brain mode activated 🧠",
    "Your productivity is inspiring! 💪",
    "That math was smooth! ➗✔️",
    "You're a note-taking wizard 🪄"
  ];

  if (noteCount > 0 && noteCount % 5 === 0) {
    return `🎉 You've saved ${noteCount} notes! You're crushing it!`;
  }

  return messages[Math.floor(Math.random() * messages.length)];
}
