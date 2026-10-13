import { cards as allCards } from './cards.js';
import { sampleCards } from './cards.sample.js';

const filled = allCards.filter((c) => c.yomi.trim() && c.tori.trim());

// 1枚も入力されていなければサンプル札で動かす
export const usingSample = filled.length === 0;
export const cards = usingSample ? sampleCards : filled;
export const totalCardCount = allCards.length;
