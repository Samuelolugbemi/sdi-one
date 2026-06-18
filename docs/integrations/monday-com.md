# Monday.com Connector

## Purpose

The Monday.com connector brings project planning boards, items, subitems, owners, statuses and due dates into SDI One.

## Business mapping

- Monday Board -> PlanningBoard
- Monday Item -> PlanningItem
- Monday Subitem -> PlanningTask
- Monday Updates -> Timeline Events
- Monday Users -> SDI Users where possible
- Job/Unique Job columns -> SDI Job relationship

## Required production credentials

- Monday.com API token or OAuth app
- Board IDs to sync
- Mapping of Monday columns to SDI planning fields

## Primary outcomes

- Job planning visibility
- Resource load planning
- Planning timeline
- Planning risk detection
- Project manager workspace readiness
