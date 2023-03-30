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
    bar: number
}

coreSetup.savedObjects.registerType({
    name: 'my-type',
    mappings: {
        properties: {
            foo: { type: 'keyword' },
            bar: { type: 'integer' }
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
                bar: schema.number(),
            }, { unknowns: 'ignore' }),
            // only ran when the doc version is < 1
            up: (doc, ctx) => {
                const { bar, ...attrs } = doc;
                return {
                    ...attrs,
                    bar: 1,
                };
            },
        },
    }
});