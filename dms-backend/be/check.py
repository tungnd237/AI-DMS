import torch

# Check if CUDA is available
if torch.cuda.is_available():
    print("CUDA is available.")
else:
    print("CUDA is not available.")

# Check if cuDNN is enabled
if torch.backends.cudnn.enabled:
    print("cuDNN is enabled.")
else:
    print("cuDNN is not enabled.")
    
# Try to perform a simple operation on the GPU
try:
    x = torch.rand(3, 3).cuda()
    y = torch.rand(3, 3).cuda()
    z = x + y
    print("Operation successful:", z)
except Exception as e:
    print("Operation failed:", e)
