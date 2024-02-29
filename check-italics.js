'use strict';

import process from 'node:process';

const check_italics = text => {
    const exp = /((?<=\s|^)(_.*?\s_)(?=\s|$))/gm;
    const matches = text.match(exp) ?? [];
    for (const match of matches) {
        console.error(`Whitespace characters are not allowed before the closing underscore: ${match}`);
    }

    if (matches.length) {
        process.exit(-1);
    }
};

export default check_italics;

