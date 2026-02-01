# OpenClaw Research for AI Employee Video

## What is OpenClaw?

OpenClaw (formerly Clawdbot → Moltbot → OpenClaw) is an open-source personal AI assistant that runs locally on your hardware. Created by Peter Steinberger (founder of PSPDFKit), it went viral in early 2026 with 126K+ GitHub stars.

**Key differentiator:** Unlike ChatGPT where you go to a website, OpenClaw comes to you - it lives in your messaging apps (WhatsApp, Telegram, Slack, Discord, iMessage, Signal) and executes real tasks autonomously.

**The Mac Mini Rush:** When OpenClaw went viral, Mac Mini sales skyrocketed. People started buying $599+ Mac Minis just to run this AI assistant 24/7. This is the exact trend Jeremy's AI Employee offering taps into.

---

## Why OpenClaw is Different from Zapier/n8n

| Feature | Zapier/n8n | OpenClaw |
|---------|------------|----------|
| Execution | Triggers → Actions | Understands context, makes decisions |
| Interface | Web dashboard | Your existing chat apps |
| Intelligence | Rule-based | AI reasoning + context awareness |
| Autonomy | Waits for triggers | Proactively monitors and acts |
| Setup | Visual workflow builder | Natural language instructions |

**Key quote:** "Unlike other automation platforms like n8n and Zapier, OpenClaw takes into account additional factors like context and task priority, and then makes decisions based on them."

---

## Real-World Use Cases (from X/Twitter and blogs)

### Personal Productivity
- **@tobi_bsf:** "My new AI assistant running 24/7 on a mini PC at home. Daily reminders, GitHub tracking, weekly accountability nudges for my 2026 goals. Finally a personal assistant that actually gets shit done."
- **Steve Caldwell:** Configured OpenClaw to build a weekly meal planning system in Notion, saving his family an hour per week.
- **Mike Manzano:** Set up OpenClaw to run coding agents while sleeping.
- **Andy Griffiths:** Used OpenClaw to build a functional Laravel app while grabbing coffee.

### Daily Briefings
Every morning at 9am, OpenClaw sends a Telegram message with:
- Today's calendar (from macOS Calendar)
- Open Linear tasks sorted by priority
- Anything else that needs attention

### Email/Calendar Automation
OpenClaw monitors inbox, identifies calendar-related messages, and takes action. When someone wants to reschedule, it:
1. Checks availability
2. Updates the event
3. Drafts a confirmation
All without involvement.

### Developer Workflows
- GitHub integration with scheduled cron jobs
- Webhook triggers for automated responses
- Background coding agents in tmux sessions
- Automated debugging and DevOps

---

## OpenClaw Skills for Service Businesses

### Project Management
| Skill | Description |
|-------|-------------|
| **clickup-mcp** | Manage ClickUp tasks, docs, time tracking, comments, chat, search via MCP |
| **asana** | Asana tasks, projects, and workspaces via REST API |
| **jira** | Jira issues, boards, sprints, and projects |
| **linear** | Linear issues, projects, and team workflows |
| **todoist** | List, add, modify, complete, delete tasks |
| **omnifocus** | OmniFocus tasks with GTD workflows |
| **notion** | Notion API for search, query databases, create pages |

### CRM & Sales
| Skill | Description |
|-------|-------------|
| **hubspot** | HubSpot CRM/CMS - contacts, companies, deals, owners, content |
| **twenty-crm** | Twenty CRM (self-hosted) via REST/GraphQL |
| **sales-toolkit** | Apollo.io enrichment, Attio CRM, PhantomBuster automation |
| **gong** | Gong API - calls, transcripts, conversation intelligence |

### Meeting & Transcription
| Skill | Description |
|-------|-------------|
| **otter** | Otter.ai - list, search, download, sync meeting transcripts to CRM |
| **gong** | Search calls, transcripts, conversation intelligence |
| **granola** | Access Granola meeting transcripts and notes |

### Email & Communication
| Skill | Description |
|-------|-------------|
| **email-sequence** | Create/optimize email sequences, drip campaigns, automated flows |
| **gog** | Google Workspace CLI - Gmail, Calendar, Drive, Contacts, Sheets, Docs |
| **clippy** | Microsoft 365/Outlook CLI for calendar and email |
| **imap-email** | Read/manage email via IMAP (ProtonMail, Gmail, etc.) |
| **morning-email-rollup** | Daily morning rollup with AI-generated summaries at 8am |

