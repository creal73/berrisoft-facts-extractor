import readline = require('readline');
import fs = require('fs');
import commandLineArgs = require('command-line-args');
import commandLineUsage = require('command-line-usage');

import { Fact } from './src/fact';

import { optionsDefinition } from './src/option-definitions';
import { sectionsDefinition } from './src/sections-definition';

import { extractQuote } from './src/extractor';

/**
 * Definition of the Berrisoft Facts eXtractor CLI.
 */
export class BfxCli {
    private options: commandLineArgs.CommandLineOptions;
    private sections: string;

    private facts: Fact[];

    constructor() {
        this.options = commandLineArgs(optionsDefinition);
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

                const quote = extractQuote(line);
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
}
