# TweetNaCl in TypeScript (and ES6)

[![npm version](https://badge.fury.io/js/tweetnacl-ts.svg)](https://badge.fury.io/js/tweetnacl-ts)
[![npm downloads](https://img.shields.io/npm/dm/tweetnacl-ts.svg)](https://www.npmjs.com/package/tweetnacl-ts)
[![Build Status](https://travis-ci.org/katyo/tweetnacl-ts.svg?branch=master)](https://travis-ci.org/katyo/tweetnacl-ts)

Port of [TweetNaCl.js](https://tweetnacl.js.org) to **TypeScript** with several API changes for compatibility with Tree-Shaking to help modern JavaScript bundlers like Rollup and Webpack >2.x attain much optimization.

Also includes:

* [TweetNaCl-Auth.js](https://github.com/dchest/tweetnacl-auth-js)
* [TweetNaCl-Utils.js](https://github.com/dchest/tweetnacl-util-js)
* [BlakeJS](https://github.com/dcposch/blakejs)
* [TweetNaCl-SealedBox.js](https://github.com/whs/tweetnacl-sealed-box)

__NOTE: May be you need `crypto.getRandomValues()` polyfill for browsers which doesn't supported it.__

Documentation
=============

* [Overview](#overview)
* [Usage](#usage)
  * [Public-key authenticated encryption (box)](#public-key-authenticated-encryption-box)
  * [Secret-key authenticated encryption (secretbox)](#secret-key-authenticated-encryption-secretbox)
  * [Scalar multiplication](#scalar-multiplication)
  * [Signatures](#signatures)
  * [Hashing](#hashing)
  * [Random bytes generation](#random-bytes-generation)
  * [Constant-time comparison](#constant-time-comparison)
* [System requirements](#system-requirements)
* [Development and testing](#development-and-testing)


Overview
--------

Originally this project had been a port of `nacl-fast.js` to TypeScript.
Now it also includes support of SealedBox and HMAC-Auth.

Usage
-----

All API functions accept and return bytes as `ByteArray`s (natively as `Uint8Array`s).
If you need to encode or decode strings, use functions `encodeUTF8/decodeUTF8`.


### Public-key authenticated encryption (box)

Implements *x25519-xsalsa20-poly1305*.

#### box\_keyPair()

Generates a new random key pair for box and returns it as an object with
`publicKey` and `secretKey` members:

```typescript
interface BoxKeyPair {
    publicKey: ByteArray; // Array with 32-byte public key
    secretKey: ByteArray; // Array with 32-byte secret key
}
```

#### box\_keyPair\_fromSecretKey(secretKey)

Returns a key pair for box with public key corresponding to the given secret
key.

#### box(message, nonce, theirPublicKey, mySecretKey)

Encrypts and authenticates message using peer's public key, our secret key, and
the given nonce, which must be unique for each distinct message for a key pair.

Returns an encrypted and authenticated message, which is
`BoxLength.Overhead` longer than the original message.

#### box\_open(box, nonce, theirPublicKey, mySecretKey)

Authenticates and decrypts the given box with peer's public key, our secret
key, and the given nonce.

Returns the original message, or `undefined` if authentication fails.

#### box\_before(theirPublicKey, mySecretKey)

Returns a precomputed shared key which can be used in `box_after` and
`box_open_after`.

#### box\_after(message, nonce, sharedKey)

Same as `box`, but uses a shared key precomputed with `box_before`.

#### box\_open\_after(box, nonce, sharedKey)

Same as `box_open`, but uses a shared key precomputed with `box_before`.

#### Constants

##### BoxLength.PublicKey = 32

Length of public key in bytes.

##### BoxLength.SecretKey = 32

Length of secret key in bytes.

##### BoxLength.SharedKey = 32

Length of precomputed shared key in bytes.

##### BoxLength.Nonce = 24

Length of nonce in bytes.

##### BoxLength.Overhead = 16

Length of overhead added to box compared to original message.


### Secret-key authenticated encryption (secretbox)

Implements *xsalsa20-poly1305*.

#### secretbox(message, nonce, key)

Encrypts and authenticates message using the key and the nonce. The nonce must
be unique for each distinct message for this key.

Returns an encrypted and authenticated message, which is
`SecretBox.Overhead` longer than the original message.

#### secretbox\_open(box, nonce, key)

Authenticates and decrypts the given secret box using the key and the nonce.

Returns the original message, or `undefined` if authentication fails.

#### Constants

##### SecretBoxLength.Key = 32

Length of key in bytes.

##### SecretBoxLength.Nonce = 24

Length of nonce in bytes.

##### SecretBoxLength.Overhead = 16

Length of overhead added to secret box compared to original message.


### Sealed box encryption

Sealed boxes are designed to anonymously send messages
to a recipient given its public key.

#### sealedbox(message, publicKey)

Encrypts message using the recipient's public key.

Returns an encrypted message, which is `SealedBox.Overhead`
longer than the original message.

#### sealedbox\_open(box, publicKey, secretKey)

Decrypts the given sealed box using the recipient's key pair.

Returns the original message, or `undefined` if decryption fails.

#### Constants

##### SealedBoxLength.PublicKey = 32

Length of public key of recipient in bytes.

##### SealedBoxLength.SecretKey = 32

Length of secret key of recipient in bytes.

##### SealedBoxLength.Nonce = 24

Length of nonce in bytes.

##### SealedBoxLength.Overhead = 48

Length of overhead added to box compared to original message.


### Scalar multiplication

Implements *x25519*.

#### scalarMult(n, p)

Multiplies an integer `n` by a group element `p` and returns the resulting
group element.

#### scalarMult\_base(n)

Multiplies an integer `n` by a standard group element and returns the resulting
group element.

#### Constants

##### ScalarMultLength.Scalar = 32

Length of scalar in bytes.

##### ScalarMultLength.GroupElement = 32

Length of group element in bytes.


### Signatures

Implements [ed25519](http://ed25519.cr.yp.to).

#### sign\_keyPair()

Generates new random key pair for signing and returns it as an object with
`publicKey` and `secretKey` members:

```typescript
interface SignKeyPair {
    publicKey: ByteArray; // Array with 32-byte public key
    secretKey: ByteArray; // Array with 64-byte secret key
}
```

#### sign\_keyPair\_fromSecretKey(secretKey)

Returns a signing key pair with public key corresponding to the given
64-byte secret key. The secret key must have been generated by
`sign_keyPair` or `sign_keyPair_fromSeed`.

#### sign\_keyPair\_fromSeed(seed)

Returns a new signing key pair generated deterministically from a 32-byte seed.
The seed must contain enough entropy to be secure. This method is not
recommended for general use: instead, use `sign_keyPair` to generate a new
key pair from a random seed.

#### sign(message, secretKey)

Signs the message using the secret key and returns a signed message.

#### sign\_open(signedMessage, publicKey)

Verifies the signed message and returns the message without signature.

Returns `undefined` if verification failed.

#### sign\_detached(message, secretKey)

Signs the message using the secret key and returns a signature.

#### sign\_detached\_verify(message, signature, publicKey)

Verifies the signature for the message and returns `true` if verification
succeeded or `false` if it failed.

#### Constants

##### SignLength.PublicKey = 32

Length of signing public key in bytes.

##### SignLength.SecretKey = 64

Length of signing secret key in bytes.

##### SignLength.Seed = 32

Length of seed for `sign_keyPair_fromSeed` in bytes.

##### SignLength.Signature = 64

Length of signature in bytes.


### Hashing

Implements *SHA-512*.

#### hash(message)

Returns SHA-512 hash of the message.

#### Constants

##### HashLength.Hash = 64

Length of hash in bytes.

### Authenticating

Implements *HMAC-SHA-512-256*

#### auth(message, key)

Authenticates the given message with the secret key.
(In other words, returns HMAC-SHA-512-256 of the message under the key.)

#### auth\_full(message, key)

Returns HMAC-SHA-512 (without truncation) of the message under the key

#### AuthLength.Auth = 32

Length of authenticator returned by `auth`.

#### AuthLength.AuthFull = 64

Length of authenticator returned by `auth_full`.

#### AuthLength.Key = 32

Length of key for `auth` and `auth_full` (key length is currently not
enforced).


### Random bytes generation

#### randomBytes(length)

Returns a `ByteArray` of the given length containing random bytes of
cryptographic quality.

**Implementation note**

TweetNaCl.js uses the following methods to generate random bytes,
depending on the platform it runs on:

* `window.crypto.getRandomValues` (WebCrypto standard)
* `window.msCrypto.getRandomValues` (Internet Explorer 11)
* `crypto.randomBytes` (Node.js)

If the platform doesn't provide a suitable PRNG, the following functions,
which require random numbers, will throw exception:

* `randomBytes`
* `box_keyPair`
* `sign_keyPair`

Other functions are deterministic and will continue working.

### Constant-time comparison

#### verify(x, y)

Compares `x` and `y` in constant time and returns `true` if their lengths are
non-zero and equal, and their contents are equal.

Returns `false` if either of the arguments has zero length, or arguments have
different lengths, or their contents differ.


System requirements
-------------------

TweetNaCl.js supports modern browsers that have a cryptographically secure
pseudorandom number generator and typed arrays, including the latest versions
of:

* Chrome
* Firefox
* Safari (Mac, iOS)
* Internet Explorer 11

Other systems:

* Node.js


Development and testing
------------------------

Install NPM modules needed for development:

    $ npm install

To build js run compilation:

    $ npm run compile

### Testing

To run tests in Node:

    $ npm run test-node

To run tests in browsers and Node (CI-mode):

    $ npm run test

To run tests in browsers and Node (Dev-mode):

    $ npm run test-dev
