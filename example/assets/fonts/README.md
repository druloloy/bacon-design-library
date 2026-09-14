# Quicksand

Bacon does not bundle Quicksand — the app registers it, because font loading is an
application concern and bundling a typeface into a library duplicates it in every consumer.

Download the four weights the Bacon system uses from Google Fonts
(<https://fonts.google.com/specimen/Quicksand>, SIL Open Font License 1.1) and place them here:

```
Quicksand-Light.ttf     300
Quicksand-Regular.ttf   400
Quicksand-Medium.ttf    500
Quicksand-Bold.ttf      700
```

Do **not** add `Quicksand-SemiBold.ttf`. Weight 600 is deliberately absent from the Bacon type
system — the identity depends on the gap between Light and Bold (Brand Guide 05).
