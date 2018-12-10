import { extractQuote } from './extractor';

describe('extractor', () => {

    describe('extractQuote', () => {
        test('simple case', () => {
            const line = '[Alex] Cum sociis natoque !';
            const quote = extractQuote(line);

            expect(quote).toEqual({
                who: 'Alex',
                how: '',
                what: 'Cum sociis natoque !',
            });
        });

        test('without name', () => {
            const line = 'Cum sociis natoque !';
            const quote = extractQuote(line);

            expect(quote).toEqual({
                who: '',
                how: '',
                what: 'Cum sociis natoque !',
            });
        });

        test('name with accent', () => {
            const line = '[Sébastien] Cum sociis natoque !';
            const quote = extractQuote(line);

            expect(quote).toEqual({
                who: 'Sébastien',
                how: '',
                what: 'Cum sociis natoque !',
            });
        });

        test('quote with accents', () => {
            const line = '[Alex] Cum sôciis nàtoqué !';
            const quote = extractQuote(line);

            expect(quote).toEqual({
                who: 'Alex',
                how: '',
                what: 'Cum sôciis nàtoqué !',
            });
        });

        test('with a space at the beginning', () => {
            const line = ' [Alex] Cum sociis natoque !';
            const quote = extractQuote(line);

            expect(quote).toEqual({
                who: 'Alex',
                how: '',
                what: 'Cum sociis natoque !',
            });
        });

        test('with special characters in the name', () => {
            const line = '[$3B@stien] Cum sociis natoque !';
            const quote = extractQuote(line);

            expect(quote).toEqual({
                who: '$3B@stien',
                how: '',
                what: 'Cum sociis natoque !',
            });
        });

        test('with a "one word" context', () => {
            const line = '[Romain] (loudly) Cum sociis natoque !';
            const quote = extractQuote(line);

            expect(quote).toEqual({
                who: 'Romain',
                how: 'loudly',
                what: 'Cum sociis natoque !',
            });
        });

        test('with a "two word" context', () => {
            const line = '[Romain] (very loudly) Cum sociis natoque !';
            const quote = extractQuote(line);

            expect(quote).toEqual({
                who: 'Romain',
                how: 'very loudly',
                what: 'Cum sociis natoque !',
            });
        });

        test('with an empty context', () => {
            const line = '[Romain] () Cum sociis natoque !';
            const quote = extractQuote(line);

            expect(quote).toEqual({
                who: 'Romain',
                how: '',
                what: 'Cum sociis natoque !',
            });
        });

        test('without quote', () => {
            const line = '[Romain]';
            const quote = extractQuote(line);

            expect(quote).toEqual({
                who: 'Romain',
                how: '',
                what: '',
            });
        });

        test('with nothing', () => {
            const line = '';
            const quote = extractQuote(line);

            expect(quote).toEqual({ 
                who: '', 
                how: '', 
                what: '' 
            });
        });
    });
});