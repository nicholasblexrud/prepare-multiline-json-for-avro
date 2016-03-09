#Prepare Multiline JSON file for AVRO
This CLI assists in converting a file of stacked JSON (see data.json below) to a format that Avro can use i.e. where missing fields in objects are converted to `null`, and fields containing values are wrapped with a `type`.

**Usage**:

```node index.js -d <data file> -s <schema file> -a <optional avro flag>```

_Note: if the `-a` flag is left off, the CLI will convert the file to JSON where all of the fields contain a value or are null_

**data.json**
```json
{"event": "foo", "color": "blue", "age": 22, "ownsDogs": true, "dogs":[{"type": "korgi", "age": 6, "color": "gray"}]}
{"event": "bar", "color": "red", "ownsDogs": false}
{"event": "baz", "color": "green", "ownsDogs": false}
{"event": "zip", "age": 34, "ownsDogs": true, "dogs":[{"type": "westy", "color": "brown"}, {"type": "golden doodle", "age": 1, "color": "white"}]}
{"event": "foo", "color": "pink", "age": 55, "ownsDogs": true, "dogs":[{"type": "labra doodle", "age": 2}]}
```

A schema of what events _should_ look like:


**schema.json**
```json
{
    "event": null,
    "color": null,
    "age": null,
    "ownsDogs": null,
    "dogs":[{
        "type": null,
        "age": null,
        "color": null
    }]
}
```

**results: avro.cleaned.data.json**

```json
{"event":{"string":"foo"},"color":{"string":"blue"},"age":{"long":22},"ownsDogs":{"boolean":true},"dogs":[{"type":{"string":"korgi"},"age":{"long":6},"color":{"string":"gray"}}]}
{"event":{"string":"bar"},"color":{"string":"red"},"age":null,"ownsDogs":{"boolean":false},"dogs":[{"type":null,"age":null,"color":null}]}
{"event":{"string":"baz"},"color":{"string":"green"},"age":null,"ownsDogs":{"boolean":false},"dogs":[{"type":null,"age":null,"color":null}]}
{"event":{"string":"zip"},"color":null,"age":{"long":34},"ownsDogs":{"boolean":true},"dogs":[{"type":{"string":"westy"},"age":null,"color":{"string":"brown"}},{"type":{"string":"golden doodle"},"age":{"long":1},"color":{"string":"white"}}]}
{"event":{"string":"foo"},"color":{"string":"pink"},"age":{"long":55},"ownsDogs":{"boolean":true},"dogs":[{"type":{"string":"labra doodle"},"age":{"long":2},"color":null}]}
```

**results: json.cleaned.data.json**

```json
{"event":"foo","color":"blue","age":22,"ownsDogs":true,"dogs":[{"type":"korgi","age":6,"color":"gray"}],"car":{"type":"chevy","isAWD":true}}
{"event":"bar","color":"red","age":null,"ownsDogs":false,"dogs":[{"type":null,"age":null,"color":null}],"car":{"type":null,"isAWD":null}}
{"event":"baz","color":"green","age":null,"ownsDogs":false,"dogs":[{"type":null,"age":null,"color":null}],"car":{"type":"ford","isAWD":false}}
{"event":"zip","color":null,"age":34,"ownsDogs":true,"dogs":[{"type":"westy","age":null,"color":"brown"},{"type":"golden doodle","age":1,"color":"white"}],"car":{"type":null,"isAWD":null}}
{"event":"foo","color":"pink","age":55,"ownsDogs":true,"dogs":[{"type":"labra doodle","age":2,"color":null}],"car":{"type":null,"isAWD":null}}
```

