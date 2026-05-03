/**
 * Unit tests for extracted Blogger Template logic
 * Framework: node:test
 */

const test = require('node:test');
const assert = require('node:assert/strict');

// Logic extracted from the theme XML
const pikiShortcode = (t, r) => {
  const n = Array.from(t.matchAll(/(?:(#[a-zA-Z]{0,})=\(([^\)]+)\))/g)).find((t => t[1].split('#')[1] === r));
  return !!n && n[2];
};

function get_text(e) {
  let ret = '';
  for (var t = e.childNodes.length, n = 0; n < t; n++) {
    var o = e.childNodes[n];
    // nodeType 8 is a Comment, nodeType 1 is an Element
    if (o.nodeType !== 8) {
      ret += o.nodeType !== 1 ? o.nodeValue : get_text(o);
    }
  }
  return ret;
}

test('pikiShortcode() extracts values for valid keys', () => {
  const shortcodeStr = '#buttons=(Ok, Go it!) #days=(20) #type=(blogger)';
  assert.equal(pikiShortcode(shortcodeStr, 'buttons'), 'Ok, Go it!');
  assert.equal(pikiShortcode(shortcodeStr, 'days'), '20');
  assert.equal(pikiShortcode(shortcodeStr, 'type'), 'blogger');
});

test('pikiShortcode() returns false for unknown keys', () => {
  const shortcodeStr = '#buttons=(Ok, Go it!)';
  assert.equal(pikiShortcode(shortcodeStr, 'missing'), false);
});

test('pikiShortcode() handles empty and malformed strings', () => {
  assert.equal(pikiShortcode('', 'any'), false);
  assert.equal(pikiShortcode('just plain text without markers', 'any'), false);
});

test('get_text() recursively extracts text and ignores comments', () => {
  const textNode = (value) => ({ nodeType: 3, nodeValue: value, childNodes: [] });
  const commentNode = (value) => ({ nodeType: 8, nodeValue: value, childNodes: [] });
  const elementNode = (children = []) => ({ nodeType: 1, nodeValue: null, childNodes: children });

  const container = elementNode([
    elementNode([textNode('Part 1 '), elementNode([textNode('Nested Part')])]),
    commentNode(' This comment should be ignored '),
    elementNode([textNode(' Part 2')]),
  ]);

  const extracted = get_text(container).replace(/\s+/g, ' ').trim();
  assert.equal(extracted, 'Part 1 Nested Part Part 2');
});
