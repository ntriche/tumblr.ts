import { Command } from "commander";

const program = new Command();

program
    .name("tumblr.ts cli")
    .description("A command line interface for the tumblr.ts library")

// you can call this like so
// node -r ts-node/register src/cli.ts test this-is-my-argument --boption this-is-my-option

program.command('test')
    .description('A test command')
    .argument('<string>', 'stringy string')
    .option('--boption <string>', 'an option')
    .action((str, options) => {
        console.log(`${str}`)
        console.log(`${options.boption}`)
    })

program.parse();