# Gap Analysis

Service: Sexual Health Information and Support

## Queries

### Source Data (syndication query)

http://v1.syndication.nhschoices.nhs.uk/services/types/sexualhealthinformationandsupport/21724888.xml?apikey=bbccdd

### ETL

  https://github.com/nhsuk/sexual-health-information-etl/blob/master/app/lib/mappers/mapService.js


### Elastic Search Query


```
{
  must: [
    { match: { serviceType: 'Sexual health information and support' } },
    { match: { venueType: 'Clinic' } },
  ],
  must_not: [
    { match: { name: 'Marie Stopes' } },
    { match: { name: 'Young People Friendly Practice' } },
    { match: { name: 'BPAS' } },
  ]
}

```
From [here](https://github.com/nhsuk/sexual-health-service-finder/blob/master/app/lib/elasticsearch/coreQuery.js)

### Search Service Query

```
curl -X POST \
  'https://nhsuksearchprodne.search.windows.net/indexes/organisationlookup/docs/search?api-version=2017-11-11' \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 0baab9d2-5480-409e-b20d-f40df675901f' \
  -H 'api-key: 163B9B17F1E81C792A77E84B76B4C3ED' \
  -H 'cache-control: no-cache' \
  -d '{
  "search": "10 Hammersmith Broadway",
  "filter": "ServicesProvided/any(sp : sp eq '\''Sexual health information and support'\'') and not search.in(OrganisationName, '\''Marie Stopes, Young People Friendly Practice, BPAS'\'')",
  "count": true
}'
```

## Gaps

* Query fields missing from source data
  * venueType
* Display fields missing from source data
  * all nonCore elements (service details, general notes, opening times, venue type)
  * distance
* Display fields renamed from source data
  * See [here](https://github.com/nhsuk/sexual-health-information-etl/blob/master/app/lib/mappers/mapService.js) for the mapping between raw syndication output and shaped data for the app.

## Notes

* The renaming/formatting/enriching of data can be handled by moving the mappers from the ETL to the application. In addition, there may need to be some small changes to the mappers.
* The missing data (nonCore elements - see the syndication response) will need to be addressed in the data factory