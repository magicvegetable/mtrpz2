'use strict';

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

const replace = (tag, md, match) =>
    `<${tag}>${match.substring(md.length, match.length - md.length)}</${tag}>`
;

const italics = match => (
    check_italics(match),
    replace('i', '_', match)
);

const bold = match => replace('b', '**', match);
const preformatted = match => replace('pre', '```', match);
const monospaced = match => replace('tt', '`', match);

const replacers = {
    preformatted,
    monospaced,
    bold,
    italics
};

export default replacers;

