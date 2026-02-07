import { CHARACTERS, CharacterKey, getCharacterImage } from "@/data/characters";
import Image from "next/image";

interface CharacterImageProps {
  character: CharacterKey;
  pose?: string;
  className?: string;
  width?: number;
  height?: number;
}

export function CharacterImage({ character, pose, className, width = 300, height = 300 }: CharacterImageProps) {
  const char = CHARACTERS[character];
  const imageSrc = getCharacterImage(character, pose);

  return (
    <Image
      src={imageSrc}
      alt={`${char.name} - ${char.title}`}
      width={width}
      height={height}
      className={`object-contain ${className}`}
    />
  );
}
