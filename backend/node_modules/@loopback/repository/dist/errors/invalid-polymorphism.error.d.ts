export declare class InvalidPolymorphismError<Props extends object = {}> extends Error {
    code: string;
    constructor(typeName: string, discriminator?: string, extraProperties?: Props);
}
export declare function isInvalidPolymorphismError(e: any): e is InvalidPolymorphismError<any>;
