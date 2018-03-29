# 3. Use ElasticSearch for Data Storage and Search

Date: 2018-03-20

## Status

Accepted

## Context

Elasticsearch is configured as a cluster for reliability and failover, and provides a single point for data updates.
Elasticsearch is used for filtering for the different service data requirements of the application.

## Decision

The application will use Elasticsearch for service data retrieval purposes.

## Consequences

There is an existing Elasticsearch instance which will be able to be used, reducing setup and configuration time.