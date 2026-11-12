# Santosha Nutrition — website design preview

A clickable preview of the new website design for [Santosha Nutrition](https://www.santoshanutrition.com), Chef Liz Murphy's plant-based cooking business in Vista, California.

This is a design preview, not the live site. Pages are marked `noindex` so search engines leave them out, and the contact form doesn't send anything.

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
| Order confirmed (after Square checkout) | `/thank-you/` |

## How it's built

Every page is plain HTML with no build step.

- `assets/css/tokens.css` holds the design tokens: colors for light and dark themes, the type scale (Aleo and Sofia Sans Semi Condensed), spacing, radii and shadows.
- `assets/css/components.css` and `assets/js/santosha.js` are the Santosha component library (header, hero, cards, testimonials, FAQ, forms, footer), written in React 18.
- Each page keeps its layout in a `<template>` that names the components it uses. `assets/js/dc-runtime.js` turns that template into the page.
- Photos, video and fonts live in `assets/`. The photos are Santosha Nutrition's own and are sized for the web.

## Checkout with Square

The cookbook and the two class gift certificates are sold through Square payment links. Each Buy button opens Square's own secure checkout for that one product, so there's no cart and no payment code on this site. Square's checkout page can't change the quantity, so larger cookbook orders go through the contact page.

To turn checkout on:

1. In Liz's Square Dashboard, go to **Payment links → Create link → Sell an item** and make three links:
   - Kitchen Contentment cookbook, $40.00. Collect a shipping address and add a shipping fee.
   - Cooking class gift certificate for 1, $125.00.
   - Cooking class gift certificate for 2, $200.00.
2. In each link's settings, turn on **Redirect to a website after checkout** and enter the site's `/thank-you/` page.
3. Paste the three links into [`assets/js/square-links.js`](assets/js/square-links.js) and commit.

Until a link is filled in, its Buy button goes to the contact page and the note under it says online checkout is coming soon.

## Run it locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Credits

- Photography and video © Santosha Nutrition. Photo of Liz in the garden by B. Vance for Edible San Diego.
- Aleo and Sofia Sans Semi Condensed are licensed under the SIL Open Font License (see `assets/fonts/`).
- React 18.3.1, MIT License.
