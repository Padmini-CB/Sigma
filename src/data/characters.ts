export const CHARACTERS = {
  tony: {
    name: "Tony Sharma",
    title: "The Shortcut Guy",
    description: "Takes the easy path (don't be Tony)",
    images: {
      thinking: "/assets/characters/tony/thinking.png",
      presenting: "/assets/characters/tony/presenting.png",
      explaining: "/assets/characters/tony/explaining.png",
    },
    defaultImage: "presenting",
  },
  peter: {
    name: "Peter Pandey",
    title: "The Confused Beginner",
    description: "Asks the questions we're all thinking",
    images: {
      confused: "/assets/characters/peter/confused.png",
      victory: "/assets/characters/peter/victory.png",
      neutral: "/assets/characters/peter/neutral.png",
      mildConfusion: "/assets/characters/peter/mild-confusion.png",
      frustrated: "/assets/characters/peter/frustrated.png",
    },
    defaultImage: "confused",
  },
  bruce: {
    name: "Bruce Haryali",
    title: "The Overthinker",
    description: "Analyzes until paralysis",
    images: {
      thinking: "/assets/characters/bruce/thinking.png",
      working: "/assets/characters/bruce/working.png",
      multitasking: "/assets/characters/bruce/multitasking.png",
    },
    defaultImage: "thinking",
  },
};

export type CharacterKey = keyof typeof CHARACTERS;
export type CharacterPose<T extends CharacterKey> = keyof typeof CHARACTERS[T]["images"];
