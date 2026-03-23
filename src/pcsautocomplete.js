import createFuzzySearch from "@nozbe/microfuzz";
import css from "../style/pcs.css";

// Default options
export const defaultOptions = {
  gender: "homme",
  stratgey: "fuzzy",
  css: {
    autocompleteItemsClass: "pcs-autocomplete-items",
    autocompleteActiveClass: "pcs-autocomplete-active",
  },
};

// Autocomplete div ID suffix
const autocompleteDivIDSuffix = "-pcs-autocomplete-list";

// Tokens to ignore when doing native search
const ignoreTokens = [
  "a",
  "au",
  "dans",
  "de",
  "des",
  "du",
  "en",
  "et",
  "la",
  "le",
  "ou",
  "sur",
  "aux",
  "dans",
  "un",
  "une",
  "pour",
  "avec",
  "chez",
  "par",
  "les",
];

// Regex containing tokens to ignore
const ignoreTokensRegex = new RegExp(ignoreTokens.join(" | "), "g");

/**
 * Finds matches based on user input and list of autocompletion items
 * and creates HTML elements on the given element.
 *
 * @param {string} elementId - ID of the input element.
 * @param {Object} options - Options of the autocomplete.
 */
export async function pcsAutocomplete(elementId, options) {
  // Fetch element given by the ID. If no element found, return
  const inputElement = document.getElementById(elementId);
  if (!inputElement) {
    console.warn(`No element with ID ${elementId} found`);
    return false;
  }

  // Ensure CSS classnames are setup
  options.css = { ...defaultOptions.css, ...options.css };

  // Always inject default CSS into style
  let defaultStyle = document.createElement("style");
  defaultStyle.innerHTML = css;
  document.head.appendChild(defaultStyle);

  var currentFocus;

  // Fetch professions
  const professions = await getProfessions(options.gender);

  // Instantiate fuzzy search
  const fuzzySearch = createFuzzySearch(professions, {
    strategy: "smart",
  });

  // Execute a function when someone writes in the text field
  // eslint-disable-next-line no-unused-vars
  inputElement.addEventListener("input", function (e) {
    // Close any already open lists of autocompleted values
    closeAllLists();

    // If no input value provided or less than 3 characters provided, return
    if (!this.value || this.value.length < 3) {
      return false;
    }

    // Make a search
    let matches;
    if (options.strategy === "native") {
      matches = nativeSearch(this.value, professions);
    } else {
      matches = fuzzySearch(this.value);
    }

    // Reset current focus
    currentFocus = -1;

    // Create a div element that will contain the items (values)
    var professionsDiv = document.createElement("div");
    professionsDiv.setAttribute("id", this.id + autocompleteDivIDSuffix);
    professionsDiv.setAttribute("class", options.css.autocompleteItemsClass);

    // Append the div element as a child of the autocomplete container
    this.parentNode.appendChild(professionsDiv);

    // Loop over all matches
    for (let i = 0; i < matches.length; i++) {
      // Consider item only when match starts from the beginning
      if (
        matches[i].matches[0].length > 0 &&
        matches[i].matches[0][0][0] === 0
      ) {
        var professionItemDiv = document.createElement("div");
        professionItemDiv.innerHTML = "";

        // Make the matching letters bold
        let lastHighlightedIndex = 0;
        matches[i].matches[0].forEach(([start, end]) => {
          // Broken range, ignore
          if (start < lastHighlightedIndex || end < start) {
            console.warn(
              `Broken range in highlighting: ${start}-${end}, last: ${lastHighlightedIndex}`,
            );
            return;
          }
          if (start > lastHighlightedIndex) {
            professionItemDiv.innerHTML += matches[i].item.substring(
              lastHighlightedIndex,
              start,
            );
          }
          professionItemDiv.innerHTML +=
            "<strong>" +
            matches[i].item.substring(start, end + 1) +
            "</strong>";
          lastHighlightedIndex = end + 1;
        });
        if (matches[i].item.length > lastHighlightedIndex) {
          professionItemDiv.innerHTML += matches[i].item.substring(
            lastHighlightedIndex,
            matches[i].item.length,
          );
        }

        // Insert a input field that will hold the current array item's value
        professionItemDiv.innerHTML +=
          "<input type='hidden' value=\"" + matches[i].item + '">';
        // Execute a function when someone clicks on the item value (div element)
        // eslint-disable-next-line no-unused-vars
        professionItemDiv.addEventListener("click", function (e) {
          // Insert the value for the autocomplete text field
          inputElement.value = this.getElementsByTagName("input")[0].value;
          // Close the list of autocompleted values,
          // (or any other open lists of autocompleted values:
          closeAllLists();
        });
        professionsDiv.appendChild(professionItemDiv);
      }
    }
  });

  // Execute a function presses a key on the keyboard
  inputElement.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + autocompleteDivIDSuffix);
    if (x) x = x.getElementsByTagName("div");
    if (e.key === "ArrowDown") {
      // If the arrow DOWN key is pressed, increase the currentFocus variable
      currentFocus++;
      // and and make the current item more visible
      addActive(x);
      // // Scroll element into view
      // document
      //   .querySelector("." + options.css.autocompleteActiveClass)
      //   .scrollIntoView();
    } else if (e.key === "ArrowUp") {
      // If the arrow UP key is pressed, decrease the currentFocus variable
      currentFocus--;
      // and and make the current item more visible
      addActive(x);
      // // Scroll element into view
      // document
      //   .querySelector("." + options.css.autocompleteActiveClass)
      //   .scrollIntoView();
    } else if (e.key === "Enter") {
      // If the ENTER key is pressed, prevent the form from being submitted
      e.preventDefault();
      // and simulate a click on the "active" item
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });

  inputElement.addEventListener("keydown", function (e) {
    const scroll = ["ArrowUp", "ArrowDown"].includes(e.key);
    if (scroll) {
      document
        .querySelector("." + options.css.autocompleteActiveClass)
        .scrollIntoView();
    }
  });

  // Close all list when clicked anywhere on the document
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });

  // Make the element div as active in the list.
  function addActive(elements) {
    if (!elements) return false;
    // Start by removing the "active" class on all items
    removeActive(elements);
    if (currentFocus >= elements.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = elements.length - 1;
    // Add class autocompleteActiveClass
    elements[currentFocus].classList.add(options.css.autocompleteActiveClass);
  }

  // Removes the element div as active in the list.
  function removeActive(elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.remove(options.css.autocompleteActiveClass);
    }
  }

  // Closes all autocomplete lists in the document, except the one passed as an argument.
  function closeAllLists(element) {
    var x = document.getElementsByClassName(options.css.autocompleteItemsClass);
    for (var i = 0; i < x.length; i++) {
      if (element != x[i] && element != inputElement) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
}

/**
 * Normalize string and remove all ignored tokens.
 *
 * @param {string} input - Input string.
 * @returns {string} - Normalized string.
 */
function normalizeText(input, removeInsignificantTokens = true) {
  const normalizedString = input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace("-", " ")
    .toLowerCase();
  if (!removeInsignificantTokens) {
    return normalizedString;
  }
  return normalizedString
    .replace(ignoreTokensRegex, " ")
    .replace("d'", "")
    .replace("l'", "")
    .replace("(", "")
    .replace(")", "")
    .replace(",", "");
}

/**
 * Perform a native search of query string in list of professions.
 *
 * @param {string} query - Queried string.
 * @param {Array<string>} professions - Array of professions.
 * @returns {Array<Object>} - Array of match objects.
 */
function nativeSearch(query, professions) {
  var firstWordMatches = [];
  var midWordMatches = [];
  var matches = [];

  // Normalize the query string
  const normalizedQuery = normalizeText(query);
  const queryWords = normalizeText(query, false).split(" ");

  // for each item in the professions
  for (let i = 0; i < professions.length; i++) {
    const normalizedItem = normalizeText(professions[i]);
    if (normalizedItem.includes(normalizedQuery)) {
      // Get match indices
      const normalizedItemWithTokens = normalizeText(professions[i], false);
      var matchIndices = [];
      for (let j = 0; j < queryWords.length; j++) {
        const wordIndex = normalizedItemWithTokens.indexOf(queryWords[j]);
        if (wordIndex >= 0) {
          matchIndices.push([wordIndex, wordIndex + queryWords[j].length - 1]);
        }
      }

      // Separate matches that match at the beginning of the string
      const matchIndx = normalizedItem.indexOf(normalizedQuery);
      if (matchIndx === 0) {
        firstWordMatches.push({ item: professions[i], matches: matchIndices });
      } else {
        if (
          normalizedItem[matchIndx - 1] === " " ||
          normalizedItem[matchIndx - 1] === "'"
        ) {
          midWordMatches.push({ item: professions[i], matches: matchIndices });
        }
      }
    }
  }

  // Always prioritise the matches that match at beginning of the string
  firstWordMatches.forEach(function (item) {
    matches.push({ item: item.item, matches: [item.matches] });
  });
  midWordMatches.forEach(function (item) {
    matches.push({ item: item.item, matches: [item.matches] });
  });

  return matches;
}

/**
 * Fetches list of professions from datav.sciencespo.fr based on gender.
 *
 * @param {string} gender - Gender.
 * @returns {Array} - Array of professions
 */
async function getProfessions(gender) {
  // Convert to lowercase
  gender = gender.toLocaleLowerCase();

  // Check if gender is either homme or femme. If neither log a warning and default
  // to homme
  if (!["femme", "homme"].includes(gender)) {
    console.warn(
      `Gender must be either homme or femme but got ${gender}. Defaulting to homme`,
    );
    gender = "homme";
  }

  const url = `https://datav.sciencespo.fr/api/pcs/professions/?genre=${gender}`;
  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) {
      console.error(`Response status: ${response.status}`);
      return new Array();
    }

    // Await response and get professions array if response is non empty
    const responseBody = await response.json();
    if (responseBody) return responseBody.professions;
    return new Array();
  } catch (error) {
    console.error(`Failed to fetch professions list: ${error.message}`);
    return new Array();
  }
}

export default pcsAutocomplete;
