import { OptionDefinition } from 'command-line-usage';

/**
 * CLI Arguments options.
 * @see OptionDefinition
 */
export const optionsDefinition: OptionDefinition[] = [
  {
    name: 'file',
    type: String,
    defaultOption: true,
    typeLabel: 'file',
    description: 'The input file to process.',
  },
  {
    name: 'output',
    type: String,
    defaultValue: 'data.json',
    typeLabel: 'file',
    description: 'The output file where to extract facts.',
  },
  {
    name: 'verbose',
    type: Boolean,
    alias: 'v',
    defaultValue: false,
    description: 'To display more information during processing.',
  },
  {
    name: 'help',
    type: Boolean,
    description: 'Print this usage guide.',
  },
];
