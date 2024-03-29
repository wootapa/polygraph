/**
 * @jest-environment jsdom
 */

import { and } from '../src/polygraph';

const person = {
    name: 'Mr Miyagi',
    age: 42,
    null: null as any
};

describe('equal', () => {
    it('should equal', () => {
        const result = and()
            .eq('age', person.age)
            .done()
            .evaluate(person);

        expect(result).toBe(true);
    });
    it('should not equal', () => {
        const result = and()
            .eq('age', person.age - 1)
            .done()
            .evaluate(person);

        expect(result).toBe(false);
    });
});

describe('null', () => {
    it('should be nullish', () => {
        const result = and()
            .isNull('null')
            .isNull('undefinedproperty')
            .done()
            .evaluate(person);

        expect(result).toBe(true);
    });
});

describe('greater', () => {
    it('should be greater', () => {
        const result = and()
            .gt('age', person.age - 1)
            .done()
            .evaluate(person);

        expect(result).toBe(true);
    });
    it('should not be greater', () => {
        const result = and()
            .gt('age', person.age)
            .done()
            .evaluate(person);

        expect(result).toBe(false);
    });
    it('should be greater or equal', () => {
        const result = and()
            .gte('age', person.age)
            .done()
            .evaluate(person);

        expect(result).toBe(true);
    });
    it('should not be greater or equal', () => {
        const result = and()
            .gte('age', person.age + 1)
            .done()
            .evaluate(person);

        expect(result).toBe(false);
    });
});

describe('less', () => {
    it('should be less', () => {
        const result = and()
            .lt('age', person.age + 1)
            .done()
            .evaluate(person);

        expect(result).toBe(true);
    });
    it('should not be less', () => {
        const result = and()
            .lt('age', person.age)
            .eq('foo', 3)
            .gte('asdf', 3)
            .done()
            .evaluate(person);

        expect(result).toBe(false);
    });
    it('should be less or equal', () => {
        const result = and()
            .lte('age', person.age)
            .done()
            .evaluate(person);

        expect(result).toBe(true);
    });
    it('should not be less or equal', () => {
        const result = and()
            .lte('age', person.age - 1)
            .done()
            .evaluate(person);

        expect(result).toBe(false);
    });
});

describe('any', () => {
    it('should be any', () => {
        const result = and()
            .any('age', [10, 20, person.age, 30, 80])
            .done()
            .evaluate(person);

        expect(result).toBe(true);
    });
});

describe('like', () => {
    it('should contain word', () => {
        const result = and()
            .like('name', person.name.slice(3, 6))
            .done()
            .evaluate(person);

        expect(result).toBe(true);
    });
    it('should not contain word', () => {
        const result = and()
            .like('name', person.name.slice(3, 6)
                .toUpperCase())
            .done()
            .evaluate(person);

        expect(result).toBe(false);
    });
    it('should contain word case insensitive', () => {
        const result = and()
            .ilike('name', person.name.slice(3, 6)
                .toUpperCase())
            .done()
            .evaluate(person);

        expect(result).toBe(true);
    });
    it('should contain words case insensitive and wildcards', () => {
        const result = and()
            .ilike('name', 'mr*mi*gi*')
            .done()
            .evaluate(person);

        expect(result).toBe(true);
    });
    it('aliases', () => {
        const result = and().operator('eq', 'age', person.age)
            .operator('gt', 'age', person.age - 1)
            .operator('gte', 'age', person.age)
            .operator('lt', 'age', person.age + 1)
            .operator('lte', 'age', person.age)
            .operator('isnull', 'null', person.null)
            .operator('like', 'name', 'Mr*')
            .operator('ilike', 'name', 'mr*')
            .done()
            .evaluate(person);

        expect(result).toBe(true);
    });
});
