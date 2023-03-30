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
            backfill: true,
            // the onWrite from the most recent data model version is used for writing backward compatible documents
            // with the prior data model
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
);

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
            backfill: true,
            // this onWrite isn't used for this version of the data model.
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
        schema: schema.object({
            status_value: schema.string(),
        }, { unknowns: 'ignore' }),
        // the onWrite from the most recent data model version is used for writing backward compatible documents
        // with the prior data model
        onWrite: (doc, ctx) => {
            const status_value = doc.status_value;
            return {
                ...doc,
                status: intToEnum(status)
            };
        }
    }
}
);

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
            backfill: true,
            // this onWrite isn't used for this version of the data model.
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
        schema: schema.object({
            status_value: schema.string(),
        }, { unknowns: 'ignore' }),
        // the onWrite from the most recent data model version is used for writing backward compatible documents
        // with the prior data model
        onWrite: (doc, ctx) => {
            const status_value = doc.status_value;
            return {
                ...doc,
                status: intToEnum(status)
            };
        }
    },
    3: { // we don't really need this, we'd most likely see a new data-model doing something else
        schema: schema.object({
            status_value: schema.string(),
        }, { unknowns: 'ignore' }),
    }
}
);