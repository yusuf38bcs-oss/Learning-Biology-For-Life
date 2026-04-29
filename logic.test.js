/**
 * Unit tests for extracted Blogger Template logic
 * Framework: Jest with JSDOM
 */

// Logic extracted from the theme XML
const pikiShortcode = (t, r) => {
  const n = Array.from(t.matchAll(/(?:(#[a-zA-Z]{0,})=\(([^\)]+)\))/g)).find((t => t[1].split("#")[1] === r));
  return !!n && n[2];
};

function get_text(e) {
  let ret = "";
  for (var t = e.childNodes.length, n = 0; n < t; n++) {
    var o = e.childNodes[n];
    // nodeType 8 is a Comment, nodeType 1 is an Element
    if (o.nodeType !== 8) {
      ret += o.nodeType !== 1 ? o.nodeValue : get_text(o);
    }
  }
  return ret;
}

describe('Blogger Template Utility Logic', () => {
  
  describe('pikiShortcode()', () => {
    test('should extract value for a given key in complex shortcode strings', () => {
      const shortcodeStr = "#buttons=(Ok, Go it!) #days=(20) #type=(blogger)";
      expect(pikiShortcode(shortcodeStr, 'buttons')).toBe('Ok, Go it!');
      expect(pikiShortcode(shortcodeStr, 'days')).toBe('20');
      expect(pikiShortcode(shortcodeStr, 'type')).toBe('blogger');
    });

    test('should return false when a key does not exist', () => {
      const shortcodeStr = "#buttons=(Ok, Go it!)";
      expect(pikiShortcode(shortcodeStr, 'missing')).toBe(false);
    });

    test('should handle empty or malformed strings gracefully', () => {
      expect(pikiShortcode("", "any")).toBe(false);
      expect(pikiShortcode("just plain text without markers", "any")).toBe(false);
    });
  });

  describe('get_text()', () => {
    test('should recursively extract all text from nested nodes while ignoring comments', () => {
      // Create a mock DOM structure
      const container = document.createElement('div');
      container.innerHTML = `
        <p>Part 1 <span>Nested Part</span></p>
        <!-- This comment should be ignored -->
        <div>Part 2</div>
      `;
      
      const extracted = get_text(container).replace(/\s+/g, ' ').trim();
      expect(extracted).toBe('Part 1 Nested Part Part 2');
    });
  });
});
