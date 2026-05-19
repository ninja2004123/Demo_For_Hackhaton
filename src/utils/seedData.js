import { setItem, getItem, getGlobal, setGlobal } from './storage.js';

const FINANCIAL_PLAN_DOC = {
  id: 'fin-plan-1',
  title: '5-Year Financial Projection',
  description: '5-year revenue & expenditure projections, funding requirements, and break-even analysis',
  clearance: 'L3',
  category: 'Finance',
  type: 'TXT',
  size: '6 KB',
  uploadedBy: 'u1',
  uploadedAt: '2025-01-01',
  content: `5-YEAR FINANCIAL PROJECTION

=== INSTRUCTIONS ===

How to use this workbook:
1. Use the Revenue Projection sheet to enter products/services, estimated units sold, and average price per item for each year.
2. Use the Expenditure Projection sheet to enter all expected costs. The detailed expenditure rows are intentionally left blank.
3. The 5-Year Summary sheet automatically calculates total revenue, total expenditures, net profit/loss, and profit margin.
4. Yellow cells are input cells that founders should complete. Formula cells should not be overwritten.
5. The template is suitable for online stores, digital services, marketplaces, subscription businesses, and other e-business models.

Suggested online-business expenditure categories:
- Website / e-commerce platform
- Domain and hosting
- Payment processing fees
- Digital marketing and paid ads
- Content creation
- Packaging
- Delivery / logistics
- Inventory / cost of goods sold
- Software subscriptions
- Freelancers / salaries
- Customer service
- Accounting / legal
- Other operating expenses

=== REVENUE PROJECTION ===

Revenue Projection — Units Sold × Price per Item

Product / Service                     | Y1 Units | Y1 Price (€) | Y1 Rev (€) | Y2 Units | Y2 Price (€) | Y2 Rev (€) | Y3 Units | Y3 Price (€) | Y3 Rev (€) | Y4 Units | Y4 Price (€) | Y4 Rev (€) | Y5 Units | Y5 Price (€) | Y5 Rev (€)
Enterprise SaaS Subscription          |        5 |       12,000 |     60,000 |       10 |       13,000 |    130,000 |       18 |       14,000 |    252,000 |       30 |       15,000 |    450,000 |       45 |       16,000 |    720,000
API Access Licensing                  |        5 |        3,000 |     15,000 |       10 |        4,000 |     40,000 |       18 |        5,000 |     90,000 |       30 |        6,000 |    180,000 |       45 |        7,000 |    315,000
Custom Enterprise Deployment          |        2 |        8,000 |     16,000 |        4 |       10,000 |     40,000 |        6 |       12,000 |     72,000 |        8 |       14,000 |    112,000 |       10 |       15,000 |    150,000
Premium Support & Compliance Package  |        3 |        2,500 |      7,500 |        5 |        3,000 |     15,000 |        8 |        4,000 |     32,000 |       12 |        5,000 |     60,000 |       18 |        6,000 |    108,000
AI Workflow Automation Add-ons        |        4 |        3,500 |     14,000 |        6 |        4,700 |     28,200 |       10 |        5,000 |     50,000 |       16 |        5,500 |     88,000 |       23 |        6,000 |    138,000

TOTAL REVENUE                         |          |              |    112,500 |          |              |    253,200 |          |              |    496,000 |          |              |    890,000 |          |              |  1,431,000

=== EXPENDITURE PROJECTION ===

Expenditure Projection — 5 Years

Expenditure Category / Cost Item      | Notes                                | Year 1 (€) | Year 2 (€) | Year 3 (€) | Year 4 (€) | Year 5 (€)
Cloud Computing Infrastructure        | GPU servers, cloud hosting, AI infer |     15,000 |     25,000 |     40,000 |     60,000 |     85,000
Software Development                  | Engineers and developers             |     30,000 |     45,000 |     70,000 |    100,000 |    140,000
AI Research & Model Optimization      | AI specialists and testing           |     10,000 |     18,000 |     30,000 |     45,000 |     60,000
Security & Compliance                 | Security audits and certifications   |      5,000 |      8,000 |     12,000 |     18,000 |     25,000
Sales & Marketing                     | Enterprise outreach and advertising  |      8,000 |     15,000 |     25,000 |     40,000 |     60,000
Customer Support                      | Client onboarding and SLA support    |      4,000 |      7,000 |     12,000 |     18,000 |     28,000
Legal & Accounting                    | Company registration and contracts   |      3,000 |      4,000 |      5,000 |      7,000 |      8,000
Software Tools & Subscriptions        | Dev tools, collaboration tools       |      2,500 |      4,000 |      6,000 |      8,000 |     10,000
Office & Administrative Costs         | Operational expenses                 |      2,500 |      4,000 |      5,000 |      7,000 |      9,000
Integration & Deployment Costs        | Enterprise integration support       |      5,000 |      9,000 |     15,000 |     22,000 |     35,000
Salaries & Wages                      | Employee salaries                    |     52,000 |     87,000 |    138,000 |    203,000 |    282,000

TOTAL EXPENDITURES                    |                                      |    137,000 |    226,000 |    358,000 |    528,000 |    742,000

=== 5-YEAR SUMMARY ===

5-Year Financial Summary

Metric                | Year 1 (€) | Year 2 (€) | Year 3 (€) | Year 4 (€) | Year 5 (€) | Total 5 Years (€)
Total Revenue         |    112,500 |    253,200 |    496,000 |    890,000 |  1,431,000 |        3,182,700
Total Expenditures    |    137,000 |    226,000 |    358,000 |    528,000 |    742,000 |        1,991,000
Net Profit / Loss     |    -24,500 |     27,200 |    138,000 |    362,000 |    689,000 |        1,191,700

=== INITIAL FUNDING REQUIREMENTS ===

Use of Funds                      | Amount (€) | Notes
Platform Development / Coding     |     20,000 | MVP development
Cloud Infrastructure Setup        |      8,000 | Initial hosting and compute
AI Model/API Costs                |      5,000 | Initial AI integration costs
Branding & Website                |      3,000 | Company identity and website
Legal / Registration              |      2,500 | Company setup and contracts
Marketing Launch Budget           |      6,000 | Initial customer acquisition
Security & Compliance Setup       |      4,000 | Security framework and audits
Software Licenses & Tools         |      2,500 | Collaboration and development tools
Emergency / Reserve Capital       |      4,000 | Operational buffer
TOTAL PLANNED USE                 |     55,000 |

Funding Sources:
- Founders' own investment:   €10,000
- Family / friends contribution: €5,000
- Bank loan:                  €10,000
- Investor / partner funding: €20,000
- Grant / startup support:     €7,000
- Other funding:               €3,000
TOTAL FUNDING:                €55,000

Tip: Initial funding should cover launch costs and the first operating months.

=== BREAK-EVEN ANALYSIS ===

Break-even Point Template

Inputs:
- Selling price per unit:         €12,000  (average price per product/service sold)
- Variable cost per unit:          €3,000  (cost per sale: product, packaging, payment fee, delivery)
- Contribution margin per unit:    €9,000  (selling price - variable cost)
- Fixed costs for the period:     €85,000  (fixed costs: website, software, salaries, rent, ads)

Break-even Results:
- Break-even units:    9.44 units   (number of units that must be sold to cover all costs)
- Break-even revenue: €113,333      (revenue needed to cover all costs)

Formula: Break-even units = Fixed costs ÷ (Selling price per unit - Variable cost per unit)

Notes:
* Insert your selling price, variable and fixed costs for your business.
* Please check the results using your critical thinking analysis.`,
};

