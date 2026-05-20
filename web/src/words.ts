import type { Difficulty } from './types'

const EASY = [
  'the','be','to','of','and','in','it','for','not','on',
  'with','he','as','you','do','at','but','by','from','they',
  'we','her','she','or','an','my','one','all','up','out',
  'if','who','get','go','me','can','no','him','know','take',
  'good','some','them','see','now','look','come','also','back','use',
  'two','how','new','want','any','give','day','us','work','well',
  'way','even','old','hand','high','time','year','face','end','mind',
  'side','show','move','find','tell','keep','home','real','life','few',
  'open','next','walk','food','sure','top','cut','try','long','book',
  'eat','room','once','stop','head','run','hold','ask','hot','far',
  'draw','left','cold','led','hit','big','red','age','arm','eye',
  'boy','ten','set','got','let','sit','bit','car','dog','air',
  'sea','sky','lot','job','law','war','oil','ice','box','net',
]

const NORMAL = [
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
  'best', 'cut', 'try', 'point', 'sound', 'water', 'long', 'book', 'carry', 'eat',
]

const HARD = [
  'achieve','balance','capture','develop','elegant','factory','genuine','harvest','imagine','journey',
  'kingdom','liberty','measure','natural','observe','patient','quality','require','silence','venture',
  'between','certain','chapter','climate','company','complex','concern','control','correct','country',
  'culture','despite','distant','excited','failure','forward','freedom','general','healthy','history',
  'hundred','include','instead','kitchen','machine','medical','mention','million','minutes','mistake',
  'morning','nothing','outside','perfect','perhaps','picture','problem','quickly','reasons','regular',
  'related','science','several','similar','special','started','strange','student','success','surface',
  'teacher','through','tonight','trouble','usually','various','watched','whether','without','written',
  'already','another','because','believe','brought','careful','carried','complete','contain','current',
  'decided','evening','example','feeling','finally','foreign','further','however','increase','language',
  'learning','leaving','machine','matter','morning','nothing','outside','perhaps','picture','possible',
  'present','private','produce','reading','running','several','someone','special','started','students',
  'surface','teacher','through','tonight','trouble','usually','various','watched','whether','without',
]

function shuffle(arr: string[]): string[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function generateWords(count: number, difficulty: Difficulty = 'normal'): string[] {
  const pool = difficulty === 'easy' ? EASY : difficulty === 'hard' ? HARD : NORMAL
  const result: string[] = []
  while (result.length < count) {
    result.push(...shuffle(pool))
  }
  return result.slice(0, count)
}
