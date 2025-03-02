# ThemeProvider should always have the following features:

1) When the page loads, the authors that match the current user.id are retrieved from the database. Of the authors retrieved, the author with "primary" set to true should set the theme of the layout via ThemeProvider.
2) If the author.theme is NOT set to custom, it should check the string in author.theme against the available preset themes and apply the relevant theme.
3) If the author.theme IS set to custom, the auther.custome_theme property should be parsed and shadcn/tailwind color properties should be set with the provided colors.
4) If there is  more than one author, there should be a selecter that can be used to switch authors.
5) WHen authors are switched, their primary should be set to true, and all other authors with that user id should be set to primary false so that when there is a refresh, the author is retained.
6) When author is changed, there should be a refresh to reset the layout.
7) When a custom preset is changed, the name of the theme should be stored in the active author's theme property
8) When selecting a custom preset, that preset should only be pushed to the author that is currently active
9) Do not add any loading states, like loading author profiles