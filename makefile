vibe-kanban:
	npx vibe-kanban

.PHONY: ai-generate ai-check ai-audit zeka-cli-build zeka-cli-test

# Keep site, Skills and offline knowledge aligned with the maintained sources.
ai-generate:
	python3 supports/zeka-cli/scripts/generate.py

ai-check:
	python3 supports/zeka-cli/scripts/generate.py --check

ai-audit:
	python3 supports/zeka-cli/scripts/audit.py

zeka-cli-build: ai-generate
	cd supports/zeka-cli && go build -trimpath -o bin/zeka ./cmd/zeka

zeka-cli-test:
	cd supports/zeka-cli && go test ./... && go vet ./...
