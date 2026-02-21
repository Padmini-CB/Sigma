import { DA_BOOTCAMP } from './da-bootcamp';
import { DE_BOOTCAMP } from './de-bootcamp';
import { DS_GENAI_BOOTCAMP } from './ds-genai-bootcamp';
import { AI_ENGINEERING_BOOTCAMP } from './ai-engineering-bootcamp';

export { DA_BOOTCAMP, DE_BOOTCAMP, DS_GENAI_BOOTCAMP, AI_ENGINEERING_BOOTCAMP };

export const ALL_BOOTCAMPS = {
  'da': DA_BOOTCAMP,
  'de': DE_BOOTCAMP,
  'ds-genai': DS_GENAI_BOOTCAMP,
  'ai-engineering': AI_ENGINEERING_BOOTCAMP,
} as const;

export type BootcampKey = keyof typeof ALL_BOOTCAMPS;