export const COMPANIES = [
  {
    id: 'acme-corp',
    name: 'Acme Corp',
    industry: 'Technology',
    logo: 'AC',
    color: '#3b82f6',
    description: 'Leading enterprise technology solutions provider',
    employeeCount: 1240,
  },
  {
    id: 'fintech-inc',
    name: 'FinTech Inc',
    industry: 'Financial Services',
    logo: 'FI',
    color: '#10b981',
    description: 'Next-generation financial technology & compliance',
    employeeCount: 380,
  },
];

const USERS = {
  'acme-corp': [
    { id: 'u1', name: 'Alex Chen',      email: 'alex@acme.com',    password: 'demo123', clearance: 'L5', role: 'CTO',              department: 'Engineering', isAdmin: true },
    { id: 'u2', name: 'Sam Rivera',     email: 'sam@acme.com',     password: 'demo123', clearance: 'L3', role: 'Senior Engineer',  department: 'Engineering', isAdmin: false },
    { id: 'u3', name: 'Jordan Lee',     email: 'jordan@acme.com',  password: 'demo123', clearance: 'L2', role: 'Product Manager',  department: 'Product',     isAdmin: false },
    { id: 'u4', name: 'Morgan Park',    email: 'morgan@acme.com',  password: 'demo123', clearance: 'L1', role: 'Intern',           department: 'Engineering', isAdmin: false },
    { id: 'u5', name: 'Casey Zhang',    email: 'casey@acme.com',   password: 'demo123', clearance: 'L4', role: 'HR Director',      department: 'HR',          isAdmin: false },
  ],
  'fintech-inc': [
    { id: 'u1', name: 'Riley Johnson',  email: 'riley@fintech.com',  password: 'demo123', clearance: 'L5', role: 'CEO',           department: 'Executive',  isAdmin: true },
    { id: 'u2', name: 'Taylor Kim',     email: 'taylor@fintech.com', password: 'demo123', clearance: 'L3', role: 'Lead Developer', department: 'Engineering', isAdmin: false },
    { id: 'u3', name: 'Drew Martinez',  email: 'drew@fintech.com',   password: 'demo123', clearance: 'L1', role: 'Analyst',        department: 'Finance',    isAdmin: false },
  ],
};

