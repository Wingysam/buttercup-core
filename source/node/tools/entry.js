const { objectValues } = require("./polyfill.js");

const ENTRY_URL_TYPE_ANY = "any";
const ENTRY_URL_TYPE_GENERAL = "general";
const ENTRY_URL_TYPE_ICON = "icon";
const ENTRY_URL_TYPE_LOGIN = "login";

const URL_PROP = /(^|[a-zA-Z0-9_-]|\b)(ur[li]|UR[LI]|Ur[li])(\b|$|[_-])/;
const URL_PROP_ICON = /icon[\s_-]*ur[li]/i;

/**
 * Entry facade data field
 * @typedef {Object} EntryFacadeField
 * @property {String} title - The user-friendly title of the field
 * @property {String} field - The type of data to map back to on the Entry instance (property/attribute)
 * @property {String} property - The property name within the field type of the Entry instance
 * @property {String} value - The value of the property (read/write)
 * @property {Boolean} secret - Wether or not the value should be hidden while viewing (masked)
 * @property {Boolean} multiline - Whether the value should be edited as a multiline value or not
 * @property {Object|Boolean} formatting - Vendor formatting options object, or false if no formatting necessary
 * @property {Number} maxLength - Maximum recommended length of the value (defaults to -1)
 */

/**
 * Create a descriptor for a field to be used within a facade
 * @param {Entry} entry The entry instance to process
 * @param {String} title The field title
 * @param {String} entryPropertyType The type of entry property (property/attribute)
 * @param {String} entryPropertyName The name of the property
 * @param {Object} options The options for the field
 * @returns {EntryFacadeField} The field descriptor
 */
function createFieldDescriptor(
    entry,
    title,
    entryPropertyType,
    entryPropertyName,
    { multiline = false, secret = false, formatting = false, removeable = false } = {}
) {
    const value = getEntryValue(entry, entryPropertyType, entryPropertyName);
    return {
        title,
        field: entryPropertyType,
        property: entryPropertyName,
        value,
        secret,
        multiline,
        formatting,
        removeable
    };
}

/**
 * Get URLs from an entry's propertyies
 * Allows for preferential sorting
 * @param {Object} properties The entry properties
 * @param {*} preference
 */
function getEntryURLs(properties, preference = ENTRY_URL_TYPE_ANY) {
    const urlRef = Object.keys(properties)
        .filter(key => URL_PROP.test(key))
        .reduce(
            (output, nextKey) =>
                Object.assign(output, {
                    [nextKey]: properties[nextKey]
                }),
            {}
        );
    if (preference === ENTRY_URL_TYPE_GENERAL || preference === ENTRY_URL_TYPE_LOGIN) {
        return Object.keys(urlRef)
            .sort((a, b) => {
                if (preference === ENTRY_URL_TYPE_GENERAL) {
                    const general = /^ur[li]$/i;
                    const aVal = general.test(a) ? 1 : 0;
                    const bVal = general.test(b) ? 1 : 0;
                    return bVal - aVal;
                } else if (preference === ENTRY_URL_TYPE_LOGIN) {
                    const login = /login/i;
                    const aVal = login.test(a) ? 1 : 0;
                    const bVal = login.test(b) ? 1 : 0;
                    return bVal - aVal;
                }
                return 0;
            })
            .map(key => urlRef[key]);
    } else if (preference === ENTRY_URL_TYPE_ICON) {
        const iconProp = Object.keys(urlRef).find(key => URL_PROP_ICON.test(key));
        return iconProp ? [urlRef[iconProp]] : [];
    }
    // Default is "any" URLs
    return objectValues(urlRef);
}

function getEntryFacadeURLs(facade, preference) {
    const props = facade.fields.filter(item => item.field === "property").reduce(
        (output, field) =>
            Object.assign(output, {
                [field.property]: field.value
            }),
        {}
    );
    return getEntryURLs(props, preference);
}

/**
 * Get a value on an entry for a specific property type
 * @param {Entry} entry The entry instance
 * @param {String} property The type of entry property (property/meta/attribute)
 * @param {String} name The property name
 * @returns {String} The property value
 * @throws {Error} Throws for unknown property types
 * @deprecated Not in use - To be removed
 */
function getEntryValue(entry, property, name) {
    switch (property) {
        case "property":
            return entry.getProperty(name);
        case "meta":
            return entry.getMeta(name);
        case "attribute":
            return entry.getAttribute(name);
        default:
            throw new Error(`Cannot retrieve value: Unknown property type: ${property}`);
    }
}

/**
 * Check if a property name is valid
 * @param {String} name The name to check
 * @returns {Boolean} True if the name is valid
 */
function isValidProperty(name) {
    for (var keyName in EntryProperty) {
        if (EntryProperty.hasOwnProperty(keyName)) {
            if (EntryProperty[keyName] === name) {
                return true;
            }
        }
    }
    return false;
}

module.exports = {
    ENTRY_URL_TYPE_ANY,
    ENTRY_URL_TYPE_GENERAL,
    ENTRY_URL_TYPE_ICON,
    ENTRY_URL_TYPE_LOGIN,
    createFieldDescriptor,
    getEntryURLs,
    getEntryFacadeURLs,
    getEntryValue,
    isValidProperty
};
