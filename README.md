# Santosha Nutrition — website design preview

A clickable preview of the new website design for [Santosha Nutrition](https://www.santoshanutrition.com), Chef Liz Murphy's plant-based cooking business in Vista, California.

This is a design preview, not the live site. Pages are marked `noindex` so search engines leave them out, the contact form doesn't send anything, and the cart and gift certificate buttons aren't connected to a checkout.

## Pages

| Page | Path |
| --- | --- |
| Home | `/` |
| Cooking classes | `/cooking-classes/` |
| Catering, farm-to-table and menu consulting | `/catering/` |
| Events | `/events/` |
| Cookbook and gift certificates | `/cookbook/` |
| About Liz, media and testimonials | `/about/` |
| Contact and FAQ | `/contact/` |

## How it's built

Every page is plain HTML with no build step.

- `assets/css/tokens.css` holds the design tokens: colors for light and dark themes, the type scale (Aleo and Sofia Sans Semi Condensed), spacing, radii and shadows.
- `assets/css/components.css` and `assets/js/santosha.js` are the Santosha component library (header, hero, cards, testimonials, FAQ, forms, footer), written in React 18.
- Each page keeps its layout in a `<template>` that names the components it uses. `assets/js/dc-runtime.js` turns that template into the page.
- Photos, video and fonts live in `assets/`. The photos are Santosha Nutrition's own and are sized for the web.

## Run it locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Credits

- Photography and video © Santosha Nutrition. Photo of Liz in the garden by B. Vance for Edible San Diego.
- Aleo and Sofia Sans Semi Condensed are licensed under the SIL Open Font License (see `assets/fonts/`).
- React 18.3.1, MIT License.
