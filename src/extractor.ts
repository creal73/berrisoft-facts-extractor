import { Quote } from './quote';

/**
 * Extracts a quote object from a line.
 * @param line The line corresponding to a quote.
 */
export function extractQuote(line: string): Quote {
  line = line.trim();

  const who = extractWho(line);
  const how = extractHow(line);

  line = line.replace(`[${who}]`, '');
  line = line.replace(`(${how})`, '');
  const what = line.trim();

  return {
    who: who,
    how: how,
    what: what,
  };
}

function extractWho(line: string) {
  const whoRegex = /^\[(.+)\]/;
  const whoMatch = line.match(whoRegex);
  let who: string = '';

  if (whoMatch) {
    who = whoMatch[1];
  }

  return who;
}

function extractHow(line: string) {
  const howRegex = /\((.+)\)/;
  const howMatch = line.match(howRegex);
  let how: string = '';

  if (howMatch) {
    how = howMatch[1];
  }

  return how;
}
