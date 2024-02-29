'use strict';

import ansi from 'ansi-escape-sequences';

import check_italics from './check-italics.js';

const replace = (style, md, match) =>
    `${style}${match.substring(md.length, match.length - md.length)}${ansi.style.reset}`
;

const italics = match => (
    check_italics(match),
    replace(ansi.style.italic, '_', match)
);

const bold = match => replace(ansi.style.bold, '**', match);
const preformatted = match => replace(ansi.style['bg-grey'], '```', match);
const monospaced = match => replace(ansi.style['bg-white'] + ansi.style.black, '`', match);

const replacers = {
    preformatted,
    monospaced,
    bold,
    italics
};

export default replacers;

