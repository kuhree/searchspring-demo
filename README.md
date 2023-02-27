# Searchspring Demo

## Getting started

- Install deps: `pnpm install`
- Run dev server: `pnpm serve`
- Run quality and test: `pnpm format/lint/test`
- Build for production: `pnpm build`

## Requirements

- [ ] An input box for a search bar with a search button next to it.
  - [ ] When someone types into the search bar and hits enter or clicks the search button display product results below the search bar.
        You’ll want to use “resultsFormat=native” as part of the API request to get your results back as JSON.
        You’ll want to pass the search query using the “q” parameter.
- [ ] Display the product image using the “thumbnailImageUrl”, the product “name” and “price”.
  - [ ] If the product has an “msrp” field and it’s greater than “price” field display the “msrp” next to the price crossed out.
  - [ ] Above and below the results show pagination with next and previous buttons. You could also display some pages before/after the current page as applicable.
    - [ ] If you’re on the first page you shouldn’t show the previous button or it should be disabled.
    - [ ] If you’re on the last page you shouldn’t show the next button or it should be disabled.
- [ ] You’ll be able to change the page by making another request to our Search API with the “page” parameter set to the page you’d like to request.

### Resources

Yours does not need to be as involved, but we would like to see what you come up with for a design.

- I’ve included a sample search request below that does a search for jeans and gets the 2nd page of results.
  - Use site ID “scmq7n” for this example.
  - `http://api.searchspring.net/api/search/search.json?siteId=scmq7n&q=jeans&resultsFormat=native&page=2`
- If you want to see an example of what a full integration looks like see the following links.
  - https://condescending-bassi-4d660a.netlify.app/
  - https://shopily.netlify.app/
