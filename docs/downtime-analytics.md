# Downtime website analytics

## Activate GA4

1. Create or select a Google Analytics account and GA4 property.
2. Create a web data stream for https://ariapar.me/downtime/.
3. Copy the stream's Measurement ID (G-…) into _data/downtime/analytics.json.
4. Run `python3 tools/localize-downtime.py` to update both languages.
5. Build, test, and deploy.

An empty Measurement ID disables the integration, including the consent banner.
The ID is public configuration, not an API secret.

## Reports

The website sends normal page views and the custom event `app_store_click`.
Create event-scoped custom dimensions for these parameters in GA4:

- `placement`: header, hero, pricing, final_cta, guide_cta, footer, or content.
- `site_language`: the language of the page, independently of browser language.
- `ppid`: the custom App Store product page ID, when present.

UTM campaign parameters use GA4's standard attribution. If useful, mark
`app_store_click` as a key event. It measures an outbound click, not an app
install; downloads remain in App Store Connect reporting.

## Visitor choices

No Google tag loads before a visitor allows website analytics. Advertising
consent remains denied, and Google signals and ad personalization are disabled.
The footer's Analytics preferences control reopens the choice. Choices expire
after 180 days; declining disables collection and clears this site's GA cookies.
App analytics consent and website consent are independent.

Language redirects skip analytics on the source page so one landing does not
produce English and German page views. Query strings sent as page locations
include only UTM campaign parameters and a validly shaped ppid.

## Verify after activation

Use GA4 Realtime or DebugView/Tag Assistant after allowing analytics. Test a
badge click and check app_store_click and its parameters. Also verify that
declining analytics produces no Google Analytics requests. Custom dimensions
need processing time before they appear in standard reports.
