import { boxStyles, pseudoClassSuffixes } from './boxStyles';

export type StyleKey = keyof typeof boxStyles;

export type PseudoClassSuffix = (typeof pseudoClassSuffixes)[number];
