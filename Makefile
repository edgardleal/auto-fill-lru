#
# Makefile
# edgardleal, 2020-02-08 09:33
#

DONE = echo ✓ $@ done
SOURCES = $(shell find ./ -maxdepth 1 -type f -name '*.js')
APP_NAME = $(shell cat package.json 2>/dev/null | $(call JSON_GET_VALUE,name))
modules = $(wildcard node_modules/*/*.js)
.PHONY: all clean help test lint

all: lint test

./node_modules/.bin/jest: package.json
	yarn || npm i
	touch ./node_modules/.bin/jest

coverage/index.html: package.json $(SOURCES) ./node_modules/.bin/jest
	./node_modules/.bin/jest --coverage --coverageReporters html

test: coverage/index.html

watch: ./node_modules/.bin/jest
	./node_modules/.bin/jest  --watchAll

./node_modules/.last_lint: ./node_modules/.bin/jest $(SOURCES)
	./node_modules/.bin/eslint --cache .
	touch ./node_modules/.last_lint

lint: ./node_modules/.last_lint

clean: ## clean: Remove ./node_modules and call clean in all children projects
	rm -rf ./node_modules

hel%: ## help: Show this help message.
	@echo "usage: make [target] ..."
	@echo ""
	@echo "targets:"
	@grep -Eh '^.+:\ ##\ .+' ${MAKEFILE_LIST} | cut -d ' ' -f '3-' | column -t -s ':'


# vim:ft=make
#
