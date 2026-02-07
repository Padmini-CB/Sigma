export interface CharacterPoseInfo {
  src: string;
  label: string;
  useFor: string;
}

export interface Character {
  name: string;
  title: string;
  description: string;
  color: string;
  defaultPose: string;
  poses: Record<string, CharacterPoseInfo>;
}

export const CHARACTERS: Record<string, Character> = {
  tony: {
    name: "Tony Sharma",
    title: "The Shortcut Guy",
    description: "Takes the easy path (don't be Tony)",
    color: "#EF4444",
    defaultPose: "presenting",
    poses: {
      attitude: {
        src: "/assets/characters/tony/attitude.png",
        label: "Attitude",
        useFor: "Overconfident moments, bad advice scenarios",
      },
      explaining: {
        src: "/assets/characters/tony/explaining.png",
        label: "Explaining",
        useFor: "Tony giving wrong explanations, shortcuts",
      },
      presenting: {
        src: "/assets/characters/tony/presenting.png",
        label: "Presenting",
        useFor: "Default hero pose, intro slides",
      },
      seeing: {
        src: "/assets/characters/tony/seeing.png",
        label: "Seeing",
        useFor: "Reacting to results, surprise moments",
      },
      talking: {
        src: "/assets/characters/tony/talking.png",
        label: "Talking",
        useFor: "Dialogue scenes, conversations",
      },
      talkingonphone: {
        src: "/assets/characters/tony/talkingonphone.png",
        label: "Talking on Phone",
        useFor: "Distracted, multitasking badly",
      },
      thinking: {
        src: "/assets/characters/tony/thinking.png",
        label: "Thinking",
        useFor: "Pondering shortcuts, scheming",
      },
    },
  },
  peter: {
    name: "Peter Pandey",
    title: "The Confused Beginner",
    description: "Asks the questions we're all thinking",
    color: "#F97316",
    defaultPose: "confused",
    poses: {
      confused: {
        src: "/assets/characters/peter/confused.png",
        label: "Confused",
        useFor: "Default state, encountering new concepts",
      },
      frustrated: {
        src: "/assets/characters/peter/frustrated.png",
        label: "Frustrated",
        useFor: "Stuck on problems, debugging pain",
      },
      idea: {
        src: "/assets/characters/peter/idea.png",
        label: "Idea",
        useFor: "Eureka moments, breakthroughs",
      },
      victory: {
        src: "/assets/characters/peter/victory.png",
        label: "Victory",
        useFor: "Success, completing projects, celebrations",
      },
      working: {
        src: "/assets/characters/peter/working.png",
        label: "Working",
        useFor: "Coding, building projects, hands-on learning",
      },
    },
  },
  bruce: {
    name: "Bruce Haryali",
    title: "The Overthinker",
    description: "Analyzes until paralysis",
    color: "#8B5CF6",
    defaultPose: "thinking",
    poses: {
      talkingonphone: {
        src: "/assets/characters/bruce/talkingonphone.png",
        label: "Talking on Phone",
        useFor: "Seeking advice, consulting others endlessly",
      },
      thinking: {
        src: "/assets/characters/bruce/thinking.png",
        label: "Thinking",
        useFor: "Default overthinking pose, analysis paralysis",
      },
      working: {
        src: "/assets/characters/bruce/working.png",
        label: "Working",
        useFor: "Finally taking action, rare productive moment",
      },
    },
  },
};

export type CharacterKey = keyof typeof CHARACTERS;

/** Get all poses for a character as an array */
export function getCharacterPoses(key: CharacterKey): { pose: string; info: CharacterPoseInfo }[] {
  const char = CHARACTERS[key];
  return Object.entries(char.poses).map(([pose, info]) => ({ pose, info }));
}

/** Get the image src for a specific character + pose */
export function getCharacterImage(key: CharacterKey, pose?: string): string {
  const char = CHARACTERS[key];
  const selectedPose = pose || char.defaultPose;
  const poseInfo = char.poses[selectedPose];
  return poseInfo?.src || char.poses[char.defaultPose].src;
}
