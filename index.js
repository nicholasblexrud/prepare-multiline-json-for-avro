/*jshint esversion:6*/
var CLI = require('commander');
var _ = require('lodash');
var fs = require('fs');
var readline = require('readline');
var path = require('path');

CLI
    .version('0.0.1')
    .option('-d, --data <data>', 'A multiline JSON file to convert')
    .option('-s, --schema <schema>', 'A schema for defining all possible values')
    .option('-a, --avro', 'Boolean for Avro')
    .parse(process.argv);

checkArgs(CLI.data, 'No multiline JSON file given!');
checkArgs(CLI.schema, 'No schema JSON file given!');

function checkArgs(option, error) {
    if (typeof option === 'undefined') {
        console.error(error);
        process.exit(1);
    }
}

const LINE_BREAK = '\n';
const IN_JSON_FILE = CLI.data;
const IN_JSON_FILE_NAME = path.basename(IN_JSON_FILE);
const IN_SCHEMA_FILE = CLI.schema;
const IS_AVRO = CLI.avro;
const NEW_FILE_PREFIX = IS_AVRO ? 'avro.cleaned.' : 'json.cleaned.';

const CLEANED_JSON_FILE = fs.openSync(NEW_FILE_PREFIX + IN_JSON_FILE_NAME, 'w');
var inputSchemaJson = JSON.parse(fs.readFileSync(IN_SCHEMA_FILE, 'utf8'));
var lineReader = readline.createInterface({
    input: fs.createReadStream(IN_JSON_FILE)
});

function isFloat(mixed_var) {
   //  discuss at: http://phpjs.org/functions/is_float/
   return +mixed_var === mixed_var && (!isFinite(mixed_var) || !!(mixed_var % 1));
}

function assignTypeToValue(value, key) {

    if (IS_AVRO) {
        if (_.isString(value)) {
            return {"string": value};

        } else if (_.isNumber(value)) {
            return {"long": value};

        } else if (_.isBoolean(value)) {
            return {"boolean": value};

        } else if (isFloat(value)) {
            return {"float": value};
        }
    }

    if (_.isArray(value)) {
        return handleArrayOfObjects(inputSchemaJson[key][0], value);
    }

    if (_.isObject(value)) {
        return wrapObjectValuesWithTypeOrNull(inputSchemaJson[key], value);
    }

    return value;

}

function wrapObjectValuesWithTypeOrNull(defaultObject, object) {
    var nulled = _.assignIn({}, defaultObject, object);
    return _.mapValues(nulled, function (value, key) {
        return assignTypeToValue(value, key);
    });
}

function handleArrayOfObjects(defaultObject, jsonArray) {
    return jsonArray.map(function (object) {
        return wrapObjectValuesWithTypeOrNull(defaultObject, object);
    });
}

function readLines(line) {
    if (!line) { return; }

    var parsed = JSON.parse(line);
    var cleaned = wrapObjectValuesWithTypeOrNull(inputSchemaJson, parsed);

    fs.write(CLEANED_JSON_FILE, JSON.stringify(cleaned) + LINE_BREAK);

}

//lets convert a file
lineReader.on('line', readLines);