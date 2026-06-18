import { PrismaClient } from '@prisma/client';
import { entityDefinitions, relationshipDefinitions } from '../lib/entity-definitions';

const prisma = new PrismaClient();

async function main() {
  for (const [index, definition] of entityDefinitions.entries()) {
    const entityType = await prisma.entityType.upsert({
      where: { key: definition.key },
      update: {
        displayName: definition.displayName,
        pluralName: definition.pluralName,
        domain: definition.domain,
        description: definition.description,
        icon: definition.icon,
        color: definition.color,
        sourceModel: definition.sourceModel,
        routePath: definition.routePath,
        isSystem: definition.isSystem ?? true,
        supportsSearch: definition.supportsSearch ?? true,
        supportsTimeline: definition.supportsTimeline ?? true,
        supportsDocuments: definition.supportsDocuments ?? true,
        supportsAi: definition.supportsAi ?? true,
        sortOrder: index + 1,
      },
      create: {
        key: definition.key,
        displayName: definition.displayName,
        pluralName: definition.pluralName,
        domain: definition.domain,
        description: definition.description,
        icon: definition.icon,
        color: definition.color,
        sourceModel: definition.sourceModel,
        routePath: definition.routePath,
        isSystem: definition.isSystem ?? true,
        supportsSearch: definition.supportsSearch ?? true,
        supportsTimeline: definition.supportsTimeline ?? true,
        supportsDocuments: definition.supportsDocuments ?? true,
        supportsAi: definition.supportsAi ?? true,
        sortOrder: index + 1,
      },
    });

    for (const [sortOrder, field] of definition.fields.entries()) {
      await prisma.entityField.upsert({
        where: { entityTypeId_key: { entityTypeId: entityType.id, key: field.key } },
        update: {
          label: field.label,
          fieldType: field.fieldType ?? 'text',
          sourceColumn: field.sourceColumn,
          description: field.description,
          isPrimary: field.isPrimary ?? false,
          isSearchable: field.isSearchable ?? false,
          isListVisible: field.isListVisible ?? true,
          isDetailVisible: field.isDetailVisible ?? true,
          isFilterable: field.isFilterable ?? false,
          isSortable: field.isSortable ?? false,
          required: field.required ?? false,
          sortOrder: sortOrder + 1,
        },
        create: {
          entityTypeId: entityType.id,
          key: field.key,
          label: field.label,
          fieldType: field.fieldType ?? 'text',
          sourceColumn: field.sourceColumn,
          description: field.description,
          isPrimary: field.isPrimary ?? false,
          isSearchable: field.isSearchable ?? false,
          isListVisible: field.isListVisible ?? true,
          isDetailVisible: field.isDetailVisible ?? true,
          isFilterable: field.isFilterable ?? false,
          isSortable: field.isSortable ?? false,
          required: field.required ?? false,
          sortOrder: sortOrder + 1,
        },
      });
    }

    for (const [sortOrder, capability] of definition.capabilities.entries()) {
      await prisma.entityCapability.upsert({
        where: { entityTypeId_key: { entityTypeId: entityType.id, key: capability.key } },
        update: {
          label: capability.label,
          description: capability.description,
          status: capability.status ?? 'Active',
          sortOrder: sortOrder + 1,
        },
        create: {
          entityTypeId: entityType.id,
          key: capability.key,
          label: capability.label,
          description: capability.description,
          status: capability.status ?? 'Active',
          sortOrder: sortOrder + 1,
        },
      });
    }

    for (const [sortOrder, section] of definition.workspaceSections.entries()) {
      await prisma.entityWorkspaceSection.upsert({
        where: { entityTypeId_key: { entityTypeId: entityType.id, key: section.key } },
        update: {
          label: section.label,
          description: section.description,
          sectionType: section.sectionType ?? 'panel',
          enabled: section.enabled ?? true,
          config: section.config,
          sortOrder: sortOrder + 1,
        },
        create: {
          entityTypeId: entityType.id,
          key: section.key,
          label: section.label,
          description: section.description,
          sectionType: section.sectionType ?? 'panel',
          enabled: section.enabled ?? true,
          config: section.config,
          sortOrder: sortOrder + 1,
        },
      });
    }

    for (const permission of definition.permissions) {
      await prisma.entityPermissionTemplate.upsert({
        where: { entityTypeId_action: { entityTypeId: entityType.id, action: permission.action } },
        update: {
          key: permission.key,
          label: permission.label,
          description: permission.description,
          defaultRoles: permission.defaultRoles ?? [],
        },
        create: {
          entityTypeId: entityType.id,
          action: permission.action,
          key: permission.key,
          label: permission.label,
          description: permission.description,
          defaultRoles: permission.defaultRoles ?? [],
        },
      });
    }
  }

  for (const relationship of relationshipDefinitions) {
    const source = await prisma.entityType.findUniqueOrThrow({ where: { key: relationship.sourceEntityKey } });
    const target = await prisma.entityType.findUniqueOrThrow({ where: { key: relationship.targetEntityKey } });
    await prisma.entityRelationshipRule.upsert({
      where: { key: relationship.key },
      update: {
        sourceEntityTypeId: source.id,
        targetEntityTypeId: target.id,
        label: relationship.label,
        inverseLabel: relationship.inverseLabel,
        relationshipType: relationship.relationshipType,
        sourceField: relationship.sourceField,
        targetField: relationship.targetField,
        cardinality: relationship.cardinality ?? 'many-to-one',
        description: relationship.description,
        enabled: true,
      },
      create: {
        key: relationship.key,
        sourceEntityTypeId: source.id,
        targetEntityTypeId: target.id,
        label: relationship.label,
        inverseLabel: relationship.inverseLabel,
        relationshipType: relationship.relationshipType,
        sourceField: relationship.sourceField,
        targetField: relationship.targetField,
        cardinality: relationship.cardinality ?? 'many-to-one',
        description: relationship.description,
        enabled: true,
      },
    });
  }

  console.log(`Seeded ${entityDefinitions.length} entity definitions and ${relationshipDefinitions.length} relationship rules.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
