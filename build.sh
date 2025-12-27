#!/bin/bash
# Create env.js with environment variables
echo "window.ENV = { GEMINI_API_KEY: '$GEMINI_API_KEY' };" > env.js
