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
    bar?: number // This has to be optional because we can't consistently search on this until the backfill has ran
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
                bar: schema.maybe(schema.number()),
            }, { unknowns: 'ignore' }),
            backfill: true,
            // only ran when the doc version is < 1
            up: (doc, ctx) => {
                const { bar, ...attrs } = doc;
                return {
                    ...attrs,
                    bar: bar || 1,
                };
            },

            onWrite: (doc, ctx) => {
                const { bar, ...attrs } = doc;
                return {
                    ...attrs,
                    bar: bar || 1,
                };
            },
        },
    }
});

// Kibana N + 2
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
                bar: schema.maybe(schema.number()),
            }, { unknowns: 'ignore' }),
            backfill: true,
            // only ran when the doc version is < 1
            up: (doc, ctx) => {
                const { bar, ...attrs } = doc;
                return {
                    ...attrs,
                    bar: bar || 1,
                };
            },

            onWrite: (doc, ctx) => {
                const { bar, ...attrs } = doc;
                return {
                    ...attrs,
                    bar: bar || 1,
                };
            },
        },
        2: {
            schema: schema.object({
                foo: schema.string(),
                bar: schema.number(),
            }, { unknowns: 'ignore' }),
        },
    }
});