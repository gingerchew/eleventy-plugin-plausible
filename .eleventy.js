// Example use:
// {% plausible %}

module.exports = (eleventyConfig, _options = {}) => {
  // Define defaults for your plugin config
  const defaults = {
    domain: 'replace.me', // the bare domain that plausible is keeping track of
    // Cannot remove defer attribute
    // not recommended by the default plausible js snippet, 
    // but here's the option anyways :)
    async: false 
  };

  // You can create more than filters as a plugin, but here's an example
  eleventyConfig.addShortcode("plausible", () => {
    const options = {
      ...defaults,
      ..._options
    }

    let { domain, async } = options;

    if (domain.startsWith('http://')) domain = domain.slice(7);
    if (domain.startsWith('https://')) domain = domain.slice(8);

    const attr = async ? 'async defer' : 'defer';

    return `<script ${attr} data-domain="${domain}" src="https://plausible.io/js/plausible.js"></script>`;
  });
};
