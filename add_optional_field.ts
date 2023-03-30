// Kibana N

interface MyTypeDataModel {
    foo: string
}

coreSetup.savedObjects.registerType({
  name: 'my-type',
  mappings: {
    properties: {
      foo: { type: 'keyword' },
    },
  },
  versions: {
    0: {
        schema: schema.object({
            foo: schema.string()
        }, { unknowns: 'ignore' }),
    },
  }
});

// Kibana N + 1
interface MyTypeDataModel {
    foo: string
    bar?: string
}

coreSetup.savedObjects.registerType({
  name: 'my-type',
  mappings: {
    properties: {
      foo: { type: 'keyword' },
      bar: { type: 'keyword' }
    },
  },
  versions: {
    0: {
        schema: schema.object({
            foo: schema.string()
        }, { unknowns: 'ignore' }),
    },
    1: {
        schema: schema.object({
            foo: schema.string(),
            bar: schema.maybe(schema.string()),
        }, { unknowns: 'ignore' }),
    },
  }
});