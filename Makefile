# the-second-trial.github.io — master Makefile
#
# This Makefile is the SINGLE entry point for building and publishing
# standalone projects. Individual projects under `projects/<slug>/` only know
# how to build themselves into their own local `dist/`. They NEVER touch the
# parent repo or `public/`. All artifact placement into `public/work/<slug>/`
# is done here, by this Makefile.
#
# See docs/architecture.md (option 3) for the rationale.

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# Standalone projects. Add a new slug here when you add a project under
# projects/<slug>/ that produces a prebuilt artifact in public/work/<slug>/.
PROJECTS := serverless-queue

PROJECTS_DIR := projects
PUBLIC_WORK  := public/work

# How project dependencies are installed. The default build uses `npm ci`,
# which installs strictly from the committed package-lock.json (reproducible,
# never mutates the lockfile, fails if it's out of sync) — correct for CI and
# deploys. The `*-local` targets override this with `npm install`, which
# creates/updates the lockfile — use those when adding or bumping deps.
INSTALL ?= ci

# ---------------------------------------------------------------------------
# Meta
# ---------------------------------------------------------------------------

.DEFAULT_GOAL := help
# NOTE: per-project targets (build-<slug>/clean-<slug>) are intentionally NOT
# listed as .PHONY. GNU Make will not apply a pattern rule (build-%) to a
# target declared phony, which would silently break `make build-<slug>`.
# There are no real files by those names, so phoniness isn't needed.
.PHONY: help build site dev preview build-projects local-build-projects clean-projects $(addprefix local-build-,$(PROJECTS))

help: ## Show this help
	@echo "Targets:"
	@echo "  make site                  Build the main Astro site (dist/)"
	@echo "  make dev                   Run the Astro dev server"
	@echo "  make preview               Preview the built Astro site"
	@echo "  make build-projects        Build ALL projects (npm ci) into public/work/"
	@echo "  make build-<slug>          Build one project (npm ci)"
	@echo "  make local-build-projects  Build ALL projects with 'npm install' (updates lockfiles)"
	@echo "  make local-build-<slug>    Build one project with 'npm install' (updates its lockfile)"
	@echo "  make clean-projects        Remove ALL standalone artifacts from public/work/"
	@echo "  make clean-<slug>          Remove a single project's artifact"
	@echo "  make build                 Build all projects (npm ci), then the main site"
	@echo ""
	@echo "Use the local-build-* targets when adding/bumping a project's deps;"
	@echo "they run 'npm install' and update package-lock.json. Everything else"
	@echo "uses 'npm ci' for reproducible builds."
	@echo ""
	@echo "Known projects: $(PROJECTS)"

# ---------------------------------------------------------------------------
# Main site (Astro)
# ---------------------------------------------------------------------------

site: ## Build the main Astro site
	npm run build

dev: ## Run the Astro dev server
	npm run dev

preview: ## Preview the built Astro site
	npm run preview

# ---------------------------------------------------------------------------
# Standalone projects
# ---------------------------------------------------------------------------

# Build a single project: install its deps, build it, then copy its dist/
# into public/work/<slug>/app/. This is the ONLY place public/ is written to.
# The artifact is published under an `app/` sub-path so it does not collide
# with the Astro-rendered article route at /work/<slug>/.
#
# $* is the stem (the <slug>) from the pattern target.
# INSTALL selects the install command: `ci` (default, reproducible) or
# `install` (via the local-* targets, updates the lockfile).
build-%: ## Build one project into public/work/<slug>/app/ (npm ci)
	@if [ ! -d "$(PROJECTS_DIR)/$*" ]; then \
		echo "error: no such project '$(PROJECTS_DIR)/$*'"; exit 1; \
	fi
	@echo ">> installing deps for $* (npm $(INSTALL))"
	cd $(PROJECTS_DIR)/$* && npm $(INSTALL)
	@echo ">> building $*"
	cd $(PROJECTS_DIR)/$* && npm run build
	@echo ">> publishing artifact to $(PUBLIC_WORK)/$*/app"
	rm -rf "$(PUBLIC_WORK)/$*/app"
	mkdir -p "$(PUBLIC_WORK)/$*/app"
	cp -R "$(PROJECTS_DIR)/$*/dist/." "$(PUBLIC_WORK)/$*/app/"
	@# GitHub Pages: prevent Jekyll from touching the artifact
	touch "$(PUBLIC_WORK)/$*/app/.nojekyll"
	@echo ">> done: $(PUBLIC_WORK)/$*/app"

# Local variant: build one project using `npm install` (creates/updates its
# package-lock.json). Use when adding or bumping a project's dependencies.
#
# These are explicit per-project targets (generated from $(PROJECTS)) rather
# than a `build-local-%` pattern, which would otherwise be captured by the
# `build-%` pattern above with the wrong stem.
define LOCAL_BUILD_template
local-build-$(1):
	@$$(MAKE) --no-print-directory build-$(1) INSTALL=install
endef
$(foreach p,$(PROJECTS),$(eval $(call LOCAL_BUILD_template,$(p))))

# Remove a single project's published artifact.
clean-%: ## Remove one project's artifact from public/work/<slug>/
	rm -rf "$(PUBLIC_WORK)/$*"
	@echo ">> removed $(PUBLIC_WORK)/$*"

build-projects: $(addprefix build-,$(PROJECTS)) ## Build all standalone projects (npm ci)

local-build-projects: $(addprefix local-build-,$(PROJECTS)) ## Build all projects with npm install

clean-projects: $(addprefix clean-,$(PROJECTS)) ## Remove all standalone artifacts

# ---------------------------------------------------------------------------
# Full build
# ---------------------------------------------------------------------------

build: build-projects site ## Build all projects, then the main site
