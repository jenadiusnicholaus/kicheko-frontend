# Kicheko — Product Requirements and Technical Specification

**Document type:** Product Requirements Document (PRD) and initial Technical Specification  
**Product name:** Kicheko  
**Version:** 1.0 — Draft for planning and development  
**Initial market:** Tanzania, with architecture designed for future regional expansion  
**Product concept:** Comedy discovery, premium video streaming, creator monetization, and audience voting/awards

---

## 1. Executive Summary

Kicheko is a digital entertainment platform where upcoming and established comedians can register, build profiles, publish comedy content, attract audiences through free short clips, and earn revenue from paid full-length performances. Users can discover comedians, watch previews, purchase access to premium videos, follow creators, and vote in time-limited comedy competitions. Administrators manage creators, content moderation, payments, voting periods, categories, prizes, and platform operations.

Kicheko should launch with a focused minimum viable product (MVP), validate audience demand and willingness to pay, and expand based on usage and creator feedback.

### 1.1 Product objectives

1. Help audiences discover Tanzanian comedy and emerging comedians.
2. Give creators a controlled way to publish short previews and full-length videos.
3. Support secure, auditable payments for premium content.
4. Establish transparent, time-limited public voting and comedian recognition.
5. Provide creators with meaningful content-performance and earnings information.
6. Give administrators tools to moderate content, manage competitions, and resolve issues.
7. Build a maintainable platform that can later support more countries, currencies, languages, and payment providers.

### 1.2 Proposed product tagline

**Kicheko — Cheka, Tazama, Piga Kura!**

### 1.3 Product principles

- Mobile-first, responsive, and usable on slower connections.
- Clear distinction between free previews and paid full performances.
- No premium access until payment has been verified server-side.
- Clear creator terms, revenue-sharing rules, and payout records.
- Voting rules and competition deadlines are visible to users.
- Content moderation, copyright reporting, privacy, and security are built in.
- Prices, commissions, limits, and eligibility rules must be configurable rather than hard-coded.

---

## 2. Scope

### 2.1 MVP scope

The initial release should include:

- Public home and discovery pages.
- User registration, login, password reset, and account management.
- Comedian application, approval, and creator profile.
- Creator video upload and content management.
- Short clips linked to a full-length performance.
- Free and paid content visibility.
- Video playback and premium purchase flow.
- Payment initiation, verified payment callbacks, purchase records, and refunds/admin adjustments.
- Basic user library of purchased videos.
- Comedy categories and time-limited voting competitions.
- Nominees, valid vote records, competition closing, and winner publication.
- Administration dashboard.
- Content reporting and moderation.
- Basic creator analytics and sales/earnings ledger.
- Audit logs for sensitive administrative and financial actions.
- Terms, privacy notice, content rules, and creator agreement pages.

### 2.2 Recommended post-MVP scope

- Native Android and iOS applications.
- Monthly subscriptions or bundles.
- Advertising management and sponsor portals.
- Direct event ticketing and bookings.
- Advanced recommendations and personalized feeds.
- Live streaming.
- Creator livestreams or paid live events.
- Multi-country support, multiple currencies, and additional languages.
- Advanced fraud detection and voting risk scoring.
- Gift cards, promotional codes, and referral campaigns.
- Sponsor reporting and branded competitions.

### 2.3 Out of scope for the first release

Unless separately approved, the MVP will not include:

- A full social network with private messaging.
- Live video broadcasting.
- Complex recommendation AI.
- Guaranteed prevention of screen recording or all copying.
- Automated payouts without a reviewed reconciliation and approval process.
- Paid public voting before legal and payment-provider review.

---

## 3. User Types and Permissions

### 3.1 Guest

Can:

- View public landing pages, public creator profiles, public previews, public competition pages, and public event announcements.
- Search and browse publicly available content.
- Register or log in.

Cannot:

- Purchase premium videos without an authenticated account.
- Vote where voting requires an authenticated account.
- Upload content or access account-specific pages.

### 3.2 Registered viewer

Can:

- Manage their account.
- Watch free videos and previews.
- Purchase eligible premium performances.
- Watch videos they have valid access to.
- Save and view purchased content in their library.
- Follow comedians, like/comment if enabled, share public links, and report content.
- Vote under the published competition rules.
- View purchase history and payment status.
- Submit support requests.

### 3.3 Comedian / creator

Can:

- Apply for creator status and submit required profile details.
- Manage their approved profile.
- Upload videos and thumbnails.
- Create short previews and associate them with a full performance.
- Set permitted content details and propose prices within platform rules.
- Submit content for moderation and publish after approval.
- View performance analytics, purchases, and earnings.
- Request payout when eligible.
- Submit competition nominations where allowed.
- Respond to moderation requests and view account notices.

Cannot:

- Approve their own creator application if approval is required.
- Alter verified payment records or vote records.
- Publish content that has not passed required moderation.
- Access another creator's private analytics or earnings.

### 3.4 Moderator / content reviewer

Can:

- Review creator applications and submitted content.
- Approve, reject, restrict, or request edits to content according to policy.
- Review content reports.
- Add moderation notes.
- Escalate serious cases to an administrator.

Cannot:

- Change financial ledger entries or competition outcomes unless specifically authorized.
- Grant themselves additional privileges.

### 3.5 Finance officer

Can:

- View payment transactions, refunds, creator balances, payout requests, and reconciliation reports.
- Record reviewed adjustments through controlled workflows.
- Approve or reject payouts according to assigned permissions.

Cannot:

- Edit raw payment-provider callback records.
- Change vote results or content moderation outcomes unless separately authorized.

### 3.6 Administrator

Can:

- Manage users, roles, creators, content, categories, competitions, payment settings, platform configuration, reports, and support cases.
- Assign authorized staff roles.
- Review audit logs.
- Suspend accounts or content according to documented policies.

High-risk actions should require explicit permissions and audit records. A single administrator should not be able to silently alter payment evidence or erase voting history.

---

## 4. Functional Requirements

Priority labels: **P0 = required for MVP**, **P1 = important next**, **P2 = later enhancement**.

### 4.1 Authentication and accounts

| ID       | Requirement                             | Priority | Acceptance criteria                                                                              |
| -------- | --------------------------------------- | -------: | ------------------------------------------------------------------------------------------------ |
| AUTH-001 | Register with supported identity fields |       P0 | Valid registrations create an account and show clear validation errors for invalid input.        |
| AUTH-002 | Login and logout                        |       P0 | Only valid credentials establish a session; logout invalidates the session/token as appropriate. |
| AUTH-003 | Password reset                          |       P0 | A user can securely request a reset without revealing whether an account exists.                 |
| AUTH-004 | Verify email or phone where required    |       P0 | Verification status is recorded and sensitive actions can require verification.                  |
| AUTH-005 | Role-based authorization                |       P0 | APIs and pages enforce permissions server-side, not only by hiding UI elements.                  |
| AUTH-006 | Account profile and preferences         |       P0 | Users can update allowed profile details and preferences.                                        |
| AUTH-007 | Account suspension/deactivation         |       P0 | Suspended accounts are restricted according to policy and the action is audited.                 |
| AUTH-008 | Optional social login                   |       P2 | Only added if product demand justifies it.                                                       |

### 4.2 Creator onboarding and profiles

| ID      | Requirement                 | Priority | Acceptance criteria                                                                          |
| ------- | --------------------------- | -------: | -------------------------------------------------------------------------------------------- |
| CRT-001 | Apply for creator status    |       P0 | A registered user can submit a creator application.                                          |
| CRT-002 | Review creator applications |       P0 | Authorized staff can approve, reject, or request more information.                           |
| CRT-003 | Public creator profile      |       P0 | Approved creators have a public profile with stage name, biography, image, and content.      |
| CRT-004 | Creator profile editing     |       P0 | Creators can update allowed fields; sensitive changes may require review.                    |
| CRT-005 | Creator verification badge  |       P1 | Authorized staff can grant/revoke a verification status with an audit record.                |
| CRT-006 | Creator analytics           |       P0 | Creators can view permitted video views, sales, and earnings summaries.                      |
| CRT-007 | Creator payout details      |       P0 | Payout details are stored securely with restricted access and change history.                |
| CRT-008 | Booking/contact information |       P1 | Creators may publish optional business contact or booking links subject to privacy controls. |

### 4.3 Video and media management

| ID      | Requirement                                                                 | Priority | Acceptance criteria                                                                                          |
| ------- | --------------------------------------------------------------------------- | -------: | ------------------------------------------------------------------------------------------------------------ |
| VID-001 | Upload full-length video                                                    |       P0 | Authorized creators can upload supported files within configurable limits.                                   |
| VID-002 | Upload or generate preview clips                                            |       P0 | A short clip can be associated with a specific full-length performance.                                      |
| VID-003 | Multiple clips per full video                                               |       P0 | A performance can have multiple preview clips.                                                               |
| VID-004 | Store title, description, category, language, tags, thumbnail, and duration |       P0 | Required metadata is validated before submission.                                                            |
| VID-005 | Draft, processing, pending review, published, rejected, and archived states |       P0 | State transitions are controlled and visible to authorized users.                                            |
| VID-006 | Video processing status                                                     |       P0 | Failed processing is reported and can be retried by authorized systems/staff.                                |
| VID-007 | Free or premium access setting                                              |       P0 | Published content follows its configured access policy.                                                      |
| VID-008 | Price and currency configuration                                            |       P0 | Price changes are validated and recorded; purchased access keeps its purchase terms.                         |
| VID-009 | Moderation and copyright reporting                                          |       P0 | Users can report content and staff can record outcomes.                                                      |
| VID-010 | Captions/subtitles                                                          |       P1 | Caption files can be attached to videos.                                                                     |
| VID-011 | Video analytics                                                             |       P0 | The system records reasonable view/playback events without treating every page refresh as a meaningful view. |
| VID-012 | Video deletion/archive policy                                               |       P0 | Deletion respects purchase entitlements, legal holds, and retention requirements.                            |

