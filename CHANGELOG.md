0.14.0 / 2018-08-15
===================
- Update npm dependencies
- Remove references to `NHS.UK` in favour of `NHS`
- Set background to blue
- Fix input width
- Add title to header and footer home page link

0.13.0 / 2018-08-09
===================
- Update `npm` dependencies
- Transpile frontend JS from ES6 into browse compatible
- Update frontend to use new design
- Update IE css to new design
- Update print css to new design

0.12.0 / 2018-06-28
===================
- Update `npm` dependencies
- Update to `node:8.11.3` 
- Remove `origin` param for <16 and symptomatic sexpert results

0.11.0 / N/A
============
No release

0.10.0 / 2018-05-16
===================
- Fix for XSS vulnerability on location entry
- End `h2` tag on results page

0.9.4 / 2018-05-11
==================
- Fix spacing on the multiple choice options 
- Reduce reveal font size on mobile devices
- Logo link to https://www.nhs.uk/ instead of beta.

0.9.3 / 2018-05-11
==================
- JavaScript/CSS instead of HTML5 details as its not supported any version of IE

0.9.2 / 2018-05-03
==================
- Content based on accessibility lab and link to beta chlamydia page
- Open links in same window

0.9.1 / 2018-04-30
==================
- Final content tweaks
- Allow fonts to be loaded from `*.hotjar.com`

0.9.0 / N/A
==================
- Update content post sign-off
- Update `npm` dependencies
- Improve accessibility of search and logos

0.8.0 / 2018-04-27
==================
- Add performance tests

0.7.0 / 2018-04-24
==================
- England start page accordion tweaks
- Results distance to 1 decimal place
- Mobile typography improvements
- Mobile viewport click to call (tel) links.
- Accessibility improvements
- Webtrends analytics tags

0.6.0 / 2018-04-19
==================
- Collapse duplicate results in Elasticsearch query on uid
- Add pharmacies to kit pickup for 16-24
- Replace sexperts search with kit locations for over 25s
- Use `arc` rather than `plane` for precision in distance
- Use location input for map link
- Do not use name of place in map link
- Display address when there is no postcode
- Add formatted opening times for pharmacies
- Trim leading and trailing spaces on postcode

0.5.0 / 2018-04-11
==================
- Add page descriptions
- Support latest service data model changes
- Add meta description

0.4.0 / 2018-04-10
==================
- Choose pages
- ES integration
- Error messages tweaking
- Search result pages design
- Remove in app breadcrumbs
- Skip to page content links & accessibility help pages
- Accessibility improvements
- Results opening times table
- Queries for sexual health professionals and chlamydia kits under 25
- No indexing for intermediate steps by search engines
- Journey step count

0.3.0 / 2018-03-19
==================
- Error pages
- Symptoms page
- Age page
- Recommend page
- Location page
- PostcodeIO integration
- Form error handling
- Form query validation

0.2.0 / 2018-03-01
==================
- Upgrade python in Alpine to 2.7.14-r0
- Build header items nunjucks
- Use NHS.UK front-end library 
- Add site layout files and a start page

0.1.0 / 2018-02-21
==================
- Initial application architecture
