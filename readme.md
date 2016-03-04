To run:

```node index.js <data> <schema>```

```node index.js data.json schema.json```

Mult-line JSON file that looks like:
* notice how each event is missing some data. If an event is to be converted to Avro, the missing fields must be null and the fields that contain values must be wrapped in a type.


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

**results: cleaned_data.json**

```json
{"event":{"string":"foo"},"color":{"string":"blue"},"age":{"long":22},"ownsDogs":{"boolean":true},"dogs":[{"type":{"string":"korgi"},"age":{"long":6},"color":{"string":"gray"}}]}
{"event":{"string":"bar"},"color":{"string":"red"},"age":null,"ownsDogs":{"boolean":false},"dogs":[{"type":null,"age":null,"color":null}]}
{"event":{"string":"baz"},"color":{"string":"green"},"age":null,"ownsDogs":{"boolean":false},"dogs":[{"type":null,"age":null,"color":null}]}
{"event":{"string":"zip"},"color":null,"age":{"long":34},"ownsDogs":{"boolean":true},"dogs":[{"type":{"string":"westy"},"age":null,"color":{"string":"brown"}},{"type":{"string":"golden doodle"},"age":{"long":1},"color":{"string":"white"}}]}
{"event":{"string":"foo"},"color":{"string":"pink"},"age":{"long":55},"ownsDogs":{"boolean":true},"dogs":[{"type":{"string":"labra doodle"},"age":{"long":2},"color":null}]}
```