### Marketing & Analytics
| Skill | Description |
|-------|-------------|
| **ga4** | Query Google Analytics 4 data |
| **gsc** | Query Google Search Console for SEO data |
| **google-ads** | Query, audit, optimize Google Ads campaigns |
| **marketing-mode** | 23 comprehensive marketing skills combined |
| **seo-audit** | SEO audit capabilities |

### Calendar & Scheduling
| Skill | Description |
|-------|-------------|
| **caldav-calendar** | Sync/query CalDAV (iCloud, Google, Fastmail, Nextcloud) |
| **apple-reminders** | Manage Apple Reminders via CLI |
| **calcurse** | Text-based calendar and scheduling |

---

## Jeremy's ClickUp Automation Example

**Use case:** "I'm automating my clients' entire ClickUp tracking. Tasks automatically created and updated based on meeting transcript."

**How to build this with OpenClaw:**

1. **Meeting recording** → Otter.ai or Gong captures transcript
2. **otter skill** syncs transcript to workspace
3. **AI processes transcript** → identifies action items, deadlines, assignees
4. **clickup-mcp skill** creates tasks with:
   - Task name from action item
   - Due date from context
   - Assignee from meeting participants
   - Notes with relevant transcript excerpt
5. **Ongoing updates** → As follow-up meetings happen, tasks auto-update

**Skills needed:**
- `otter` or `gong` (meeting transcripts)
- `clickup-mcp` (task management)
- Custom prompt to parse action items

---

## Technical Architecture

### How OpenClaw Works
```
Your Message (WhatsApp/Slack/etc.)
        ↓
   Gateway (localhost:18789)
        ↓
   AI Model (Claude/GPT/local)
        ↓
   Skills (markdown instruction files)
        ↓
   External APIs & Actions
        ↓
   Response back to your chat
```

### Deployment Options
| Option | Cost | Pros | Cons |
|--------|------|------|------|
| Mac Mini | $599+ one-time | Local, private, powerful | Hardware purchase |
| VPS (Hetzner/DO) | $5-20/mo | No hardware, always on | Cloud-hosted |
| Cloudflare Workers | $5/mo | Serverless, auto-scaling | Less control |
| Existing hardware | $0 | Use what you have | Needs to stay on |

### API Costs
- Claude API: $3/M input, $15/M output tokens
- Typical usage: $20-50/month moderate, $100-300/month heavy

---

## Messaging Channels Supported

**Native:**
- WhatsApp
- Telegram
- Slack
- Discord
- Signal
- iMessage
- Microsoft Teams
- Google Chat
- WebChat

**Extensions:**
- BlueBubbles
- Matrix
- Zalo

---

## Key Features for Video

### For Marketing Copy
- "Your own AI that actually does things"
- "Lives in your chat apps, not another dashboard"
- "126K+ developers trust it"
- "Runs locally - your data never leaves your network"
- "Works while you sleep"

### Visual Opportunities
1. **Mac Mini hero shot** - The hardware that runs 24/7
2. **Chat interface** - Messages going back and forth with AI
3. **Task creation animation** - Meeting → Tasks auto-generated
4. **Integration logos** - Slack, ClickUp, HubSpot, Gmail, Calendar
5. **Dashboard/Gateway UI** - localhost:18789 control panel

### Stats to Show
- 126K+ GitHub stars
- 700+ community skills
- 100+ integrations
- 24/7 uptime
- $0 monthly salary

---

## Press & Social Proof

**Featured in:**
- TechCrunch
- IBM Think
- DigitalOcean
- Ars Technica
- MacStories
- VentureBeat
- Fortune

**Creator:** Peter Steinberger (PSPDFKit/Nutrient founder)

**Community:** Active X/Twitter community at @clawdbot, @openclaw

---

## Sources

- [OpenClaw Official](https://openclaw.ai/)
- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
- [OpenClaw Docs](https://docs.openclaw.ai/)
- [Awesome OpenClaw Skills](https://github.com/VoltAgent/awesome-openclaw-skills)
- [DigitalOcean Guide](https://www.digitalocean.com/resources/articles/what-is-openclaw)
- [Wikipedia](https://en.wikipedia.org/wiki/OpenClaw)
- [@tobi_bsf on X](https://x.com/tobi_bsf/status/2008083529284948265) - Mac Mini 24/7 setup
- [@clawdbot on X](https://x.com/clawdbot) - Official account
- [DEV.to Guide](https://dev.to/mechcloud_academy/unleashing-openclaw-the-ultimate-guide-to-local-ai-agents-for-developers-in-2026-3k0h)
