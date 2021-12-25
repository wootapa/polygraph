import { expect } from 'chai';
import { and, fromJson } from '../src/polygraph';

const person = {
    age: 20,
    weight: 30,
    height: 180
};

describe('polygraph', () => {
    const polygraph1 = and()
        .eq('age', 20)
        .or()
        .any('weight', [20, 30, 40])
        .done();

    const polygraph2 = fromJson(polygraph1.asJson());

    it('polygraph and json-polygraph evaluates same', () => {
        const result1 = polygraph1.evaluate(person);
        const result2 = polygraph2.evaluate(person);
        expect(result1)
            .eq(result2);
    });
    it('polygraph and json-polygraph same json', () => {
        const result1 = JSON.stringify(polygraph1.asJson());
        const result2 = JSON.stringify(polygraph2.asJson());
        expect(result1)
            .eq(result2);
    });
    it('polygraph and clone polygraph same', () => {
        const result1 = JSON.stringify(polygraph1.asJson());
        const result2 = JSON.stringify(polygraph1.clone()
            .asJson());
        expect(result1)
            .eq(result2);
    });
    it('addPolygraph should evaluate new polygraph', () => {
        const polygraph3 = and()
            .eq('height', person.height)
            .done();

        const result = polygraph3.addPolygraph(polygraph1)
            .done()
            .evaluate(person);
        expect(result).true;
    });
});
