# 3. Use ElasticSearch for Data Storage and Search

Date: 2018-03-20

## Status

Accepted

## Context

Elasticsearch is configured as a cluster for reliability and failover, and provides a single point for data updates.
Elasticsearch is also useful for filtering, especially when we will have the same source of data that need bucketing

## Decision

sexual-health-service finder will consume data from Elasticsearch rather than other sources.

## Consequences

Being able to use the existing cluster to add another index will reduce the work needed to get the data allowing for work
to be focused on more ETL and combiner.
