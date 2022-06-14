export const sizes = [1, 2, 3] as const;
export type SizeType = typeof sizes[number];

export const variables = {
  sizes,
};
