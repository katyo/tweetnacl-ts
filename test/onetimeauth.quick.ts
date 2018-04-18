import { equal } from 'assert';
import { ByteArray, _onetimeauth, encodeBase64 } from '../src/nacl';
import specVectors from './data/onetimeauth.spec';

describe('onetimeauth.quick', () => {
    describe('onetimeauth specified vectors', () => {
        const _out = ByteArray(16);

        specVectors.forEach(([m_, k_, out_], i) => {
            it(`test spec #${i}`, () => {
                const m = ByteArray(m_);
                const k = ByteArray(k_);
                const out = ByteArray(out_);

                _onetimeauth(_out, 0, m, 0, m.length, k);
                equal(encodeBase64(_out), encodeBase64(out));
            });
        });
    });
});
