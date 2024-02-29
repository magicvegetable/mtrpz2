'use strict';

const italics_around = '\\.|,|;|\\?|\\]|\\}|\'|"|`';
const italics = `((?<=\\s|^|${italics_around})(_.*?_)(?=\\s|$|${italics_around}))`;
const bold = '(\\*{2}.*?\\*{2})';
const preformatted = '(`{3}(.|\\n)*?`{3})';
const monospaced = '(`.*?(?<!`)`(?!`{1,2}))';

const all = [italics, bold, preformatted, monospaced];

const regexp = new RegExp(all.join('|'), 'gm');

export default regexp;

