const iocane = require("iocane");
const Datasources = require("@buttercup/datasources");
const Credentials = require("@buttercup/credentials");

module.exports = {
    Archive: require("./Archive.js"),
    ArchiveManager: require("./archiveManagement/ArchiveManager.js"),
    ArchiveSource: require("./archiveManagement/ArchiveSource.js"),
    Workspace: require("./Workspace.js"),

    Credentials,
    Datasources,

    Group: require("./Group.js"),
    Entry: require("./Entry.js"),
    entryFacade: require("./entryFacade.js"),

    Flattener: require("./Flattener.js"),
    Descriptor: require("./Descriptor.js"),
    EntryFinder: require("./EntryFinder.js"),

    storage: {
        StorageInterface: require("./storage/StorageInterface.js"),
        MemoryStorageInterface: require("./storage/MemoryStorageInterface.js")
    },

    tools: {
        encoding: require("./tools/encoding.js"),
        entry: require("./tools/entry.js"),
        export: require("./tools/export.js"),
        uuid: require("./tools/uuid.js"),
        request: require("./tools/request.js"),
        signing: require("@buttercup/signing"),
        searching: {
            instance: require("./tools/searching-instance.js"),
            raw: require("./tools/searching-raw.js")
        }
    },

    vendor: {
        iocane,
        webdav: Datasources.webdav
    }
};
