---
title: 'How Neurons Decide'
description: 'A from-scratch look at the integrate-and-fire model and the threshold where a thought becomes a spike.'
tags: ['biology', 'data']
date: 2025-11-15
---

A neuron spends its time listening. Inputs arrive, nudging its voltage up and
down, until — at a critical threshold — it fires a spike and resets. That spike
is the atom of thought.

## Integrate and fire

The simplest useful model treats the neuron as a leaky bucket: signals pour in,
charge leaks out, and when the level crosses a line, the neuron fires. Crude,
but it captures the essential nonlinearity of *deciding*.

From this one rule, networks of neurons can compute, remember, and learn.
