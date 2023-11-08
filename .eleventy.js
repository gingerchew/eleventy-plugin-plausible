// Example use:
// {% plausible %}
const defaults = {
  domain: '', // the bare domain that plausible is keeping track of
  // Cannot remove defer attribute
  // not recommended by the default plausible js snippet, 
  // but here's the option anyways :)
  async: false,
  transform: false, // add a transform
  exclude: [], // support for https://plausible.io/docs/excluding-pages
  include: [], // support including pages within an excluded glob
  // Enable some alternate versions of the analytics script
  // for example, hash, outbound-links, file-download, revenue
  // @NOTE: Some of the above may need extra requirements in
  // the Plausible Dashboard
  // Full list of extensions can be found here: https://plausible.io/docs/script-extensions
  scriptExtensions: [], 
  // if proxying the plausible analytics script, 
  // pass the same path you do in your redirects file
  // prefixed by the root url without the file extension
  // e.g. proxy is /js/special-script.js
  // and the root url is "ginger.wtf"
  // then proxyPath should be "https://ginger.wtf/js/specialScript"
  proxyPath: false 
};
/**
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
  let {
    domain,
    async,
    exclude,
    include,
    scriptExtensions,
    proxyPath
  } = options;
  // @ts-ignore
  if (!domain) {
    throw new Error('Must include domain option.');
  }
  scriptExtensions = new Set(...scriptExtensions);
  if (domain.startsWith('https://')) domain = domain.slice(8);
  if (domain.startsWith('http://')) domain = domain.slice(7);
  const attr = async ? ' async defer ' : ' defer ';
  let src= !proxyPath ? "https://plausible.io/js/script" : proxyPath;
  
  let excludeAttr = ''
  if (exclude.length) {
    scriptExtensions.add('exclusions')
    excludeAttr = ' data-exclude="' + exclude.join(', ') + '" ';
  
    excludeAttr += include.length ?
      ' data-include"' + include.join(', ') + '" ' :
      '';
  }
    
  const getScriptEl = (content) => {
    /**
     * Pass in page properties by putting **_valid_** json
     * in between the start and end tags 
     * ```html
     * {% plausible %}
     * {
     *  "author":"Jimmy Buffet",
     *  "logged_in": true,
     *  "darkmode": false
     * }
     * {% endplausible %}
     * ```
     */
    let props = '';
    if (content.length) {
      scriptExtensions.add('pageview-props');
      content = content.trim()
      try {
        const propsJSON = JSON.parse(content);
        props = Object.entries(propsJSON).map(([ key, value ]) => ` event-${key}="${value}" `).join(' ');
      } catch(e) {
        console.log('Error: ', e.message);
      }
    }
    if (scriptExtensions) {
      src = `${src}.${[...scriptExtensions].join('.')}`
    }
    src += '.js';

    return `<script ${attr} data-domain="${domain}" ${props}  ${includeAttr} ${excludeAttr} ${src}></script>`;
  }

  // You can create more than filters as a plugin, but here's an example
  eleventyConfig.addShortcode("plausible", getScriptEl);
  
  // Add this to the head of your 404 page
  // Follow the instructions here to see 404 stats: https://plausible.io/docs/error-pages-tracking-404#3-create-a-custom-event-goal-in-your-plausible-analytics-account
  eleventyConfig.addShortcode("plausible404", () => `<script>window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }</script>
  <script>document.addEventListener('DOMContentLoaded', function () { plausible('404', { props: { path: document.location.pathname } }); });</script>`)

  // @ts-ignore
  /**
   * the transform does not support pageviewProps
   * you must instead add the manual extension and
   * follow these steps: https://plausible.io/docs/script-extensions#scriptmanualjs
   * to add in manual pageprops tracking
   */
  if (options.transform) {
    eleventyConfig.addTransform("plausible", (content) => {
      const addScript = this.page.outputPath && this.page.outputPath.endsWith('.html');

      if (addScript) {
        const el = getScriptEl();

        return content.split('</head>').join(`${el}</head>`);
      }
      return content;
    })
  }
};
