
export const modelTypes = [
    {
        id: 1,
        name: "TFGraph"
    },
    {
        id: 2,
        name: "Keras"
    },
    {
        id: 3,
        name: "ONNX"
    },
    {
        id: 4,
        name: "Binary"
    },
    {
        id: 5,
        name: "Custom",
    }
]

export const inferenceStatus = [
    {
        id: 0,
        name: "CREATED",
    },
    {
        id: 1,
        name: "RUNNING",
    },
    {
        id: 5,
        name: "SUCCESSFUL",
    },
    {
        id: -1,
        name: "FAILED"
    }
]

export const LATEST_INFERENCE = {
    id: -1,
    name: "latest"
}