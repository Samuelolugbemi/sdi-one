-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "customerId" TEXT NOT NULL,
    "name" TEXT,
    "address1" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "type" TEXT,
    "raw" JSONB,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" SERIAL NOT NULL,
    "vendorId" TEXT NOT NULL,
    "name" TEXT,
    "address1" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "type" TEXT,
    "raw" JSONB,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "jobId" TEXT NOT NULL,
    "well" TEXT,
    "description" TEXT,
    "county" TEXT,
    "uniqueJob" TEXT,
    "recordTypeName" TEXT,
    "status" TEXT,
    "customerId" TEXT,
    "workTypeId" TEXT,
    "raw" JSONB,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "sageId" TEXT NOT NULL,
    "vendorId" TEXT,
    "invoiceDate" TIMESTAMP(3),
    "invoice" TEXT,
    "vendorInvoiceNumber" TEXT,
    "description" TEXT,
    "amount" DECIMAL(18,2),
    "raw" JSONB,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceLine" (
    "id" SERIAL NOT NULL,
    "sageId" TEXT NOT NULL,
    "invoiceSageId" TEXT,
    "parentInvoiceSageId" TEXT,
    "jobId" TEXT,
    "uniqueJob" TEXT,
    "costCode" TEXT,
    "activityStatus" TEXT,
    "activityDate" TIMESTAMP(3),
    "transactionDate" TIMESTAMP(3),
    "amount" DECIMAL(18,2),
    "vendorId" TEXT,
    "expenseAccount" TEXT,
    "description" TEXT,
    "raw" JSONB,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvoiceLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" SERIAL NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT,
    "raw" JSONB,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryTransaction" (
    "id" SERIAL NOT NULL,
    "rowId" TEXT NOT NULL,
    "accountingDate" TIMESTAMP(3),
    "amount" DECIMAL(18,2),
    "dateStamp" TIMESTAMP(3),
    "description" TEXT,
    "jcTransactionType" TEXT,
    "transactionDate" TIMESTAMP(3),
    "unitCost" DECIMAL(18,4),
    "units" DECIMAL(18,4),
    "costCode" TEXT,
    "jobId" TEXT,
    "uniqueJobNumber" TEXT,
    "raw" JSONB,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportRun" (
    "id" SERIAL NOT NULL,
    "source" TEXT NOT NULL,
    "fileName" TEXT,
    "status" TEXT NOT NULL,
    "rowsImported" INTEGER NOT NULL DEFAULT 0,
    "rowsFailed" INTEGER NOT NULL DEFAULT 0,
    "message" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "ImportRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSourceConnection" (
    "id" SERIAL NOT NULL,
    "system" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Not configured',
    "connectionType" TEXT,
    "notes" TEXT,
    "lastSyncAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataSourceConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppUser" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "title" TEXT,
    "department" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "passwordHash" TEXT,
    "isExecutive" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCompanyAccess" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserCompanyAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserJobAccess" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "jobId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserJobAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentRecord" (
    "id" SERIAL NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityKey" TEXT NOT NULL,
    "entityLabel" TEXT,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT,
    "fileType" TEXT,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "storageProvider" TEXT NOT NULL DEFAULT 'local',
    "storageBucket" TEXT,
    "storageKey" TEXT,
    "contentHash" TEXT,
    "description" TEXT,
    "category" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "version" INTEGER NOT NULL DEFAULT 1,
    "uploadedBy" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimelineEvent" (
    "id" SERIAL NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityKey" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "source" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "raw" JSONB,

    CONSTRAINT "TimelineEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityRelationship" (
    "id" SERIAL NOT NULL,
    "sourceEntityType" TEXT NOT NULL,
    "sourceEntityKey" TEXT NOT NULL,
    "targetEntityType" TEXT NOT NULL,
    "targetEntityKey" TEXT NOT NULL,
    "relationshipType" TEXT NOT NULL,
    "sourceSystem" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EntityRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationRule" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'Info',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityKey" TEXT,
    "description" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedReport" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "config" JSONB,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureFlag" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeatureFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityType" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "pluralName" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "sourceModel" TEXT,
    "routePath" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "supportsSearch" BOOLEAN NOT NULL DEFAULT true,
    "supportsTimeline" BOOLEAN NOT NULL DEFAULT true,
    "supportsDocuments" BOOLEAN NOT NULL DEFAULT true,
    "supportsAi" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntityType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityField" (
    "id" SERIAL NOT NULL,
    "entityTypeId" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "fieldType" TEXT NOT NULL DEFAULT 'text',
    "sourceColumn" TEXT,
    "description" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isSearchable" BOOLEAN NOT NULL DEFAULT false,
    "isListVisible" BOOLEAN NOT NULL DEFAULT true,
    "isDetailVisible" BOOLEAN NOT NULL DEFAULT true,
    "isFilterable" BOOLEAN NOT NULL DEFAULT false,
    "isSortable" BOOLEAN NOT NULL DEFAULT false,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntityField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityCapability" (
    "id" SERIAL NOT NULL,
    "entityTypeId" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntityCapability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityWorkspaceSection" (
    "id" SERIAL NOT NULL,
    "entityTypeId" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "sectionType" TEXT NOT NULL DEFAULT 'panel',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntityWorkspaceSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityPermissionTemplate" (
    "id" SERIAL NOT NULL,
    "entityTypeId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "defaultRoles" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntityPermissionTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityRelationshipRule" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "sourceEntityTypeId" INTEGER NOT NULL,
    "targetEntityTypeId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "inverseLabel" TEXT,
    "relationshipType" TEXT NOT NULL,
    "sourceField" TEXT NOT NULL,
    "targetField" TEXT NOT NULL,
    "cardinality" TEXT NOT NULL DEFAULT 'many-to-one',
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntityRelationshipRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSession" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "tokenHash" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchIndex" (
    "id" SERIAL NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "body" TEXT,
    "href" TEXT NOT NULL,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SearchIndex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationItem" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "title" TEXT NOT NULL,
    "message" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'Info',
    "entityType" TEXT,
    "entityKey" TEXT,
    "href" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowDefinition" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "triggerType" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowRun" (
    "id" SERIAL NOT NULL,
    "workflowId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "entityType" TEXT,
    "entityKey" TEXT,
    "currentStage" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "context" JSONB,

    CONSTRAINT "WorkflowRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkspaceFavorite" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "entityType" TEXT NOT NULL,
    "entityKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkspaceFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityActivity" (
    "id" SERIAL NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityKey" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "actor" TEXT,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "raw" JSONB,

    CONSTRAINT "EntityActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentFolder" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "entityType" TEXT,
    "entityKey" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentVersion" (
    "id" SERIAL NOT NULL,
    "documentId" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "storageKey" TEXT,
    "sizeBytes" INTEGER,
    "mimeType" TEXT,
    "uploadedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentShare" (
    "id" SERIAL NOT NULL,
    "documentId" INTEGER NOT NULL,
    "shareType" TEXT NOT NULL,
    "targetKey" TEXT,
    "permission" TEXT NOT NULL DEFAULT 'View',
    "expiresAt" TIMESTAMP(3),
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentShare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentAccessEvent" (
    "id" SERIAL NOT NULL,
    "documentId" INTEGER NOT NULL,
    "eventType" TEXT NOT NULL,
    "actor" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentAccessEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentRequirement" (
    "id" SERIAL NOT NULL,
    "entityType" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "requiredFor" TEXT,
    "description" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformEvent" (
    "id" SERIAL NOT NULL,
    "eventType" TEXT NOT NULL,
    "entityType" TEXT,
    "entityKey" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'Info',
    "source" TEXT,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "PlatformEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DashboardDefinition" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "description" TEXT,
    "layout" JSONB,
    "isSystem" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DashboardDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DashboardWidget" (
    "id" SERIAL NOT NULL,
    "dashboardId" INTEGER,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "widgetType" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "size" TEXT NOT NULL DEFAULT 'md',
    "config" JSONB,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DashboardWidget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KpiDefinition" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "description" TEXT,
    "queryKey" TEXT,
    "format" TEXT NOT NULL DEFAULT 'number',
    "targetValue" DECIMAL(18,2),
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KpiDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperationalAlert" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'Info',
    "domain" TEXT NOT NULL,
    "entityType" TEXT,
    "entityKey" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Open',
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "OperationalAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataQualityCheck" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "description" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'Warning',
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "resultCount" INTEGER NOT NULL DEFAULT 0,
    "lastRunAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataQualityCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiInsight" (
    "id" SERIAL NOT NULL,
    "entityType" TEXT,
    "entityKey" TEXT,
    "insightType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'Info',
    "confidence" DECIMAL(5,2),
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalRequest" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "entityType" TEXT,
    "entityKey" TEXT,
    "requestedBy" TEXT,
    "assignedTo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "dueAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ApprovalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkItem" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "workType" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'Normal',
    "status" TEXT NOT NULL DEFAULT 'Open',
    "entityType" TEXT,
    "entityKey" TEXT,
    "assignedTo" TEXT,
    "dueAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "WorkItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomationRule" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "domain" TEXT NOT NULL,
    "entityType" TEXT,
    "triggerType" TEXT NOT NULL,
    "condition" JSONB,
    "action" JSONB,
    "severity" TEXT NOT NULL DEFAULT 'Info',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AutomationRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledJobDefinition" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "schedule" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Enabled',
    "lastRunAt" TIMESTAMP(3),
    "nextRunAt" TIMESTAMP(3),
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledJobDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledJobRun" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Started',
    "message" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "metrics" JSONB,

    CONSTRAINT "ScheduledJobRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalPolicy" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "entityType" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "condition" JSONB,
    "steps" JSONB,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApprovalPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskItem" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "taskType" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'Normal',
    "status" TEXT NOT NULL DEFAULT 'Open',
    "entityType" TEXT,
    "entityKey" TEXT,
    "assignedTo" TEXT,
    "dueAt" TIMESTAMP(3),
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "TaskItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiProviderConfig" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "modelName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Not configured',
    "purpose" TEXT,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiProviderConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiPromptTemplate" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "scope" TEXT NOT NULL,
    "entityType" TEXT,
    "prompt" TEXT NOT NULL,
    "variables" JSONB,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiPromptTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiBriefing" (
    "id" SERIAL NOT NULL,
    "briefingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audience" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "highlights" JSONB,
    "risks" JSONB,
    "actions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiBriefing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiRecommendation" (
    "id" SERIAL NOT NULL,
    "entityType" TEXT,
    "entityKey" TEXT,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "impact" TEXT,
    "confidence" DECIMAL(5,2),
    "status" TEXT NOT NULL DEFAULT 'Open',
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dismissedAt" TIMESTAMP(3),

    CONSTRAINT "AiRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NaturalLanguageQueryLog" (
    "id" SERIAL NOT NULL,
    "query" TEXT NOT NULL,
    "interpretedIntent" TEXT,
    "entities" JSONB,
    "resultCount" INTEGER NOT NULL DEFAULT 0,
    "userEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NaturalLanguageQueryLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntegrationConnector" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "system" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Not configured',
    "description" TEXT,
    "authType" TEXT,
    "baseUrl" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "lastSyncAt" TIMESTAMP(3),
    "nextSyncAt" TIMESTAMP(3),
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntegrationConnector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntegrationMapping" (
    "id" SERIAL NOT NULL,
    "connectorId" INTEGER NOT NULL,
    "sourceObject" TEXT NOT NULL,
    "targetEntity" TEXT NOT NULL,
    "fieldMap" JSONB NOT NULL,
    "transformRules" JSONB,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntegrationMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntegrationRun" (
    "id" SERIAL NOT NULL,
    "connectorId" INTEGER NOT NULL,
    "runType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Queued',
    "recordsRead" INTEGER NOT NULL DEFAULT 0,
    "recordsWritten" INTEGER NOT NULL DEFAULT 0,
    "recordsFailed" INTEGER NOT NULL DEFAULT 0,
    "message" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "metrics" JSONB,

    CONSTRAINT "IntegrationRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntegrationLog" (
    "id" SERIAL NOT NULL,
    "connectorId" INTEGER,
    "level" TEXT NOT NULL DEFAULT 'Info',
    "message" TEXT NOT NULL,
    "entityType" TEXT,
    "entityKey" TEXT,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntegrationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntegrationRetryPolicy" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "backoffType" TEXT NOT NULL DEFAULT 'exponential',
    "retryableErrors" JSONB,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntegrationRetryPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityPolicy" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SecurityPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessReview" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "reviewer" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Open',
    "scope" TEXT NOT NULL,
    "result" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "AccessReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowStepTemplate" (
    "id" SERIAL NOT NULL,
    "workflowKey" TEXT NOT NULL,
    "stepKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "stepType" TEXT NOT NULL DEFAULT 'Action',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "config" JSONB,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowStepTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowActionTemplate" (
    "id" SERIAL NOT NULL,
    "workflowKey" TEXT NOT NULL,
    "stepKey" TEXT NOT NULL,
    "actionKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "description" TEXT,
    "config" JSONB,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowActionTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowExecution" (
    "id" SERIAL NOT NULL,
    "runKey" TEXT NOT NULL,
    "workflowKey" TEXT NOT NULL,
    "workflowName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Queued',
    "entityType" TEXT,
    "entityKey" TEXT,
    "currentStep" TEXT,
    "requestedBy" TEXT,
    "context" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowExecutionStep" (
    "id" SERIAL NOT NULL,
    "executionRunKey" TEXT NOT NULL,
    "stepKey" TEXT NOT NULL,
    "stepName" TEXT NOT NULL,
    "stepType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "assignedTo" TEXT,
    "message" TEXT,
    "result" JSONB,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkflowExecutionStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowActionRun" (
    "id" SERIAL NOT NULL,
    "executionRunKey" TEXT NOT NULL,
    "stepKey" TEXT NOT NULL,
    "actionKey" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "message" TEXT,
    "result" JSONB,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkflowActionRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowEventSubscription" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "workflowKey" TEXT NOT NULL,
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowEventSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowQueueItem" (
    "id" SERIAL NOT NULL,
    "queueKey" TEXT NOT NULL,
    "workflowKey" TEXT NOT NULL,
    "entityType" TEXT,
    "entityKey" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'Normal',
    "status" TEXT NOT NULL DEFAULT 'Queued',
    "payload" JSONB,
    "lockedAt" TIMESTAMP(3),
    "lockedBy" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "nextAttemptAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "WorkflowQueueItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiConversation" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "userEmail" TEXT,
    "entityType" TEXT,
    "entityKey" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiMessage" (
    "id" SERIAL NOT NULL,
    "conversationId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "context" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiContextSnapshot" (
    "id" SERIAL NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityKey" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "metrics" JSONB,
    "relationships" JSONB,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiContextSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiActionPlan" (
    "id" SERIAL NOT NULL,
    "entityType" TEXT,
    "entityKey" TEXT,
    "title" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'Normal',
    "status" TEXT NOT NULL DEFAULT 'Proposed',
    "steps" JSONB NOT NULL,
    "owner" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "AiActionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FleetVehicle" (
    "id" SERIAL NOT NULL,
    "unitNumber" TEXT NOT NULL,
    "equipmentId" TEXT,
    "vin" TEXT,
    "make" TEXT,
    "model" TEXT,
    "modelYear" INTEGER,
    "ownerCompanyId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "currentJobId" TEXT,
    "odometerMiles" DECIMAL(18,2),
    "engineHours" DECIMAL(18,2),
    "fuelCostMtd" DECIMAL(18,2),
    "fuelGallonsMtd" DECIMAL(18,2),
    "mpg" DECIMAL(18,2),
    "utilizationPct" DECIMAL(8,2),
    "lastLocation" TEXT,
    "lastSeenAt" TIMESTAMP(3),
    "healthStatus" TEXT NOT NULL DEFAULT 'Unknown',
    "sourceSystem" TEXT DEFAULT 'SDI One',
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FleetVehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FuelTransaction" (
    "id" SERIAL NOT NULL,
    "transactionKey" TEXT NOT NULL,
    "vehicleId" INTEGER,
    "unitNumber" TEXT,
    "transactionDate" TIMESTAMP(3),
    "vendorName" TEXT,
    "cardNumber" TEXT,
    "driverName" TEXT,
    "gallons" DECIMAL(18,3),
    "amount" DECIMAL(18,2),
    "odometerMiles" DECIMAL(18,2),
    "fuelType" TEXT,
    "location" TEXT,
    "costPerGallon" DECIMAL(18,4),
    "sourceSystem" TEXT DEFAULT 'Fuel System',
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FuelTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelematicsSnapshot" (
    "id" SERIAL NOT NULL,
    "snapshotKey" TEXT NOT NULL,
    "vehicleId" INTEGER,
    "unitNumber" TEXT,
    "sourceSystem" TEXT NOT NULL DEFAULT 'Telematics',
    "latitude" DECIMAL(12,7),
    "longitude" DECIMAL(12,7),
    "speedMph" DECIMAL(10,2),
    "bearing" DECIMAL(10,2),
    "odometerMiles" DECIMAL(18,2),
    "engineHours" DECIMAL(18,2),
    "isCommunicating" BOOLEAN NOT NULL DEFAULT false,
    "currentState" TEXT,
    "currentStateDuration" INTEGER,
    "faultCount" INTEGER NOT NULL DEFAULT 0,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "raw" JSONB,

    CONSTRAINT "TelematicsSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceAlert" (
    "id" SERIAL NOT NULL,
    "alertKey" TEXT NOT NULL,
    "vehicleId" INTEGER,
    "unitNumber" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'Info',
    "status" TEXT NOT NULL DEFAULT 'Open',
    "category" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "sourceSystem" TEXT DEFAULT 'SDI One',
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanningBoard" (
    "id" SERIAL NOT NULL,
    "boardKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerTeam" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "sourceSystem" TEXT NOT NULL DEFAULT 'SDI One',
    "mondayBoardId" TEXT,
    "description" TEXT,
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanningBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanningItem" (
    "id" SERIAL NOT NULL,
    "itemKey" TEXT NOT NULL,
    "boardId" INTEGER,
    "jobId" TEXT,
    "uniqueJob" TEXT,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Planned',
    "priority" TEXT NOT NULL DEFAULT 'Normal',
    "ownerName" TEXT,
    "startDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "completionPct" DECIMAL(10,2),
    "riskLevel" TEXT NOT NULL DEFAULT 'Low',
    "sourceSystem" TEXT NOT NULL DEFAULT 'SDI One',
    "mondayItemId" TEXT,
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanningItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanningTask" (
    "id" SERIAL NOT NULL,
    "taskKey" TEXT NOT NULL,
    "boardId" INTEGER,
    "itemId" INTEGER,
    "jobId" TEXT,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Not Started',
    "taskType" TEXT,
    "assigneeName" TEXT,
    "startDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "percentDone" DECIMAL(10,2),
    "sourceSystem" TEXT NOT NULL DEFAULT 'SDI One',
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanningTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanningDependency" (
    "id" SERIAL NOT NULL,
    "dependencyKey" TEXT NOT NULL,
    "predecessorKey" TEXT NOT NULL,
    "successorKey" TEXT NOT NULL,
    "dependencyType" TEXT NOT NULL DEFAULT 'Finish-to-start',
    "lagDays" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "sourceSystem" TEXT NOT NULL DEFAULT 'SDI One',
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanningDependency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceAssignment" (
    "id" SERIAL NOT NULL,
    "assignmentKey" TEXT NOT NULL,
    "jobId" TEXT,
    "resourceType" TEXT NOT NULL,
    "resourceName" TEXT NOT NULL,
    "resourceId" TEXT,
    "plannedHours" DECIMAL(18,2),
    "actualHours" DECIMAL(18,2),
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'Planned',
    "sourceSystem" TEXT NOT NULL DEFAULT 'SDI One',
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourceAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customerId_key" ON "Customer"("customerId");

-- CreateIndex
CREATE INDEX "Customer_name_idx" ON "Customer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_vendorId_key" ON "Vendor"("vendorId");

-- CreateIndex
CREATE INDEX "Vendor_name_idx" ON "Vendor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Job_jobId_key" ON "Job"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "Job_uniqueJob_key" ON "Job"("uniqueJob");

-- CreateIndex
CREATE INDEX "Job_customerId_idx" ON "Job"("customerId");

-- CreateIndex
CREATE INDEX "Job_status_idx" ON "Job"("status");

-- CreateIndex
CREATE INDEX "Job_uniqueJob_idx" ON "Job"("uniqueJob");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_sageId_key" ON "Invoice"("sageId");

-- CreateIndex
CREATE INDEX "Invoice_vendorId_idx" ON "Invoice"("vendorId");

-- CreateIndex
CREATE INDEX "Invoice_invoiceDate_idx" ON "Invoice"("invoiceDate");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceLine_sageId_key" ON "InvoiceLine"("sageId");

-- CreateIndex
CREATE INDEX "InvoiceLine_invoiceSageId_idx" ON "InvoiceLine"("invoiceSageId");

-- CreateIndex
CREATE INDEX "InvoiceLine_jobId_idx" ON "InvoiceLine"("jobId");

-- CreateIndex
CREATE INDEX "InvoiceLine_uniqueJob_idx" ON "InvoiceLine"("uniqueJob");

-- CreateIndex
CREATE INDEX "InvoiceLine_vendorId_idx" ON "InvoiceLine"("vendorId");

-- CreateIndex
CREATE INDEX "InvoiceLine_transactionDate_idx" ON "InvoiceLine"("transactionDate");

-- CreateIndex
CREATE INDEX "InvoiceLine_costCode_idx" ON "InvoiceLine"("costCode");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_equipmentId_key" ON "Equipment"("equipmentId");

-- CreateIndex
CREATE INDEX "Equipment_status_idx" ON "Equipment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryTransaction_rowId_key" ON "InventoryTransaction"("rowId");

-- CreateIndex
CREATE INDEX "InventoryTransaction_jobId_idx" ON "InventoryTransaction"("jobId");

-- CreateIndex
CREATE INDEX "InventoryTransaction_uniqueJobNumber_idx" ON "InventoryTransaction"("uniqueJobNumber");

-- CreateIndex
CREATE INDEX "InventoryTransaction_transactionDate_idx" ON "InventoryTransaction"("transactionDate");

-- CreateIndex
CREATE INDEX "InventoryTransaction_costCode_idx" ON "InventoryTransaction"("costCode");

-- CreateIndex
CREATE UNIQUE INDEX "DataSourceConnection_system_key" ON "DataSourceConnection"("system");

-- CreateIndex
CREATE UNIQUE INDEX "AppUser_email_key" ON "AppUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_key_key" ON "Permission"("key");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_key" ON "UserRole"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");

-- CreateIndex
CREATE INDEX "UserCompanyAccess_companyId_idx" ON "UserCompanyAccess"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCompanyAccess_userId_companyId_key" ON "UserCompanyAccess"("userId", "companyId");

-- CreateIndex
CREATE INDEX "UserJobAccess_jobId_idx" ON "UserJobAccess"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "UserJobAccess_userId_jobId_key" ON "UserJobAccess"("userId", "jobId");

-- CreateIndex
CREATE INDEX "DocumentRecord_entityType_entityKey_idx" ON "DocumentRecord"("entityType", "entityKey");

-- CreateIndex
CREATE INDEX "DocumentRecord_fileName_idx" ON "DocumentRecord"("fileName");

-- CreateIndex
CREATE INDEX "DocumentRecord_category_idx" ON "DocumentRecord"("category");

-- CreateIndex
CREATE INDEX "DocumentRecord_status_idx" ON "DocumentRecord"("status");

-- CreateIndex
CREATE INDEX "TimelineEvent_entityType_entityKey_idx" ON "TimelineEvent"("entityType", "entityKey");

-- CreateIndex
CREATE INDEX "TimelineEvent_occurredAt_idx" ON "TimelineEvent"("occurredAt");

-- CreateIndex
CREATE INDEX "EntityRelationship_sourceEntityType_sourceEntityKey_idx" ON "EntityRelationship"("sourceEntityType", "sourceEntityKey");

-- CreateIndex
CREATE INDEX "EntityRelationship_targetEntityType_targetEntityKey_idx" ON "EntityRelationship"("targetEntityType", "targetEntityKey");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityKey_idx" ON "AuditLog"("entityType", "entityKey");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureFlag_key_key" ON "FeatureFlag"("key");

-- CreateIndex
CREATE UNIQUE INDEX "EntityType_key_key" ON "EntityType"("key");

-- CreateIndex
CREATE INDEX "EntityType_domain_idx" ON "EntityType"("domain");

-- CreateIndex
CREATE INDEX "EntityType_isActive_idx" ON "EntityType"("isActive");

-- CreateIndex
CREATE INDEX "EntityField_entityTypeId_idx" ON "EntityField"("entityTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "EntityField_entityTypeId_key_key" ON "EntityField"("entityTypeId", "key");

-- CreateIndex
CREATE INDEX "EntityCapability_entityTypeId_idx" ON "EntityCapability"("entityTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "EntityCapability_entityTypeId_key_key" ON "EntityCapability"("entityTypeId", "key");

-- CreateIndex
CREATE INDEX "EntityWorkspaceSection_entityTypeId_idx" ON "EntityWorkspaceSection"("entityTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "EntityWorkspaceSection_entityTypeId_key_key" ON "EntityWorkspaceSection"("entityTypeId", "key");

-- CreateIndex
CREATE INDEX "EntityPermissionTemplate_entityTypeId_idx" ON "EntityPermissionTemplate"("entityTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "EntityPermissionTemplate_entityTypeId_action_key" ON "EntityPermissionTemplate"("entityTypeId", "action");

-- CreateIndex
CREATE UNIQUE INDEX "EntityRelationshipRule_key_key" ON "EntityRelationshipRule"("key");

-- CreateIndex
CREATE INDEX "EntityRelationshipRule_sourceEntityTypeId_idx" ON "EntityRelationshipRule"("sourceEntityTypeId");

-- CreateIndex
CREATE INDEX "EntityRelationshipRule_targetEntityTypeId_idx" ON "EntityRelationshipRule"("targetEntityTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSession_tokenHash_key" ON "UserSession"("tokenHash");

-- CreateIndex
CREATE INDEX "UserSession_userId_idx" ON "UserSession"("userId");

-- CreateIndex
CREATE INDEX "UserSession_expiresAt_idx" ON "UserSession"("expiresAt");

-- CreateIndex
CREATE INDEX "SearchIndex_entityType_idx" ON "SearchIndex"("entityType");

-- CreateIndex
CREATE INDEX "SearchIndex_title_idx" ON "SearchIndex"("title");

-- CreateIndex
CREATE UNIQUE INDEX "SearchIndex_entityType_entityKey_key" ON "SearchIndex"("entityType", "entityKey");

-- CreateIndex
CREATE INDEX "NotificationItem_userId_idx" ON "NotificationItem"("userId");

-- CreateIndex
CREATE INDEX "NotificationItem_entityType_entityKey_idx" ON "NotificationItem"("entityType", "entityKey");

-- CreateIndex
CREATE INDEX "NotificationItem_createdAt_idx" ON "NotificationItem"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowDefinition_key_key" ON "WorkflowDefinition"("key");

-- CreateIndex
CREATE INDEX "WorkflowRun_workflowId_idx" ON "WorkflowRun"("workflowId");

-- CreateIndex
CREATE INDEX "WorkflowRun_entityType_entityKey_idx" ON "WorkflowRun"("entityType", "entityKey");

-- CreateIndex
CREATE INDEX "WorkflowRun_status_idx" ON "WorkflowRun"("status");

-- CreateIndex
CREATE INDEX "WorkspaceFavorite_userId_idx" ON "WorkspaceFavorite"("userId");

-- CreateIndex
CREATE INDEX "WorkspaceFavorite_entityType_entityKey_idx" ON "WorkspaceFavorite"("entityType", "entityKey");

-- CreateIndex
CREATE INDEX "EntityActivity_entityType_entityKey_idx" ON "EntityActivity"("entityType", "entityKey");

-- CreateIndex
CREATE INDEX "EntityActivity_createdAt_idx" ON "EntityActivity"("createdAt");

-- CreateIndex
CREATE INDEX "DocumentFolder_entityType_entityKey_idx" ON "DocumentFolder"("entityType", "entityKey");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentVersion_documentId_version_key" ON "DocumentVersion"("documentId", "version");

-- CreateIndex
CREATE INDEX "DocumentShare_shareType_targetKey_idx" ON "DocumentShare"("shareType", "targetKey");

-- CreateIndex
CREATE INDEX "DocumentAccessEvent_eventType_idx" ON "DocumentAccessEvent"("eventType");

-- CreateIndex
CREATE INDEX "DocumentAccessEvent_createdAt_idx" ON "DocumentAccessEvent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentRequirement_entityType_category_requiredFor_key" ON "DocumentRequirement"("entityType", "category", "requiredFor");

-- CreateIndex
CREATE INDEX "PlatformEvent_eventType_idx" ON "PlatformEvent"("eventType");

-- CreateIndex
CREATE INDEX "PlatformEvent_entityType_entityKey_idx" ON "PlatformEvent"("entityType", "entityKey");

-- CreateIndex
CREATE INDEX "PlatformEvent_createdAt_idx" ON "PlatformEvent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "DashboardDefinition_key_key" ON "DashboardDefinition"("key");

-- CreateIndex
CREATE UNIQUE INDEX "DashboardWidget_key_key" ON "DashboardWidget"("key");

-- CreateIndex
CREATE INDEX "DashboardWidget_dashboardId_idx" ON "DashboardWidget"("dashboardId");

-- CreateIndex
CREATE INDEX "DashboardWidget_domain_idx" ON "DashboardWidget"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "KpiDefinition_key_key" ON "KpiDefinition"("key");

-- CreateIndex
CREATE INDEX "KpiDefinition_domain_idx" ON "KpiDefinition"("domain");

-- CreateIndex
CREATE INDEX "OperationalAlert_status_idx" ON "OperationalAlert"("status");

-- CreateIndex
CREATE INDEX "OperationalAlert_domain_idx" ON "OperationalAlert"("domain");

-- CreateIndex
CREATE INDEX "OperationalAlert_entityType_entityKey_idx" ON "OperationalAlert"("entityType", "entityKey");

-- CreateIndex
CREATE UNIQUE INDEX "DataQualityCheck_key_key" ON "DataQualityCheck"("key");

-- CreateIndex
CREATE INDEX "DataQualityCheck_domain_idx" ON "DataQualityCheck"("domain");

-- CreateIndex
CREATE INDEX "DataQualityCheck_status_idx" ON "DataQualityCheck"("status");

-- CreateIndex
CREATE INDEX "AiInsight_entityType_entityKey_idx" ON "AiInsight"("entityType", "entityKey");

-- CreateIndex
CREATE INDEX "AiInsight_insightType_idx" ON "AiInsight"("insightType");

-- CreateIndex
CREATE INDEX "ApprovalRequest_status_idx" ON "ApprovalRequest"("status");

-- CreateIndex
CREATE INDEX "ApprovalRequest_entityType_entityKey_idx" ON "ApprovalRequest"("entityType", "entityKey");

-- CreateIndex
CREATE INDEX "WorkItem_status_idx" ON "WorkItem"("status");

-- CreateIndex
CREATE INDEX "WorkItem_entityType_entityKey_idx" ON "WorkItem"("entityType", "entityKey");

-- CreateIndex
CREATE UNIQUE INDEX "AutomationRule_key_key" ON "AutomationRule"("key");

-- CreateIndex
CREATE INDEX "AutomationRule_domain_idx" ON "AutomationRule"("domain");

-- CreateIndex
CREATE INDEX "AutomationRule_entityType_idx" ON "AutomationRule"("entityType");

-- CreateIndex
CREATE INDEX "AutomationRule_enabled_idx" ON "AutomationRule"("enabled");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledJobDefinition_key_key" ON "ScheduledJobDefinition"("key");

-- CreateIndex
CREATE INDEX "ScheduledJobDefinition_status_idx" ON "ScheduledJobDefinition"("status");

-- CreateIndex
CREATE INDEX "ScheduledJobDefinition_jobType_idx" ON "ScheduledJobDefinition"("jobType");

-- CreateIndex
CREATE INDEX "ScheduledJobRun_jobId_idx" ON "ScheduledJobRun"("jobId");

-- CreateIndex
CREATE INDEX "ScheduledJobRun_status_idx" ON "ScheduledJobRun"("status");

-- CreateIndex
CREATE INDEX "ScheduledJobRun_startedAt_idx" ON "ScheduledJobRun"("startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ApprovalPolicy_key_key" ON "ApprovalPolicy"("key");

-- CreateIndex
CREATE INDEX "ApprovalPolicy_entityType_idx" ON "ApprovalPolicy"("entityType");

-- CreateIndex
CREATE INDEX "ApprovalPolicy_domain_idx" ON "ApprovalPolicy"("domain");

-- CreateIndex
CREATE INDEX "TaskItem_status_idx" ON "TaskItem"("status");

-- CreateIndex
CREATE INDEX "TaskItem_assignedTo_idx" ON "TaskItem"("assignedTo");

-- CreateIndex
CREATE INDEX "TaskItem_entityType_entityKey_idx" ON "TaskItem"("entityType", "entityKey");

-- CreateIndex
CREATE UNIQUE INDEX "AiProviderConfig_key_key" ON "AiProviderConfig"("key");

-- CreateIndex
CREATE INDEX "AiProviderConfig_provider_idx" ON "AiProviderConfig"("provider");

-- CreateIndex
CREATE INDEX "AiProviderConfig_status_idx" ON "AiProviderConfig"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AiPromptTemplate_key_key" ON "AiPromptTemplate"("key");

-- CreateIndex
CREATE INDEX "AiPromptTemplate_scope_idx" ON "AiPromptTemplate"("scope");

-- CreateIndex
CREATE INDEX "AiPromptTemplate_entityType_idx" ON "AiPromptTemplate"("entityType");

-- CreateIndex
CREATE INDEX "AiBriefing_audience_idx" ON "AiBriefing"("audience");

-- CreateIndex
CREATE INDEX "AiBriefing_briefingDate_idx" ON "AiBriefing"("briefingDate");

-- CreateIndex
CREATE INDEX "AiRecommendation_entityType_entityKey_idx" ON "AiRecommendation"("entityType", "entityKey");

-- CreateIndex
CREATE INDEX "AiRecommendation_category_idx" ON "AiRecommendation"("category");

-- CreateIndex
CREATE INDEX "AiRecommendation_status_idx" ON "AiRecommendation"("status");

-- CreateIndex
CREATE INDEX "NaturalLanguageQueryLog_createdAt_idx" ON "NaturalLanguageQueryLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationConnector_key_key" ON "IntegrationConnector"("key");

-- CreateIndex
CREATE INDEX "IntegrationConnector_system_idx" ON "IntegrationConnector"("system");

-- CreateIndex
CREATE INDEX "IntegrationConnector_status_idx" ON "IntegrationConnector"("status");

-- CreateIndex
CREATE INDEX "IntegrationMapping_connectorId_idx" ON "IntegrationMapping"("connectorId");

-- CreateIndex
CREATE INDEX "IntegrationMapping_targetEntity_idx" ON "IntegrationMapping"("targetEntity");

-- CreateIndex
CREATE INDEX "IntegrationRun_connectorId_idx" ON "IntegrationRun"("connectorId");

-- CreateIndex
CREATE INDEX "IntegrationRun_status_idx" ON "IntegrationRun"("status");

-- CreateIndex
CREATE INDEX "IntegrationRun_startedAt_idx" ON "IntegrationRun"("startedAt");

-- CreateIndex
CREATE INDEX "IntegrationLog_connectorId_idx" ON "IntegrationLog"("connectorId");

-- CreateIndex
CREATE INDEX "IntegrationLog_level_idx" ON "IntegrationLog"("level");

-- CreateIndex
CREATE INDEX "IntegrationLog_createdAt_idx" ON "IntegrationLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationRetryPolicy_key_key" ON "IntegrationRetryPolicy"("key");

-- CreateIndex
CREATE UNIQUE INDEX "SecurityPolicy_key_key" ON "SecurityPolicy"("key");

-- CreateIndex
CREATE INDEX "AccessReview_status_idx" ON "AccessReview"("status");

-- CreateIndex
CREATE INDEX "AccessReview_scope_idx" ON "AccessReview"("scope");

-- CreateIndex
CREATE INDEX "WorkflowStepTemplate_workflowKey_idx" ON "WorkflowStepTemplate"("workflowKey");

-- CreateIndex
CREATE INDEX "WorkflowStepTemplate_stepType_idx" ON "WorkflowStepTemplate"("stepType");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowStepTemplate_workflowKey_stepKey_key" ON "WorkflowStepTemplate"("workflowKey", "stepKey");

-- CreateIndex
CREATE INDEX "WorkflowActionTemplate_workflowKey_idx" ON "WorkflowActionTemplate"("workflowKey");

-- CreateIndex
CREATE INDEX "WorkflowActionTemplate_actionType_idx" ON "WorkflowActionTemplate"("actionType");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowActionTemplate_workflowKey_stepKey_actionKey_key" ON "WorkflowActionTemplate"("workflowKey", "stepKey", "actionKey");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowExecution_runKey_key" ON "WorkflowExecution"("runKey");

-- CreateIndex
CREATE INDEX "WorkflowExecution_workflowKey_idx" ON "WorkflowExecution"("workflowKey");

-- CreateIndex
CREATE INDEX "WorkflowExecution_status_idx" ON "WorkflowExecution"("status");

-- CreateIndex
CREATE INDEX "WorkflowExecution_entityType_entityKey_idx" ON "WorkflowExecution"("entityType", "entityKey");

-- CreateIndex
CREATE INDEX "WorkflowExecution_startedAt_idx" ON "WorkflowExecution"("startedAt");

-- CreateIndex
CREATE INDEX "WorkflowExecutionStep_executionRunKey_idx" ON "WorkflowExecutionStep"("executionRunKey");

-- CreateIndex
CREATE INDEX "WorkflowExecutionStep_status_idx" ON "WorkflowExecutionStep"("status");

-- CreateIndex
CREATE INDEX "WorkflowExecutionStep_stepType_idx" ON "WorkflowExecutionStep"("stepType");

-- CreateIndex
CREATE INDEX "WorkflowActionRun_executionRunKey_idx" ON "WorkflowActionRun"("executionRunKey");

-- CreateIndex
CREATE INDEX "WorkflowActionRun_actionType_idx" ON "WorkflowActionRun"("actionType");

-- CreateIndex
CREATE INDEX "WorkflowActionRun_status_idx" ON "WorkflowActionRun"("status");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowEventSubscription_key_key" ON "WorkflowEventSubscription"("key");

-- CreateIndex
CREATE INDEX "WorkflowEventSubscription_eventType_idx" ON "WorkflowEventSubscription"("eventType");

-- CreateIndex
CREATE INDEX "WorkflowEventSubscription_workflowKey_idx" ON "WorkflowEventSubscription"("workflowKey");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowQueueItem_queueKey_key" ON "WorkflowQueueItem"("queueKey");

-- CreateIndex
CREATE INDEX "WorkflowQueueItem_workflowKey_idx" ON "WorkflowQueueItem"("workflowKey");

-- CreateIndex
CREATE INDEX "WorkflowQueueItem_status_idx" ON "WorkflowQueueItem"("status");

-- CreateIndex
CREATE INDEX "WorkflowQueueItem_priority_idx" ON "WorkflowQueueItem"("priority");

-- CreateIndex
CREATE INDEX "AiConversation_userEmail_idx" ON "AiConversation"("userEmail");

-- CreateIndex
CREATE INDEX "AiConversation_entityType_entityKey_idx" ON "AiConversation"("entityType", "entityKey");

-- CreateIndex
CREATE INDEX "AiConversation_createdAt_idx" ON "AiConversation"("createdAt");

-- CreateIndex
CREATE INDEX "AiMessage_conversationId_idx" ON "AiMessage"("conversationId");

-- CreateIndex
CREATE INDEX "AiMessage_role_idx" ON "AiMessage"("role");

-- CreateIndex
CREATE INDEX "AiMessage_createdAt_idx" ON "AiMessage"("createdAt");

-- CreateIndex
CREATE INDEX "AiContextSnapshot_entityType_entityKey_idx" ON "AiContextSnapshot"("entityType", "entityKey");

-- CreateIndex
CREATE INDEX "AiContextSnapshot_generatedAt_idx" ON "AiContextSnapshot"("generatedAt");

-- CreateIndex
CREATE INDEX "AiActionPlan_entityType_entityKey_idx" ON "AiActionPlan"("entityType", "entityKey");

-- CreateIndex
CREATE INDEX "AiActionPlan_status_idx" ON "AiActionPlan"("status");

-- CreateIndex
CREATE INDEX "AiActionPlan_priority_idx" ON "AiActionPlan"("priority");

-- CreateIndex
CREATE UNIQUE INDEX "FleetVehicle_unitNumber_key" ON "FleetVehicle"("unitNumber");

-- CreateIndex
CREATE INDEX "FleetVehicle_equipmentId_idx" ON "FleetVehicle"("equipmentId");

-- CreateIndex
CREATE INDEX "FleetVehicle_ownerCompanyId_idx" ON "FleetVehicle"("ownerCompanyId");

-- CreateIndex
CREATE INDEX "FleetVehicle_currentJobId_idx" ON "FleetVehicle"("currentJobId");

-- CreateIndex
CREATE INDEX "FleetVehicle_status_idx" ON "FleetVehicle"("status");

-- CreateIndex
CREATE INDEX "FleetVehicle_healthStatus_idx" ON "FleetVehicle"("healthStatus");

-- CreateIndex
CREATE UNIQUE INDEX "FuelTransaction_transactionKey_key" ON "FuelTransaction"("transactionKey");

-- CreateIndex
CREATE INDEX "FuelTransaction_unitNumber_idx" ON "FuelTransaction"("unitNumber");

-- CreateIndex
CREATE INDEX "FuelTransaction_transactionDate_idx" ON "FuelTransaction"("transactionDate");

-- CreateIndex
CREATE INDEX "FuelTransaction_sourceSystem_idx" ON "FuelTransaction"("sourceSystem");

-- CreateIndex
CREATE UNIQUE INDEX "TelematicsSnapshot_snapshotKey_key" ON "TelematicsSnapshot"("snapshotKey");

-- CreateIndex
CREATE INDEX "TelematicsSnapshot_unitNumber_idx" ON "TelematicsSnapshot"("unitNumber");

-- CreateIndex
CREATE INDEX "TelematicsSnapshot_sourceSystem_idx" ON "TelematicsSnapshot"("sourceSystem");

-- CreateIndex
CREATE INDEX "TelematicsSnapshot_capturedAt_idx" ON "TelematicsSnapshot"("capturedAt");

-- CreateIndex
CREATE UNIQUE INDEX "MaintenanceAlert_alertKey_key" ON "MaintenanceAlert"("alertKey");

-- CreateIndex
CREATE INDEX "MaintenanceAlert_unitNumber_idx" ON "MaintenanceAlert"("unitNumber");

-- CreateIndex
CREATE INDEX "MaintenanceAlert_severity_idx" ON "MaintenanceAlert"("severity");

-- CreateIndex
CREATE INDEX "MaintenanceAlert_status_idx" ON "MaintenanceAlert"("status");

-- CreateIndex
CREATE INDEX "MaintenanceAlert_dueAt_idx" ON "MaintenanceAlert"("dueAt");

-- CreateIndex
CREATE UNIQUE INDEX "PlanningBoard_boardKey_key" ON "PlanningBoard"("boardKey");

-- CreateIndex
CREATE INDEX "PlanningBoard_status_idx" ON "PlanningBoard"("status");

-- CreateIndex
CREATE INDEX "PlanningBoard_sourceSystem_idx" ON "PlanningBoard"("sourceSystem");

-- CreateIndex
CREATE INDEX "PlanningBoard_mondayBoardId_idx" ON "PlanningBoard"("mondayBoardId");

-- CreateIndex
CREATE UNIQUE INDEX "PlanningItem_itemKey_key" ON "PlanningItem"("itemKey");

-- CreateIndex
CREATE INDEX "PlanningItem_jobId_idx" ON "PlanningItem"("jobId");

-- CreateIndex
CREATE INDEX "PlanningItem_uniqueJob_idx" ON "PlanningItem"("uniqueJob");

-- CreateIndex
CREATE INDEX "PlanningItem_status_idx" ON "PlanningItem"("status");

-- CreateIndex
CREATE INDEX "PlanningItem_priority_idx" ON "PlanningItem"("priority");

-- CreateIndex
CREATE INDEX "PlanningItem_riskLevel_idx" ON "PlanningItem"("riskLevel");

-- CreateIndex
CREATE INDEX "PlanningItem_mondayItemId_idx" ON "PlanningItem"("mondayItemId");

-- CreateIndex
CREATE UNIQUE INDEX "PlanningTask_taskKey_key" ON "PlanningTask"("taskKey");

-- CreateIndex
CREATE INDEX "PlanningTask_jobId_idx" ON "PlanningTask"("jobId");

-- CreateIndex
CREATE INDEX "PlanningTask_status_idx" ON "PlanningTask"("status");

-- CreateIndex
CREATE INDEX "PlanningTask_taskType_idx" ON "PlanningTask"("taskType");

-- CreateIndex
CREATE INDEX "PlanningTask_dueDate_idx" ON "PlanningTask"("dueDate");

-- CreateIndex
CREATE UNIQUE INDEX "PlanningDependency_dependencyKey_key" ON "PlanningDependency"("dependencyKey");

-- CreateIndex
CREATE INDEX "PlanningDependency_predecessorKey_idx" ON "PlanningDependency"("predecessorKey");

-- CreateIndex
CREATE INDEX "PlanningDependency_successorKey_idx" ON "PlanningDependency"("successorKey");

-- CreateIndex
CREATE INDEX "PlanningDependency_status_idx" ON "PlanningDependency"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceAssignment_assignmentKey_key" ON "ResourceAssignment"("assignmentKey");

-- CreateIndex
CREATE INDEX "ResourceAssignment_jobId_idx" ON "ResourceAssignment"("jobId");

-- CreateIndex
CREATE INDEX "ResourceAssignment_resourceType_idx" ON "ResourceAssignment"("resourceType");

-- CreateIndex
CREATE INDEX "ResourceAssignment_status_idx" ON "ResourceAssignment"("status");