#### Recommended video lifecycle

1. Creator uploads original video.
2. Backend validates file type, size, and account permissions.
3. Media processor scans/transcodes the upload and creates playback renditions and a thumbnail.
4. Creator adds metadata, price, and one or more preview clips.
5. Content is submitted for moderation.
6. Moderator approves or rejects it.
7. Approved content is published.
8. Public preview playback is available.
9. Full playback is allowed only if content is free or the viewer has a valid entitlement.

#### Media security requirements

- Store original media in private object storage where practical.
- Deliver playback through a controlled CDN or streaming provider.
- Use signed or time-limited playback URLs/tokens for premium content where supported.
- Never expose permanent storage credentials or private bucket paths in the browser.
- Verify payment on the backend before issuing premium playback access.
- Use upload size, duration, and format limits.
- Scan and validate uploads; do not trust file extensions alone.
- Apply rate limits and monitor failed uploads.
- Understand that DRM, signed URLs, and other controls reduce unauthorized access but cannot guarantee that copying or screen recording is impossible.

### 4.4 Discovery and short-video feed

| ID      | Requirement                           | Priority | Acceptance criteria                                                                           |
| ------- | ------------------------------------- | -------: | --------------------------------------------------------------------------------------------- |
| DSC-001 | Home page content sections            |       P0 | Home page can show featured, new, popular, and competition content.                           |
| DSC-002 | Short-video feed                      |       P0 | Users can scroll through published preview clips.                                             |
| DSC-003 | Open full performance from preview    |       P0 | Each preview links to its corresponding full-performance detail page.                         |
| DSC-004 | Search creators and videos            |       P0 | Search returns only public and permitted content.                                             |
| DSC-005 | Filter by category and other metadata |       P1 | Users can narrow results by supported filters.                                                |
| DSC-006 | Follow creator                        |       P1 | Authenticated users can follow/unfollow creators.                                             |
| DSC-007 | Likes and comments                    |       P1 | If enabled, users can interact within moderation and rate-limit rules.                        |
| DSC-008 | Share content                         |       P0 | Public pages have shareable URLs and appropriate preview metadata.                            |
| DSC-009 | Recommendation ranking                |       P2 | Later ranking may use relevance and engagement while respecting privacy and moderation rules. |

### 4.5 Premium purchase and playback

| ID      | Requirement                               | Priority | Acceptance criteria                                                                |
| ------- | ----------------------------------------- | -------: | ---------------------------------------------------------------------------------- |
| PAY-001 | Display price and purchase terms          |       P0 | The viewer sees the price, currency, and access terms before payment.              |
| PAY-002 | Initiate payment                          |       P0 | Backend creates a pending order and starts payment with a supported provider.      |
| PAY-003 | Verify payment server-side                |       P0 | Only a trusted provider confirmation or verified status check marks an order paid. |
| PAY-004 | Handle duplicate callbacks safely         |       P0 | Repeated callbacks do not create duplicate purchases or ledger entries.            |
| PAY-005 | Grant video entitlement                   |       P0 | Successful payment creates a durable entitlement for the correct user and video.   |
| PAY-006 | Handle failure, timeout, and cancellation |       P0 | Failed payments do not grant access and the user receives a clear status.          |
| PAY-007 | Purchase history                          |       P0 | Users can view order amount, status, date, and purchased item.                     |
| PAY-008 | Refund workflow                           |       P0 | Authorized staff can process/record refunds and update access according to policy. |
| PAY-009 | Reconciliation                            |       P0 | Staff can compare platform transactions with provider settlement records.          |
| PAY-010 | Discount codes                            |       P2 | Codes have expiry, limits, eligibility, and audit history.                         |
| PAY-011 | Subscriptions/bundles                     |       P2 | Introduce only after the individual purchase flow is stable.                       |

**Important:** Payment integration must use provider-approved APIs and callback verification. Do not store mobile-money PINs, card security codes, or payment credentials. A redirect back to Kicheko is not proof of payment.

### 4.6 Creator revenue and payouts

| ID      | Requirement                         | Priority | Acceptance criteria                                                                            |
| ------- | ----------------------------------- | -------: | ---------------------------------------------------------------------------------------------- |
| REV-001 | Configurable revenue-sharing policy |       P0 | The applicable commission and creator share are recorded for each transaction.                 |
| REV-002 | Earnings ledger                     |       P0 | Every earning, fee, refund, adjustment, and payout is represented by traceable ledger entries. |
| REV-003 | Pending and available balance       |       P0 | Balances follow documented settlement, refund, and fraud-review rules.                         |
| REV-004 | Payout request                      |       P0 | Eligible creators can submit a payout request.                                                 |
| REV-005 | Payout review                       |       P0 | Authorized staff approve/reject requests with reasons and audit history.                       |
| REV-006 | Payout status                       |       P0 | Creators can see requested, processing, paid, rejected, or failed status.                      |
| REV-007 | Earnings statement                  |       P1 | Creators can download or view a period-based statement.                                        |
| REV-008 | Tax and compliance reporting        |       P1 | Reports support review by qualified local accounting/legal advisers.                           |

Use a ledger-based design instead of manually overwriting a creator's balance. The ledger should be append-only in normal operations; corrections should be recorded as new, traceable adjustment entries.

### 4.7 Competitions, nominations, voting, and awards

| ID      | Requirement                               | Priority | Acceptance criteria                                                                                           |
| ------- | ----------------------------------------- | -------: | ------------------------------------------------------------------------------------------------------------- |
| VOT-001 | Create competition                        |       P0 | Authorized staff can configure title, description, category, dates, rules, and status.                        |
| VOT-002 | Create/edit categories                    |       P0 | Categories are configurable and can be enabled/disabled.                                                      |
| VOT-003 | Nominate comedians                        |       P0 | Eligible creators can be nominated or apply according to competition rules.                                   |
| VOT-004 | Publish competition page                  |       P0 | Public page displays nominees, dates, rules, and prize information.                                           |
| VOT-005 | Accept votes only during the valid period |       P0 | Votes outside the open window are rejected by the backend.                                                    |
| VOT-006 | Enforce voting limits                     |       P0 | The system applies the configured rule, such as one vote per account per category.                            |
| VOT-007 | Record individual votes                   |       P0 | Each accepted vote has an auditable record and duplicate protections.                                         |
| VOT-008 | Abuse prevention                          |       P0 | Rate limits, account checks, anomaly flags, and staff review tools are available.                             |
| VOT-009 | Close voting automatically                |       P0 | Competition closes at the configured deadline in the specified time zone.                                     |
| VOT-010 | Finalize and publish results              |       P0 | Results are calculated from valid votes and finalization is logged.                                           |
| VOT-011 | Tie handling                              |       P0 | Published rules define how ties are resolved.                                                                 |
| VOT-012 | Award records                             |       P0 | Winners, prize details, announcement date, and award status are stored.                                       |
| VOT-013 | Public live vote totals                   |       P1 | If enabled, totals follow the competition's disclosure policy and are clearly provisional until finalization. |
| VOT-014 | Judges' scoring                           |       P2 | A future option for competitions combining judges and public votes.                                           |

#### Voting policy decisions required before launch

- Whether each user may vote once per category, once per nominee, or under another rule.
- Whether voting is free. **Free voting is recommended for the MVP.**
- Whether verified phone/email or other checks are required.
- Whether vote totals are public during the competition.
- Tie-break rules.
- Nomination and eligibility requirements.
- Rules for suspected fraud and appeals.
- Prize fulfilment and winner verification.
- How personal data used for voting is handled.

Do not introduce paid voting without specific Tanzanian legal, consumer-protection, tax, and payment-provider review. Depending on the structure, paid voting or prize mechanics may trigger additional requirements.

### 4.8 Administration and moderation

| ID      | Requirement                     | Priority | Acceptance criteria                                                                         |
| ------- | ------------------------------- | -------: | ------------------------------------------------------------------------------------------- |
| ADM-001 | Dashboard overview              |       P0 | Shows useful totals for users, creators, content, sales, pending reviews, and competitions. |
| ADM-002 | Manage users and roles          |       P0 | Authorized staff can suspend/restore accounts and manage roles.                             |
| ADM-003 | Review creator applications     |       P0 | Application decisions and reasons are recorded.                                             |
| ADM-004 | Review videos and reports       |       P0 | Moderation queue supports approve, reject, restrict, and escalate actions.                  |
| ADM-005 | Manage categories and tags      |       P0 | Staff can manage content categories.                                                        |
| ADM-006 | Manage competitions             |       P0 | Staff can create, schedule, close, and finalize competitions.                               |
| ADM-007 | View payment and payout records |       P0 | Finance permissions control access to sensitive records.                                    |
| ADM-008 | Support/refund tools            |       P0 | Staff can investigate orders and follow a controlled refund workflow.                       |
| ADM-009 | Audit log                       |       P0 | Sensitive actions record actor, action, target, time, and relevant before/after values.     |
| ADM-010 | Platform settings               |       P0 | Authorized staff can manage supported configuration without code changes.                   |
| ADM-011 | Reports/export                  |       P1 | Authorized users can export operational and financial reports.                              |

---

## 5. Screen Inventory

### 5.1 Public and viewer screens

