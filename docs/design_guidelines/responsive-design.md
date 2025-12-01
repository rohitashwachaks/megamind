# Responsive Design Specification

## PocketSchool Breakpoints & Behavior

**Version**: 1.0  
**Last Updated**: December 1, 2025

---

## Breakpoints

### Mobile First Approach

Design for mobile first, then progressively enhance for larger screens.

```css
/* Base styles: Mobile (320px+) */
:root {
  --container-max: 100%;
  --grid-columns: 1;
  --spacing-page: 16px;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  :root {
    --container-max: 720px;
    --grid-columns: 2;
    --spacing-page: 24px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  :root {
    --container-max: 960px;
    --grid-columns: 3;
    --spacing-page: 32px;
  }
}

/* Large Desktop (1440px+) */
@media (min-width: 1440px) {
  :root {
    --container-max: 1100px;
    --grid-columns: 4;
    --spacing-page: 40px;
  }
}
```

---

## Responsive Typography

### Scale by Breakpoint

```css
/* Mobile: Smaller, more compact */
@media (max-width: 767px) {
  :root {
    --text-xs: 11px;
    --text-sm: 13px;
    --text-base: 16px;  /* Never below 16px for mobile */
    --text-lg: 18px;
    --text-xl: 20px;
    --text-2xl: 24px;
    --text-3xl: 28px;
    --text-4xl: 32px;
  }
}

/* Tablet: Moderate scale */
@media (min-width: 768px) and (max-width: 1023px) {
  :root {
    --text-xs: 12px;
    --text-sm: 14px;
    --text-base: 16px;
    --text-lg: 18px;
    --text-xl: 22px;
    --text-2xl: 26px;
    --text-3xl: 30px;
    --text-4xl: 36px;
  }
}

/* Desktop: Full scale (default) */
@media (min-width: 1024px) {
  :root {
    --text-xs: 12px;
    --text-sm: 14px;
    --text-base: 16px;
    --text-lg: 18px;
    --text-xl: 22px;
    --text-2xl: 28px;
    --text-3xl: 32px;
    --text-4xl: 40px;
  }
}
```

---

## Layout Patterns

### Navigation

#### Mobile (< 768px)

- Bottom navigation bar (reachable with thumb)
- Hamburger menu for secondary nav
- Floating action button for primary action

```css
.nav-mobile {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: rgba(13, 19, 33, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: env(safe-area-inset-bottom); /* iPhone notch */
}
```

#### Tablet (768px - 1023px)

- Side navigation drawer (swipe or tap to open)
- Top app bar with primary actions
- Content area = 100% - nav width

#### Desktop (1024px+)

- Persistent left sidebar navigation
- Top app bar with search and user menu
- Content area centers with max-width

### Grid System

```css
.grid-responsive {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(var(--grid-columns), 1fr);
}

/* Mobile: Stack everything */
@media (max-width: 767px) {
  .grid-responsive {
    grid-template-columns: 1fr;
  }
}

/* Tablet: 2 columns for most content */
@media (min-width: 768px) and (max-width: 1023px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 3 columns default */
@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Large: 4 columns for cards */
@media (min-width: 1440px) {
  .grid-responsive--cards {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

## Touch Target Sizes

### Minimum Sizes by Platform

```css
/* iOS: 44×44pt (Apple HIG) */
.touch-target-ios {
  min-width: 44px;
  min-height: 44px;
}

/* Android: 48×48dp (Material Design) */
.touch-target-android {
  min-width: 48px;
  min-height: 48px;
}

/* Web: Use larger of the two */
.touch-target {
  min-width: 48px;
  min-height: 48px;
  /* Add padding if visual element is smaller */
  padding: var(--space-3);
}
```

### Spacing Between Touch Targets

- Minimum 8px between adjacent targets
- Ideal 16px for comfortable tapping

---

## Mobile-Specific Patterns

### Pull to Refresh

```css
.pull-to-refresh {
  overscroll-behavior-y: contain;
  /* Implement with JavaScript */
}
```

### Swipe Gestures

- **Swipe left**: Delete item (with visual feedback)
- **Swipe right**: Archive/complete item
- **Swipe down**: Refresh content
- **Pinch zoom**: Disabled for UI, enabled for images

### Bottom Sheet

```css
.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #172039;
  border-radius: 20px 20px 0 0;
  padding: var(--space-6);
  padding-bottom: calc(var(--space-6) + env(safe-area-inset-bottom));
  max-height: 90vh;
  overflow-y: auto;
  transform: translateY(100%);
  transition: transform 300ms ease-out;
}

