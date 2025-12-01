# PocketSchool Design System Quick Reference
**One-page cheat sheet for designers and developers**

---

## 🎨 Colors

### Brand
```css
--primary-gradient: linear-gradient(135deg, #4ea1ff, #7cf29c);
--brand-blue: #4ea1ff;
--brand-green: #7cf29c;
```

### Text
```css
--text-primary: #e9ecf2;     /* Main content */
--text-secondary: #d6deed;   /* Supporting */
--text-tertiary: #9aa5bb;    /* Muted */
```

### Backgrounds
```css
--bg-primary: #0d1321;       /* Page background */
--bg-secondary: #172039;     /* Elevated surfaces */
--surface: rgba(255,255,255,0.04); /* Cards */
```

### Semantic
```css
--success: #7cf29c;
--warning: #ffb347;
--error: #ff3b30;
--info: #4ea1ff;
```

---

## 📐 Spacing
**4px baseline grid**
```css
4px  8px  12px  16px  20px  24px  32px  40px  48px  64px  80px
 1    2     3     4     5     6     8    10    12    16    20
```

---

## ✏️ Typography

### Font Family
```css
font-family: 'Space Grotesk', 'SF Pro', 'Segoe UI', sans-serif;
```

### Scale
| Size | px | Usage |
|------|-----|-------|
| xs   | 12px | Helper text |
| sm   | 14px | Secondary |
| base | 16px | Body |
| lg   | 18px | Emphasized |
| xl   | 22px | Section |
| 2xl  | 28px | Page title |
| 3xl  | 32px | Hero |

### Weights
```css
400 (normal), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)
```

---

## 🔘 Buttons

### Primary
```css
background: linear-gradient(135deg, #4ea1ff, #7cf29c);
color: #0d1321;
padding: 10px 16px;
border-radius: 12px;
font-weight: 700;
```

### Secondary
```css
background: rgba(255,255,255,0.08);
color: #e9ecf2;
border: 1px solid rgba(255,255,255,0.12);
```

### Sizes
- **Touch targets**: 48×48px minimum
- **Small**: 32px height
- **Medium**: 40px height (default)
- **Large**: 48px height

---

## 📦 Cards

```css
background: rgba(255,255,255,0.04);
border: 1px solid rgba(255,255,255,0.06);
border-radius: 16px;
padding: 16px;
box-shadow: 0 10px 30px rgba(0,0,0,0.25);
```

**Hover**: `translateY(-2px)` + stronger shadow

---

## 🎬 Animations

### Durations
```css
--fast: 150ms;
--normal: 250ms;
--slow: 350ms;
```

### Easings
```css
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Motion Preference
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

---

## 📱 Breakpoints

| Device | Min Width | Columns | Container |
|--------|-----------|---------|-----------|
| Mobile | 320px | 1 | 100% |
| Tablet | 768px | 2 | 720px |
| Desktop | 1024px | 3 | 960px |
| Large | 1440px | 4 | 1100px |
```

---

## ♿ Accessibility

### Contrast Ratios
- Normal text: **4.5:1** minimum
- Large text (18pt+): **3:1** minimum
- UI components: **3:1** minimum

### Focus States
```css
outline: 2px solid #4ea1ff;
outline-offset: 2px;
```

### ARIA Checklist
- [ ] Alt text on images
- [ ] Labels on form inputs
- [ ] Heading hierarchy (H1-H6)
- [ ] Keyboard navigable
- [ ] Screen reader tested

---

## 🎯 Nielsen's Heuristics (Quick)

1. **System Status** - Show loading/progress
2. **Real World** - Use familiar terms
3. **Control** - Provide undo/cancel
4. **Consistency** - Keep patterns same
5. **Prevention** - Validate inputs
6. **Recognition** - Don't require memory
7. **Efficiency** - Shortcuts for experts
8. **Minimalism** - Remove unnecessary
9. **Error Recovery** - Clear error messages
10. **Help** - Contextual documentation

---

## 🔍 Laws of UX (Quick)

- **Hick's Law**: ↓ options = ↓ decision time
- **Fitts's Law**: Bigger/closer = easier to click
- **Miller's Law**: 7±2 items in memory
- **Jakob's Law**: Users expect familiarity
- **Serial Position**: First & last remembered

---

## 📋 Component Checklist

Before shipping:
- [ ] Keyboard accessible
- [ ] Focus visible
- [ ] Screen reader tested
- [ ] Mobile responsive (320px+)
- [ ] Touch targets 48×48px
- [ ] Loading state
- [ ] Error state
- [ ] Empty state
- [ ] Success feedback
- [ ] WCAG AA compliant

---

## 💡 Quick Tips

### Do's ✅
- Mobile-first design
- Test on real devices
- Use semantic HTML
- Provide alt text
- Show system status
- Allow undo
- Use consistent patterns

### Don'ts ❌
- Use color alone for meaning
- Require memory recall
- Trap keyboard focus
- Use jargon
- Hide critical actions
- Ignore empty states
- Forget error messages

---

## 🎨 Brand Voice

- **Encouraging** - "Great progress!"
- **Clear** - "Save your work"
- **Friendly** - "Welcome back!"
- **Respectful** - Never condescending

---

## 🔗 Related Docs

- Full guidelines: `guidelines.md`
- Responsive design: `responsive-design.md`
- Accessibility: `accessibility-testing.md`
- Components: `components.md`

---

**Version**: 1.0 | **Updated**: Dec 1, 2025 | **Source**: PocketSchool Design System
