const WORDS = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
  'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
  'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
  'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so',
  'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when',
  'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people',
  'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than',
  'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back',
  'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even',
  'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'great',
  'between', 'need', 'large', 'often', 'hand', 'high', 'place', 'hold', 'turn', 'where',
  'show', 'play', 'small', 'number', 'off', 'always', 'move', 'still', 'find', 'should',
  'every', 'own', 'under', 'last', 'little', 'home', 'read', 'never', 'end', 'tell',
  'follow', 'keep', 'start', 'city', 'earth', 'light', 'thought', 'head', 'story', 'far',
  'sea', 'draw', 'left', 'late', 'run', 'while', 'close', 'night', 'real', 'life',
  'few', 'open', 'seem', 'next', 'white', 'children', 'walk', 'since', 'hard', 'young',
  'until', 'form', 'food', 'feet', 'land', 'side', 'without', 'boy', 'once', 'animal',
  'enough', 'took', 'sometimes', 'four', 'above', 'kind', 'began', 'almost', 'live', 'page',
  'door', 'sure', 'become', 'top', 'ship', 'across', 'today', 'during', 'short', 'better',
  'best', 'cut', 'try', 'point', 'play', 'sound', 'water', 'long', 'book', 'carry',
  'eat', 'room', 'friend', 'began', 'idea', 'fish', 'mountain', 'stop', 'face', 'watch',
  'color', 'wood', 'main', 'open', 'seem', 'together', 'next', 'white', 'children', 'example',
  'paper', 'group', 'always', 'music', 'those', 'both', 'mark', 'book', 'letter', 'until',
  'mile', 'river', 'car', 'feet', 'care', 'second', 'enough', 'plain', 'girl', 'usual',
  'young', 'ready', 'above', 'ever', 'red', 'list', 'though', 'feel', 'talk', 'bird',
]

function shuffle(arr: string[]): string[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function generateWords(count: number): string[] {
  const result: string[] = []
  while (result.length < count) {
    result.push(...shuffle(WORDS))
  }
  return result.slice(0, count)
}