.bottom-sheet.is-open {
  transform: translateY(0);
}
```

---

## Image Optimization

### Responsive Images

```html
<picture>
  <!-- Mobile: Small, optimized -->
  <source 
    media="(max-width: 767px)" 
    srcset="image-small.webp 1x, image-small@2x.webp 2x"
    type="image/webp"
  />
  
  <!-- Tablet: Medium -->
  <source 
    media="(min-width: 768px) and (max-width: 1023px)" 
    srcset="image-medium.webp 1x, image-medium@2x.webp 2x"
    type="image/webp"
  />
  
  <!-- Desktop: Large -->
  <source 
    media="(min-width: 1024px)" 
    srcset="image-large.webp 1x, image-large@2x.webp 2x"
    type="image/webp"
  />
  
  <!-- Fallback -->
  <img src="image-medium.jpg" alt="Descriptive text" loading="lazy" />
</picture>
```

### Image Sizing Guidelines

- **Mobile**: Max 640px wide
- **Tablet**: Max 1024px wide
- **Desktop**: Max 1440px wide
- **Quality**: WebP at 80% quality
- **Fallback**: JPEG at 85% quality

---

## Orientation Changes

### Portrait vs. Landscape (Mobile/Tablet)

```css
/* Portrait: Stack vertically */
@media (orientation: portrait) {
  .content-split {
    flex-direction: column;
  }
}

/* Landscape: Side by side */
@media (orientation: landscape) and (max-width: 1023px) {
  .content-split {
    flex-direction: row;
  }
  
  /* Reduce header/footer height */
  .topbar {
    height: 56px;
  }
}
```

---

## Performance Considerations

### Critical CSS

Inline critical CSS for above-the-fold content:

```html
<style>
  /* Critical: First paint styles */
  body {
    margin: 0;
    background: #0d1321;
    color: #e9ecf2;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  
  .topbar {
    position: sticky;
    top: 0;
    background: rgba(13, 19, 33, 0.9);
    padding: 14px 20px;
  }
</style>
```

### Lazy Loading

```html
<!-- Below-the-fold images -->
<img src="thumbnail.jpg" loading="lazy" alt="..." />

<!-- Below-the-fold iframes -->
<iframe src="video.html" loading="lazy"></iframe>
```

---

## Testing Checklist

### Responsive Testing

- [ ] iPhone SE (375×667) - Smallest modern phone
- [ ] iPhone 14 Pro (393×852) - Modern iPhone
- [ ] iPad (768×1024) - Tablet portrait
- [ ] iPad (1024×768) - Tablet landscape
- [ ] Desktop (1280×720) - Small laptop
- [ ] Desktop (1920×1080) - Standard desktop
- [ ] Desktop (2560×1440) - Large desktop

### Device-Specific Testing

- [ ] iOS Safari (latest)
- [ ] Android Chrome (latest)
- [ ] Samsung Internet Browser
- [ ] Desktop browsers (Chrome, Firefox, Safari, Edge)

### Interaction Testing

- [ ] Touch gestures work smoothly
- [ ] Hover states don't break on touch
- [ ] Forms work with on-screen keyboard
- [ ] Navigation accessible with keyboard
- [ ] Orientation changes don't break layout

---

## Common Pitfalls to Avoid

### ❌ Don't

1. **Use fixed pixel widths** - Use percentages or max-width
2. **Forget viewport meta tag** - `<meta name="viewport" content="width=device-width, initial-scale=1">`
3. **Ignore safe areas** - iOS notch and gesture bar
4. **Use hover-only interactions** - Provide touch alternatives
5. **Set font-size below 16px on mobile** - Causes zoom on focus
6. **Forget landscape orientation** - Test both portrait and landscape
7. **Use horizontal scroll** - Always prevent horizontal overflow
8. **Ignore device capabilities** - Check for touch, motion sensors
9. **Hard-code breakpoints in JS** - Use CSS custom properties
10. **Test only on simulator** - Always test on real devices

### ✅ Do

1. **Mobile-first CSS** - Base styles for mobile, enhance for desktop
2. **Use relative units** - rem, em, %, vw/vh
3. **Test on real devices** - Simulators miss performance issues
4. **Optimize images** - Use WebP, lazy loading, responsive images
5. **Use system fonts** - Faster load, familiar to users
6. **Respect user preferences** - Dark mode, reduced motion, font size
7. **Progressive enhancement** - Core functionality without JS
8. **Touch-friendly spacing** - 48px minimum touch targets
9. **Consider thumb zones** - Easy-to-reach areas on mobile
10. **Monitor performance** - Lighthouse scores, Core Web Vitals

---

*This responsive design specification ensures PocketSchool works seamlessly across all devices and screen sizes, providing an optimal learning experience whether on phone, tablet, or desktop.*
