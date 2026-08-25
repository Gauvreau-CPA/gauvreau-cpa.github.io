.PHONY: install fmt lint check test

install:
	python -m pip install -e .[dev] || python -m pip install ruff pytest

fmt:
	python -m ruff format .
	python -m ruff check --fix .

lint:
	python -m ruff format --check .
	python -m ruff check .

check: lint

test:
	python -m pytest
