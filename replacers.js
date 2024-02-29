'use strict';

import check_italics from './check-italics.js';

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