| Screen ID | Screen             | Main content/actions                                                           | Access                       |
| --------- | ------------------ | ------------------------------------------------------------------------------ | ---------------------------- |
| SCR-001   | Landing/Home       | Featured clips, new releases, popular creators, competitions, sign-in/register | Public                       |
| SCR-002   | Register           | Name/display name, email or phone, password, terms acceptance                  | Public                       |
| SCR-003   | Login              | Credentials and password reset link                                            | Public                       |
| SCR-004   | Password Reset     | Request and complete password reset                                            | Public                       |
| SCR-005   | Browse/Discover    | Search, categories, filters, video and creator cards                           | Public                       |
| SCR-006   | Short-Video Feed   | Vertical player, creator link, like/share, full-video CTA                      | Public/authenticated actions |
| SCR-007   | Video Detail       | Thumbnail/player, description, creator, price, preview, purchase CTA           | Public                       |
| SCR-008   | Premium Checkout   | Order summary, amount, payment method, terms                                   | Authenticated                |
| SCR-009   | Payment Status     | Pending/success/failure and next steps                                         | Authenticated                |
| SCR-010   | Full Video Player  | Protected playback, title, creator, playback state                             | Entitled/free viewer         |
| SCR-011   | My Library         | Purchased videos and available playback links                                  | Authenticated                |
| SCR-012   | Purchase History   | Orders, dates, amounts, statuses, receipts where supported                     | Authenticated                |
| SCR-013   | Creator Profile    | Biography, videos, categories, follow/share                                    | Public                       |
| SCR-014   | Competition List   | Open, upcoming, and completed competitions                                     | Public                       |
| SCR-015   | Competition Detail | Rules, dates, category, nominees, vote action, results state                   | Public/authenticated voting  |
| SCR-016   | Nominee Detail     | Creator profile, eligible clips, vote action                                   | Public/authenticated voting  |
| SCR-017   | Winners/Awards     | Winners, category, period, prize, archive                                      | Public                       |
| SCR-018   | Account Settings   | Profile, password, contact verification, preferences                           | Authenticated                |
| SCR-019   | Notifications      | Payment, creator, competition, and platform notices                            | Authenticated                |
| SCR-020   | Report Content     | Reason, description, relevant content reference                                | Public/authenticated         |
| SCR-021   | Help/Support       | FAQs and support request                                                       | Public/authenticated         |
| SCR-022   | Terms and Privacy  | Legal policies and policy version                                              | Public                       |

### 5.2 Creator dashboard screens

| Screen ID   | Screen                    | Main content/actions                                              |
| ----------- | ------------------------- | ----------------------------------------------------------------- |
| CRT-SCR-001 | Creator Application       | Application form, requirements, status                            |
| CRT-SCR-002 | Creator Dashboard         | Views, sales, pending reviews, earnings summary                   |
| CRT-SCR-003 | Edit Profile              | Stage name, biography, image, category, public links              |
| CRT-SCR-004 | Video Library             | Draft, processing, pending, published, rejected, archived content |
| CRT-SCR-005 | Upload Video              | File upload, metadata, category, language, thumbnail              |
| CRT-SCR-006 | Preview Manager           | Create/upload short clips and link each to a full video           |
| CRT-SCR-007 | Video Editor              | Title, description, price, access type, tags, submit for review   |
| CRT-SCR-008 | Video Analytics           | Views, watch duration where available, purchases, conversion      |
| CRT-SCR-009 | Sales and Earnings        | Sales, fees, refunds, pending/available earnings                  |
| CRT-SCR-010 | Payout Details            | Payout destination and verification status                        |
| CRT-SCR-011 | Payout Requests           | Request payout and view previous requests                         |
| CRT-SCR-012 | Competition Participation | Eligible competitions, nominations, status, results               |
| CRT-SCR-013 | Creator Notifications     | Review outcomes, policy notices, payment/payout status            |

### 5.3 Admin screens

| Screen ID   | Screen                      | Main content/actions                                        |
| ----------- | --------------------------- | ----------------------------------------------------------- |
| ADM-SCR-001 | Admin Login                 | Secure staff authentication                                 |
| ADM-SCR-002 | Admin Dashboard             | Operational and business metrics                            |
| ADM-SCR-003 | User Management             | Search, view, suspend, restore, role management             |
| ADM-SCR-004 | Creator Applications        | Review evidence, approve, reject, request changes           |
| ADM-SCR-005 | Creator Management          | Profiles, verification, restrictions                        |
| ADM-SCR-006 | Content Moderation Queue    | Review uploads and reported content                         |
| ADM-SCR-007 | Video Management            | Video states, metadata, restrictions, archive               |
| ADM-SCR-008 | Category and Tag Management | Add, edit, disable categories/tags                          |
| ADM-SCR-009 | Competition Management      | Create, schedule, publish, close, finalize                  |
| ADM-SCR-010 | Nominee Management          | Eligibility, nominee list, nomination review                |
| ADM-SCR-011 | Vote Monitoring             | Counts, anomaly flags, audit review; no silent vote editing |
| ADM-SCR-012 | Results and Awards          | Calculate, review, finalize, announce winners               |
| ADM-SCR-013 | Transactions                | Orders, provider references, status, refund workflow        |
| ADM-SCR-014 | Creator Ledger              | Earnings, fees, refunds, adjustments                        |
| ADM-SCR-015 | Payout Management           | Review and process payout requests                          |
| ADM-SCR-016 | Reports                     | Sales, creators, views, competition participation           |
| ADM-SCR-017 | Content Reports             | Copyright, abuse, and other complaints                      |
| ADM-SCR-018 | Support Cases               | View and resolve user support requests                      |
| ADM-SCR-019 | Staff and Permissions       | Assign roles and least-privilege permissions                |
| ADM-SCR-020 | Audit Log                   | Search sensitive actions and review history                 |
| ADM-SCR-021 | Platform Settings           | Payment providers, commission rules, limits, policies       |
| ADM-SCR-022 | System Health               | Processing failures, queue status, integration health       |

---

## 6. Initial Database Design

The following is a proposed relational schema for planning. It is not a final migration file. Exact fields, data types, constraints, indexes, and deletion policies should be confirmed during implementation.

Use a relational database such as PostgreSQL. Use UUIDs or another consistent primary-key strategy. Include `created_at` and `updated_at` on mutable business records where appropriate. Store monetary values as integer minor units (for example, Tanzanian shillings as integer TSh) or an exact decimal type; never use floating-point for money. Include currency explicitly wherever amounts are stored.

### 6.1 Core account tables

#### `users`

| Column            | Suggested type      | Rules/notes                                            |
| ----------------- | ------------------- | ------------------------------------------------------ |
| id                | UUID / PK           | Primary key                                            |
| display_name      | VARCHAR             | Required                                               |
| email             | VARCHAR, nullable   | Unique when present; normalized                        |
| phone_number      | VARCHAR, nullable   | Unique when present; normalized to a consistent format |
| password_hash     | VARCHAR             | Never store plaintext password                         |
| status            | ENUM/VARCHAR        | active, suspended, deactivated, pending_verification   |
| email_verified_at | TIMESTAMP, nullable | Verification timestamp                                 |
| phone_verified_at | TIMESTAMP, nullable | Verification timestamp                                 |
| last_login_at     | TIMESTAMP, nullable | Optional                                               |
| created_at        | TIMESTAMP           | Required                                               |
| updated_at        | TIMESTAMP           | Required                                               |

**Constraints:** At least one supported login identifier must be present. Enforce normalized uniqueness safely. Use the framework's secure authentication facilities rather than implementing password handling from scratch.

#### `roles`

| Column      | Suggested type | Rules/notes      |
| ----------- | -------------- | ---------------- |
| id          | PK             | Primary key      |
| name        | VARCHAR        | Unique role name |
| description | TEXT           | Optional         |

#### `user_roles`

| Column      | Suggested type          | Rules/notes |
| ----------- | ----------------------- | ----------- |
| user_id     | FK → users.id           | Required    |
| role_id     | FK → roles.id           | Required    |
| assigned_by | FK → users.id, nullable | Audit       |
| assigned_at | TIMESTAMP               | Required    |

Composite unique key: `(user_id, role_id)`.

#### `user_profiles`

| Column                   | Suggested type                 | Rules/notes                    |
| ------------------------ | ------------------------------ | ------------------------------ |
| user_id                  | PK/FK → users.id               | One profile per user           |
| avatar_asset_id          | FK → media_assets.id, nullable | Profile image                  |
| preferred_language       | VARCHAR                        | Default configurable           |
| country_code             | VARCHAR                        | Optional/validated             |
| notification_preferences | JSONB                          | Non-sensitive preferences only |
| created_at               | TIMESTAMP                      | Required                       |
| updated_at               | TIMESTAMP                      | Required                       |

### 6.2 Creator tables

#### `creator_applications`

| Column              | Suggested type               | Rules/notes                                |
| ------------------- | ---------------------------- | ------------------------------------------ |
| id                  | UUID / PK                    | Primary key                                |
| user_id             | FK → users.id                | Applicant                                  |
| stage_name          | VARCHAR                      | Required                                   |
| biography           | TEXT                         | Required or configurable                   |
| primary_category_id | FK → categories.id, nullable | Proposed category                          |
| location            | VARCHAR, nullable            | Avoid unnecessary precise personal data    |
| social_links        | JSONB                        | Validate allowed URL schemes               |
| status              | ENUM/VARCHAR                 | pending, approved, rejected, needs_changes |
| reviewer_id         | FK → users.id, nullable      | Staff reviewer                             |
| review_notes        | TEXT, nullable               | Restrict access                            |
| submitted_at        | TIMESTAMP                    | Required                                   |
| reviewed_at         | TIMESTAMP, nullable          | Optional                                   |

#### `creators`

