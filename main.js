'use strict';

import process from 'node:process';
import fs from 'node:fs';

const parse = text => {
    const expr = /(\*\*((?!\*\*).)*\*\*)|(_((?!_).)*_)|(```((?!```).)*```)|(`((?!`).)*`)/g;

    const replacement = {
        '```': 'pre',
        '`': 'tt',
        '**': 'b',
        '_': 'i'
    };

    const parsed = text.replace(expr, match => {
        for (const [md, tag] of Object.entries(replacement)) {
            if (!match.startsWith(md)) continue;

            const replaced = `<${tag}>${match.substring(md.length, match.length - md.length)}</${tag}>`;

            if (md !== '```') return parse(replaced);
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

    for (const arg of args.slice(md_file_id)) {
        if (is_out) {
            out.push(arg);
            is_out = false;
            continue;
        }

        if (arg === '-o' | arg === '--out') {
            is_out = true;
            continue;
        }

        mds.push(arg);
    }

    if (is_out === true) {
        console.error(`Error: no file for output specified`)
        process.exit(-1);
    }
    return [mds, out];
}

const run = args => {
    const [mds, out] = parse_args(args);

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

