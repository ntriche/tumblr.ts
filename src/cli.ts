import { Command } from "commander";

const program = new Command();

program
    .name("tumblr.ts cli")
    .description("A command line interface for the tumblr.ts library")

program.command('test')
    .description('A test command')
    .argument('<string>', 'stringy string')
    .option('--boption <string>', 'an option')
    .action((str, options) => {
        console.log(`${str}`)
        console.log(`${options.boption}`)
    })

program.parse();