| Column              | Suggested type                 | Rules/notes                   |
| ------------------- | ------------------------------ | ----------------------------- |
| id                  | UUID / PK                      | Primary key                   |
| user_id             | FK → users.id                  | Unique; owner account         |
| stage_name          | VARCHAR                        | Public name                   |
| slug                | VARCHAR                        | Unique public URL slug        |
| biography           | TEXT                           | Public biography              |
| avatar_asset_id     | FK → media_assets.id, nullable | Image                         |
| banner_asset_id     | FK → media_assets.id, nullable | Optional                      |
| primary_category_id | FK → categories.id, nullable   | Main category                 |
| verification_status | VARCHAR                        | unverified, verified, revoked |
| profile_status      | VARCHAR                        | active, restricted, archived  |
| approved_at         | TIMESTAMP, nullable            | Approval date                 |
| created_at          | TIMESTAMP                      | Required                      |
| updated_at          | TIMESTAMP                      | Required                      |

#### `creator_social_links`

Optional normalized alternative to JSONB.

| Column        | Suggested type   | Rules/notes   |
| ------------- | ---------------- | ------------- |
| id            | UUID / PK        | Primary key   |
| creator_id    | FK → creators.id | Required      |
| platform      | VARCHAR          | Platform name |
| url           | TEXT             | Validated URL |
| display_order | INTEGER          | Optional      |

### 6.3 Categories and content tables

#### `categories`

| Column        | Suggested type | Rules/notes                              |
| ------------- | -------------- | ---------------------------------------- |
| id            | UUID / PK      | Primary key                              |
| name          | VARCHAR        | Required                                 |
| slug          | VARCHAR        | Unique                                   |
| description   | TEXT, nullable | Optional                                 |
| category_type | VARCHAR        | content, competition, or shared taxonomy |
| is_active     | BOOLEAN        | Default true                             |
| sort_order    | INTEGER        | Optional                                 |
| created_at    | TIMESTAMP      | Required                                 |
| updated_at    | TIMESTAMP      | Required                                 |

If content and competition categories require different rules, use separate tables or a clearly enforced category type.

#### `videos`

| Column             | Suggested type                 | Rules/notes                                           |
| ------------------ | ------------------------------ | ----------------------------------------------------- |
| id                 | UUID / PK                      | Primary key                                           |
| creator_id         | FK → creators.id               | Owner                                                 |
| title              | VARCHAR                        | Required                                              |
| slug               | VARCHAR                        | Unique or creator-scoped unique                       |
| description        | TEXT                           | Optional                                              |
| category_id        | FK → categories.id             | Required/configurable                                 |
| language_code      | VARCHAR                        | Required/configurable                                 |
| content_type       | VARCHAR                        | performance, trailer, other                           |
| access_type        | VARCHAR                        | free, paid                                            |
| price_amount       | BIGINT/DECIMAL                 | Exact amount; required for paid content               |
| currency           | CHAR(3)                        | Required for paid content                             |
| duration_seconds   | INTEGER                        | Derived from processed media                          |
| thumbnail_asset_id | FK → media_assets.id, nullable | Thumbnail                                             |
| processing_status  | VARCHAR                        | pending, processing, ready, failed                    |
| moderation_status  | VARCHAR                        | draft, pending_review, approved, rejected, restricted |
| publication_status | VARCHAR                        | unpublished, published, archived                      |
| published_at       | TIMESTAMP, nullable            | Publication time                                      |
| age_rating         | VARCHAR, nullable              | Policy-defined rating                                 |
| created_at         | TIMESTAMP                      | Required                                              |
| updated_at         | TIMESTAMP                      | Required                                              |

**Implementation notes:**

- A paid video must have a valid positive price.
- A free video should not accidentally trigger a purchase flow.
- Record price and revenue-sharing terms on the order/ledger when purchased, so later configuration changes do not rewrite historical transactions.
- Consider separating a video content record from its media assets and playback renditions.

#### `video_previews`

| Column               | Suggested type       | Rules/notes                           |
| -------------------- | -------------------- | ------------------------------------- |
| id                   | UUID / PK            | Primary key                           |
| video_id             | FK → videos.id       | Associated full video                 |
| title                | VARCHAR, nullable    | Optional                              |
| media_asset_id       | FK → media_assets.id | Processed preview                     |
| duration_seconds     | INTEGER              | Must respect configured preview limit |
| start_offset_seconds | INTEGER, nullable    | If generated from full video          |
| end_offset_seconds   | INTEGER, nullable    | If generated from full video          |
| moderation_status    | VARCHAR              | pending_review, approved, rejected    |
| publication_status   | VARCHAR              | unpublished, published, archived      |
| sort_order           | INTEGER              | Display order                         |
| created_at           | TIMESTAMP            | Required                              |

A preview can be uploaded separately or generated from the full video. The system should record its source and moderation state.

#### `media_assets`

| Column            | Suggested type          | Rules/notes                                   |
| ----------------- | ----------------------- | --------------------------------------------- |
| id                | UUID / PK               | Primary key                                   |
| owner_user_id     | FK → users.id, nullable | Uploader/owner                                |
| storage_provider  | VARCHAR                 | Provider identifier                           |
| storage_key       | TEXT                    | Private object key, not public credential     |
| media_type        | VARCHAR                 | video, image, caption, other                  |
| mime_type         | VARCHAR                 | Detected/validated type                       |
| file_size_bytes   | BIGINT                  | Required                                      |
| checksum          | VARCHAR, nullable       | Integrity/deduplication                       |
| processing_status | VARCHAR                 | uploaded, scanning, processing, ready, failed |
| width             | INTEGER, nullable       | For visual media                              |
| height            | INTEGER, nullable       | For visual media                              |
| duration_seconds  | INTEGER, nullable       | For video/audio                               |
| created_at        | TIMESTAMP               | Required                                      |

Never put secret storage credentials in this table. Restrict access to storage keys and provider configuration.

#### `video_tags`

| Column   | Suggested type | Rules/notes        |
| -------- | -------------- | ------------------ |
| video_id | FK → videos.id | Composite key part |
| tag_id   | FK → tags.id   | Composite key part |

#### `tags`

| Column    | Suggested type | Rules/notes                 |
| --------- | -------------- | --------------------------- |
| id        | UUID / PK      | Primary key                 |
| name      | VARCHAR        | Unique or normalized unique |
| slug      | VARCHAR        | Unique                      |
| is_active | BOOLEAN        | Default true                |

#### `video_captions`

| Column         | Suggested type       | Rules/notes         |
| -------------- | -------------------- | ------------------- |
| id             | UUID / PK            | Primary key         |
| video_id       | FK → videos.id       | Required            |
| media_asset_id | FK → media_assets.id | Caption file        |
| language_code  | VARCHAR              | Required            |
| format         | VARCHAR              | For example, WebVTT |
| created_at     | TIMESTAMP            | Required            |

### 6.4 Engagement tables

#### `creator_follows`

| Column     | Suggested type   | Rules/notes      |
| ---------- | ---------------- | ---------------- |
| user_id    | FK → users.id    | Viewer           |
| creator_id | FK → creators.id | Followed creator |
| created_at | TIMESTAMP        | Required         |

Composite primary/unique key: `(user_id, creator_id)`.

#### `video_likes` (optional MVP/P1)

| Column     | Suggested type | Rules/notes |
| ---------- | -------------- | ----------- |
| user_id    | FK → users.id  | Required    |
| video_id   | FK → videos.id | Required    |
| created_at | TIMESTAMP      | Required    |

Composite unique key: `(user_id, video_id)`.

#### `video_comments` (optional P1)

| Column            | Suggested type                   | Rules/notes                              |
| ----------------- | -------------------------------- | ---------------------------------------- |
| id                | UUID / PK                        | Primary key                              |
| user_id           | FK → users.id                    | Author                                   |
| video_id          | FK → videos.id                   | Target                                   |
| parent_comment_id | FK → video_comments.id, nullable | Optional reply                           |
| body              | TEXT                             | Length-limited                           |
| status            | VARCHAR                          | visible, hidden, removed, pending_review |
| created_at        | TIMESTAMP                        | Required                                 |
| updated_at        | TIMESTAMP                        | Required                                 |

### 6.5 Orders, payments, and entitlements

#### `orders`

| Column              | Suggested type      | Rules/notes                                                    |
| ------------------- | ------------------- | -------------------------------------------------------------- |
| id                  | UUID / PK           | Primary key                                                    |
| public_order_number | VARCHAR             | Unique, non-sequential preferred                               |
| user_id             | FK → users.id       | Buyer                                                          |
| status              | VARCHAR             | pending, paid, failed, cancelled, refunded, partially_refunded |
| subtotal_amount     | BIGINT/DECIMAL      | Exact amount                                                   |
| discount_amount     | BIGINT/DECIMAL      | Default zero                                                   |
| total_amount        | BIGINT/DECIMAL      | Exact amount                                                   |
| currency            | CHAR(3)             | Required                                                       |
| idempotency_key     | VARCHAR             | Unique where applicable                                        |
| created_at          | TIMESTAMP           | Required                                                       |
| paid_at             | TIMESTAMP, nullable | Verified payment time                                          |

#### `order_items`

| Column                  | Suggested type            | Rules/notes                        |
| ----------------------- | ------------------------- | ---------------------------------- |
| id                      | UUID / PK                 | Primary key                        |
| order_id                | FK → orders.id            | Required                           |
| video_id                | FK → videos.id            | Purchased item                     |
| item_title_snapshot     | VARCHAR                   | Historical title                   |
| unit_amount             | BIGINT/DECIMAL            | Price at purchase                  |
| currency                | CHAR(3)                   | Required                           |
| creator_id_snapshot     | UUID/FK as policy permits | Creator at purchase                |
| revenue_policy_snapshot | JSONB                     | Commission/share terms at purchase |
| created_at              | TIMESTAMP                 | Required                           |

