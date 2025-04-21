export type ValidationError = {
  path: string;
  message: string;
};

export type UnicodeEmojiCandidate = {
  aliases: string[];
  unicode: string;
  variants: string[];
};

export type CustomEmojiCandidate = {
  name: string;
  id: string;
  animated: boolean;
};

export type EmojiCandidate = UnicodeEmojiCandidate | CustomEmojiCandidate;
