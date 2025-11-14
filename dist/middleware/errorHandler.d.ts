import type { NextFunction, Request, Response } from "express";
export declare class HttpError extends Error {
    status: number;
    constructor(status: number, message: string);
}
export declare const notFoundHandler: (req: Request, res: Response, next: NextFunction) => void;
export declare const errorHandler: (err: unknown, req: Request, res: Response, _next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map