const DOCUMENTS = {
  'acme-corp': [
    FINANCIAL_PLAN_DOC,
    {
      id: 'd1',
      title: 'New Employee Onboarding Guide',
      description: 'Getting started guide for all new hires at Acme Corp',
      clearance: 'L1',
      category: 'HR',
      type: 'MD',
      size: '45 KB',
      uploadedBy: 'u1',
      uploadedAt: '2024-01-01',
      content: `# Welcome to Acme Corp — Onboarding Guide

## Week 1: Getting Started

### Day 1 — Setup
- IT will provide your MacBook Pro and access credentials
- Enable 2FA on all accounts: Slack, GitHub, Jira, Gmail
- Join Slack channels: #engineering, #general, #announcements
- Meet your onboarding buddy (assigned by HR)

### Day 2–3 — Environment Setup
1. Clone the main platform repo from GitHub
2. Follow README.md for local development setup
3. Run the full test suite to verify your setup
4. Complete mandatory security training (link in your welcome email)

### Day 4–5 — Learn the Codebase
- Review architecture documentation in Confluence
- Shadow your buddy in their daily standups
- Attend daily standup at 10 AM
- Start exploring good-first-issue tickets in Jira

## Week 2: First Contribution
- Pick a "good first issue" from Jira (labeled 'onboarding')
- Submit your first PR — your buddy will review it
- Pair programming sessions available on request

## Key Tools
| Tool | Purpose |
|---|---|
| GitHub | Code repository and CI/CD |
| Jira | Project and ticket tracking |
| Slack | Team communication |
| Confluence | Internal documentation |
| ArgoCD | Deployment management |

## Key Contacts
- IT Support: it@acme.com
- HR Team: hr@acme.com
- Security Team: security@acme.com`,
    },
    {
      id: 'd2',
      title: 'Employee Handbook 2024',
      description: 'Company policies, values, benefits, and code of conduct',
      clearance: 'L2',
      category: 'HR',
      type: 'PDF',
      size: '2.4 MB',
      uploadedBy: 'u5',
      uploadedAt: '2024-01-15',
      content: `ACME CORP — EMPLOYEE HANDBOOK 2024

CORE VALUES
- Innovation: We push boundaries and embrace new ideas
- Integrity: We act with honesty and transparency in all interactions
- Excellence: We strive for the highest quality in everything we deliver
- Collaboration: We achieve more together than individually

WORKING HOURS
Standard hours are 9 AM–6 PM, Monday through Friday. Flexible arrangements available with manager approval. Core collaboration hours: 10 AM–3 PM.

REMOTE WORK POLICY
Full-time employees may work remotely up to 3 days per week. A minimum of 2 in-office days per week is required. Home office stipend: $500/year.

VACATION & PTO
- Full-time employees: 20 days PTO per year + all federal holidays
- PTO accrues monthly (1.67 days/month)
- Unused PTO rolls over up to a maximum of 30 days
- Parental leave: 16 weeks fully paid (primary caregiver)

COMPENSATION & BENEFITS
- Competitive market-rate salaries reviewed annually
- 401(k) with 4% company match
- 100% employer-paid health, dental, vision
- $2,000/year learning & development budget
- Annual performance bonus: 5–20% of base salary

CODE OF CONDUCT
All employees must maintain professional behavior, respect all colleagues regardless of level, and protect company information. Violations are subject to disciplinary action up to and including termination.

PERFORMANCE REVIEW CYCLE
Reviews occur twice yearly: July 1 and January 1. Mid-year check-ins with managers are encouraged quarterly.`,
    },
    {
      id: 'd3',
      title: 'Platform Architecture — v3.2',
      description: 'Core system architecture, tech stack, and infrastructure documentation',
      clearance: 'L3',
      category: 'Engineering',
      type: 'PDF',
      size: '5.1 MB',
      uploadedBy: 'u1',
      uploadedAt: '2024-02-01',
      content: `ACME CORP — PLATFORM ARCHITECTURE v3.2

OVERVIEW
The Acme Platform is built on a microservices architecture deployed across 3 AWS regions for high availability and global performance.

MICROSERVICES INVENTORY
1. API Gateway (Kong v3.5) — Routes all external traffic, handles SSL termination
2. Auth Service — JWT + OAuth 2.0/OIDC, integrates with Okta SSO
3. User Service — User profiles, preferences, organizational hierarchy
4. Product Service — Core product catalog, pricing engine
5. Order Service — Order processing pipeline, inventory management
6. Notification Service — Email (SES), SMS (Twilio), Push (FCM)
7. Analytics Service — Real-time event streaming, BI dashboards
8. ML Platform — Feature store, model registry, inference serving

TECHNOLOGY STACK
Backend:
- Primary services: Node.js 20 LTS (TypeScript)
- ML/Data: Python 3.11 (FastAPI, PyTorch)
- Batch processing: Apache Spark on EMR

Frontend:
- Web: React 18 + TypeScript + Vite
- Mobile: React Native (iOS + Android)
- Design system: Internal component library (Figma)

Databases:
- PostgreSQL 15 (primary relational store, RDS Multi-AZ)
- Redis 7 (session cache, rate limiting)
- MongoDB Atlas (unstructured analytics data)
- Elasticsearch 8 (full-text search)

Infrastructure:
- Container orchestration: Kubernetes (EKS) 1.29
- Service mesh: Istio 1.20
- Message queue: Apache Kafka 3.6 (MSK)
- CI/CD: GitHub Actions + ArgoCD
- IaC: Terraform + Atlantis

REGIONAL DEPLOYMENT
- Primary: us-east-1 (N. Virginia)
- Secondary: eu-west-1 (Ireland) — GDPR compliance
- APAC: ap-southeast-1 (Singapore)

SECURITY POSTURE
- All data encrypted at rest: AES-256 via AWS KMS
- All data in transit: TLS 1.3 minimum
- Secrets management: AWS Secrets Manager + HashiCorp Vault
- Security scanning: Snyk (dependencies), Semgrep (SAST), Wiz (cloud posture)
- Compliance: SOC 2 Type II, PCI DSS Level 1, ISO 27001

SLO TARGETS
- API availability: 99.95% (4.4h downtime/year)
- P99 API latency: < 200ms
- RTO: 4 hours | RPO: 1 hour
- Incident response: P1 = 15 min, P2 = 1 hour`,
    },
    {
      id: 'd4',
      title: 'Q1 2024 Performance Reviews',
      description: 'Individual performance assessments, ratings, and compensation decisions',
      clearance: 'L4',
      category: 'HR',
      type: 'PDF',
      size: '890 KB',
      uploadedBy: 'u5',
      uploadedAt: '2024-03-31',
      content: `ACME CORP — Q1 2024 PERFORMANCE REVIEWS
CONFIDENTIAL — HR & MANAGER ACCESS ONLY

ENGINEERING DEPARTMENT

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sam Rivera — Senior Engineer (L3)
Rating: Exceeds Expectations — 4.5/5
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Highlights:
• Led successful migration of authentication system (ahead of schedule by 2 weeks)
• Mentored 2 junior engineers; both promoted within the quarter
• Architected the new caching layer that reduced API latency 40%
• Zero critical incidents in the systems they own

Development Areas:
• Cross-functional communication with product stakeholders
• Documentation of complex system design decisions

Compensation Review: +8% salary increase effective April 1, 2024
New base: $198,000 + $40,000 bonus target

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HR DEPARTMENT

Casey Zhang — HR Director (L4)
Rating: Meets Expectations — 3.5/5
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Highlights:
• Successfully implemented new onboarding program (Net Promoter Score: 8.4/10)
• Reduced average time-to-hire from 45 to 38 days (15% improvement)
• Managed 3 complex employee relations cases successfully

Development Areas:
• Strategic workforce planning at executive level
• Data-driven HR metrics and dashboards

Compensation Review: +4% salary increase effective April 1, 2024
New base: $165,000 + $25,000 bonus target`,
    },
    {
      id: 'd5',
      title: 'M&A Strategy 2024–2025',
      description: 'Strategic merger and acquisition targets, valuations, and board-level deal strategy',
      clearance: 'L5',
      category: 'Executive',
      type: 'PDF',
      size: '1.2 MB',
      uploadedBy: 'u1',
      uploadedAt: '2024-03-15',
      content: `ACME CORP — M&A STRATEGY 2024–2025
TOP SECRET — BOARD & C-SUITE ONLY

EXECUTIVE SUMMARY
Acme Corp is evaluating two strategic acquisitions to accelerate growth in the AI/ML space and close a critical gap in our analytics offering. Total capital required: ~$460M, funded through a combination of existing cash reserves and revolving credit facility.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TARGET A: CloudMind AI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current Valuation: $340M (14x ARR)
Revenue: $24M ARR, growing 180% YoY
Headcount: 85 (60% engineering)
Location: San Francisco, CA

Strategic Fit:
CloudMind's enterprise AI assistant technology directly complements our automation roadmap. Their customer base (140 enterprise accounts) has 78% overlap with our target ICP.

Proposed Deal Structure:
• All-cash acquisition at $340M
• 18-month retention packages for key engineers ($12M total)
• Integration timeline: 9 months

Key Risks:
• Customer churn during integration (estimated 10–15%)
• Key-person dependency on 3 founders

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TARGET B: DataStream Analytics
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current Valuation: $120M (15x ARR)
Revenue: $8M ARR, growing 95% YoY
Headcount: 42 (75% engineering)

Strategic Fit:
Fills critical gap in real-time data processing capability. Patent portfolio includes 12 patents on stream processing algorithms.

Proposed Deal Structure:
• 60% cash ($72M), 40% Acme stock ($48M at current valuation)
• 2-year earnout of up to $20M based on revenue milestones

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINANCIAL IMPACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Combined acquisition cost: ~$480M (including retention)
Expected synergies: $45M/year by 2026
EPS impact: -$0.23 in Year 1, +$0.41 by Year 3

TIMELINE
Q2 2024: Complete due diligence on both targets
Q3 2024: Board approval + regulatory filing (HSR Act)
Q4 2024: Close primary acquisition (CloudMind)
Q1 2025: Close secondary acquisition (DataStream)

THIS DOCUMENT IS RESTRICTED TO BOARD MEMBERS AND C-SUITE.
UNAUTHORIZED DISTRIBUTION IS A SERIOUS POLICY VIOLATION.`,
    },
    {
      id: 'd6',
      title: 'Engineering Salary Bands 2024',
      description: 'Compensation bands and leveling framework for engineering roles',
      clearance: 'L4',
      category: 'HR',
      type: 'PDF',
      size: '320 KB',
      uploadedBy: 'u5',
      uploadedAt: '2024-01-05',
      content: `ACME CORP — ENGINEERING SALARY BANDS 2024
RESTRICTED — MANAGERS & HR ONLY

LEVELING FRAMEWORK

L3 — Engineer I
Scope: Delivers well-defined tasks independently
Base Range: $120,000 – $145,000
Bonus Target: 8% of base
Equity: 10,000 options (4-year vest)

L4 — Engineer II
Scope: Owns features end-to-end, some cross-team coordination
Base Range: $145,000 – $175,000
Bonus Target: 10% of base
Equity: 20,000 options (4-year vest)

L5 — Senior Engineer
Scope: Technical leadership of a team or system
Base Range: $175,000 – $215,000
Bonus Target: 15% of base
Equity: 40,000 options (4-year vest)

L6 — Staff Engineer
Scope: Cross-org technical influence, sets architectural direction
Base Range: $215,000 – $260,000
Bonus Target: 20% of base
Equity: 80,000 options (4-year vest)

L7 — Principal Engineer
Scope: Company-wide technical strategy
Base Range: $260,000 – $320,000
Bonus Target: 25% of base
Equity: 150,000 options (4-year vest)

M5 — Engineering Manager
Scope: Manages 5-8 engineers, team delivery
Base Range: $195,000 – $235,000
Bonus Target: 18% of base
Equity: 60,000 options (4-year vest)

M6 — Senior Engineering Manager / Director
Scope: Manages managers, org of 20-40
Base Range: $235,000 – $290,000
Bonus Target: 25% of base
Equity: 120,000 options (4-year vest)`,
    },
  ],
  'fintech-inc': [
    FINANCIAL_PLAN_DOC,
    {
      id: 'd1',
      title: 'Compliance Framework 2024',
      description: 'Regulatory compliance, risk management, and audit requirements',
      clearance: 'L3',
      category: 'Compliance',
      type: 'PDF',
      size: '3.2 MB',
      uploadedBy: 'u1',
      uploadedAt: '2024-01-10',
      content: `FINTECH INC — COMPLIANCE FRAMEWORK 2024

REGULATORY OVERVIEW
FinTech Inc operates under multiple regulatory frameworks and must maintain compliance across all product lines and geographies.

APPLICABLE REGULATIONS
• PCI DSS Level 1 — Card payment data handling
• SOX Section 404 — Financial reporting controls
• GDPR — EU customer data protection
• CCPA — California consumer privacy
• FINRA Rule 4370 — Business continuity planning
• BSA/AML — Anti-money laundering monitoring

DATA CLASSIFICATION & HANDLING
Level 1 — Public: Marketing materials, public API docs
Level 2 — Internal: Employee communications, internal tools
Level 3 — Confidential: Customer PII, transaction records
Level 4 — Restricted: Risk models, audit findings, HR data
Level 5 — Top Secret: Executive strategy, M&A, board materials

SECURITY CONTROLS
• Multi-factor authentication required for all systems
• Privileged Access Management (CyberArk) for production access
• All customer data encrypted: AES-256 at rest, TLS 1.3 in transit
• Annual penetration testing by certified third party
• SOC 2 Type II audit completed annually

INCIDENT RESPONSE
• GDPR breach notification: 72 hours to supervisory authority
• PCI DSS: Immediate notification to card brands
• Internal escalation: CISO within 1 hour of discovery
• Incident commander assigned for all P1 incidents

AUDIT & LOGGING
• All financial transactions retained: 7 years minimum
• System access logs: 3 years minimum
• Immutable audit trail in dedicated log management platform (Splunk)`,
    },
    {
      id: 'd2',
      title: 'New Analyst Onboarding',
      description: 'Welcome guide and first 30 days for new financial analysts',
      clearance: 'L1',
      category: 'HR',
      type: 'MD',
      size: '28 KB',
      uploadedBy: 'u1',
      uploadedAt: '2024-01-01',
      content: `# Welcome to FinTech Inc — Analyst Onboarding

## Your First Week

Welcome to FinTech Inc! We're excited to have you join our growing team.

### Day 1 Checklist
- [ ] Collect hardware from IT (MacBook Pro + security key)
- [ ] Complete identity verification and background check acknowledgment
- [ ] Set up all required software (see IT setup guide)
- [ ] Mandatory security awareness training (2 hours, online)
- [ ] Meet your manager and onboarding buddy

### Day 2–5: Systems Access
All data systems require manager approval. Submit access requests via the IT portal.

Key systems for analysts:
- **Bloomberg Terminal** — Market data and analytics
- **Tableau** — Internal reporting dashboards
- **Jira** — Project tracking
- **Confluence** — Documentation wiki
- **Slack** — Communication

## Compliance Training
All employees must complete within your first 30 days:
1. Anti-Money Laundering (AML) Fundamentals — 3 hours
2. Data Privacy & GDPR — 2 hours
3. Insider Trading Prevention — 1 hour
4. Code of Conduct — 1 hour

Failure to complete training by Day 30 will result in system access suspension.

## Key Contacts
- Your Manager: See offer letter
- IT Helpdesk: it@fintech-inc.com | ext. 2000
- Compliance: compliance@fintech-inc.com
- HR: hr@fintech-inc.com`,
    },
    {
      id: 'd3',
      title: 'Executive Compensation 2024',
      description: 'Board-approved executive compensation packages and equity grants',
      clearance: 'L5',
      category: 'Executive',
      type: 'PDF',
      size: '512 KB',
      uploadedBy: 'u1',
      uploadedAt: '2024-02-01',
      content: `FINTECH INC — EXECUTIVE COMPENSATION 2024
BOARD CONFIDENTIAL — DO NOT DISTRIBUTE

COMPENSATION COMMITTEE APPROVED — February 15, 2024

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Riley Johnson — CEO & Co-Founder
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Base Salary: $450,000
Annual Bonus Target: 100% of base ($450,000 target)
2024 Bonus Achievement: 115% ($517,500 actual)
Equity Grant: 500,000 RSUs vesting over 4 years (cliff at 1 year)
RSU Value at Grant Date: $8.50/share = $4,250,000
Total 2024 Compensation: $5,217,500

Performance Metrics Tied to Bonus:
• Revenue growth > 40% YoY (35% weight)
• Customer NPS > 65 (25% weight)
• Regulatory audit: zero critical findings (20% weight)
• Employee retention > 88% (20% weight)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BOARD NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The Compensation Committee approved a 12% increase to CEO base salary for 2025 based on company performance exceeding all targets in 2024.

Series C fundraising target for Q3 2024: $80M at $340M pre-money valuation.
If achieved, all executive equity grants will be adjusted per the Equity Incentive Plan.

THIS DOCUMENT IS BOARD CONFIDENTIAL.
DISTRIBUTION OUTSIDE THE BOARD IS STRICTLY PROHIBITED.`,
    },
  ],
};

