/*jshint esversion:6*/
var _ = require('lodash');
var fs = require('fs');
var readline = require('readline');

const LINE_BREAK = '\n';
const IN_JSON_FILE = process.argv[2];
const IN_SCHEMA_FILE = process.argv[3];
const NEW_FILE_PREFIX = 'cleaned_';

var fd = fs.openSync(NEW_FILE_PREFIX + IN_JSON_FILE, 'w');
var inputSchemaJson = JSON.parse(fs.readFileSync(IN_SCHEMA_FILE, 'utf8'));
var lineReader = readline.createInterface({
    input: fs.createReadStream(IN_JSON_FILE),
    output: process.stdout
});

function checkCommandLineArg(number, error) {
    if (process.argv.length !== 4) {
        throw new Error('Missing a file');
    }
}

function isFloat(mixed_var) {
   //  discuss at: http://phpjs.org/functions/is_float/
   return +mixed_var === mixed_var && (!isFinite(mixed_var) || !!(mixed_var % 1));
}

function assignTypeToValue(value, key) {
    if (_.isString(value)) {
        return {"string": value};

    } else if (_.isNumber(value)) {
        return {"long": value};

    } else if (_.isBoolean(value)) {
        return {"boolean": value};

    } else if (isFloat(value)) {
        return {"float": value};

    } else if (_.isArray(value)) {
        return handleNestedArrayOfObjects(inputSchemaJson[key][0], value);

    } else {
        return value;
    }
}

function wrapObjectValuesWithTypeOrNull(defaultObject, object) {
    var nulled = _.assignIn({}, defaultObject, object);
    return _.mapValues(nulled, function (value, key) {
        return assignTypeToValue(value, key);
    });
}

function handleNestedArrayOfObjects(defaultObject, jsonArray) {
    return jsonArray.map(function (object) {
        return wrapObjectValuesWithTypeOrNull(defaultObject, object);
    });
}
function readLines(line) {
    if (!line) { return; }

    var parsed = JSON.parse(line);
    var cleaned = wrapObjectValuesWithTypeOrNull(inputSchemaJson, parsed);

    fs.write(fd, JSON.stringify(cleaned) + LINE_BREAK);

}

// check command line args
checkCommandLineArg();

// lets convert a file
lineReader.on('line', readLines);