#### `payment_transactions`

| Column                  | Suggested type      | Rules/notes                                     |
| ----------------------- | ------------------- | ----------------------------------------------- |
| id                      | UUID / PK           | Primary key                                     |
| order_id                | FK → orders.id      | Required                                        |
| provider                | VARCHAR             | Payment provider                                |
| provider_transaction_id | VARCHAR, nullable   | Unique per provider when present                |
| provider_reference      | VARCHAR, nullable   | Reference from provider                         |
| amount                  | BIGINT/DECIMAL      | Exact amount                                    |
| currency                | CHAR(3)             | Required                                        |
| status                  | VARCHAR             | initiated, pending, succeeded, failed, reversed |
| idempotency_key         | VARCHAR, nullable   | Duplicate protection                            |
| verified_at             | TIMESTAMP, nullable | Server-side verification time                   |
| raw_callback_reference  | VARCHAR, nullable   | Prefer reference to protected event record      |
| created_at              | TIMESTAMP           | Required                                        |
| updated_at              | TIMESTAMP           | Required                                        |

#### `payment_webhook_events`

| Column                 | Suggested type      | Rules/notes                                  |
| ---------------------- | ------------------- | -------------------------------------------- |
| id                     | UUID / PK           | Primary key                                  |
| provider               | VARCHAR             | Provider                                     |
| provider_event_id      | VARCHAR             | Unique per provider where available          |
| event_type             | VARCHAR             | Event name                                   |
| signature_valid        | BOOLEAN             | Verification result                          |
| processing_status      | VARCHAR             | received, processed, failed, ignored         |
| received_at            | TIMESTAMP           | Required                                     |
| processed_at           | TIMESTAMP, nullable | Optional                                     |
| safe_payload_reference | TEXT, nullable      | Store only as allowed; redact sensitive data |

Keep webhook processing idempotent. Verify signatures and/or fetch transaction status through trusted provider APIs. Do not trust client-supplied payment status.

#### `video_entitlements`

| Column            | Suggested type                | Rules/notes                           |
| ----------------- | ----------------------------- | ------------------------------------- |
| id                | UUID / PK                     | Primary key                           |
| user_id           | FK → users.id                 | Viewer                                |
| video_id          | FK → videos.id                | Full video                            |
| order_item_id     | FK → order_items.id, nullable | Source purchase                       |
| entitlement_type  | VARCHAR                       | purchase, complimentary, subscription |
| status            | VARCHAR                       | active, revoked, expired              |
| granted_at        | TIMESTAMP                     | Required                              |
| expires_at        | TIMESTAMP, nullable           | Optional expiry                       |
| revoked_at        | TIMESTAMP, nullable           | Optional                              |
| revocation_reason | TEXT, nullable                | Restricted                            |

Create an entitlement only after payment is verified or an authorized complimentary-access workflow succeeds. Define refund behavior: an entitlement may be revoked when policy and law permit, but the history must remain auditable.

#### `refunds`

| Column                 | Suggested type               | Rules/notes                                                  |
| ---------------------- | ---------------------------- | ------------------------------------------------------------ |
| id                     | UUID / PK                    | Primary key                                                  |
| payment_transaction_id | FK → payment_transactions.id | Original payment                                             |
| amount                 | BIGINT/DECIMAL               | Exact amount                                                 |
| currency               | CHAR(3)                      | Required                                                     |
| reason                 | TEXT                         | Required                                                     |
| status                 | VARCHAR                      | requested, approved, processing, completed, failed, rejected |
| requested_by           | FK → users.id                | Requester                                                    |
| reviewed_by            | FK → users.id, nullable      | Reviewer                                                     |
| provider_refund_id     | VARCHAR, nullable            | Provider reference                                           |
| created_at             | TIMESTAMP                    | Required                                                     |
| completed_at           | TIMESTAMP, nullable          | Optional                                                     |

### 6.6 Revenue ledger and payouts

#### `creator_ledger_entries`

| Column          | Suggested type                    | Rules/notes                                                       |
| --------------- | --------------------------------- | ----------------------------------------------------------------- |
| id              | UUID / PK                         | Primary key                                                       |
| creator_id      | FK → creators.id                  | Owner                                                             |
| order_item_id   | FK → order_items.id, nullable     | Source sale                                                       |
| refund_id       | FK → refunds.id, nullable         | Source refund                                                     |
| payout_id       | FK → creator_payouts.id, nullable | Source payout                                                     |
| entry_type      | VARCHAR                           | sale_credit, platform_fee, refund_debit, adjustment, payout_debit |
| amount          | BIGINT/DECIMAL                    | Exact signed amount under a documented convention                 |
| currency        | CHAR(3)                           | Required                                                          |
| status          | VARCHAR                           | pending, available, reversed, settled                             |
| idempotency_key | VARCHAR                           | Unique where applicable                                           |
| description     | TEXT, nullable                    | Human-readable reason                                             |
| created_at      | TIMESTAMP                         | Required                                                          |

Define a single sign convention and apply it consistently. Do not update balances by overwriting history. Corrections should be additional entries.

#### `creator_payout_details`

| Column                      | Suggested type   | Rules/notes                                                       |
| --------------------------- | ---------------- | ----------------------------------------------------------------- |
| id                          | UUID / PK        | Primary key                                                       |
| creator_id                  | FK → creators.id | Owner                                                             |
| provider                    | VARCHAR          | Supported payout provider                                         |
| destination_token/reference | TEXT             | Protected/tokenized destination; avoid unnecessary sensitive data |
| masked_destination          | VARCHAR          | Display-safe representation                                       |
| verification_status         | VARCHAR          | pending, verified, rejected                                       |
| is_default                  | BOOLEAN          | Optional                                                          |
| created_at                  | TIMESTAMP        | Required                                                          |
| updated_at                  | TIMESTAMP        | Required                                                          |

#### `creator_payouts`

| Column             | Suggested type                 | Rules/notes                                                           |
| ------------------ | ------------------------------ | --------------------------------------------------------------------- |
| id                 | UUID / PK                      | Primary key                                                           |
| creator_id         | FK → creators.id               | Payee                                                                 |
| payout_details_id  | FK → creator_payout_details.id | Destination snapshot/reference                                        |
| amount             | BIGINT/DECIMAL                 | Exact amount                                                          |
| currency           | CHAR(3)                        | Required                                                              |
| status             | VARCHAR                        | requested, under_review, approved, processing, paid, rejected, failed |
| requested_at       | TIMESTAMP                      | Required                                                              |
| reviewed_by        | FK → users.id, nullable        | Reviewer                                                              |
| reviewed_at        | TIMESTAMP, nullable            | Optional                                                              |
| provider_reference | VARCHAR, nullable              | Transfer reference                                                    |
| failure_reason     | TEXT, nullable                 | Restricted                                                            |
| paid_at            | TIMESTAMP, nullable            | Optional                                                              |

### 6.7 Competition and voting tables

#### `competitions`

| Column              | Suggested type      | Rules/notes                                                                   |
| ------------------- | ------------------- | ----------------------------------------------------------------------------- |
| id                  | UUID / PK           | Primary key                                                                   |
| title               | VARCHAR             | Required                                                                      |
| slug                | VARCHAR             | Unique                                                                        |
| description         | TEXT                | Required                                                                      |
| category_id         | FK → categories.id  | Competition category                                                          |
| status              | VARCHAR             | draft, scheduled, nominations_open, voting_open, closed, finalized, cancelled |
| nomination_start_at | TIMESTAMP, nullable | Optional                                                                      |
| nomination_end_at   | TIMESTAMP, nullable | Optional                                                                      |
| voting_start_at     | TIMESTAMP           | Required before publication                                                   |
| voting_end_at       | TIMESTAMP           | Required                                                                      |
| timezone            | VARCHAR             | Store IANA zone; show local dates clearly                                     |
| voting_rule_config  | JSONB               | Validated configuration                                                       |
| tie_break_rule      | TEXT                | Published rule                                                                |
| prize_description   | TEXT, nullable      | Public terms                                                                  |
| published_at        | TIMESTAMP, nullable | Optional                                                                      |
| finalized_at        | TIMESTAMP, nullable | Optional                                                                      |
| created_by          | FK → users.id       | Admin                                                                         |
| created_at          | TIMESTAMP           | Required                                                                      |
| updated_at          | TIMESTAMP           | Required                                                                      |

#### `competition_nominees`

| Column                | Suggested type          | Rules/notes                                |
| --------------------- | ----------------------- | ------------------------------------------ |
| id                    | UUID / PK               | Primary key                                |
| competition_id        | FK → competitions.id    | Required                                   |
| creator_id            | FK → creators.id        | Required                                   |
| display_name_snapshot | VARCHAR                 | Preserve public competition display        |
| biography_snapshot    | TEXT, nullable          | Optional                                   |
| status                | VARCHAR                 | pending, approved, disqualified, withdrawn |
| nominated_by          | FK → users.id, nullable | Source                                     |
| approved_by           | FK → users.id, nullable | Reviewer                                   |
| approved_at           | TIMESTAMP, nullable     | Optional                                   |
| created_at            | TIMESTAMP               | Required                                   |

Unique constraint: `(competition_id, creator_id)` unless competition rules explicitly permit otherwise.

#### `votes`

