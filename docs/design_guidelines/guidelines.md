# PocketSchool Design Guidelines
## A Human-First Design System

**Version**: 1.0  
**Last Updated**: December 1, 2025  
**Purpose**: This document serves as the north star for all design decisions in PocketSchool, ensuring beauty, synergy, and brand cohesion through human-centered principles.

---

## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Core Design Principles](#core-design-principles)
3. [The Four Pillars](#the-four-pillars)
4. [Nielsen's 10 Usability Heuristics](#nielsens-10-usability-heuristics)
5. [Laws of UX Applied](#laws-of-ux-applied)
6. [Accessibility First (WCAG 2.1)](#accessibility-first-wcag-21)
7. [Visual Design System](#visual-design-system)
8. [Interaction Patterns](#interaction-patterns)
9. [Content Strategy](#content-strategy)
10. [Implementation Guidelines](#implementation-guidelines)

---

## Design Philosophy

### Human-First Design
PocketSchool exists to empower learners. Every design decision must:
- **Reduce cognitive load** - Learning is hard enough; the interface should be effortless
- **Build confidence** - Users should feel capable and in control
- **Celebrate progress** - Small wins matter and should be visible
- **Respect time** - Every interaction should feel purposeful and efficient

### Design Thinking Process
We follow a iterative, user-centered approach:

1. **Empathize** → Understand learners' needs, frustrations, and goals
2. **Define** → Identify core problems and opportunities
3. **Ideate** → Generate creative solutions
4. **Prototype** → Build tangible representations
5. **Test** → Validate with real users
6. **Implement** → Execute the vision with quality

> "There's no such thing as a creative type. As if creativity is a verb, a very time-consuming verb. It's about taking an idea in your head, and transforming that idea into something real." — Milton Glaser

---

## Core Design Principles

### 1. **Clarity Above All**
- Every element should have a clear purpose
- Remove ambiguity in labels, actions, and feedback
- Use plain language, not jargon
- Visual hierarchy should guide attention naturally

### 2. **Beauty Through Restraint**
- Aesthetic minimalism: focus on essentials
- Every extra element competes for attention
- Whitespace is a design element, not empty space
- Quality over quantity in features and visuals

### 3. **Consistency Builds Trust**
- Internal consistency within PocketSchool
- External consistency with platform conventions (iOS, Android, Web)
- Patterns once established should be reused
- Jakob's Law: Users expect your site to work like others

### 4. **Accessibility is Non-Negotiable**
- Perceivable: Information must be presentable to all senses
- Operable: UI must work for all input methods
- Understandable: Content and operation must be clear
- Robust: Content must work across technologies

### 5. **Progressive Disclosure**
- Start simple, reveal complexity when needed
- Don't overwhelm; guide users through complexity
- Advanced features for power users, simple path for beginners
- Context-sensitive help over lengthy documentation

### 6. **Delight in the Details**
- Micro-interactions matter (hover states, transitions, feedback)
- Smooth animations at 60fps
- Purposeful motion that communicates state and progress
- Easter eggs and moments of joy (but never at usability's expense)

---

## The Four Pillars

Based on WCAG 2.1 and Apple's HIG, our design rests on four pillars:

### 1. PERCEIVABLE
**Users must be able to perceive the information being presented**

#### Visual Design
- **Color contrast ratio**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Never rely on color alone**: Use icons, labels, and patterns
- **Text sizing**: Minimum 16px for body text, scalable up to 200%
- **Focus indicators**: Clearly visible when navigating via keyboard

#### Feedback & State
- Loading states with progress indication
- Success/error states with clear visual distinction
- System status always visible (Heuristic #1)
- Use of animation to draw attention without distraction

### 2. OPERABLE
**Users must be able to operate the interface**

#### Navigation
- **Keyboard navigation**: All functions accessible via keyboard
- **Touch targets**: Minimum 44×44px (iOS), 48×48px (Android)
- **Timing**: No time limits unless absolutely necessary (with warnings)
- **Focus management**: Logical tab order, trapped focus in modals

#### User Control
- **Emergency exits**: Clear cancel/close buttons always available
- **Undo/Redo**: Support for reversing actions
- **Pause/Stop**: Control over auto-playing content
- **Breadcrumbs**: Users always know where they are

### 3. UNDERSTANDABLE
**Information and operation must be understandable**

#### Content
- **Plain language**: 8th-grade reading level or lower
- **Consistent terminology**: Same words for same concepts
- **Error messages**: What went wrong + how to fix it
- **Instructions**: Brief, contextual, just-in-time

#### Predictability
- **Consistent navigation**: Same locations across pages
- **Predictable interactions**: Buttons look like buttons
- **Intentional changes**: Major changes require user confirmation
- **Mental models**: Match user expectations, not system architecture

### 4. ROBUST
**Content must work across technologies**

#### Technical Quality
- **Semantic HTML**: Proper heading hierarchy, ARIA labels
- **Cross-browser support**: Chrome, Safari, Firefox, Edge
- **Responsive design**: Mobile-first, scales to desktop
- **Progressive enhancement**: Core functionality without JavaScript
- **Performance**: < 3s load time, 60fps animations

---

## Nielsen's 10 Usability Heuristics

### #1: Visibility of System Status
**Always keep users informed**

✅ **Good Practices**:
- Loading spinners for async operations
- Progress bars showing completion percentage
- "Saving..." indicators with success confirmation
- Course progress visible on dashboard
- Assignment status pills (not started, in progress, completed)

❌ **Avoid**:
- Silent failures without error messages
- Unclear button states (is it loading or broken?)
- No feedback after form submission

### #2: Match Between System and Real World
**Speak the user's language**

✅ **Good Practices**:
- "Dashboard" not "Control Panel"
- "Courses" not "Learning Modules"
- Calendar metaphors for schedules
- Book iconography for educational content

❌ **Avoid**:
- Technical jargon ("API error 502")
- Database field names as labels
- Developer terminology in UI

### #3: User Control and Freedom
**Provide emergency exits**

✅ **Good Practices**:
- Undo for deletions
- Cancel buttons on all forms
- Back navigation always available
- "Are you sure?" dialogs for destructive actions
- Draft saving for long-form content

❌ **Avoid**:
- Irreversible actions without warning
- Trapped in multi-step flows
- No way to abandon in-progress tasks

### #4: Consistency and Standards
**Don't make users guess**

✅ **Good Practices**:
- Primary button always blue gradient
- Icons have consistent meanings
- Navigation in same location across pages
- Similar actions look similar

❌ **Avoid**:
- Different words for same action
- Inconsistent button styles
- Random placement of common controls

### #5: Error Prevention
**Prevent problems before they occur**

✅ **Good Practices**:
- Form validation before submission
- Confirmation dialogs for delete actions
- Disabled state for unavailable actions
- Smart defaults in forms
- Inline validation with helpful suggestions

❌ **Avoid**:
- Allowing invalid input
- Unclear error messages after failure
- No warnings for destructive actions

### #6: Recognition Rather Than Recall
**Minimize memory load**

✅ **Good Practices**:
- Autocomplete for search
- Recently viewed items
- Visual preview of content
- Contextual help instead of manuals
- Inline examples in form fields

❌ **Avoid**:
- Requiring users to remember codes
- Hidden navigation requiring memory
- Multi-page forms without summary

### #7: Flexibility and Efficiency of Use
**Cater to novices and experts**

✅ **Good Practices**:
- Keyboard shortcuts (power users)
- Bulk actions (select multiple)
- Customizable dashboard layouts
- Quick filters and search
- Smart defaults that work for most

❌ **Avoid**:
- One rigid workflow
- No shortcuts for common tasks
- Can't customize experience

### #8: Aesthetic and Minimalist Design
**Every element must earn its place**

✅ **Good Practices**:
- Clean, uncluttered layouts
- Generous whitespace
- Typography hierarchy (3 sizes max)
- Limited color palette
- Progressive disclosure of complexity

❌ **Avoid**:
- Information overload
- Decorative elements that don't serve purpose
- Cluttered interfaces with too many options

### #9: Help Users Recognize, Diagnose, and Recover from Errors
**Clear error communication**

✅ **Good Practices**:
- Plain language error messages
- Red for errors, with icon
- Specific solution suggestions
- Error summary at top of form
- Inline error hints

❌ **Avoid**:
- Error codes without explanation
- Vague "Something went wrong"
- No guidance on how to fix

### #10: Help and Documentation
**When needed, make it findable**

✅ **Good Practices**:
- Searchable help center
- Contextual tooltips (? icons)
- In-app onboarding for new features
- Video tutorials for complex workflows
- Quick-start guides

❌ **Avoid**:
- Hiding documentation
- Requiring external resources
- Overwhelming new users with tutorials

---

## Laws of UX Applied

### Aesthetic-Usability Effect
**Beautiful design is perceived as more usable**
- PocketSchool's gradient brand colors convey energy and growth
- Smooth animations create perception of speed
- Polished visuals build trust and credibility

### Hick's Law
**More options = longer decision time**
- Limit dashboard actions to 3-5 primary ones
- Use progressive disclosure for advanced features
- Categorize options logically

### Miller's Law
**Average person can hold 7±2 items in working memory**
- Chunk course information into digestible sections
- Limit navigation items to 5-7
- Break long lists into categories

### Fitts's Law
**Larger, closer targets are easier to hit**
- Primary buttons are large (44×44px minimum)
- Frequently used actions placed prominently
- Related actions grouped spatially

### Jakob's Law
**Users prefer your site to work like others**
- Standard icons (hamburger menu, home, settings)
- Common patterns (cards for content, tabs for switching)
- Platform-native behaviors (swipe gestures on mobile)

### Law of Proximity
**Objects near each other are perceived as related**
- Group related form fields
- Cluster course metadata (duration, lectures, assignments)
- Separate distinct sections with whitespace

### Serial Position Effect
**People remember first and last items best**
- Most important nav items first and last
- Key information at top and bottom of cards
- Prioritize critical actions in prime positions

### Von Restorff Effect
**Items that stand out are remembered**
- Primary CTA uses bright gradient
- Important notifications have distinct styling
- Key metrics highlighted with color/size

### Goal-Gradient Effect
**Motivation increases as we approach a goal**
- Progress bars show completion
- "Almost done" messaging in onboarding
- Visual feedback for milestones

### Peak-End Rule
**Experiences judged by peak and end moments**
- Delight moments: success animations, achievement celebrations
- Smooth offboarding (data export, graceful degradation)
- Memorable first experience (onboarding)

---

## Accessibility First (WCAG 2.1)

### Level AA Compliance (Minimum Standard)

#### Color & Contrast
- **Normal text**: 4.5:1 contrast ratio
- **Large text** (18pt+): 3:1 contrast ratio
- **UI components**: 3:1 contrast ratio
- **Never rely on color alone** for information

**PocketSchool Colors (Tested)**:
```css
/* Text on dark backgrounds */
#e9ecf2 on #0d1321 = 11.83:1 ✅
#d6deed on #0d1321 = 10.48:1 ✅
#9aa5bb on #0d1321 = 5.18:1 ✅

/* Gradient buttons */
#4ea1ff to #7cf29c on #0d1321 = sufficient contrast ✅
```

#### Keyboard Navigation
- **Tab order**: Logical, matches visual flow
- **Focus indicators**: Visible 2px outline
- **Skip links**: Jump to main content
- **No keyboard traps**: Can escape all components
- **Shortcuts**: Don't conflict with browser/screen reader

#### Screen Reader Support
- **Alt text**: Descriptive for all images
- **ARIA labels**: For interactive elements
- **Heading hierarchy**: Proper H1-H6 structure
- **Form labels**: Programmatically associated
- **Live regions**: Announce dynamic content changes

#### Content
- **Language**: Declare page language (`<html lang="en">`)
- **Link text**: Descriptive (not "click here")
- **Error identification**: Clear, specific
- **Instructions**: Don't rely solely on sensory characteristics

#### Motion & Animation
- **Respect preferences**: `prefers-reduced-motion`
- **No flashing**: Nothing flashes more than 3 times/second
- **Pauseable**: Auto-playing content can be stopped
- **Essential only**: Animation serves purpose, not decoration

---

## Visual Design System

### Color Palette

#### Primary Colors
```css
/* Brand Gradient */
--primary-start: #4ea1ff; /* Sky Blue */
--primary-end: #7cf29c;   /* Mint Green */

/* Background */
--bg-primary: #0d1321;    /* Deep Navy */
--bg-secondary: #172039;  /* Midnight Blue */
--bg-tertiary: #1f2a44;   /* Slate */
```

#### Semantic Colors
```css
/* Text */
--text-primary: #e9ecf2;   /* Off-white - primary content */
--text-secondary: #d6deed; /* Light gray - secondary content */
--text-tertiary: #9aa5bb;  /* Medium gray - muted content */

/* Feedback */
--success: #7cf29c;    /* Success states */
--warning: #ffb347;    /* Warnings */
--error: #ff3b30;      /* Errors */
--info: #4ea1ff;       /* Information */
```

#### Surface Colors
```css
/* Cards & Components */
--surface-raised: rgba(255, 255, 255, 0.04);  /* Cards */
--surface-overlay: rgba(255, 255, 255, 0.08);  /* Hover/Active */
--border-subtle: rgba(255, 255, 255, 0.06);    /* Borders */
--border-strong: rgba(255, 255, 255, 0.12);    /* Emphasized borders */
```

### Typography

#### Font Family
```css
--font-primary: 'Space Grotesk', 'SF Pro', 'Segoe UI', sans-serif;
--font-mono: 'SF Mono', 'Consolas', monospace;
```

#### Type Scale
```css
--text-xs: 12px;    /* Helper text */
--text-sm: 14px;    /* Secondary content */
--text-base: 16px;  /* Body text */
--text-lg: 18px;    /* Emphasized */
--text-xl: 22px;    /* Section headings */
--text-2xl: 28px;   /* Page titles */
--text-3xl: 32px;   /* Hero headings */
--text-4xl: 40px;   /* Marketing */
```

#### Line Heights
```css
--leading-tight: 1.25;   /* Headings */
--leading-normal: 1.5;   /* Body */
--leading-relaxed: 1.75; /* Large body */
```

#### Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### Spacing System
Based on 4px baseline grid:
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
```

### Border Radius
```css
--radius-sm: 8px;   /* Small elements */
--radius-md: 12px;  /* Buttons, inputs */
--radius-lg: 16px;  /* Cards */
--radius-xl: 20px;  /* Large cards */
--radius-full: 9999px; /* Pills, avatars */
```

### Shadows
```css
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.2);
--shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.25);
--shadow-xl: 0 20px 60px rgba(0, 0, 0, 0.3);

/* Glows for emphasis */
--glow-primary: 0 4px 16px rgba(78, 161, 255, 0.4);
--glow-success: 0 4px 16px rgba(124, 242, 156, 0.4);
```

### Animation Timings
```css
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 350ms;
--duration-slower: 500ms;

--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

## Interaction Patterns

### Buttons

#### Primary Button
**Purpose**: Main call-to-action
```css
.button-primary {
  background: linear-gradient(135deg, #4ea1ff, #7cf29c);
  color: #0d1321;
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: 700;
  transition: transform 150ms, box-shadow 150ms;
}

.button-primary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 20px rgba(78, 161, 255, 0.4);
}

.button-primary:active {
  transform: scale(0.98);
}
```

#### Secondary Button
**Purpose**: Alternative actions
```css
.button-secondary {
  background: rgba(255, 255, 255, 0.08);
  color: #e9ecf2;
  border: 1px solid rgba(255, 255, 255, 0.12);
}
```

#### Ghost Button
**Purpose**: Tertiary actions
```css
.button-ghost {
  background: transparent;
  color: #4ea1ff;
  padding: 8px 12px;
}
```

### Form Elements

#### Text Input
```css
.input {
  width: 100%;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: #e9ecf2;
  font-size: 16px; /* Prevents zoom on mobile */
}

.input:focus {
  outline: none;
  border-color: #4ea1ff;
  background: rgba(255, 255, 255, 0.04);
  box-shadow: 0 0 0 3px rgba(78, 161, 255, 0.1);
}

.input::placeholder {
  color: #9aa5bb;
}
```

#### Select Dropdown
- Custom styling that matches input aesthetics
- Clear dropdown indicator
- Keyboard navigable
- Option highlighting on hover/focus

### Cards

#### Standard Card
```css
.card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  transition: transform 200ms, box-shadow 200ms;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
}
```

### Loading States

#### Skeleton Screens
- Use for content-heavy pages
- Maintain layout to prevent shift
- Subtle shimmer animation

#### Spinners
- For button loading states
- For small async operations
- Sized appropriately (16px-24px)

#### Progress Bars
- For multi-step processes
- Show percentage when calculable
- Indeterminate for unknown duration

### Modals & Overlays

```css
.modal-overlay {
  background: rgba(13, 19, 33, 0.8);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.modal {
  background: #172039;
  border-radius: 20px;
  max-width: 500px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}
```

**Behavior**:
- Focus trapped within modal
- Esc key closes modal
- Click outside closes (if non-critical)
- Close button always visible

---

## Content Strategy

### Voice & Tone

#### Brand Voice
- **Encouraging**: "Great progress! Keep going."
- **Clear**: "Save your work before leaving."
- **Friendly**: "Welcome back! Ready to learn?"
- **Respectful**: Never condescending or patronizing

#### Tone Variations
- **Success**: Celebratory but not over-the-top
- **Error**: Helpful, not blaming
- **Empty states**: Motivating, not sad
- **Onboarding**: Excited, not overwhelming

### Microcopy Guidelines

#### Button Labels
- Start with verb: "Save Draft", "Delete Course", "Continue"
- Be specific: "Add Course" not "Add"
- Avoid gerunds: "Save" not "Saving" (use separate loading state)

#### Error Messages
Template: `[What happened] + [Why] + [How to fix]`

✅ Good:
> "Couldn't save your progress. Check your internet connection and try again."

❌ Bad:
> "Error 500. Please try again."

#### Empty States
Template: `[What this is] + [Why it's empty] + [Action to take]`

✅ Good:
> "No courses yet. Browse MIT OCW and add your first course to get started."

❌ Bad:
> "No results found."

### Content Hierarchy

1. **Page Title**: What page is this?
2. **Primary Content**: Main focus of the page
3. **Supporting Info**: Metadata, context
4. **Actions**: What can I do here?
5. **Help**: Where to go if stuck

---

## Implementation Guidelines

### Component Checklist
Before shipping any component:

#### Functionality
- [ ] Works without JavaScript (progressive enhancement)
- [ ] Loading states implemented
- [ ] Error states handled gracefully
- [ ] Empty states designed
- [ ] Success feedback provided

#### Accessibility
- [ ] Keyboard navigable (Tab, Enter, Esc, Arrow keys)
- [ ] Focus indicators visible
- [ ] Screen reader tested (NVDA/VoiceOver)
- [ ] ARIA labels where needed
- [ ] Color contrast ratio checked
- [ ] Text scalable to 200%
- [ ] Works with high contrast mode

#### Responsive Design
- [ ] Mobile (320px+)
- [ ] Tablet (768px+)
- [ ] Desktop (1024px+)
- [ ] Large desktop (1440px+)
- [ ] Touch target sizes (44×44px minimum)
- [ ] No horizontal scroll

#### Performance
- [ ] < 100KB total CSS
- [ ] Animations use transform/opacity only
- [ ] Images optimized (WebP with fallback)
- [ ] Lazy loading for below-fold images
- [ ] Critical CSS inlined

#### Browser Support
- [ ] Chrome (latest 2 versions)
- [ ] Firefox (latest 2 versions)
- [ ] Safari (latest 2 versions)
- [ ] Edge (latest 2 versions)
- [ ] iOS Safari (latest 2 versions)
- [ ] Chrome Android (latest version)

### Code Quality

#### CSS Best Practices
```css
/* ✅ Good: BEM-style naming */
.card--elevated { }
.card__header { }
.card__title { }

/* ❌ Bad: Overly specific */
.container div.card div.header h3 { }
```

#### Performance Animations
```css
/* ✅ Good: GPU-accelerated */
.card:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

/* ❌ Bad: Triggers layout */
.card:hover {
  margin-top: -2px;
  padding: 18px;
}
```

### Design Tokens
All design values should use CSS custom properties:
```css
/* ✅ Good */
color: var(--text-primary);
padding: var(--space-4);

/* ❌ Bad */
color: #e9ecf2;
padding: 16px;
```

### Documentation
Each component should have:
- Purpose and use cases
- Props/API documentation
- Accessibility notes
- Code examples
- Do's and don'ts

---

## Measuring Success

### Usability Metrics
- **Task Success Rate**: Can users complete core tasks?
- **Time on Task**: How quickly can users achieve goals?
- **Error Rate**: How often do users make mistakes?
- **Satisfaction**: NPS or CSAT scores

### Accessibility Metrics
- **WAVE errors**: 0 errors, 0 contrast errors
- **Lighthouse score**: 100/100 accessibility
- **Keyboard-only completion**: All tasks possible
- **Screen reader testing**: Monthly testing with users

### Design System Adoption
- **Component reuse**: % of UI using design system
- **Consistency score**: Visual audit results
- **Design debt**: Number of one-off patterns

---

## Continuous Improvement

### Regular Audits
- **Monthly**: Accessibility check (automated + manual)
- **Quarterly**: Usability testing with 5 users
- **Bi-annually**: Full design system review

### User Feedback Loops
- In-app feedback widget
- User interviews for major changes
- Analytics for drop-off points
- A/B testing for contentious decisions

### Staying Current
- Follow Nielsen Norman Group research
- Monitor WCAG updates
- Study competitor interfaces
- Attend design conferences

---

## Conclusion

These guidelines represent our commitment to human-first design. They will evolve as we learn from our users, but the core principles remain constant:

1. **Users first**: Every decision serves user needs
2. **Accessibility always**: No one left behind
3. **Consistency matters**: Patterns build trust
4. **Details count**: Polish reflects care
5. **Test with users**: Assumptions aren't facts

PocketSchool should feel like a trusted companion—intelligent, helpful, and delightful to use. These guidelines help us achieve that vision consistently across every interaction.

---

**Questions?** Contact the design team.  
**Want to contribute?** Submit a pull request with proposed updates.  
**Found an issue?** Open a GitHub issue with the `design-system` label.

---

*This document synthesizes principles from Nielsen Norman Group, Apple Human Interface Guidelines, Google Material Design, Laws of UX, and WCAG 2.1. All external principles have been adapted specifically for PocketSchool's educational context and user base.*
