import os
import sys

# Ensure root directory and backend directory are in sys.path
dir_path = os.path.dirname(os.path.realpath(__file__))
root_path = os.path.abspath(os.path.join(dir_path, '..'))
backend_path = os.path.join(root_path, 'backend')

if root_path not in sys.path:
    sys.path.insert(0, root_path)
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from backend.app import app

# Export app for Vercel Serverless Function runtime
__all__ = ['app']
