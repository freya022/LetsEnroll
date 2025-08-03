export type UnicodeEmojiCandidate = {
  names: string[];
  unicode: string;
  variants: string[];
  /**
   * The index in the spritesheet.
   *
   * The spritesheet to use varies:
   * - No variants: Take the sheet with all non-diversity sprites
   * - Has variants: Take the sheet based on the currently selected diversity (default = empty string, other = hex string of the diversity's codepoints)
   */
  spriteIndex: number;
};

export type CustomEmojiCandidate = {
  name: string;
  id: string;
  animated: boolean;
};

export type EmojiCandidate = UnicodeEmojiCandidate | CustomEmojiCandidate;
