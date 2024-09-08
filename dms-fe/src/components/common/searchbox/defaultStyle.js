export default {
    control: {
        backgroundColor: "#fff",
        fontSize: 14,
        fontWeight: "normal",
    },

    // "&multiLine": {
    //     control: {
    //         fontFamily: "monospace",
    //         minHeight: 63,
    //     },
    //     highlighter: {
    //         padding: 9,
    //         border: "1px solid transparent",
    //     },
    //     input: {
    //         padding: 9,
    //         border: "1px solid silver",
    //     },
    // },

    "&singleLine": {
        // display: "inline-block",
        // width: "100%",
        // highlighter: {
        //     padding: 1,
        //     border: "2px inset transparent",
        // },
        input: {
            borderRadius: "5px",
            // padding: 1,
            border: "2px solid rgba(0,0,0,0.15)",
            // padding: 1,
            // // border: 0,
            // borderBottom: `1px solid`,

        },
    },

    suggestions: {
        list: {
            backgroundColor: "white",
            border: "1px solid rgba(0,0,0,0.15)",
            fontSize: 14,
        },
        item: {
            padding: "5px 15px",
            borderBottom: "1px rgba(0,0,0,0.15)",
            "&focused": {
                backgroundColor: "#55a9ee",
            },
        },
    },
};
