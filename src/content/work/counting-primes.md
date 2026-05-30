---
title: 'Counting Primes, Slowly and Quickly'
description: 'From trial division to the sieve of Eratosthenes — benchmarking how fast we can find primes.'
tags: ['math', 'data']
date: 2026-03-30
---

How many primes are there below one million? The answer is 78,498 — but
*how you count them* reveals a lot about algorithmic thinking.

## Trial division

The naive approach checks every number for divisors. It works, but it is slow:
the cost grows roughly with the square root of each candidate.

## The sieve of Eratosthenes

Over two thousand years old and still elegant: cross out the multiples of each
prime in turn, and whatever survives is prime. It trades memory for speed and
leaves trial division far behind.
