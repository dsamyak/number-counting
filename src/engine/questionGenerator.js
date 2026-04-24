import { QUESTION_TYPES } from './questionTypes';
import { shuffle } from '../utils/shuffle';

// Helpers
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const generateId = () => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);

function generateDistractors(correctAnswer, count, min = 1, max = 100, rules = null) {
  const distractors = new Set();
  let attempts = 0;
  while (distractors.size < count && attempts < 100) {
    attempts++;
    let distractor;
    
    if (rules === 'placeValue') {
      // Common mistakes: swap digits, +1/-1 tens/ones
      const tens = Math.floor(correctAnswer / 10);
      const ones = correctAnswer % 10;
      const type = randomInt(1, 3);
      if (type === 1) distractor = ones * 10 + tens; // swap
      else if (type === 2) distractor = Math.max(min, Math.min(max, correctAnswer + (randomInt(0,1)?10:-10))); // wrong tens
      else distractor = Math.max(min, Math.min(max, correctAnswer + (randomInt(0,1)?1:-1))); // wrong ones
    } else {
      // Normal within range of +/- 20
      distractor = Math.max(min, Math.min(max, correctAnswer + randomInt(-20, 20)));
    }

    if (distractor !== correctAnswer && distractor >= min && distractor <= max) {
      distractors.add(distractor);
    }
  }
  
  // Fallback if rules couldn't find enough
  while (distractors.size < count) {
    const fallback = randomInt(min, max);
    if (fallback !== correctAnswer) distractors.add(fallback);
  }
  
  return Array.from(distractors);
}

export function generateQuestion(type) {
  const id = generateId();
  let q = { id, type };

  switch (type) {
    case QUESTION_TYPES.IDENTIFY_NUMBER: {
      const num = randomInt(1, 100);
      const visuals = ['blocks', 'ten_frame', 'hundred_chart'];
      q.correctAnswer = num;
      q.visual = { type: visuals[randomInt(0, visuals.length - 1)], value: num };
      q.difficulty = num > 40 ? 'medium' : 'easy';
      q.points = 10;
      q.prompt = 'What number is shown?';
      q.options = shuffle([num, ...generateDistractors(num, 3)]);
      q.hint = 'Count the groups of ten first!';
      break;
    }

    case QUESTION_TYPES.BEFORE_AFTER: {
      const num = randomInt(2, 99);
      const isBefore = Math.random() > 0.5;
      q.correctAnswer = isBefore ? num - 1 : num + 1;
      q.difficulty = num > 50 ? 'medium' : 'easy';
      q.points = 10;
      q.prompt = `What number comes ${isBefore ? 'before' : 'after'} ${num}?`;
      q.options = shuffle([q.correctAnswer, ...generateDistractors(q.correctAnswer, 3, Math.max(1, q.correctAnswer - 5), Math.min(100, q.correctAnswer + 5))]);
      q.hint = isBefore ? 'Count backward by 1' : 'Count forward by 1';
      break;
    }

    case QUESTION_TYPES.FILL_SEQUENCE: {
      const step = [1, 2, 5, 10][randomInt(0, 3)];
      const start = randomInt(1, 100 - (step * 7));
      const sequence = Array.from({ length: 8 }, (_, i) => start + i * step);
      const blankIndex = randomInt(2, 5);
      q.correctAnswer = sequence[blankIndex];
      sequence[blankIndex] = '___';
      
      q.difficulty = step > 2 ? 'hard' : 'medium';
      q.points = 15;
      q.prompt = `Fill in the missing number: ${sequence.join(', ')}`;
      q.options = shuffle([q.correctAnswer, ...generateDistractors(q.correctAnswer, 3, Math.max(1, q.correctAnswer - step*3), Math.min(100, q.correctAnswer + step*3))]);
      q.hint = `What is the pattern? Are they counting by ${step}s?`;
      break;
    }

    case QUESTION_TYPES.PLACE_VALUE: {
      const num = randomInt(10, 99);
      const tens = Math.floor(num / 10);
      const ones = num % 10;
      q.correctAnswer = num;
      q.difficulty = 'medium';
      q.points = 15;
      q.prompt = `${tens} tens and ${ones} ones = ___`;
      q.options = shuffle([num, ...generateDistractors(num, 3, 10, 99, 'placeValue')]);
      q.hint = `Combine the tens and ones: ${tens}0 + ${ones}`;
      break;
    }

    case QUESTION_TYPES.COMPARE_NUMBERS: {
      const num1 = randomInt(1, 100);
      let num2 = randomInt(1, 100);
      while (num1 === num2) num2 = randomInt(1, 100); // ensure different
      
      const askBigger = Math.random() > 0.5;
      q.correctAnswer = askBigger ? Math.max(num1, num2) : Math.min(num1, num2);
      q.difficulty = 'easy';
      q.points = 10;
      q.prompt = `Which number is ${askBigger ? 'bigger' : 'smaller'}?`;
      q.options = [num1, num2]; // Only 2 options
      q.hint = `Look at the tens digit first!`;
      break;
    }

    case QUESTION_TYPES.ORDER_NUMBERS: {
      const nums = new Set();
      while(nums.size < 4) nums.add(randomInt(1, 100));
      const arr = Array.from(nums);
      q.correctAnswer = [...arr].sort((a,b)=>a-b).join(','); // Correct order as string
      q.difficulty = 'hard';
      q.points = 20;
      q.prompt = 'Arrange the numbers from smallest to largest.';
      q.options = arr; // Options to be sorted by user
      q.hint = 'Find the smallest number first.';
      break;
    }

    case QUESTION_TYPES.SKIP_COUNTING: {
      const step = [2, 5, 10][randomInt(0, 2)];
      const start = step * randomInt(1, Math.floor((100 - step * 5) / step));
      const sequence = Array.from({ length: 6 }, (_, i) => start + i * step);
      const blankIndex = randomInt(1, 4);
      q.correctAnswer = sequence[blankIndex];
      sequence[blankIndex] = '___';
      
      q.difficulty = 'hard';
      q.points = 20;
      q.prompt = `Complete the skip counting pattern: ${sequence.join(', ')}`;
      q.options = shuffle([q.correctAnswer, ...generateDistractors(q.correctAnswer, 3, Math.max(1, q.correctAnswer - step*3), Math.min(100, q.correctAnswer + step*3))]);
      q.hint = `Try counting by ${step}s!`;
      break;
    }

    case QUESTION_TYPES.WORD_PROBLEM: {
      const subjects = ['apples', 'stickers', 'marbles', 'stars'];
      const subject = subjects[randomInt(0, subjects.length - 1)];
      const start = randomInt(10, 50);
      const add = randomInt(5, 30);
      q.correctAnswer = start + add;
      q.difficulty = 'hard';
      q.points = 25;
      q.prompt = `Benny had ${start} ${subject}. He got ${add} more. How many ${subject} does he have now?`;
      q.options = shuffle([q.correctAnswer, ...generateDistractors(q.correctAnswer, 3)]);
      q.hint = `Try to add ${start} and ${add} together.`;
      break;
    }
    
    default:
      break;
  }

  return q;
}
