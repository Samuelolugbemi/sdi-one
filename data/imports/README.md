Place exported CSV files here using these names:

- customers.csv
- vendors.csv
- jobs.csv  (formerly projects.csv)
- invoices.csv
- invoice-lines.csv
- equipment.csv
- inventory.csv

Then run:

```powershell
npm run import:all
```

Or import one dataset at a time:

```powershell
npm run import:customers -- data/imports/customers.csv
npm run import:jobs -- data/imports/jobs.csv
```
