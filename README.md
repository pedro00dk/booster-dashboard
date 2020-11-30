# Booster Dashboard

Small dashboard to show github project metrics.

### Instructions

You may start a local development server with `npm run serve`.

A production build can also be produced with the following command `npm run build`.
The built application will be located at `dist/build`, and may be served by any http server such as nginx.

### Usage

Not a lot to do, just type the name of a github user or organization in the "Username or Organization" field, the repository name in the field below, and press Enter.

### General Notes

-   I am using emotion for styling, and although this library provide a package exclusive for react (@emotion/react), I do not like using libraries that do not work standalone. Hence, I decided to use @emotion/css
-   The column ticks in the vertical axis of the column chart do not follow a linear scale, my implementation does
-   The 0 tick in the column chart is missing the hour label ('h'), I also removed for this tick
-   I am using the chart.js as plotting library, this library is not the most flexible in terms of layout (it uses canvas), but it is small, with good animations, and the default charts are similar to the ones in the mockup
-   chart.js slightly changes the bar color (I do not know the cause yet), so I had to change the color in the code to match the expected color (rgb(76, 155, 255) -> rgb(93, 131, 255))
-   All react component files have a `classes` object in the beginning, it is just a collection of precomputed classNames, when I need some dynamic styling, I use the `style` field.
-   I used Helvetica font for everything. I saw the mockup uses the San Francisco font in a few elements, but it is an Apple font, with licencing issues: "You may use the Apple Font solely for creating mock-ups of user interfaces to be used in software products running on Apples iOS or OS X operating systems, as applicable. "
