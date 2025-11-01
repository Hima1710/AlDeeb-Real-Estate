# TODO: Implement Caching for Index Page Data

## Steps:
1. [x] Modify the `load()` function in script.js to add localStorage caching logic:
   - Check for cached data in localStorage with key 'projectsCache'.
   - If cached data exists and is not older than 1 hour, use it to render the projects.
   - Otherwise, fetch from API, cache the data with timestamp, then render.
   - Handle cache invalidation or errors gracefully.

2. [x] Ensure language switching still triggers re-rendering from cache without refetching.

3. [x] Test navigation: Load index.html, go to project.html, back to index.html – verify no API call on back.

4. [ ] (Optional) Add a way to clear cache if needed, e.g., via dev tools or a hidden button.
