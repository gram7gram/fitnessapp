import intersectionBy from 'lodash/intersectionBy';

it('intersectionBy should be true if both arrays contain same value', () => {
    const data1 = ['abs', 'legs', 'arms']
    const data2 = ['chest', 'abs', 'hands']

    const result = intersectionBy(data1, data2)

    expect(result).toEqual(['abs'])
});


it('intersectionBy should be false if no array contains same value', () => {
    const data1 = ['abs', 'legs', 'arms']
    const data2 = ['chest', 'head', 'hands']

    const result = intersectionBy(data1, data2)

    expect(result).toEqual([])
});
