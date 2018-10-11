# Gap Analysis

Service: Over 25 Non-Postal Free Kits

## Queries

### Source Data (syndication query)

http://v1.syndication.nhschoices.nhs.uk/services/types/srv0531/cl388438.xml?apikey=bbccdd

### ETL

  https://github.com/nhsuk/sexual-health-information-etl/blob/master/app/lib/mappers/mapService.js


### Elastic Search Query

```
{
  must: [
    { match: { serviceType: 'SRV0531' } },
  ],
}
```
From [here](https://github.com/nhsuk/sexual-health-service-finder/blob/master/app/lib/elasticsearch/coreQuery.js)

### Search Service Query

```
curl -X POST \
  'https://nhsuksearchprodne.search.windows.net/indexes/organisationlookup/docs/search?api-version=2017-11-11' \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 222ef897-e806-4880-bedc-dfad24c4114d' \
  -H 'api-key: 163B9B17F1E81C792A77E84B76B4C3ED' \
  -H 'cache-control: no-cache' \
  -d '{
  "search": "SW16 6LY",
  "filter": "ServiceCodesProvided/any(scp : scp eq '\''SRV0531'\'')",
  "count": true
}'
```

## Gaps

* Query fields missing from source data
  * None
* Display fields missing from source data
  * distance
* Display fields renamed from source data
  * See [here](https://github.com/nhsuk/sexual-health-information-etl/blob/master/app/lib/mappers/mapService.js) for the mapping between raw syndication output and shaped data for the app.

## Notes

* The renaming/formatting/enriching of data can be handled by moving the mappers from the ETL to the application. In addition, there may need to be some small changes to the mappers.
* The missing data (nonCore elements - see the syndication response) will need to be addressed in the data factory