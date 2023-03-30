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
        0: { // We don't need a new data-model version, just remove the optional field from the schema
            schema: schema.object({
                foo: schema.string(),
            }, { unknowns: 'ignore' }),
        },
    }
});