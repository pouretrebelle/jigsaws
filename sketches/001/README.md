---
datePublished: 2020-09-25
youTubeLink: https://youtu.be/g2ldt_mDSXA

designNoiseSeeds: ['rtb', 'wzn', 'tii', 'xnq', 'qgo', 'enq']
cutNoiseSeeds: ['rsj', 'gbc', 'ptu', 'hnw']
accentColor: '#E45566'

pieces: 196
---

# 001

![canvas](result/001_rtb-wzn-tii-xnq-qgo-enq_rsj-gbc-ptu-hnw.png?raw=true)

For my first series of jigsaws I wanted to use a classic jigsaw pattern so I could explore what makes traditional jigsaws so engaging - what levels of complexity in colour, shape, and texture hit the sweet spot between a puzzle being boring because it's too easy and frustrating because it's too hard?

The jigsaw pattern is created using a cartesian grid where each of the cross points is distorted by layers of 2D simplex noise, the distortion is softened towards the outside to make the edge pieces more uniform in shape. To make the pieces lines are drawn between each of the points, adding a tab that points in a random direction. The first pass of this algorithm is lightweight - there's no intelligent mapping to ensure the pieces are similar sizes or to avoid pieces with four or zero tabs.

The design for this puzzle is inspired by [one of my first generative art sketches](https://twitter.com/charlotte_dann/status/785482524621467650). It uses wondering worms (curving at a constant speed but changing direction every now and then) where the head of each worm is drawn as two circles offset from one another, resulting in a crescent hatching between the two layers. The vibrant colours and bold shapes made this a joy to solve.
