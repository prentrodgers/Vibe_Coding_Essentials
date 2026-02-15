#!/usr/bin/env python3
import argparse, math

def is_prime(n: int) -> bool:
    if n < 2: return False
    if n % 2 == 0: return n == 2
    r = math.isqrt(n)
    for i in range(3, r + 1, 2):
        if n % i == 0:
            return False
    return True

def main():
    p = argparse.ArgumentParser(description="Print primes in a range")
    p.add_argument('start', type=int, nargs='?', default=0, help='start of range (or end if only one arg given)')
    p.add_argument('end',   type=int, nargs='?', default=11, help='end of range (inclusive)')
    args = p.parse_args()
    if args.end is None:
        start, end = 2, args.start
    else:
        start, end = args.start, args.end
    if args.end is None:
        start, end = 2, args.start
    else:
        start, end = args.start, args.end
    print(f"Finding primes in range [{start}, {end}]")
    if start > end:
        start, end = end, start

    for n in range(max(2, start), end):
        if is_prime(n):
            print(n)

if __name__ == "__main__":
    main()