| Column              | Suggested type               | Rules/notes                     |
| ------------------- | ---------------------------- | ------------------------------- |
| id                  | UUID / PK                    | Primary key                     |
| competition_id      | FK → competitions.id         | Required                        |
| nominee_id          | FK → competition_nominees.id | Required                        |
| user_id             | FK → users.id                | Voter                           |
| status              | VARCHAR                      | valid, flagged, invalidated     |
| risk_flag           | VARCHAR, nullable            | Restricted internal reason/code |
| cast_at             | TIMESTAMP                    | Required                        |
| invalidated_by      | FK → users.id, nullable      | Staff reviewer                  |
| invalidated_at      | TIMESTAMP, nullable          | Optional                        |
| invalidation_reason | TEXT, nullable               | Required if invalidated         |

Voting uniqueness must follow the published rule. For one vote per account per competition, use a unique constraint on `(competition_id, user_id)`. For one vote per nominee per competition, use the appropriate constraint and enforce the policy in the backend. Do not rely on frontend validation alone.

Avoid retaining IP addresses or device identifiers longer than necessary. If used for abuse prevention, document the purpose, access controls, retention period, and legal basis.

#### `competition_results`

| Column           | Suggested type               | Rules/notes                              |
| ---------------- | ---------------------------- | ---------------------------------------- |
| id               | UUID / PK                    | Primary key                              |
| competition_id   | FK → competitions.id         | Required                                 |
| nominee_id       | FK → competition_nominees.id | Required                                 |
| valid_vote_count | BIGINT                       | Calculated snapshot                      |
| rank             | INTEGER                      | Final rank                               |
| result_status    | VARCHAR                      | provisional, winner, runner_up, finalist |
| calculated_at    | TIMESTAMP                    | Required                                 |
| finalized_by     | FK → users.id, nullable      | Staff                                    |
| finalized_at     | TIMESTAMP, nullable          | Optional                                 |

Use a controlled finalization process. Results must be reproducible from valid votes and documented rules. Preserve the underlying vote records and audit any invalidations.

#### `awards`

| Column            | Suggested type               | Rules/notes                                          |
| ----------------- | ---------------------------- | ---------------------------------------------------- |
| id                | UUID / PK                    | Primary key                                          |
| competition_id    | FK → competitions.id         | Required                                             |
| nominee_id        | FK → competition_nominees.id | Winner/recipient                                     |
| award_title       | VARCHAR                      | Required                                             |
| prize_description | TEXT, nullable               | Optional                                             |
| status            | VARCHAR                      | announced, verification_pending, fulfilled, disputed |
| announced_at      | TIMESTAMP, nullable          | Optional                                             |
| fulfilled_at      | TIMESTAMP, nullable          | Optional                                             |
| created_at        | TIMESTAMP                    | Required                                             |

### 6.8 Moderation, reporting, notifications, and audit

#### `content_reports`

| Column           | Suggested type          | Rules/notes                                |
| ---------------- | ----------------------- | ------------------------------------------ |
| id               | UUID / PK               | Primary key                                |
| reporter_user_id | FK → users.id, nullable | Allow guest reports only if policy permits |
| target_type      | VARCHAR                 | video, preview, comment, creator, other    |
| target_id        | UUID                    | Validate target type and existence         |
| reason_code      | VARCHAR                 | Standardized reason                        |
| description      | TEXT, nullable          | User explanation                           |
| status           | VARCHAR                 | new, under_review, action_taken, dismissed |
| assigned_to      | FK → users.id, nullable | Reviewer                                   |
| resolution_notes | TEXT, nullable          | Restricted                                 |
| created_at       | TIMESTAMP               | Required                                   |
| resolved_at      | TIMESTAMP, nullable     | Optional                                   |

Because `target_id` can refer to different tables, enforce target validation in application logic or use separate report tables where strong foreign-key integrity is required.

#### `moderation_actions`

| Column            | Suggested type                    | Rules/notes                                                |
| ----------------- | --------------------------------- | ---------------------------------------------------------- |
| id                | UUID / PK                         | Primary key                                                |
| moderator_id      | FK → users.id                     | Actor                                                      |
| target_type       | VARCHAR                           | Target type                                                |
| target_id         | UUID                              | Target                                                     |
| action            | VARCHAR                           | approved, rejected, restricted, removed, restored, warning |
| reason            | TEXT                              | Required for sensitive actions                             |
| related_report_id | FK → content_reports.id, nullable | Optional                                                   |
| created_at        | TIMESTAMP                         | Required                                                   |

#### `notifications`

| Column            | Suggested type      | Rules/notes                       |
| ----------------- | ------------------- | --------------------------------- |
| id                | UUID / PK           | Primary key                       |
| user_id           | FK → users.id       | Recipient                         |
| notification_type | VARCHAR             | Type                              |
| title             | VARCHAR             | Required                          |
| body              | TEXT                | Required                          |
| data              | JSONB               | Non-sensitive navigation metadata |
| read_at           | TIMESTAMP, nullable | Read state                        |
| created_at        | TIMESTAMP           | Required                          |

#### `audit_logs`

| Column        | Suggested type          | Rules/notes                        |
| ------------- | ----------------------- | ---------------------------------- |
| id            | UUID / PK               | Primary key                        |
| actor_user_id | FK → users.id, nullable | Actor; nullable for system events  |
| action        | VARCHAR                 | Required                           |
| target_type   | VARCHAR                 | Target type                        |
| target_id     | UUID, nullable          | Target                             |
| request_id    | VARCHAR, nullable       | Correlation                        |
| ip_address    | INET, nullable          | Retain only as justified by policy |
| before_data   | JSONB, nullable         | Redact secrets/personal data       |
| after_data    | JSONB, nullable         | Redact secrets/personal data       |
| created_at    | TIMESTAMP               | Required                           |

Audit logs should be access-restricted and tamper-resistant. Never log passwords, tokens, payment secrets, or complete sensitive payment payloads.

#### `support_tickets` (recommended MVP)

| Column      | Suggested type          | Rules/notes                                  |
| ----------- | ----------------------- | -------------------------------------------- |
| id          | UUID / PK               | Primary key                                  |
| user_id     | FK → users.id, nullable | Requester                                    |
| subject     | VARCHAR                 | Required                                     |
| message     | TEXT                    | Required                                     |
| category    | VARCHAR                 | payment, content, account, other             |
| status      | VARCHAR                 | open, in_progress, waiting, resolved, closed |
| assigned_to | FK → users.id, nullable | Staff                                        |
| created_at  | TIMESTAMP               | Required                                     |
| updated_at  | TIMESTAMP               | Required                                     |
| resolved_at | TIMESTAMP, nullable     | Optional                                     |

---

## 7. Table Relationships Overview

- One `user` may have one `user_profile`.
- One `user` may submit multiple `creator_applications`; an approved creator account is represented by `creators`.
- One `creator` belongs to one user and owns many `videos`.
- One `video` may have multiple `video_previews`, tags, captions, likes, and comments.
- One `video` references media assets for its source/thumbnail/playback outputs.
- One `user` may create many `orders`; each order has one or more `order_items`.
- One successful order item may create a `video_entitlement`.
- One payment transaction may have refund records.
- One creator has many ledger entries and payout requests.
- One competition has many nominees, votes, results, and awards.
- Each vote belongs to one competition, one nominee, and one user.
- Reports, moderation actions, and audit logs provide traceability across the system.

Use foreign keys, database constraints, indexes, and transactions for integrity. Where polymorphic references are proposed, document the validation strategy.

---

## 8. API Requirements

Use versioned REST APIs, for example `/api/v1/`. This is a conceptual endpoint inventory, not a final OpenAPI contract.

### 8.1 Authentication and profile

| Method | Endpoint                              | Purpose                       | Access        |
| ------ | ------------------------------------- | ----------------------------- | ------------- |
| POST   | `/api/v1/auth/register`               | Register account              | Public        |
| POST   | `/api/v1/auth/login`                  | Authenticate                  | Public        |
| POST   | `/api/v1/auth/logout`                 | End session                   | Authenticated |
| POST   | `/api/v1/auth/password-reset`         | Request reset                 | Public        |
| POST   | `/api/v1/auth/password-reset/confirm` | Complete reset                | Public        |
| GET    | `/api/v1/me`                          | Current user profile          | Authenticated |
| PATCH  | `/api/v1/me`                          | Update allowed profile fields | Authenticated |

### 8.2 Creators

| Method | Endpoint                          | Purpose                    | Access           |
| ------ | --------------------------------- | -------------------------- | ---------------- |
| POST   | `/api/v1/creator-applications`    | Submit creator application | Authenticated    |
| GET    | `/api/v1/creator-applications/me` | View own application       | Applicant        |
| GET    | `/api/v1/creators`                | Browse/search creators     | Public           |
| GET    | `/api/v1/creators/{slug}`         | Creator detail             | Public           |
| PATCH  | `/api/v1/creator/me`              | Update own creator profile | Approved creator |
| GET    | `/api/v1/creator/me/analytics`    | Creator analytics          | Approved creator |

### 8.3 Videos

| Method | Endpoint                                    | Purpose                            | Access                                    |
| ------ | ------------------------------------------- | ---------------------------------- | ----------------------------------------- |
| GET    | `/api/v1/videos`                            | Browse published videos            | Public                                    |
| GET    | `/api/v1/videos/{slug}`                     | Video details                      | Public                                    |
| POST   | `/api/v1/creator/videos`                    | Create draft                       | Creator                                   |
| POST   | `/api/v1/creator/videos/{id}/upload`        | Start upload or request upload URL | Creator                                   |
| PATCH  | `/api/v1/creator/videos/{id}`               | Update draft/allowed metadata      | Owner creator                             |
| POST   | `/api/v1/creator/videos/{id}/previews`      | Add preview                        | Owner creator                             |
| POST   | `/api/v1/creator/videos/{id}/submit-review` | Submit for moderation              | Owner creator                             |
| GET    | `/api/v1/creator/videos`                    | List own videos                    | Creator                                   |
| POST   | `/api/v1/videos/{id}/playback-access`       | Request playback access            | Public/authenticated; entitlement checked |
| POST   | `/api/v1/videos/{id}/report`                | Report content                     | Public/authenticated                      |

