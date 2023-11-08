## Plausible Analytics Snippet

> Add the analytics script tag with a shortcode and remove *some* of the worry :)

## TODO Before 2.0.0 Fully Releases

- [ ] Test each option
  - [x] scriptExtensions
  - [x] proxyPath
  - [x] exclude
  - [ ] include
  - [ ] async
  - [ ] transform
- [ ] Test error handling
  - [ ] No domain
  - [ ] Invalid JSON
- [ ] Look for edgecases

### Using this plugin

```js
const pluginPlausible = require('eleventy-plugin-plausible');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginPlausible, {
    domain: 'mywebsite.com'
  });
}
```

## Notice

This is a pet project of **Ginger (ME)** and is in no way related to the team at Plausible Analytics. I am lazy and wanted a shortcode to manage the snippet for my different sites, rather than finding where the head is, copy and pasting. This let me put in the shortcode `{% plausible %}` and then add the plugin with my website and be done with it.

## There's an issue with...

Since this is not maintained by Plausible Analytics, I cannot help you with anything related to their product.

This plugin does 1 thing and 1 thing only, put HTML onto a page. Give it the right domain, and there shouldn't be a problem.

If the snippet that Plausible Analytics uses to track users changes, I will update the template string here when notified. Other than that, there is nothing I can do.

## Credits

- [Plausible Analytics](https://plausible.io) *(seriously check them out)*
- [11ty](https://www.11ty.dev)
- [Stephanie Eckles a.k.a. 5t3ph](https://github.com/5t3ph) for the [eleventy-plugin-template](https://github.com/5t3ph/eleventy-plugin-template) that this plugin is built on.