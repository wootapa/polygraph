/**
 * @jest-environment jsdom
 */

import { and, define, fromJson } from '../src/polygraph';

const person = {
    age: 42
};

define('even', (v: number) => v % 2 === 0);

describe('aliased operators', () => {
    it('should be even', () => {
        const result = and()
            .operator('even', 'age')
            .done()
            .evaluate(person);

        expect(result).toBe(true);;
    });

    it('should survive serialization', () => {
        const polygraph1 = and().operator('even', 'name').done();
        const polygraph2 = fromJson(JSON.stringify(polygraph1.asJson()));

        expect(polygraph1.evaluate(person)).toEqual(polygraph2.evaluate(person));
    });

    it('should be equivalent', () => {
        const polygraph1 = JSON.stringify(and()
            .eq('name', 'Foo')
            .gte('age', 20)
            .done()
            .asJson());
        const polygraph2 = JSON.stringify(and()
            .op('eq', 'name', 'Foo')
            .op('gte', 'age', 20)
            .done()
            .asJson());

        expect(polygraph1).toEqual(polygraph2);
    });
});