Playback access must be decided server-side. The endpoint should return a public preview URL or a short-lived premium playback token only when the access policy permits it.

### 8.4 Orders and payments

| Method | Endpoint                               | Purpose                         | Access                            |
| ------ | -------------------------------------- | ------------------------------- | --------------------------------- |
| POST   | `/api/v1/orders`                       | Create order for eligible video | Authenticated                     |
| GET    | `/api/v1/orders/{id}`                  | View own order status           | Buyer/authorized staff            |
| GET    | `/api/v1/me/orders`                    | Purchase history                | Authenticated                     |
| POST   | `/api/v1/orders/{id}/payment`          | Initiate provider payment       | Buyer                             |
| POST   | `/api/v1/payments/webhooks/{provider}` | Receive provider callback       | Provider-verified server endpoint |
| GET    | `/api/v1/me/library`                   | List entitled videos            | Authenticated                     |

Use idempotency keys for order/payment creation where appropriate. Never accept the final payment status from a client request.

### 8.5 Competitions and votes

| Method | Endpoint                                   | Purpose                                 | Access                        |
| ------ | ------------------------------------------ | --------------------------------------- | ----------------------------- |
| GET    | `/api/v1/competitions`                     | List public competitions                | Public                        |
| GET    | `/api/v1/competitions/{slug}`              | Competition detail                      | Public                        |
| GET    | `/api/v1/competitions/{id}/nominees`       | List eligible nominees                  | Public                        |
| POST   | `/api/v1/competitions/{id}/votes`          | Cast vote                               | Authenticated, eligible user  |
| GET    | `/api/v1/competitions/{id}/results`        | View public results according to policy | Public                        |
| POST   | `/api/v1/admin/competitions`               | Create competition                      | Authorized staff              |
| POST   | `/api/v1/admin/competitions/{id}/finalize` | Finalize results                        | Specifically authorized staff |

Voting endpoints must check competition status and dates, nominee eligibility, user eligibility, rate limits, and uniqueness constraints on the server.

### 8.6 Creator payouts and administration

| Method | Endpoint                               | Purpose                    | Access           |
| ------ | -------------------------------------- | -------------------------- | ---------------- |
| GET    | `/api/v1/creator/me/earnings`          | View earnings              | Creator          |
| GET    | `/api/v1/creator/me/ledger`            | View ledger statement      | Creator          |
| POST   | `/api/v1/creator/me/payout-requests`   | Request payout             | Eligible creator |
| GET    | `/api/v1/admin/moderation-queue`       | Review queue               | Moderator        |
| POST   | `/api/v1/admin/videos/{id}/moderation` | Record moderation decision | Moderator        |
| GET    | `/api/v1/admin/payments`               | Search payments            | Finance/admin    |
| GET    | `/api/v1/admin/audit-logs`             | Search audit trail         | Authorized staff |

Return consistent error structures, use pagination, validate inputs, and document each endpoint in OpenAPI/Swagger. Avoid leaking whether private accounts or protected resources exist.

---

## 9. Non-Functional Requirements

### 9.1 Performance

- Public pages should load efficiently on common mobile devices and constrained connections.
- Use pagination or cursor-based loading for feeds and lists.
- Avoid loading full video files before playback.
- Use adaptive bitrate streaming where supported.
- Offload video transcoding and other long-running jobs to background workers.
- Set measurable performance targets after baseline testing.

### 9.2 Availability and recovery

- Define target availability and recovery objectives before production.
- Back up database and critical configuration on a documented schedule.
- Test restoration, not just backup creation.
- Use health checks and alerts for API, database, media processing, storage, and payment integration.
- Ensure failed background jobs can be retried safely.
- Document incident response and rollback procedures.

### 9.3 Security

- Use HTTPS for all production traffic.
- Enforce role-based access control on every protected endpoint.
- Use secure password hashing and framework-supported authentication.
- Apply CSRF protection where cookie-based sessions are used.
- Apply rate limits to login, upload, payment, comment, and voting endpoints.
- Validate and normalize input; protect against SQL injection, XSS, CSRF, IDOR, SSRF, and unsafe uploads.
- Store secrets in a secret manager/environment configuration, not source control.
- Encrypt sensitive data in transit and at rest where appropriate.
- Restrict staff permissions using least privilege.
- Record security-relevant administrative actions.
- Run dependency updates, vulnerability scanning, and security testing.
- Have a process for reporting and responding to security incidents.

### 9.4 Privacy and compliance

Before launch, obtain qualified local advice on Tanzanian requirements relating to data protection, online content, consumer protection, taxes, payment services, copyright, and any applicable platform licensing or regulatory obligations.

The platform should:

- Publish a privacy notice and terms of service.
- Explain what data is collected and why.
- Collect only necessary personal information.
- Define retention and deletion policies.
- Provide a process for account/data requests where legally required.
- Restrict access to identity, payout, support, and payment-related data.
- Obtain appropriate consent for optional marketing communications.
- Avoid exposing private phone numbers or email addresses on public profiles unless explicitly chosen.
- Document the use and retention of anti-abuse signals such as IP/device information.
- Provide a copyright complaint and dispute process.

### 9.5 Accessibility and usability

- Use readable text, clear contrast, keyboard-accessible controls, and labelled form fields.
- Provide useful loading, empty, success, and error states.
- Support captions where possible.
- Make payment and voting deadlines clear.
- Avoid relying on colour alone to communicate status.
- Test on low- and mid-range Android devices and common screen sizes.

### 9.6 Localization

- MVP language: choose and confirm Swahili, English, or both.
- Store language as a code and support translated interface strings.
- Store timestamps in UTC and display them in the relevant configured time zone.
- Use explicit currency fields and exact monetary types.
- Do not assume every future country will use the same payment providers or tax rules.

---

## 10. Suggested Technology Stack

This is a recommended starting point and can be changed after engineering review.

| Layer            | Suggested option                                      | Notes                                          |
| ---------------- | ----------------------------------------------------- | ---------------------------------------------- |
| Backend          | Python, Django, Django REST Framework                 | API, permissions, admin workflows              |
| Database         | PostgreSQL                                            | Relational data and transactions               |
| Frontend web     | Vue.js or another agreed framework                    | Responsive web application                     |
| Mobile           | Flutter                                               | Consider after web MVP validation              |
| Media processing | FFmpeg and background workers, or managed service     | Transcoding and thumbnail generation           |
| Queue/cache      | Redis plus a task queue where justified               | Jobs, caching, rate limiting                   |
| Media storage    | Private object storage                                | Originals and processed assets                 |
| Delivery         | CDN/streaming provider                                | Reliable video playback                        |
| Authentication   | Django-supported secure auth approach                 | Session/token strategy decided by architecture |
| Payments         | Provider-approved Tanzanian mobile-money integrations | Confirm commercial availability and APIs       |
| Observability    | Centralized logs, metrics, error tracking, alerts     | Avoid sensitive data in logs                   |
| Deployment       | Containers and CI/CD                                  | Separate dev, staging, production              |

### Architecture guidelines

- Keep payment-provider logic behind a provider adapter/service.
- Keep media storage and transcoding behind a media service interface.
- Use background jobs for transcoding, notifications, and reporting.
- Use database transactions for order, entitlement, and ledger consistency.
- Use an outbox/event approach where reliable asynchronous processing is needed.
- Avoid splitting into microservices too early; a well-structured modular monolith is suitable for the MVP.
- Keep production secrets separate from source code and development configuration.

---

## 11. Business Rules to Confirm

These decisions affect implementation and must be approved by the product owner.

| Decision                           | Suggested initial policy                                               | Status      |
| ---------------------------------- | ---------------------------------------------------------------------- | ----------- |
| Initial market                     | Tanzania; future regional expansion possible                           | Proposed    |
| Interface language                 | Swahili and English if budget allows; otherwise select launch language | To confirm  |
| User login                         | Email and/or phone, with verification policy                           | To confirm  |
| Video sales model                  | Individual video purchase first                                        | Recommended |
| Subscription model                 | Later phase                                                            | Proposed    |
| Free preview duration              | Configurable, e.g. 30–60 seconds                                       | To confirm  |
| Maximum video upload size/duration | Configurable by plan and infrastructure                                | To confirm  |
| Creator commission                 | Configurable; disclose in creator agreement                            | To confirm  |
| Minimum payout threshold           | Configurable and provider-dependent                                    | To confirm  |
| Payout schedule                    | Periodic, after reconciliation and review                              | To confirm  |
| Voting model                       | Free public voting for MVP                                             | Recommended |
| Votes per user                     | Define per competition; enforce server-side                            | To confirm  |
| Results display                    | Provisional/public or hidden until closing, per rules                  | To confirm  |
| Tie-breaking                       | Publish before voting opens                                            | Required    |
| Creator approval                   | Manual review for launch                                               | Recommended |
| Content moderation                 | Pre-publication review for initial launch                              | Recommended |
| Comments                           | Include only if moderation capacity exists; otherwise phase 2          | Recommended |
| Refund rules                       | Publish before taking payment                                          | Required    |
| Purchased access duration          | Define whether access is ongoing or time-limited                       | Required    |
| Video takedown effects             | Define how legal takedowns affect existing purchasers                  | Required    |
| Age policy                         | Set and publish age/access rules after legal review                    | Required    |
| Prizes                             | Document eligibility, fulfilment, and dispute process                  | Required    |

---

## 12. Analytics and Reporting

### 12.1 Product analytics

Track, where appropriate and privacy-compliant:

