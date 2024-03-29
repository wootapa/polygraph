/**
 * @jest-environment jsdom
 */

import { and, or, not } from '../src/polygraph';

const person = {
    fname: 'Andreas',
    lname: 'Petersson',
    address: {
        street: 151,
        town: 'Kristianstad'
    }
};

describe('and', () => {
    it('should equal fname and lname', () => {
        const result = and()
            .eq('fname', person.fname)
            .eq('lname', person.lname)
            .done()
            .evaluate(person);

        expect(result).toBe(true);
    });
    it('should equal fname but not lname', () => {
        const result = and()
            .eq('fname', person.fname)
            .eq('lname', 'Miyagi')
            .done()
            .evaluate(person);

        expect(result).toBe(false);
    });
});

describe('or', () => {
    it('should equal fname or lname', () => {
        const result = or()
            .eq('fname', person.fname)
            .eq('lname', 'Miyagi')
            .done()
            .evaluate(person);

        expect(result).toBe(true);
    });
    it('should equal fname but not lname but will short-circuit', () => {
        const result = or()
            .eq('fname', person.fname)
            .eq('idontexistandwontbeevaluated', 'ok')
            .done()
            .evaluate(person);

        expect(result).toBe(true);
    });
    it('should not equal fname nor lname and street, but street and town', () => {
        const result = or()
            .gte('fname', 'Bonkers')
            .and()
            .eq('lname', 'Bonkers')
            .eq('address.street', person.address.street)
            .up()
            .and()
            .eq('address.street', person.address.street)
            .eq('address.town', person.address.town)
            .done()
            .evaluate(person);

        expect(result).toBe(true);
    });
    it('should equal fname, not lname and street, but street and town', () => {
        const result = and()
            .gte('fname', person.fname)
            .or()
            .and()
            .eq('lname', 'Bonkers')
            .eq('address.street', person.address.street)
            .up()
            .and()
            .eq('lname', person.lname)
            .eq('address.street', 'AnotherBonkers')
            .up()
            .eq('address.town', person.address.town)
            .done()
            .evaluate(person);

        expect(result).toBe(true);
    });
});

describe('not', () => {
    it('should not equal fname', () => {
        const result = not()
            .eq('fname', 'Doogie')
            .done()
            .evaluate(person);

        expect(result).toBe(true);
    });
});

describe('combinations', () => {
    it('should equal fname and any street but not town', () => {
        const result = and()
            .eq('fname', person.fname)
        //.any('address.street', [123,151,456])
            .or()
            .eq('address.street', 123)
            .eq('address.street', person.address.street)
            .eq('address.street', 456)
            .up()
            .not()
            .eq('address.town', 'Vinslöv')
            .up()
            .done()
            .evaluate(person);

        expect(result).toBe(true);
    });
});
