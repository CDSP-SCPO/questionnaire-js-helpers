# JS Helper Functions for Social Survey Questionnaires

## Background

This repository provides utility javascript functions that can be used to customize
social survey questionnaires like [Qualtrics](https://www.qualtrics.com/). These
functions can be used along with any questionnaire as long as they support injecting
custom JS into the survey flow.

Currently, the library provides custom functions for the following:

### Autocompletion of French Professions

The library provides an autocompletion function based on vanilla HTML and CSS to
provide a list of [PCS professions](https://www.insee.fr/fr/information/2406153) defined
by [INSEE](https://www.insee.fr/fr/accueil) to the survey respondents based on their
input value. This helps the respondents to find their professions from a list of more
than 5000 pre-defined professions list.

## Demo

[See Demo](https://cdsp-scpo.github.io/questionnaire-js-helpers/)

## Getting Started

The library can be downloaded and included with a `<script>` tag in the HTML.

```html
<script src="https://cdn.jsdelivr.net/npm/@cdsp-scpo/questionnaire-js-helpers/dist/questionnaire-helpers.bundled.js"></script>
```

If a specific version of the library is required:

```html
<script src="https://cdn.jsdelivr.net/npm/@cdsp-scpo/questionnaire-js-helpers/dist/questionnaire-helpers.bundled.js@1.0.0"></script>
```

### Using PCS Autocompletion

PCS autocompletion can be used with any regular HTML input field. If the ID of the target
input element is `pcs-professions`, the helper function can be used as follows:

```html
<script>
    questionnaireHelpers.autocompletePCSProfessions("pcs-professions");
</script>
```

The function `autocompletePCSProfessions` takes an optional argument to configure the
autocompletion function. The optional argument has the following structure:

```js
{
    strategy: "fuzzy",
    gender: "homme",
    css: {
        autocompleteItemsClass: "pcs-autocomplete-items",
        autocompleteActiveClass: "pcs-autocomplete-active",
    }
}
```

where each key can be explained as follows:

- `strategy`: Matching strategy. Can take either `fuzzy` or `native`. Default is `fuzzy`
and it uses [microfuzz](https://github.com/Nozbe/microfuzz) to search for matches. `native`
strategy is more basic where exact matches of input string are checked.
- `gender`: Gender for the professions. Default is `homme`.
- `css`: This object contains the names of the CSS classes to be used in the autocompletion
containers. `autocompleteItemsClass` is used for the container that shows the list of
matches where as `autocompleteActiveClass` is used for the container that highlights the
current selection in rhe list. Default CSS classes can be found in the
[pcs.css](https://github.com/CDSP-SCPO/questionnaire-js-helpers/blob/main/style/pcs.css)
file.

For instance, if professions for female with `native` search strategy is needed:

```html
<script>
    questionnaireHelpers.autocompletePCSProfessions("pcs-professions", { strategy: "native", gender: "femme" });
</script>
```

## License

This project is licensed under Apache 2.0 - see the [LICENSE](./LICENSE) file for details.

## Authors

This work has been created by the developers of [CDSP](https://www.sciencespo.fr/cdsp/fr/)
at [SciencesPo](https://www.sciencespo.fr/fr/).