- Registration completion rate.
- Creator application and approval rate.
- Preview impressions and meaningful plays.
- Preview-to-full-video page conversion.
- Checkout start and payment completion rates.
- Video purchases and refunds.
- Repeat viewers and returning users.
- Creator follower growth.
- Competition page visits and valid votes.
- Video processing failures and playback errors.

Define events consistently and avoid collecting unnecessary personal information.

### 12.2 Business reports

Administrators should be able to report on:

- Gross sales, refunds, provider fees, platform revenue, and creator earnings.
- Transactions by status, provider, and date.
- Creator sales and payout status.
- Popular videos and creators.
- Content moderation volume and resolution time.
- Competition participation and valid votes.
- Failed payments and reconciliation differences.

Financial reports must distinguish gross sales from net revenue and must not treat pending payments as settled income.

---

## 13. Notifications

Initial notification events may include:

- Account verification.
- Password reset.
- Creator application submitted/approved/rejected.
- Video processing completed/failed.
- Video approved/rejected or needing changes.
- Payment success/failure.
- New purchase receipt.
- Payout requested/approved/rejected/paid/failed.
- Competition opened/closing soon/results published.
- Report or support case status updates.
- Important policy or account notices.

Start with in-app notifications and email/SMS/push only where the necessary provider and consent are in place. Notification delivery must not reveal sensitive information on a shared device.

---

## 14. Testing and Acceptance

### 14.1 Required test areas

- Unit tests for pricing, permissions, voting rules, and revenue calculations.
- API integration tests.
- Payment-provider sandbox and webhook verification tests.
- Duplicate callback/idempotency tests.
- Entitlement and playback authorization tests.
- Video upload and processing failure tests.
- Competition start/end boundary tests and time-zone tests.
- Voting uniqueness and concurrency tests.
- Role/permission tests for every staff role.
- Refund and payout reconciliation tests.
- Accessibility and responsive UI checks.
- Security tests, dependency scanning, and rate-limit tests.
- Backup restoration and production recovery exercises.

### 14.2 MVP acceptance checklist

The MVP is not ready for launch until:

- [ ] Users can register, verify where required, log in, and recover accounts.
- [ ] Creator applications can be submitted and reviewed.
- [ ] Approved creators can upload and manage videos.
- [ ] A full video can have multiple short previews.
- [ ] Moderation prevents unapproved content from being publicly available.
- [ ] Public users can discover and play free previews.
- [ ] A viewer can purchase a premium video through an approved payment flow.
- [ ] No premium entitlement is granted from a client-only success message.
- [ ] Duplicate payment callbacks cannot create duplicate purchases or credits.
- [ ] Buyers can access purchased videos from their library.
- [ ] Refunds and creator ledger entries are traceable.
- [ ] Administrators can create and schedule a competition.
- [ ] Voting opens and closes according to server-enforced dates.
- [ ] Voting limits are enforced under concurrent requests.
- [ ] Final results can be audited and published.
- [ ] Sensitive staff actions are recorded in audit logs.
- [ ] Terms, privacy notice, creator agreement, copyright process, and refund policy are available.
- [ ] Monitoring, backups, incident response, and support procedures are in place.
- [ ] Payment reconciliation has been tested with the selected provider.
- [ ] Legal/compliance review is completed for the launch model.

---

## 15. Delivery Plan

### Stage 0 — Discovery and decisions

- Confirm target audience and launch geography.
- Interview comedians, viewers, sponsors, and potential partners.
- Confirm free-preview and premium-purchase rules.
- Confirm payment providers, transaction costs, settlement, and refund handling.
- Confirm creator revenue-sharing and payout policy.
- Confirm voting rules and legal review needs.
- Produce wireframes and a finalized API/data model.

### Stage 1 — Foundation

- Repository, environments, CI/CD, database, authentication, roles.
- Public web shell and design system.
- User and creator profiles.
- Admin access and audit framework.

### Stage 2 — Content

- Media upload, storage, processing, and playback.
- Video/preview relationships.
- Content moderation.
- Discovery, search, and creator pages.

### Stage 3 — Commerce

- Orders and payment provider integration.
- Webhook verification and idempotency.
- Entitlements and protected playback.
- Creator ledger, refunds, reconciliation, and payout request workflow.

### Stage 4 — Competitions

- Competition and category management.
- Nomination workflows.
- Vote records and anti-abuse checks.
- Closing, results, awards, and public archive.

### Stage 5 — Hardening and launch

- Load and security testing.
- Payment reconciliation tests.
- Legal and policy review.
- Backups, monitoring, support process, and incident response.
- Closed pilot with selected creators and invited viewers.
- Fix pilot feedback and launch in stages.

---

## 16. Risks and Mitigations

| Risk                                       | Potential impact                | Mitigation                                                                                               |
| ------------------------------------------ | ------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Low audience willingness to pay            | Low premium revenue             | Validate pricing, previews, and content demand with a pilot.                                             |
| High video delivery costs                  | Reduced margins                 | Use adaptive streaming, CDN caching, storage lifecycle rules, and cost monitoring.                       |
| Unauthorized sharing/copying               | Revenue loss                    | Signed playback access, watermarking where appropriate, clear policy; do not promise perfect prevention. |
| Payment callback spoofing or duplication   | Fraud or incorrect access       | Verify callbacks, query provider status, use idempotency, audit all transitions.                         |
| Voting manipulation                        | Loss of trust                   | Clear rules, rate limits, eligibility checks, anomaly review, auditability, and appeals.                 |
| Creator copyright disputes                 | Takedowns and legal exposure    | Creator warranties, reporting process, evidence retention, and prompt review.                            |
| Creator dissatisfaction with revenue share | Creator churn                   | Transparent agreements, understandable statements, and predictable payouts.                              |
| Poor connectivity                          | Failed playback and abandonment | Adaptive bitrate, compressed previews, resumable uploads, and mobile testing.                            |
| Inadequate moderation capacity             | Harmful or unlawful content     | Define content policy, staffing, escalation, reporting, and response targets.                            |
| Data breach                                | Harm to users and business      | Least privilege, secure secrets, encryption, monitoring, backups, and incident response.                 |
| Regulatory uncertainty                     | Delays or penalties             | Obtain qualified local legal/accounting advice before launch.                                            |

---

## 17. Decisions and Open Questions

The product owner and development team must answer these before implementation is finalized:

1. What is the official brand style, logo, and colour palette?
2. Will the MVP be a responsive website only, or website plus mobile app?
3. Which languages are required on day one?
4. Will users log in with phone number, email, or both?
5. Which payment providers will be integrated first, and what are their approved APIs and settlement terms?
6. Will creators set prices, or will Kicheko define price tiers?
7. What will the creator/platform revenue split be?
8. Will buyers receive ongoing access or time-limited access to purchased videos?
9. What is the maximum video length, file size, resolution, and supported format?
10. Will Kicheko host video files directly or use a managed streaming provider?
11. Who reviews content, and what is the moderation response target?
12. Will comments and likes be in the MVP?
13. What is the exact voting rule for each competition?
14. Will votes be free? The MVP recommendation is free voting.
15. How are ties, suspected fraud, disqualifications, and appeals handled?
16. What prizes will be offered, who funds them, and how are winners verified?
17. What is the payout threshold and payout schedule?
18. What refund policy applies to a purchased video?
19. How will copyright claims affect videos already purchased?
20. What age restrictions and content classification rules apply?
21. Which Tanzanian legal, data protection, tax, payment, and content requirements apply to the chosen operating model?
22. Who owns the platform's source code, brand, media rights, and creator-generated content under the relevant agreements?

---

## 18. Recommended MVP Definition

For a realistic first launch, focus on these end-to-end journeys:

### Journey A — Viewer watches and buys

1. Visitor discovers a short comedy clip.
2. Visitor opens the full performance page.
3. User registers/logs in.
4. User sees price and terms.
5. User pays through a supported provider.
6. Backend verifies payment.
7. User receives an entitlement and watches the full video.
8. Purchase and creator earnings records are created exactly once.

### Journey B — Creator publishes content

1. User applies to become a creator.
2. Staff reviews and approves the application.
3. Creator uploads a full performance and preview clip(s).
4. System processes media.
5. Creator submits content for review.
6. Moderator approves content.
7. Content becomes discoverable.
8. Creator can view performance and sales information.

### Journey C — Audience votes

1. Staff creates a competition and publishes its rules.
2. Eligible nominees are approved.
3. Voting opens at the configured time.
4. Authenticated users vote under the published rule.
5. Backend rejects duplicate, late, or ineligible votes.
6. Voting closes automatically.
7. Authorized staff review anomalies and finalize results.
8. Winners and awards are published with an audit trail.

These three journeys should work reliably before adding advanced features.

---

## 19. Definition of Done

A feature is complete only when:

- Its requirements and acceptance criteria are met.
- Permissions and validation are enforced server-side.
- Unit and integration tests pass.
- Error, empty, loading, and success states are implemented.
- Security and privacy implications are reviewed.
- Logs and metrics are sufficient to diagnose failures without exposing secrets.
- API and user documentation are updated.
- Administrative workflows are available where needed.
- Database migrations and rollback/recovery considerations are reviewed.
- Product owner acceptance is recorded.

---

## 20. Final Recommendation

Build Kicheko first as a well-structured, mobile-first web platform with creator registration, short-video discovery, paid full performances, secure payment verification, creator earnings records, and transparent free public voting. Keep subscriptions, live streaming, complex recommendations, and paid voting out of the first release unless user research provides a compelling reason to change scope.

Before coding the full system, approve the unresolved business rules, create screen wireframes, validate the payment provider, and review the legal requirements. Then convert this draft into implementation tickets and a versioned API/data specification.
