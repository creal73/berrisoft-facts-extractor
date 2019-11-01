import { Section } from 'command-line-usage';
import { optionsDefinition } from './option-definitions';

/**
 * CLI Usage definition.
 * @see Section
 */
export const sectionsDefinition: Section[] = [
  {
    header: 'Berrisoft Facts Extractor',
    content: 'Extracts Berrisoft Facts from text file.',
  },
  {
    header: 'Synopsis',
    content: [
      '$ bfx [{bold --file} {underline file}] {bold --output} {underline file} ...',
      '$ bfx {bold --help}',
    ],
  },
  {
    header: 'Examples',
    content: [
      {
        desc:
          '1. Short syntax. By default, parsed data will be saved to data.json in current directory. ',
        example: '$ bfx myFile.txt',
      },
      {
        desc: '2. Complete syntax. ',
        example: '$ bfx --file myFile.txt --output parsedData.json',
      },
    ],
  },
  {
    header: 'Options',

    optionList: optionsDefinition,
  },
];
