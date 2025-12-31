# Content Management System

This website uses a centralized content configuration file (`content.js`) to manage all text content across the site. This makes it easy to update content without editing HTML files.

## How It Works

1. **content.js** - Contains all text content organized by section
2. **content-loader.js** - Automatically populates HTML elements with content from `content.js`

## Quick Start

### 1. Include Scripts in HTML

Add these scripts to your HTML `<head>` section (before `</head>`):

```html
<script src="content.js"></script>
<script src="content-loader.js"></script>
```

### 2. Update Content

Simply edit `content.js` and change the values. The content will automatically update on all pages when you reload.

**Example:** To change the company name, edit `content.js`:
```javascript
company: {
    name: "Your New Company Name",  // Change this
    // ...
}
```

## Two Ways to Use Content

### Method 1: Automatic (Current Setup)

The content-loader automatically populates elements based on CSS selectors. This is already set up for the main pages.

### Method 2: Data Attributes (Recommended for New Content)

Add `data-content` attributes to HTML elements for more control:

```html
<!-- Text content -->
<h1 data-content="hero.tagline">Default text</h1>
<p data-content="hero.credibility">Default description</p>

<!-- HTML content (use data-content-html) -->
<div data-content="contact.description" data-content-html>Default HTML</div>

<!-- Attributes -->
<a data-content="footer.contact.email" data-content-attr="href" data-content-attr-value="mailto:">Email</a>
```

**Path Format:** Use dot notation to access nested properties:
- `hero.tagline` → `SiteContent.hero.tagline`
- `services.intro.mission.title` → `SiteContent.services.intro.mission.title`
- `footer.contact.email` → `SiteContent.footer.contact.email`

### Content Structure

The `content.js` file is organized into sections:
- `company` - Company name, tagline, descriptions
- `nav` - Navigation labels
- `hero` - Hero section content
- `services` - Services section content
- `affiliates` - Partners/affiliates content
- `blog` - Blog/insights content
- `leadership` - Leadership section content
- `contact` - Contact section content
- `footer` - Footer content
- `servicesPages` - Individual service page content
- `partnersPages` - Partner page content

## Examples

### Example 1: Updating Company Name

Edit `content.js`:
```javascript
company: {
    name: "Your New Company Name",  // Change this
    tagline: "YOUR NEW TAGLINE",
    // ...
}
```

This automatically updates:
- Navbar company name
- Footer company name
- Page titles (if not customized)

### Example 2: Adding a New Service

1. Add to `content.js` in `services.items` array:
```javascript
services: {
    items: [
        // ... existing services ...
        {
            title: "New Service Name",
            description: "Service description here.",
            link: "com/services/new-service.html"
        }
    ]
}
```

2. Add a new service card to `index.html` in the `.product-grid` section.

3. The content-loader will automatically populate the card content.

### Example 3: Updating Hero Section

Edit `content.js`:
```javascript
hero: {
    tagline: "YOUR NEW HERO TAGLINE",
    credibility: "Your new credibility statement.",
    cta: "Get Started"  // Button text
}
```

### Example 4: Using Data Attributes

In your HTML:
```html
<h1 data-content="hero.tagline">Default Tagline</h1>
<p data-content="hero.credibility">Default credibility text</p>
```

The content-loader will replace the default text with content from `content.js`.

### Manual Override

If you need to keep specific content in HTML (for SEO or other reasons), you can:
- Add `data-content-ignore` attribute to skip auto-population
- Or use `data-custom-title` on title elements to prevent auto-update

## Benefits

✅ **Single source of truth** - All content in one file
✅ **Easy updates** - Change content without touching HTML
✅ **Consistency** - Same content across all pages
✅ **Version control** - Easy to track content changes
✅ **Translation ready** - Can easily add multiple language support

## Notes

- Content is loaded via JavaScript, so it requires JavaScript to be enabled
- For SEO-critical content, consider keeping it in HTML or using server-side rendering
- The content-loader runs on page load, so content appears after JavaScript executes

