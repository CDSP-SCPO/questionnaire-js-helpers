import { pcsAutocomplete, defaultOptions } from "./pcsautocomplete.js";

/**
 * Creates a list of divs based on user input and a list of PCS professions
 *
 *
 * @param {string} elementId - ID of element to create a list.
 * @param {Object} options - Options for the autocompletion
 *
 *  The options object must conform to following structure
 *
 * ```js
 * {
 *   gender: "<Gender of PCS professions: homme or femme>",
 *   strategy: "<Search strategy: native or fuzzy>",
 *   css: {
 *     autocompleteItemsClass: "<Name of CSS class for autocomplete items>",
 *     autocompleteActiveClass: "<Name of CSS class for autocomplete active item>"
 *   }
 * }
 * ```
 *
 * If no CSS class is provided, a default CSS will be applied to the document. Similarly,
 * if no gender is provided or any string other than `homme` or `femme` is provided,
 * default value of `homme` will be used.
 */
export async function autocompletePCSProfessions(
  elementId,
  options = defaultOptions,
) {
  document.addEventListener("DOMContentLoaded", async () => {
    return await pcsAutocomplete(elementId, options);
  });
}

export default autocompletePCSProfessions;
