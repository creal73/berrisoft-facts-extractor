import readline = require('readline');
import fs = require('fs');
import commandLineArgs = require('command-line-args');
import commandLineUsage = require('command-line-usage');

import { Section, OptionDefinition } from 'command-line-usage';

/**
 * CLI Arguments options.
 * @see OptionDefinition
 */
const optionDefinitions: OptionDefinition[] = [
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

/**
 * CLI Usage definition.
 * @see Section
 */
const sectionsDefinition: Section[] = [
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
        optionList: optionDefinitions,
    },
];

interface CliOptions {
    help: true;
    file: string;
    verbose: boolean;
    output: string;
}

interface Quote {
    who: string;
    how: string;
    what: string;
}

interface Fact {
    quotes: Quote[]
}

/**
 * Definition of the Berrisoft Facts eXtractor CLI.
 */
export class BfxCli {
    private options: commandLineArgs.CommandLineOptions;
    private sections: string;

    private facts: Fact[];

    constructor() {
        this.options = commandLineArgs(optionDefinitions);
        this.sections = commandLineUsage(sectionsDefinition);

        this.facts = [];
    }

    /**
    * Startup of bfx CLI.
    */
    run() {
        if (this.options.help) {
            this.usage();
            return;
        }

        if (!this.options.file) {
            console.error(`Input file parameter is missing !`);
            this.usage();
            return;
        }

        this.parseFile(this.options.file);
    }

    /**
    * Parses the input file to convert it to JSON structure.
    * @param {string} file
    */
    private parseFile(file: string) {
        let firstTime: boolean = true;
        let fact: Fact;
        let previousLineWasBlank = false;

        const reader = readline.createInterface({
            input: fs.createReadStream(file),
            crlfDelay: Infinity,
        });

        reader.on('line', line => {
            const blankOrEmptyOrLineBreak = /^\s*$/;

            if (firstTime) {
                fact = { quotes: [] };
            }

            firstTime = false;

            if (this.options.verbose) {
                console.debug('---------');
                console.debug(line);
            }

            if (blankOrEmptyOrLineBreak.test(line)) {
                previousLineWasBlank = true;
            } else {
                if (previousLineWasBlank) {
                    previousLineWasBlank = false;

                    if (this.options.verbose) {
                        console.log(`Commiting fact...`);
                    }

                    this.facts.push(fact);

                    if (this.options.verbose) {
                        console.log(`Creating a new Fact !`);
                    }

                    fact = { quotes: [] };
                }
                // Iterate over the quotes of the current fact
                if (this.options.verbose) {
                    console.log(`Pushing quote... (${line})`);
                }

                const quote = this.extractQuote(line);
                fact.quotes.push(quote);
            }
        });

        reader.on('close', () => {
            fs.writeFile(
                this.options.output,
                JSON.stringify(this.facts, null, 4),
                { encoding: 'utf8' },
                err => {
                    if (err) {
                        console.error(err);
                    }

                    console.log(`Facts extracted to ${this.options.output}`);
                }
            );
        });
    }

    /**
    * Prints usage.
    */
    private usage() {
        console.log(this.sections);
    }

    /**
    * Extracts a quote object from a line.
    * @param line The line corresponding to a quote.
    */
    private extractQuote(line: string): Quote {
        const whoRegex = /^\[(\w+)\]/;
        const whoMatch = line.match(whoRegex);
        let who: string = '';
        if (whoMatch) {
            who = whoMatch[1];
        }

        const howRegex = /\((.+)\)/;
        const howMatch = line.match(howRegex);
        let how: string = '';
        if (howMatch) {
            how = howMatch[1];
        }

        line = line.replace(`[${who}]`, '');
        line = line.replace(`(${how})`, '');
        const what = line.trim();

        return { who: who, how: how, what: what };
    }
}
