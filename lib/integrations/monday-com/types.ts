export type MondayObjectDefinition = {
  sourceObject: string;
  targetEntity: string;
  externalId: string;
  description: string;
};

export type MondayConnectorDefinition = {
  key: string;
  name: string;
  system: string;
  category: string;
  authType: string;
  description: string;
  objects: MondayObjectDefinition[];
};
