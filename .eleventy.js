// @ts-check
// Example use:
// {% plausible %}
const defaults = {
  domain: 'replace.me', // the bare domain that plausible is keeping track of
  // Cannot remove defer attribute
  // not recommended by the default plausible js snippet, 
  // but here's the option anyways :)
  async: false,
  transform: false // add a transform
};
/**
 * 
 * @param {import('@11ty/eleventy/src/UserConfig')} eleventyConfig 
 * @param {typeof defaults} _options 
 */
module.exports = (eleventyConfig, _options) => {
  // Define defaults for your plugin config
  /**
   * @type {typeof defaults}
   */
  const options = {
    ...defaults,
    ..._options
  }
  let { domain, async } = options;
  if (domain.startsWith('https://')) domain = domain.slice(8);
  if (domain.startsWith('http://')) domain = domain.slice(7);
  const attr = async ? 'async defer' : 'defer';

  const el = `<script ${attr} data-domain="${domain}" src="https://plausible.io/js/plausible.js"></script>`;

  // You can create more than filters as a plugin, but here's an example
  eleventyConfig.addShortcode("plausible", () => el);

  // @ts-ignore
  if (options.transform) {
    eleventyConfig.addTransform("plausible", (content, outputPath) => {
      if (outputPath && outputPath.endsWith('.html')) {
        return content.split('</head>').join(`${el}</head>`);
      }
      return content;
    })
  }
};
