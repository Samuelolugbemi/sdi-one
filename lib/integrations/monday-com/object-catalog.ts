import type { MondayConnectorDefinition } from './types';

export const mondayConnectorDefinition: MondayConnectorDefinition = {
  key: 'monday-com',
  name: 'Monday.com',
  system: 'Monday.com',
  category: 'Project Planning',
  authType: 'API token / OAuth-ready',
  description: 'Project planning connector for boards, groups, items, statuses, owners, dates, dependencies and job planning synchronization.',
  objects: [
    { sourceObject: 'boards', targetEntity: 'PlanningBoard', externalId: 'id', description: 'Monday boards mapped to SDI planning boards.' },
    { sourceObject: 'items', targetEntity: 'PlanningItem', externalId: 'id', description: 'Monday items mapped to SDI planning items and jobs.' },
    { sourceObject: 'subitems', targetEntity: 'PlanningTask', externalId: 'id', description: 'Subitems mapped to granular planning tasks.' },
    { sourceObject: 'columns', targetEntity: 'PlanningMetadata', externalId: 'id', description: 'Column metadata used for field mapping and transformation.' },
    { sourceObject: 'updates', targetEntity: 'TimelineEvent', externalId: 'id', description: 'Monday updates can become SDI timeline events.' },
    { sourceObject: 'users', targetEntity: 'User', externalId: 'id', description: 'Monday users mapped to SDI users/team members when available.' },
  ],
};
