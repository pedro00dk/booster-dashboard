# Booster Dashboard

Small dashboard to show github project metrics.

### General Notes

-   I am using emotion for styling, and although this library provide a package exclusive for react (@emotion/react), I do not like using libraries that do not work standalone. Hence, I decided to use @emotion/css
-   Bootstrap is fetched through CDN rather than npm, promoting smaller bundle size and faster load times due to browser caching
-   The column ticks in the vertical axis of the column chart do not follow a linear scale, my implementation does
-   The 0 tick in the column chart is missing the hour label ('h'), I also removed for this tick
-   The chart API I am using slightly changes the bar color (I do not know the cause yet), so I had to change the color in the code to match the expected color (rgb(76, 155, 255) -> rgb(93, 131, 255))
-   React component files have a `classes` field in the beginning, it is just a collection of precomputed classNames, when I need some dynamic styling, I use the `style` field.
-   I used Helvetica font for everything. I saw the mockup uses the San Francisco font in a few elements, but it is an Apple font, with licencing issues: "You may use the Apple Font solely for creating mock-ups of user interfaces to be used in software products running on Apples iOS or OS X operating systems, as applicable. "
