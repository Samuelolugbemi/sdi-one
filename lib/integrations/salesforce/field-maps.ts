export const salesforceFieldMaps = {
  accounts: {
    Id: 'salesforceId',
    Name: 'name',
    Sage_ID__c: 'customerId',
    BillingStreet: 'address1',
    BillingCity: 'city',
    BillingState: 'state',
    BillingPostalCode: 'zipCode',
    Type: 'type',
  },
  contacts: {
    Id: 'salesforceId',
    AccountId: 'accountSalesforceId',
    FirstName: 'firstName',
    LastName: 'lastName',
    Email: 'email',
    Phone: 'phone',
    Title: 'title',
  },
  opportunities: {
    Id: 'salesforceId',
    Name: 'name',
    AccountId: 'accountSalesforceId',
    StageName: 'stage',
    Amount: 'amount',
    CloseDate: 'closeDate',
    Probability: 'probability',
  },
  jobs: {
    Id: 'salesforceId',
    Name: 'name',
    CW_Unique_Job_Number__c: 'uniqueJob',
    Status__c: 'status',
    Account__c: 'accountSalesforceId',
  },
  thirdPartyInvoices: {
    Id: 'salesforceId',
    Sage_ID__c: 'sageId',
    Vendor_Sage_ID__c: 'vendorId',
    Invoice_Date__c: 'invoiceDate',
    Amount__c: 'amount',
    Description__c: 'description',
  },
  thirdPartyInvoiceLines: {
    Id: 'salesforceId',
    Sage_ID__c: 'sageId',
    Parent_Invoice_Sage_ID__c: 'parentInvoiceSageId',
    Unique_Job__c: 'uniqueJob',
    Cost_Code_Sage_ID__c: 'costCode',
    Amount__c: 'amount',
    Vendor_Sage_ID__c: 'vendorSageId',
    Expense_Account__c: 'expenseAccount',
    Description__c: 'description',
  },
  costCodes: {
    Id: 'salesforceId',
    Name: 'name',
    Cost_Code_Sage_ID__c: 'costCode',
    CW_UniqueID__c: 'uniqueId',
  },
  products: {
    Id: 'salesforceId',
    Name: 'name',
    ProductCode: 'productCode',
    CW_UniqueID__c: 'uniqueId',
  },
} as const;

export function getSalesforceFieldMap(sourceKey: keyof typeof salesforceFieldMaps) {
  return salesforceFieldMaps[sourceKey];
}
