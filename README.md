# Searchspring Demo

## Technologies

- Typescript
  - Zod
- Vite
  - Vitest
- React
  - React-router
  - React-icons
- Tailwindcss
  - SCSS
- Eslint
  - Typescript-eslint
  - Prettier
- Github Actions

## Getting started

- Install deps: `pnpm install`
- Run dev server: `pnpm serve`
- Run quality and test: `pnpm [format,lint,test]`
- Build for production: `pnpm build`

## Usage

- Configuration
  - Certain properties (title, description, socials) can be managed using the [SiteConfig][site-config]
- Styling - tailwind, scsss, and css custom-properties
  - Manage your themes in [the root stylesheet][index-stylesheet] and the [tailwind-config][tailwind-config]
  - Most custom components still support a `className` to help you style them further

## Requirements

- [x] An input box for a search bar with a search button next to it.
  - [x] When someone types into the search bar and hits enter or clicks the search button display product results below the search bar.
        You’ll want to use “resultsFormat=native” as part of the API request to get your results back as JSON.
        You’ll want to pass the search query using the “q” parameter.
- [x] Display the product image using the “thumbnailImageUrl”, the product “name” and “price”.
  - [x] If the product has an “msrp” field and it’s greater than “price” field display the “msrp” next to the price crossed out.
  - [x] Above and below the results show pagination with next and previous buttons. You could also display some pages before/after the current page as applicable.
        If you’re on the first page you shouldn’t show the previous button or it should be disabled.
        If you’re on the last page you shouldn’t show the next button or it should be disabled.
- [x] You’ll be able to change the page by making another request to our Search API with the “page” parameter set to the page you’d like to request.

### Addons

- [x] Add router
  - [x] Sync search to url for shareable searches
- [ ] Advanced Search
  - [ ] In-Query Refinement
  - [ ] Implement Filters
  - [ ] Implement Sort
  - [ ] Search history
- [ ] More themes

### Known Bugs

- [x] Query is not always synced to the form
- [x] Improve ResultsGrid and ResultItem display
- [x] Theming
  - [x] Implement dark theme

### Future Improvements

- [x] Re-implement SearchQueryBuilder for other queries like `trending` and `best-selling`. See PR #1
  - [x] Allow for a schema to be passed in that defines what to build and params to set.
- [ ] UI testing w/ playwright

### Resources

Yours does not need to be as involved, but we would like to see what you come up with for a design.

- I’ve included a sample search request below that does a search for jeans and gets the 2nd page of results.
  - Use site ID “scmq7n” for this example.
  - `http://api.searchspring.net/api/search/search.json?siteId=scmq7n&q=jeans&resultsFormat=native&page=2`
- If you want to see an example of what a full integration looks like see the following links.
  - https://condescending-bassi-4d660a.netlify.app/
  - https://shopily.netlify.app/

[site-config]: ./src/utils/site-config.ts
[index-stylesheet]: ./src/styles/index.scss
[tailwind-config]: ./tailwind.config.cjs
