'use strict';

import process from 'node:process';
import fs from 'node:fs';

import expr from './matches.js';
import html_replacers from './replacers.js';
import ansi_replacers from './ansi-replacers.js';

let replacers = html_replacers;

const nested_check = replaced => {
    const matches = replaced.match(expr) ?? [];
    for (const match of matches) {
        console.error(`Nested md is forbidden: ${match}`);
    }

    if (matches.length) {
        process.exit(-1);
    }
}

const parse = text => {
    const formats = {
        '```': 'preformatted',
        '`': 'monospaced',
        '**': 'bold',
        '_': 'italics'
    };

    const parsed = text.replace(expr, match => {
        for (const [md, format] of Object.entries(formats)) {
            if (!match.startsWith(md)) continue;

            const replace = replacers[format];
            const replaced = replace(match);

            if (md !== '```') {
                nested_check(replaced)
            }

            return replaced;
        }
    });

    return parsed;
}

const parse_args = args => {
    const md_file_id = 2;

    if (args.length <= md_file_id) {
        console.log('no files given');
    }

    const mds = [];
    const out = [];
    let is_out = false;
    let format = 'html';

    for (const arg of args.slice(md_file_id)) {
        if (is_out) {
            out.push(arg);
            is_out = false;
            continue;
        }

        if (arg === '-o' || arg === '--out') {
            is_out = true;
            continue;
        }

        if (arg === '--format' || arg === '-f') {
            format = 'ansi';
            continue;
        }

        if (arg.startsWith('--format=')) {
            format = arg.slice('--format='.length);
            continue;
        }

        mds.push(arg);
    }

    if (is_out === true) {
        console.error(`Error: no file for output specified`)
        process.exit(-1);
    }

    if (format !== 'ansi' && format !== 'html') {
        console.warn(`Unsuported format: ${format}, html used by default`);
        format = 'html';
    }

    return [mds, out, format];
}

const run = args => {
    const [mds, out, format] = parse_args(args);

    if (format === 'ansi') {
        replacers = ansi_replacers;
    }

    const parsed_elms = [];

    for (const md of mds) {
        try {
            const content = fs.readFileSync(md, 'utf8');
            parsed_elms.push(parse(content));
        } catch (e) {
            console.error(`${e}`);
        }
    }

    const parsed = parsed_elms.join('');

    if (!out.length) {
        console.log(parsed);
        return;
    }

    for (const to of out) {
        try {
            fs.writeFileSync(to, parsed);
        } catch(e) {
            console.error(`${e}`);
        }
    }
}

export default run;

