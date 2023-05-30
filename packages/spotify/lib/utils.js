"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncIteration = exports.chunkArray = void 0;
const chunkArray = (array, chunk) => {
    const temp = [];
    for (let i = 0, j = array.length; i < j; i += chunk) {
        temp.push(array.slice(i, i + chunk));
    }
    return temp;
};
exports.chunkArray = chunkArray;
const asyncIteration = async (array, fc) => {
    for (let i = 0; i <= array.length; i++) {
        const item = array[i];
        if (item) {
            await fc(item);
        }
    }
};
exports.asyncIteration = asyncIteration;
//# sourceMappingURL=utils.js.map