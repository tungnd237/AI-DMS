import onnx

# Load the ONNX model
model = onnx.load("/home/ubuntu/20thao.nt/Capstone-Project/onnx-model/resnet18d_simplify.onnx")

# Check the model
onnx.checker.check_model(model)
print("The model is valid!")
