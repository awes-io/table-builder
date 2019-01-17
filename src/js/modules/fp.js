export const compare = (obj1, obj2, exclude) => {
    return _.isEqual(
        _.omit(exclude, obj1),
        _.omit(exclude, obj2)
    );
};

export const isSet = (val) => {
    return (typeof val !== 'undefined' && val !== '' && val !== false);
};

//First letter to upper case
export const ucFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
