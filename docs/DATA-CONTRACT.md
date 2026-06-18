# Data Contract

The application expects these CSV headers based on the files supplied.

## customers.csv
`Customer, Name, Address_1, City, State, ZIP_Code, Type`

## vendors.csv
`Vendor, Name, Address_1, City, State, ZIP, Type`

## jobs.csv
`Job, Well, Description, County, Unique_Job, Record_Type_Name, Status, AR_Customer, WorkTypeId`

## invoices.csv
`Sage_ID, Vendor, Invoice_Date, Invoice, Vendor_Invoice_Number, Description, Amount`

## invoice-lines.csv
`Sage_ID, Invoice_Sage_ID, Parent_Invoice_Sage_ID, Job, Unique_Job, Cost_Code, Activity_Status, Activity_Date, Transaction_Date, Amount, Vendor_Sage_ID, Expense_Account, Description`

## equipment.csv
`Equipment, Description, Status`

## inventory.csv
`Row_ID, Accounting_Date, Amount, Date_Stamp, Description, JC_Transaction_Type, Transaction_Date, Unit_Cost, Units, Cost_Code, Job, Unique_Job_Number`

# Relationship Map

- `customers.Customer` → `jobs.AR_Customer`
- `jobs.Job` → `invoice-lines.Job`
- `jobs.Unique_Job` → `invoice-lines.Unique_Job`
- `jobs.Job` → `inventory.Job`
- `jobs.Unique_Job` → `inventory.Unique_Job_Number`
- `vendors.Vendor` → `invoices.Vendor`
- `vendors.Vendor` → `invoice-lines.Vendor_Sage_ID`
- `invoices.Sage_ID` → `invoice-lines.Invoice_Sage_ID`
