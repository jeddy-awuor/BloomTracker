export interface Quote {
  text: string;
  author: string;
}

export const MOTIVATION_QUOTES: Quote[] = [
  {
    text: "I never took a day off in my twenties. Not one.",
    author: "Bill Gates",
  },
  {
    text: "Sometimes you can succeed through sheer force of will.",
    author: "Sam Altman",
  },
  {
    text: "Extreme people get extreme results.",
    author: "Sam Altman",
  },
  {
    text: "People with very high expectations have very low resilience—and unfortunately, resilience matters in success.",
    author: "Jensen Huang",
  },
  {
    text: "Greatness comes from character. And character isn't formed out of smart people, it's formed out of people who suffered.",
    author: "Jensen Huang",
  },
  {
    text: "Be a yardstick of quality. Some people aren't used to an environment where excellence is expected.",
    author: "Steve Jobs",
  },
  {
    text: "If you really look closely, most overnight successes took a long time.",
    author: "Steve Jobs",
  },
  {
    text: "I wish upon you ample doses of pain and suffering.",
    author: "Jensen Huang",
  },
  {
    text: "Impatience with actions, patience with results.",
    author: "Naval Ravikant",
  },
  {
    text: "You are in danger of living a life so comfortable and soft, that you will die without ever realizing your true potential.",
    author: "David Goggins",
  },
  {
    text: "I can't relate to lazy people. We don't speak the same language. I don't understand you. I don't want to understand you.",
    author: "Kobe Bryant",
  },
  {
    text: "No task is beneath me. I once worked as a dishwasher. I've cleaned numerous toilets, probably more than all of you combined.",
    author: "Jensen Huang",
  },
  {
    text: "Some people want it to happen, some wish it would happen, others make it happen.",
    author: "Michael Jordan",
  },
  {
    text: "You have to be burning with an idea, or a problem, or a wrong that you want to right. If you're not passionate enough from the start, you'll never stick it out.",
    author: "Steve Jobs",
  },
  {
    text: "You earn reputation by trying to do hard things well.",
    author: "Jeff Bezos",
  },
  {
    text: "Step by step, ferociously.",
    author: "Jeff Bezos",
  },
  {
    text: "The most important thing is to be relentlessly resourceful.",
    author: "Paul Graham",
  },
  {
    text: "Life is not fair, get used to it.",
    author: "Bill Gates",
  },
  {
    text: "Don't wish it were easier. Wish you were better.",
    author: "Jim Rohn",
  },
  {
    text: "Hard work is a prison sentence only if it does not have meaning.",
    author: "Malcolm Gladwell",
  },
];

export function getDailyQuoteIndex(): number {
  const today = new Date().toDateString();
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = today.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % MOTIVATION_QUOTES.length;
}

export function getRandomQuoteIndex(exclude?: number): number {
  if (MOTIVATION_QUOTES.length <= 1) return 0;
  let index = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
  while (index === exclude) {
    index = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
  }
  return index;
}