const AZURE_DATA = {
  'acme-corp': {
    organization: 'acme-corp',
    projects: [
      {
        id: 'proj1',
        name: 'Platform Core',
        description: 'Core API and microservices platform',
        repos: [
          {
            id: 'repo1',
            name: 'platform-api',
            description: 'Main REST API service (Node.js + TypeScript)',
            defaultBranch: 'main',
            language: 'TypeScript',
            lastUpdated: '2024-03-15',
            commits: 2847,
            files: ['README.md', 'package.json', 'src/', 'tests/', '.github/'],
            recentCommits: [
              { sha: 'a3f2b1c', message: 'Fix auth middleware race condition', author: 'Sam Rivera', date: '2024-03-15' },
              { sha: 'b4e7c2d', message: 'Add rate limiting to public API endpoints', author: 'Alex Chen', date: '2024-03-14' },
              { sha: 'c5f8d3e', message: 'Upgrade dependencies, patch security advisories', author: 'Sam Rivera', date: '2024-03-13' },
            ],
          },
          {
            id: 'repo2',
            name: 'platform-frontend',
            description: 'React + TypeScript web application',
            defaultBranch: 'main',
            language: 'TypeScript',
            lastUpdated: '2024-03-14',
            commits: 1923,
            files: ['README.md', 'package.json', 'src/', 'public/', 'vite.config.ts'],
            recentCommits: [
              { sha: 'd6g9e4f', message: 'Implement dark mode toggle with system preference detection', author: 'Jordan Lee', date: '2024-03-14' },
              { sha: 'e7h0f5g', message: 'Add accessibility improvements to navigation', author: 'Morgan Park', date: '2024-03-12' },
            ],
          },
        ],
        pipelines: [
          { id: 'pipe1', name: 'platform-api-ci', status: 'succeeded', lastRun: '2024-03-15 14:22', branch: 'main', duration: '4m 32s', triggeredBy: 'Sam Rivera' },
          { id: 'pipe2', name: 'platform-api-deploy-prod', status: 'succeeded', lastRun: '2024-03-15 15:10', branch: 'main', duration: '8m 14s', triggeredBy: 'CD Pipeline' },
          { id: 'pipe3', name: 'platform-frontend-ci', status: 'running', lastRun: '2024-03-15 16:05', branch: 'feature/dark-mode', duration: '2m 18s', triggeredBy: 'Jordan Lee' },
          { id: 'pipe4', name: 'security-scan-weekly', status: 'succeeded', lastRun: '2024-03-11 02:00', branch: 'main', duration: '22m 45s', triggeredBy: 'Schedule' },
        ],
        workItems: [
          { id: 'WI-2341', title: 'Implement WebSocket support for real-time notifications', type: 'User Story', status: 'In Progress', assignee: 'Sam Rivera', priority: 'High', sprint: 'Sprint 24' },
          { id: 'WI-2340', title: 'Migrate legacy session store from Redis 6 to Redis 7', type: 'Technical Debt', status: 'In Progress', assignee: 'Sam Rivera', priority: 'Medium', sprint: 'Sprint 24' },
          { id: 'WI-2338', title: 'OAuth 2.0 PKCE flow for mobile clients', type: 'User Story', status: 'Done', assignee: 'Alex Chen', priority: 'Critical', sprint: 'Sprint 23' },
          { id: 'WI-2335', title: 'Rate limiting dashboard in admin portal', type: 'Feature', status: 'To Do', assignee: 'Jordan Lee', priority: 'Medium', sprint: 'Sprint 25' },
          { id: 'WI-2330', title: 'P1: API gateway occasionally drops connections under load', type: 'Bug', status: 'Done', assignee: 'Alex Chen', priority: 'Critical', sprint: 'Sprint 23' },
        ],
        wiki: [
          { id: 'w1', title: 'Architecture Decision Records', lastUpdated: '2024-03-10', author: 'Alex Chen', preview: 'Documents all major architectural decisions including the move to microservices in 2022, database selection rationale, and API versioning strategy.' },
          { id: 'w2', title: 'Incident Runbooks', lastUpdated: '2024-03-08', author: 'Sam Rivera', preview: 'Step-by-step runbooks for common production incidents: database failover, cache flush, CDN purge, and circuit breaker resets.' },
          { id: 'w3', title: 'API Standards & Conventions', lastUpdated: '2024-02-20', author: 'Sam Rivera', preview: 'REST API design guidelines, versioning policy, error response format, pagination patterns, and webhook event schemas.' },
        ],
      },
    ],
  },
  'fintech-inc': {
    organization: 'fintech-inc',
    projects: [
      {
        id: 'proj1',
        name: 'Core Banking Platform',
        description: 'Transaction processing and account management',
        repos: [
          {
            id: 'repo1',
            name: 'transactions-api',
            description: 'Core transaction processing service',
            defaultBranch: 'main',
            language: 'Python',
            lastUpdated: '2024-03-14',
            commits: 1456,
            files: ['README.md', 'requirements.txt', 'app/', 'tests/', 'Dockerfile'],
            recentCommits: [
              { sha: 'f8i1g6h', message: 'Add fraud detection scoring to transaction pipeline', author: 'Taylor Kim', date: '2024-03-14' },
              { sha: 'g9j2h7i', message: 'Patch CVE-2024-1234 in cryptography dependency', author: 'Riley Johnson', date: '2024-03-12' },
            ],
          },
        ],
        pipelines: [
          { id: 'pipe1', name: 'transactions-api-ci', status: 'succeeded', lastRun: '2024-03-14 11:30', branch: 'main', duration: '6m 48s', triggeredBy: 'Taylor Kim' },
          { id: 'pipe2', name: 'compliance-check', status: 'succeeded', lastRun: '2024-03-14 11:45', branch: 'main', duration: '3m 22s', triggeredBy: 'CD Pipeline' },
        ],
        workItems: [
          { id: 'WI-891', title: 'Real-time AML transaction monitoring integration', type: 'Feature', status: 'In Progress', assignee: 'Taylor Kim', priority: 'Critical', sprint: 'Sprint 12' },
          { id: 'WI-890', title: 'PCI DSS Level 1 re-certification prep', type: 'Compliance', status: 'In Progress', assignee: 'Riley Johnson', priority: 'Critical', sprint: 'Sprint 12' },
          { id: 'WI-885', title: 'Upgrade TLS to 1.3 on all internal services', type: 'Security', status: 'Done', assignee: 'Taylor Kim', priority: 'High', sprint: 'Sprint 11' },
        ],
        wiki: [
          { id: 'w1', title: 'Compliance Runbooks', lastUpdated: '2024-03-05', author: 'Riley Johnson', preview: 'Step-by-step procedures for compliance audits, incident reporting to regulators, and customer data requests.' },
          { id: 'w2', title: 'Security Architecture', lastUpdated: '2024-02-28', author: 'Taylor Kim', preview: 'Network segmentation, encryption standards, key management procedures, and penetration test findings.' },
        ],
      },
    ],
  },
};

export const seedTenant = (tenantId) => {
  if (getItem(tenantId, 'seeded')) return;
  setItem(tenantId, 'users', USERS[tenantId] || []);
  setItem(tenantId, 'documents', DOCUMENTS[tenantId] || []);
  setItem(tenantId, 'azureData', AZURE_DATA[tenantId] || null);
  setItem(tenantId, 'seeded', true);
};

export const patchTenantDocuments = (tenantId) => {
  const stored = getItem(tenantId, 'documents', null);
  if (!stored) return;
  if (stored.find(d => d.id === FINANCIAL_PLAN_DOC.id)) return;
  setItem(tenantId, 'documents', [FINANCIAL_PLAN_DOC, ...stored]);
};

export const ensureCompanies = () => {
  const existing = getGlobal('companies', []);
  if (existing.length === 0) {
    setGlobal('companies', COMPANIES);
  }
};
