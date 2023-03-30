// Kibana N

interface MyTypeDataModel {
    status: string
}

coreSetup.savedObjects.registerType({
  name: 'my-type',
  mappings: {
    properties: {
      status: { type: 'keyword' },
    },
  },
  versions: {
    0: {
        schema: schema.object({
            status: schema.string(),
        }, { unknowns: 'ignore' }),
    },
  }
});

// Kibana N + 1
interface MyTypeDataModel {
    status: string
}

coreSetup.savedObjects.registerType({
  name: 'my-type',
  mappings: {
    properties: {
        status: { type: 'keyword' },
        status_value: { type: 'integer' },
    },
  },
  versions: {
    0: {
        schema: schema.object({
            status: schema.string(),
        }, { unknowns: 'ignore' }),
    },
    1: {
        schema: schema.object({
            status: schema.string(),
        }, { unknowns: 'ignore' }),
        migrations: {
             // only ran when the doc version is < 1
            up: (doc, ctx) => {
                // we don't even really need this as the schema will drop it...
                const { status, status_value, ...attrs } = doc;
                return {
                    ...attrs,
                    status,
                };                
            },
             // assumes that the framework will set the doc version to 1 whenever write is called
             // called on every write
            onWrite: (doc, ctx) => { 
                const status = doc.status;
                return {
                    ...doc,
                    status: status,
                    status_value: enumToInt(status),
                };
            },
        }
    },
  }
});

// Kibana N + 2
interface MyTypeDataModel {
    status_value: number
}

coreSetup.savedObjects.registerType({
  name: 'my-type',
  mappings: {
    properties: {
        status: { type: 'keyword' },
        status_value: { type: 'integer' },
    },
  },
  versions: {
    0: {
        schema: schema.object({
            status: schema.string(),
        }, { unknowns: 'ignore' }),
    },
    1: {
        schema: schema.object({
            status: schema.string(),
        }, { unknowns: 'ignore' }),
        migrations: {
             // only ran when the doc version is < 1
            up: (doc, ctx) => {
                // we don't even really need this as the schema will drop it...
                const { status, status_value, ...attrs } = doc;
                return {
                    ...attrs,
                    status,
                };                
            },
             // assumes that the framework will set the doc version to 1 whenever write is called
             // called on every write
            onWrite: (doc, ctx) => { 
                const status = doc.status;
                return {
                    ...doc,
                    status: status,
                    status_value: enumToInt(status),
                };
            },
        }
    },
    2: {
        schema: schema.object({ //TODO: This is awkward that this is here because we only use the most recent one, right?
            status_value: schema.string(),
        }, { unknowns: 'ignore' }),
        migrations: {
             // only ran when the doc version is < 2
            up: (doc, ctx) => {
                // we don't even really need this as the schema will drop it...
                const { status, status_value, ...attrs } = doc;
                return {
                    ...attrs,
                    status_value,
                };
            },
             // assumes that the framework will set the doc version to 2 whenever write is called
             // called on every write
            onWrite: (doc, ctx) => { 
                const status_value = doc.status_value;
                return {
                    ...doc,
                    status: intToEnum(status_value),
                    status_value: status_value,
                };
            },
        }
    },
  }
});
