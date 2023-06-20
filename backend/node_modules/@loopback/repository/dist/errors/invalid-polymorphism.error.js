"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInvalidPolymorphismError = exports.InvalidPolymorphismError = void 0;
class InvalidPolymorphismError extends Error {
    constructor(typeName, discriminator, extraProperties) {
        const message = discriminator
            ? `Invalid class name ${typeName} by discriminator ${discriminator}. Please check polymorphic types and the discriminator.`
            : `Invalid class name ${typeName}. Please check polymorphic types and the discriminator.`;
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.code = 'INVALID_POLYMORPHISM';
        Object.assign(this, extraProperties);
    }
}
exports.InvalidPolymorphismError = InvalidPolymorphismError;
function isInvalidPolymorphismError(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
e) {
    return e instanceof InvalidPolymorphismError;
}
exports.isInvalidPolymorphismError = isInvalidPolymorphismError;
//# sourceMappingURL=invalid-polymorphism.error.js.map