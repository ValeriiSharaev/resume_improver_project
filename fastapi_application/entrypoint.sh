#!/bin/bash
set -e

#echo "Running tests..."
#
#pytest tests/tests_unit/ || exit 1
#pytest tests/tests_integration/ || exit 1


echo "Starting application..."

#alembic upgrade head
python main.py