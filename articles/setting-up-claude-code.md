---
title: Setting Up Claude Code
description: >-
  Step-by-step guide to installing, authenticating, and configuring Claude Code
  on a developer workstation.
tags:
  - claude-code
  - ai
  - developer-tools
  - setup
---
# Setting Up Claude Code

Claude Code is Anthropic's official command-line tool that brings Claude into your terminal so it can read your code, run commands, edit files, and help you ship work faster. This guide walks through installing Claude Code, authenticating it, and getting it configured for day-to-day use.

## Prerequisites

Before installing, make sure your workstation meets the following:

- **Operating system:** macOS, Linux, or Windows via WSL2
- **Node.js:** version 18 or later
- **Shell:** Bash, Zsh, or Fish
- **Account:** An Anthropic account with access to Claude Code (Anthropic Console API key, Claude Pro/Max subscription, or an Amazon Bedrock / Google Vertex AI configuration)
- **Git:** Recommended so Claude Code can reason about diffs and commits

Verify your Node version:

```bash
node --version
```

If it returns anything below `v18`, install or upgrade Node first (for example with [nvm](https://github.com/nvm-sh/nvm)).

## Installation

Claude Code is distributed as an npm package.

### macOS / Linux / WSL

```bash
npm install -g @anthropic-ai/claude-code
```

Then confirm the install:

```bash
claude --version
```

### Windows (native)

Native Windows is not officially supported. Install [WSL2](https://learn.microsoft.com/windows/wsl/install) with Ubuntu, then run the macOS/Linux instructions inside your WSL shell.

> **Tip:** Avoid installing with `sudo`. If you hit permission errors, fix your global npm prefix (`npm config set prefix ~/.npm-global`) and add `~/.npm-global/bin` to your `PATH`.

## First Run and Authentication

Launch Claude Code from any project directory:

```bash
cd ~/code/my-project
claude
```

On first launch you will be prompted to choose an authentication method:

1. **Claude subscription (Pro or Max)** — opens a browser to log in to your Anthropic account. Best option for individual developers.
2. **Anthropic API key** — paste a key from the [Anthropic Console](https://console.anthropic.com/). Usage is billed per token.
3. **Amazon Bedrock** — set `CLAUDE_CODE_USE_BEDROCK=1` and configure standard AWS credentials.
4. **Google Vertex AI** — set `CLAUDE_CODE_USE_VERTEX=1` and configure `gcloud` credentials.

After authenticating, Claude will run a quick environment check and drop you into an interactive session.

## Basic Usage

Inside a Claude Code session you can simply type instructions in natural language:

```
> summarize the architecture of this repo
> add a unit test for the parseConfig function
> why is the CI build failing on main?
```

Useful built-in slash commands:

- `/help` — list available commands
- `/init` — generate a `CLAUDE.md` file describing the repo (recommended on first use)
- `/clear` — reset the conversation context
- `/cost` — show token usage for the current session
- `/model` — switch between models (e.g. Sonnet vs. Opus)
- `/config` — open the settings menu
- `exit` or Ctrl+D — quit

## Project Configuration: `CLAUDE.md`

A `CLAUDE.md` file at the root of your repo is loaded automatically into every session. Use it to give Claude persistent context such as:

- Project overview and architecture
- Coding conventions and style rules
- How to run tests, lint, and build
- Things Claude should **never** do (e.g. "do not modify files in `vendor/`")

Generate a starting point with `/init`, then edit to taste. You can also place a personal `~/.claude/CLAUDE.md` for global preferences that apply to every project.

## Permissions and Safety

By default, Claude Code asks before running shell commands or editing files. You can tune this in `/config`:

- **Ask each time** (default, safest)
- **Allow within session** — approve a command once and remember it
- **Auto-accept edits** — useful for trusted, sandboxed environments

For repos with sensitive data, add a `.claudeignore` file (same syntax as `.gitignore`) to keep certain paths out of context.

## Updating

```bash
npm update -g @anthropic-ai/claude-code
```

Check the installed version with `claude --version`. Claude Code also notifies you in-session when a new release is available.

## Uninstalling

```bash
npm uninstall -g @anthropic-ai/claude-code
rm -rf ~/.claude
```

The second command removes cached credentials and local settings.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `command not found: claude` | Ensure your npm global `bin` directory is on `PATH`. Run `npm bin -g` to find it. |
| Auth loop in the browser | Clear cookies for `console.anthropic.com` and retry, or use an API key instead. |
| `EACCES` on install | Don't use `sudo`; reconfigure the npm prefix to a user-owned directory. |
| Slow responses behind a corporate proxy | Set `HTTPS_PROXY` and `NO_PROXY` environment variables before launching `claude`. |
| TLS / certificate errors | Add your corporate CA bundle via `NODE_EXTRA_CA_CERTS=/path/to/ca.pem`. |

## Further Reading

- Official docs: <https://docs.anthropic.com/claude/docs/claude-code>
- GitHub repo and issue tracker: <https://github.com/anthropics/claude-code>
- Anthropic status page: <https://status.anthropic.com>
