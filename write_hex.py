import sys, binascii
open(sys.argv[1], 'wb').write(binascii.unhexlify(sys.argv[2]))
print(f'Wrote {sys.argv[1]}')
