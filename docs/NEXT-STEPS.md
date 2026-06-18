# Next Steps After This Release

1. Wire your existing Intacct export automation so it drops CSVs into `data/imports`.
2. Add a Windows Task Scheduler job that runs `npm run import:all` after exports complete.
3. Add auth/roles before broader internal deployment.
4. Add source connectors when credentials become available:
   - Salesforce: account/contact/opportunity enrichment.
   - Ford Pro: vehicle mileage, health, exceptions.
   - Fuel System: fuel gallons, spend, MPG, driver/card data.
   - Monday.com: tasks, safety, project status.
   - POR: equipment utilization, rental revenue, repair/maintenance details.
5. Deploy internally behind HTTPS.
