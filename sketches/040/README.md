---
datePublished: 2021-07-30
youTubeLink: https://youtu.be/5WQInF7xCa8

designNoiseSeeds: [pnx, hrz]
cutNoiseSeeds: [bhn, cca, rii]
accentColor: '#e096d2'

pieces: 225
timeToSolve: 59:30
---

# 040

![canvas](https://res.cloudinary.com/abstract-puzzles/image/upload/w_2000/040_pnx-hrz_bhn-cca-rii?raw=true)

In 038 and 039 there was a small bug in the design algorithm which would occasionally result in glitchy hourglass shapes at the edges of the colour bands. For this design I wanted to lean in to that by keeping a small grid but increasing the fidelity of the noise, so there would be more glitches. I like how this spread out the colour groups more across the design.

This uses the same Voronoi-based cut algorithm I've been developing since 038 but increases the distortion of the initial piece centers, leading to a much more varied piece shapes. To ensure the design creates contiguous, laser-cut-able pieces I added collision detection for the tabs; each tab has a preferred side but will flip if it's too close to an edge or another tab, and for edges where there's no safe place to position a tab it's replaced with a curve instead.

Overall I thought this was a really effective puzzle. Although it was still quite easy to follow the islands of colour outwards band by band, the intermix of the colours made this more challenging, and I often found myself searching for pieces by edge length and corner angles rather than colour. I think the range of piece shapes and particularly the amount of edges (and tabs) on each piece, is what makes this puzzle a triumph.
