# Kicheko Platform — Authentication Fix and YouTube-Like UI Redesign

## Objective

Redesign the existing Kicheko application into a modern, video-first comedy platform inspired by YouTube, while preserving Kicheko's own branding, existing architecture, backend integrations, and documented business requirements.

**Important:** Work on the existing project. Do not create a new project, replace the application architecture, or build a separate demo.

**Project directory:**

`/Users/mac/development/vueprojects/kicheko`

**Documentation to review:**

- `/Users/mac/development/vueprojects/kicheko/docs/auth.md`
- `/Users/mac/development/vueprojects/kicheko/docs/kicheko.md`

The current interface resembles a traditional administration dashboard with a sidebar, revenue charts, statistics cards, and tables. That layout is not appropriate for the public Kicheko experience. The public interface should focus on discovering and watching comedy videos.

---

## Phase 1: Inspect the Existing Application

Before making changes:

1. Inspect the existing Vue project structure.
2. Read `docs/auth.md` and understand the authentication implementation.
3. Read `docs/kicheko.md` to understand the complete product requirements.
4. Identify the current dashboard, layouts, routing, components, API services, state management, and styling.
5. Identify which components belong to the administration area and which belong to the public user interface.
6. Investigate why login and registration pages display unnecessary layouts or remain stuck loading.
7. Review existing backend endpoints and data models before implementing or changing features.

Do not replace files blindly. Understand the current implementation first, and preserve functionality that already works.

## Phase 2: Fix Authentication First

Make sure login and registration work correctly before proceeding with the main UI redesign.

### Requirements

- Login must work with the existing backend.
- Registration must work with the existing backend.
- Authentication state must be handled correctly.
- Protected routes must behave as expected.
- Loading indicators must disappear when requests finish.
- Authentication and validation errors must be displayed clearly.
- Prevent infinite loading states and redirect loops.
- Remove the main dashboard layout from login and registration pages.
- Do not display the dashboard sidebar or dashboard navigation on authentication pages.
- Preserve existing API contracts and backend authentication behavior.

### Loading-State Requirements

- Login and registration pages must render normally instead of remaining stuck on a loading screen.
- Show loading indicators only while necessary initialization or authentication requests are running.
- Do not block the entire interface unnecessarily.
- Handle failed requests and timeouts gracefully.
- Ensure users can interact with forms as soon as the page is ready.
- Redirect already-authenticated users appropriately without creating redirect loops.

**Do not proceed with major UI changes until authentication has been tested and confirmed to work correctly.**

## Phase 3: Replace the Public Dashboard with a YouTube-Like Interface

Transform the current public dashboard into a modern comedy video discovery and streaming interface. The public home page should focus on videos rather than revenue charts and administration statistics.

### A. Top Navigation Bar

Create a compact, responsive navigation bar containing:

- Kicheko logo on the left.
- Search input and search button.
- Upload action for authorized users, where appropriate.
- Notifications icon where supported.
- User profile avatar and dropdown.
- Login and registration actions for unauthenticated users.

Adapt the navigation for mobile screens so that it remains easy to use.

### B. Left Sidebar

Replace the public-facing administration sidebar with a YouTube-inspired navigation sidebar.

Potential destinations include:

- Home
- Shorts
- Explore
- Categories
- Comedians
- Popular Videos
- Trending
- My Library
- Watch History
- Liked Videos

Use the features documented in `docs/kicheko.md` and supported by the existing application. Do not make unimplemented destinations appear fully functional. If a feature is not yet available, either implement it properly or leave it out of the active navigation.

The sidebar should support a collapsed state on smaller screens, and the layout should work well on mobile.

Do not display administration links such as revenue reports, employee statistics, or financial charts in the public user interface.

### C. Home Page and Video Grid

Display comedy videos immediately on the public home page.

Create a responsive video grid inspired by YouTube. Each video card should show, where available:

- Video thumbnail.
- Video duration.
- Video title.
- Comedian name.
- View count.
- Upload date.
- Relevant category or tags.

Use consistent thumbnail aspect ratios, card spacing, typography, and alignment.

Responsive behavior:

- Multiple videos per row on desktop.
- Fewer columns on tablets.
- One or two columns on mobile, depending on available width.

Use real video data from the backend. Do not replace working API integration with hardcoded mock data. If no videos are available, show a professional empty state.

### D. Category Filters

Add horizontally scrollable category filters above the video feed.

Possible categories include:

- All
- Stand-up Comedy
- Skits
- Short Comedy
- Trending
- New Releases
- Popular Comedians

Use category definitions from the existing data model and documentation. Avoid duplicate or conflicting category definitions.

When a user selects a category, update the displayed videos using the existing API or a suitable local filter if all required data is already available.

### E. Shorts Experience

Create a Shorts section that presents short comedy videos in a modern vertical-video layout.

- Associate each preview with its original full-length video when applicable.
- Provide a clear **Watch Full Video** action.
- Direct users to the corresponding full-video page.
- Follow documented payment and access requirements.
- Do not expose protected video URLs or bypass premium access restrictions.

Do not imply that automatic clipping or video processing exists unless it is supported by the current implementation.

### F. Video Watch Page

Create or improve the video viewing page.

Include, where supported:

