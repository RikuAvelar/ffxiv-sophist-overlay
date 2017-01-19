FFXIV Sophist Overlay
===

_For use with Rainbow Mage Overlay Plugin_

Sophist Overlay was created as a subtle addition to the game's UI. Its appearance mimics that of the in-game HP/MP bars, and spaces itself out depending on the settings given (to correspond with your UI)

The idea was originally to have an overlay that did not distract me too much by not showing me directly other people's DPS. Naturally, one of the improvements I later made was to show other people's DPS, so that point's moot. Still, it shouldn't take up too much space or be too visually distracting as compared to some other alternatives.

![DPS Meter Example](https://snag.gy/JA0G4N.jpg)

By default, the information shown corresponds to your DPS, with an extra bar to give you a rough idea of your Crit Percentage, and a visual representation of everyone's scale compared to each other. Plus, it even has a nice addition for Healers.

## Setup

Download the latest release in the releases tab, and edit rainbow mage's overlay to point to `bar-overlay.html`

Before starting, it is a good idea to customize a few settings. These can be found in `settings.js`

- **Default Settings** : The default settings should correspond to FF14 defaults. This should show a new bar for everyone's DPS in the group. The size of the bar represents your DPS compared to the top in your group. The darker bar on top is your Crit Percentage. If you have changed how your parties get sorted, adjust said file as required.
- **Role Sort** : Role sort is the first sorting option that appears in the UI Customization. THD represents Tank, Healer, DPS - the first letter of each in order.
- **Job Sort** : This is the extra menu in which you specify which job comes first in each role.
- **Show HPS** : showHPS makes the healer bars appear as golden HPS bars. The size of their bar is how much overheal they're doing (bigger bar = less overheal). The darker bar is still crit percent.
- **UI Size** : uiSize is the size of the party list you are using. This should adjust size of bars and spacing in between.
- **Show Party** : showParty is the option to show the rest of your group, or just your own values. If you are in alliance content and your parse is not limited to your party, it will show your DPS and either the top or second top

## FAQ

**Why does the font look different than the ingame one?**

This is actually a licensing issue. The ingame font used is called Eurostile Extended, and is actually a paid font. I can't upload it without risk of the men in suits offering me a nice grave. However, if you happen to acquire the font, you just need to place it within the `lib/` folder as `eurostile-ext.ttf`, and it should automatically be loaded by the css (may require reloading the FFXIV Overlay plugin if you currently have it running)

## Roadmap

- [ ] Create proper build scripts and whatnot for development
- [ ] Create a UI based settings editor for easier adjustments
- [ ] Optimize mapping function in order to lower CPU costs
- [ ] Find way to parse your own party in 24 man
- [ ] If above is discovered, find way to show other Alliance DPS, to compare group DPS
