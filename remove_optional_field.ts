// Kibana N

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
            foo: schema.string(),
            bar: schema.maybe(schema.string())
        }, { unknowns: 'ignore' }),
    },
  }
});

// Kibana N + 1
interface MyTypeDataModel {
    foo: string
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
            foo: schema.string(),
            bar: schema.maybe(schema.string())
        }, { unknowns: 'ignore' }),
    },
    1: {
        schema: schema.object({
            foo: schema.string(),
        }, { unknowns: 'ignore' }),
        migrations: {
             // only ran when the doc version is < 1
            up: (doc, ctx) => {
                // we don't even really need this as the schema will drop it...
                const { bar, ...attrs} = doc;
                return attrs;
            },
             // assumes that the framework will set the doc version to 1 whenever write is called
             // called on every write
            onWrite: (doc, ctx) => { 
                return doc;
            },
        }
    },
  }
});