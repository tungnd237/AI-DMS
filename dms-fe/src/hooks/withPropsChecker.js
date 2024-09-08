import diff from "deep-diff";
import {Component, useEffect, useRef} from "react";
import _ from "lodash";
const withPropsChecker = WrappedComponent => {
    return props => {
        const prevProps = useRef(props);
        console.log(props);
        useEffect(() => {
            const delta = diff(prevProps.current, props);
            if (delta) {
                console.log(delta);
            }
            prevProps.current = props;
        });
        return <WrappedComponent {...props} />;
    };
};
function difference(object, base) {
    function changes(object, base) {
        return _.transform(object, function(result, value, key) {
            if (!_.isEqual(value, base[key])) {
                result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
            }
        });
    }
    return changes(object, base);
}

const useTraceUpdate = (props) => {
    const prev = useRef(props);
    useEffect(() => {
        const delta = diff(prev.current.columnConfigs[0], props.columnConfigs[0]);
        if (delta) {
            console.log(delta);
        }
        prev.current = props;
    },[props]);

}
export  {withPropsChecker, useTraceUpdate};