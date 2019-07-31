# Contribution Guidelines

We welcome patches to NHS products, as long as you follow these guidelines:

## Git workflow

- Pull requests must contain a succinct, clear summary of what the user need is
  driving this feature change
- Make a feature branch, ideally in the format `feature/summary-of-change` e.g.
  `feature/add-login`
- Follow our [Git styleguide](https://github.com/nhsuk/styleguides/blob/master/git.md)
- Ensure your branch contains logical, atomic commits
- Pull requests are automatically tested and need to pass in order for the PR
  to be eligible to merge
- You *may* rebase your branch after feedback if it's to include relevant
  updates from the master branch. We prefer a rebase here to a merge commit as
  we prefer a clean and straight history on master with discrete merge commits
  for features
- Using a single emoji to start the commit message is encouraged. See the other
  commits in the repo for examples

## Copy

- URLs should use hyphens, not underscores

## Code

Must:
- be readable with meaningful naming, e.g. no shorthand single character
  variable names
- follow our [styleguides](https://github.com/nhsuk/styleguides)
- pass linting with the ruleset from `.eslint.json` (`yarn lint`). Lint will
  run on all commits, rebases and as part of CI

## Testing

Write tests.

## Versioning

We use [Semantic Versioning](http://semver.org/), and bump the version
on master only. Please don't submit your own proposed version numbers.

## Browser support

Please see
[nhsuk-frontend browser-support](https://github.com/nhsuk/nhsuk-frontend/blob/master/docs/contributing/browser-support.md#browser-support)
for the level of required browser support.

# Assistive technology support

Please see
[nhsuk-frontend assistive-technology-support](https://github.com/nhsuk/nhsuk-frontend/blob/master/docs/contributing/browser-support.md#assistive-technology-support)
for the level of required assistive technology support.