- Video player.
- Video title.
- Comedian profile and name.
- View count and publication date.
- Like or reaction functionality.
- Video description.
- Related videos.
- Link to the comedian's profile.
- Payment or access controls for premium content.

For free videos, allow playback according to platform rules. For premium videos, show an appropriate payment or subscription prompt and enforce access restrictions through the backend.

Clearly distinguish between a short preview and its corresponding full-length video. Do not simulate payment success or premium access on the frontend.

### G. Comedian Profiles

Create a clean comedian profile page containing, where data is available:

- Profile photo.
- Comedian name.
- Biography.
- Published videos.
- Shorts.
- Categories.
- Relevant engagement statistics.

Use the existing data model and backend capabilities.

### H. Search

Implement a functional search interface for finding:

- Comedy videos.
- Comedians.
- Categories.

Use existing API endpoints where available. Include appropriate loading, empty, and error states. Search must work on desktop and mobile.

---

## Phase 4: Separate the Public Platform from Administration

Kicheko requires an administration area because administrators or authorized content managers will upload and manage comedy videos.

Maintain two distinct experiences.

### 1. Public Platform

- YouTube-like layout.
- Video discovery.
- Shorts.
- Comedian profiles.
- Video playback.
- Search and categories.

### 2. Administration Area

- Secure administrator access.
- Video upload and management.
- Comedian management.
- Category management.
- Short-preview and full-video association.
- Voting category management, as required by the documentation.
- Content publication and moderation.
- Payment and transaction management, where required.

The administration area may retain a dashboard layout, but it should be consistent with Kicheko branding.

Only administrators and authorized content managers may access administrative functions. Enforce authorization in the backend as well as in the frontend.

Do not remove essential administration functionality during the public UI redesign. Do not mix administration statistics into the public video discovery page.

---

## Phase 5: Video Upload Workflow

The platform owner or authorized content manager will upload comedy videos to Kicheko. Inspect the existing backend before implementing this workflow.

The intended process is:

1. An administrator uploads a full-length comedy video.
2. The administrator provides the title, description, comedian, category, and other required metadata.
3. A short preview is uploaded or created and associated with the full-length video.
4. The administrator previews the content before publication.
5. The administrator publishes the video.
6. The short preview appears in the appropriate public feed.
7. Users can open the preview and select **Watch Full Video**.
8. Premium access and payment requirements are enforced where applicable.

If the backend does not support a required operation, identify the missing functionality and implement it consistently with the existing architecture.

Do not create frontend-only upload forms that do not actually upload files. Consider upload progress, file validation, error handling, file-size limits, and the backend's large-file handling capabilities.

---

## Phase 6: Visual Design

Use YouTube as a usability reference while preserving Kicheko's own brand and identity.

### Design Goals

- Clean white or light background.
- Dark, readable typography.
- Compact navigation.
- Consistent spacing.
- High-quality video thumbnails.
- Subtle borders and hover effects.
- Clear primary actions.
- Responsive layouts.
- Professional loading, empty, and error states.

### Avoid

- The current finance-style dashboard on the public home page.
- Large revenue charts and financial statistics cards on the public page.
- Excessive gradients or rounded cards.
- Unnecessary animations and decorative elements.
- Fake video content presented as real.
- Broken or nonfunctional navigation links.
- Unnecessary dependencies or a wholesale rewrite of the existing architecture.

Reuse the project's existing styling framework and component library where possible.

---

## Phase 7: Testing and Verification

After implementation, verify the following.

### Authentication

- Registration works.
- Login works.
- Logout works.
- Authentication state persists appropriately.
- Invalid credentials and validation errors are handled correctly.
- Protected routes behave as expected.
- Login and registration pages do not remain stuck loading.
- Authentication pages do not display the main application layout.

### Public UI

- The public home page uses the video-first layout.
- Real video data is displayed from the backend.
- Video cards display the correct content and metadata.
- Search and category filters work.
- Navigation works correctly.
- Shorts lead to the correct full-length video where applicable.
- Comedian profiles display the appropriate data.
- The interface is responsive on desktop, tablet, and mobile.

### Administration and Video Workflow

- Administrative routes remain protected.
- Authorized administrators can access the intended management interface.
- Video uploads connect to the actual backend.
- Short previews are associated with their corresponding full-length videos.
- Publication status works correctly.
- Premium access follows the documented payment requirements.
- Existing administration functionality remains available.

### Technical Verification

- Check the browser console for errors.
- Check failed network requests and API integration issues.
- Test authentication from start to finish.
- Verify that existing functionality has not been broken.
- Do not claim a feature works unless it has been tested.

---

## Execution Order

Follow this order:

1. Inspect the project and documentation.
2. Fix authentication and loading issues.
3. Separate public and administrative layouts.
4. Redesign the public home page.
5. Implement video cards, categories, and Shorts.
6. Implement or improve video viewing and comedian profiles.
7. Improve the administration interface and video upload workflow.
8. Test the complete application.

## Final Instructions

Work directly in the existing project.

Do not stop after producing a plan. Implement the changes, test them, and summarize what was completed.

If a feature depends on missing backend functionality, explain the dependency instead of pretending it works.

Start by inspecting the project and fixing authentication. Then proceed with the redesign.
