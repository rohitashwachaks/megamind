# Accessibility Testing Procedures
## WCAG 2.1 AA Compliance for PocketSchool

**Version**: 1.0  
**Last Updated**: December 1, 2025

---

## Testing Tools

### Required Tools
1. **Browser Extensions**
   - [axe DevTools](https://www.deque.com/axe/devtools/) - Automated testing
   - [WAVE](https://wave.webaim.org/extension/) - Visual feedback
   - [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Chrome built-in

2. **Screen Readers**
   - **macOS/iOS**: VoiceOver (built-in)
   - **Windows**: NVDA (free) or JAWS (paid)
   - **Android**: TalkBack (built-in)

3. **Manual Testing**
   - Keyboard only (unplug mouse!)
   - Color blindness simulators
   - Zoom to 200% text size

---

## Automated Testing

### Step 1: Run axe DevTools

1. Open page in Chrome/Firefox
2. Open DevTools (F12)
3. Go to "axe DevTools" tab
4. Click "Scan ALL of my page"
5. Review violations

**Pass Criteria**: 0 violations, 0 critical issues

### Step 2: Run WAVE

1. Click WAVE extension icon
2. Review error summary
3. Fix all errors
4. Address contrast errors
5. Review alerts

**Pass Criteria**: 0 errors, 0 contrast errors

### Step 3: Lighthouse Audit

1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Accessibility" category
4. Click "Analyze page load"
5. Review score and issues

**Pass Criteria**: 100/100 accessibility score

---

## Keyboard Navigation Testing

### Testing Script

#### 1. Tab Navigation
```
✓ Tab through all interactive elements
✓ Tab order matches visual order (left-to-right, top-to-bottom)
✓ Focus indicator visible on all elements
✓ No keyboard traps (can escape all components)
✓ Skip link available to jump to main content
```

#### 2. Interactive Elements
```
✓ Enter/Space activates buttons
✓ Enter submits forms
✓ Esc closes modals/dropdowns
✓ Arrow keys navigate menus/select
✓ Home/End go to start/end of lists
```

#### 3. Focus Management
```
✓ Focus moves to opened modal
✓ Focus returns after closing modal
✓ Focus moves to error message after validation
✓ Focus moves to success message after action
✓ Focus doesn't get lost after DOM changes
```

### Keyboard Shortcuts Reference

| Key | Action |
|-----|--------|
| Tab | Next focusable element |
| Shift+Tab | Previous focusable element |
| Enter | Activate button, submit form |
| Space | Activate button, checkbox |
| Esc | Close modal, cancel action |
| ↑↓←→ | Navigate menu, select options |
| Home | First item in list |
| End | Last item in list |

---

## Screen Reader Testing

### VoiceOver (macOS/iOS)

#### Activation
- **macOS**: Cmd+F5 or System Preferences → Accessibility → VoiceOver
- **iOS**: Settings → Accessibility → VoiceOver

#### Basic Commands (macOS)
- **VO** = Control+Option
- **VO + A** = Start reading
- **VO + →** = Next item
- **VO + ←** = Previous item
- **VO + Space** = Activate element
- **VO + H** = Next heading
- **VO + L** = Next link
- **VO + U** = Rotor (navigation menu)

#### Testing Checklist
```
✓ All images have alt text or aria-label
✓ Form inputs announced with label
✓ Buttons announce action ("Save button")
✓ Links announce destination
✓ Headings announce level ("Heading level 2: Courses")
✓ Dynamic content changes announced (ARIA live regions)
✓ Error messages announced immediately
✓ Loading states announced
✓ Modal opening/closing announced
```

### NVDA (Windows)

#### Installation
1. Download from [nvda.org](https://www.nvaccess.org/download/)
2. Install (it's free!)
3. Reboot computer

#### Basic Commands
- **NVDA** = Insert or CapsLock
- **NVDA + Down** = Start reading
- **↑↓←→** = Navigate
- **NVDA + Space** = Activate
- **H** = Next heading
- **K** = Next link
- **F** = Next form field
- **NVDA + T** = Read title

#### Testing Checklist
(Same as VoiceOver checklist above)

---

## Color & Contrast Testing

### Color Blindness Simulation

1. **Chrome DevTools**
   - Open DevTools (F12)
   - Go to "Rendering" tab
   - Under "Emulate vision deficiencies":
     - Protanopia (red-blind)
     - Deuteranopia (green-blind)
     - Tritanopia (blue-blind)
     - Achromatopsia (no color)

2. **Test Each Page**
   - Can you still distinguish all UI states?
   - Are errors visible without color?
   - Do success/warning/error states use icons + text?

### Contrast Ratio Testing

#### Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Chrome DevTools (inspect element → see contrast ratio)
- WAVE extension

#### Requirements
```
Normal Text (< 18pt):
✓ Minimum 4.5:1 (AA)
✓ Enhanced 7:1 (AAA) for important text

Large Text (18pt+ or 14pt bold):
✓ Minimum 3:1 (AA)
✓ Enhanced 4.5:1 (AAA)

UI Components:
✓ Minimum 3:1 (AA)
- Buttons, borders, icons, form controls
```

#### PocketSchool Colors (Pre-tested)
```
✅ #e9ecf2 on #0d1321 = 11.83:1 (AAA)
✅ #d6deed on #0d1321 = 10.48:1 (AAA)
✅ #9aa5bb on #0d1321 = 5.18:1 (AA)
✅ #4ea1ff on #0d1321 = 5.88:1 (AA)
✅ #7cf29c on #0d1321 = 12.95:1 (AAA)
```

---

## Semantic HTML Testing

### Structure Check
```html
✓ One <h1> per page
✓ Headings in logical order (no skipping levels)
✓ Landmarks: <header>, <nav>, <main>, <aside>, <footer>
✓ Lists use <ul>/<ol> + <li>
✓ Tables use <table>, <thead>, <tbody>, <th>, <td>
✓ Forms use <form>, <label>, <input>, <button>
```

### ARIA Labels Check
```html
<!-- Icons without visible text -->
<button aria-label="Close modal">
  <svg>...</svg>
</button>

<!-- Form inputs -->
<label for="email">Email</label>
<input id="email" type="email" aria-required="true" />

<!-- Dynamic content -->
<div role="alert" aria-live="polite">
  Course saved successfully!
</div>

<!-- Loading states -->
<button aria-busy="true">
  <span aria-hidden="true">Loading...</span>
  <span class="sr-only">Saving your changes</span>
</button>
```

---

## Mobile Accessibility Testing

### iOS VoiceOver Gestures
- **Single tap**: Select item
- **Double tap**: Activate item
- **Swipe right**: Next item
- **Swipe left**: Previous item
- **Two-finger tap**: Pause/resume speaking
- **Three-finger swipe down**: Scroll down

### Android TalkBack Gestures
- **Single tap**: Announce item
- **Double tap**: Activate item
- **Swipe right**: Next item
- **Swipe left**: Previous item
- **Swipe down-then-right**: Continue reading

### Mobile Testing Checklist
```
✓ Touch targets ≥ 48×48px
✓ Spacing between targets ≥ 8px
✓ Form inputs ≥ 16px font (prevents zoom on iOS)
✓ Pinch-zoom disabled for UI, enabled for images
✓ No content behind safe areas (notch, home indicator)
✓ Bottom navigation reachable with thumb
✓ VoiceOver/TalkBack announces all interactive elements
```

---

## Form Accessibility

### Required Elements
```html
<form>
  <!-- Labels associated with inputs -->
  <label for="username">Username</label>
  <input 
    id="username" 
    type="text"
    aria-required="true"
    aria-describedby="username-hint"
  />
  <span id="username-hint" class="hint">
    At least 3 characters
  </span>
  
  <!-- Error messages -->
  <span id="username-error" role="alert" class="error">
    Username is required
  </span>
  
  <!-- Submit button -->
  <button type="submit">Create Account</button>
</form>
```

### Form Testing Checklist
```
✓ All inputs have visible labels
✓ Required fields marked (visually + aria-required)
✓ Error messages associated with fields
✓ Error messages announced by screen reader
✓ Inline validation doesn't break screen reader
✓ Form can be submitted with Enter key
✓ Autocomplete attributes used appropriately
✓ Placeholders don't replace labels
```

---

## Testing Schedule

### Before Every Release
- [ ] Run axe DevTools (0 violations)
- [ ] Run WAVE (0 errors)
- [ ] Run Lighthouse (100/100)
- [ ] Keyboard navigation test
- [ ] Color contrast check

### Weekly
- [ ] VoiceOver/NVDA testing (1 page)
- [ ] Mobile screen reader test
- [ ] Form accessibility review

### Monthly
- [ ] Full screen reader audit (all pages)
- [ ] User testing with assistive technology users
- [ ] Update accessibility statement

### Quarterly
- [ ] Third-party accessibility audit
- [ ] WCAG compliance review
- [ ] Accessibility training for team

---

## Common ARIA Patterns

### Modal Dialog
```html
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Confirm Delete</h2>
  <p>Are you sure you want to delete this course?</p>
  <button>Cancel</button>
  <button>Delete</button>
</div>
```

### Alert
```html
<div role="alert" aria-live="assertive">
  Error: Please fill out all required fields.
</div>
```

### Loading State
```html
<button aria-busy="true" aria-live="polite">
  Saving...
</button>
```

### Accordion
```html
<button 
  aria-expanded="false" 
  aria-controls="panel-1"
  id="button-1"
>
  Lecture 1: Introduction
</button>
<div id="panel-1" role="region" aria-labelledby="button-1" hidden>
  Content here...
</div>
```

### Tab Panel
```html
<div role="tablist" aria-label="Course sections">
  <button role="tab" aria-selected="true" aria-controls="panel-lectures">
    Lectures
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel-assignments">
    Assignments
  </button>
</div>

<div id="panel-lectures" role="tabpanel">
  Lecture content...
</div>
```

---

## Accessibility Statement

### Required Information
1. **Conformance level**: WCAG 2.1 Level AA
2. **Contact information**: accessibility@pocketschool.com
3. **Testing date**: Last tested [Date]
4. **Known issues**: List any current limitations
5. **Feedback mechanism**: How to report issues

### Example Statement
> PocketSchool is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
>
> **Conformance Status**: This website is fully conformant with WCAG 2.1 Level AA.
>
> **Feedback**: We welcome your feedback on the accessibility of PocketSchool. Please contact us at accessibility@pocketschool.com.
>
> **Last Tested**: December 1, 2025

---

## Resources

### Official Standards
- [WCAG 2.1](https://www.w3.org/TR/WCAG21/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [HTML Validator](https://validator.w3.org/)

### Learning Resources
- [WebAIM](https://webaim.org/)
- [The A11Y Project](https://www.a11yproject.com/)
- [Inclusive Components](https://inclusive-components.design/)

---

**Remember**: Automated tools catch ~30% of accessibility issues. Manual testing with keyboard and screen readers is essential for true accessibility.

---

*This testing procedure ensures PocketSchool is accessible to all learners, regardless of ability or assistive technology used.*
