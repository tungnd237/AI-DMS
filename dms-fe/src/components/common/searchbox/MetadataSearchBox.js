import React, {useEffect, useState} from "react";
import {Mention, MentionsInput} from "react-mentions";
import "./style.css";
import {fetchOddStats} from "../../../service/DashboardService";
import {v4 as uuidv4} from 'uuid';

const MetadataSearchBox = ({label, updateQuery}) => {
    const [value, setValue] = useState("");
    const [selectedField, setSelectedField] = useState("");
    const [schema, setSchema] = useState({fieldList: [], valueList: {}});
    const [schemaLoaded, setSchemaLoaded] = useState(false);

    const PLACEHOLDER_HINT = "Type :m to get list of fields, :v to get list of values";
    const PLACEHOLDER_LOADING = "Gathering options..."


    useEffect(() => {
        fetchOddStats({type: "VIDEO", period: "THREE_MONTH"})
            .then(data => {
                setSchema({...schema, fieldList: getMetadataFieldList(data), valueList: getMetadataValueList(data) } );
                setSchemaLoaded(true);
            });
    }, []);

    const getMetadataFieldList = (oddStatsForSchema) => {
        return oddStatsForSchema.map((os) => ({id: os.id, display: os.id}))
    }

    const getMetadataValueList = (oddStatsForSchema) => {
        return oddStatsForSchema.reduce((map, os) => {
            const values = os.stats.map(s => ({id: uuidv4(), display: s.name}));
            return {...map, [os.id]: values};
        }, {});
    }

    const onChange = (e, newValue, newPlainTextValue, mentions) => {
        setValue(e.target.value);
        updateQuery(newPlainTextValue)
    };

    const onAddField = (e) => {
        setSelectedField(e);
    };

    const onAddValue = (e) => {
        setSelectedField("");
    };

    const getValueListByField = () => {
        if (selectedField) return schema.valueList[selectedField];
        return Object.entries(schema.valueList).map(([key, val]) => {
            return val;
        })
            .flat(1);
    }
    return (
        <label className="block" >
            <span className="text-gray-700">{label}</span>
            <MentionsInput
                singleLine
                value={value}
                onChange={onChange}
                placeholder={schemaLoaded ? PLACEHOLDER_HINT : PLACEHOLDER_LOADING}
                className="comments-textarea"
            >
                <Mention data={schema.fieldList} trigger={":m"} onAdd={onAddField} style={{
                    backgroundColor: '#ffffff'
                }}/>
                <Mention data={getValueListByField()} trigger={":v"} onAdd={onAddValue} style={{
                    backgroundColor: '#ffffff'
                }}/>
            </MentionsInput>
            <p className="text-xs text-gray-500">
                E.g. metadata.camera.type = Sensing, metadata.camera.position like rear, etc.
            </p>
        </label>

    );
};

export default MetadataSearchBox;
