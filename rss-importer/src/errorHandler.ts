import { NextFunction, Request, Response } from "express";
export class RequestError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof RequestError) {
    return res
      .status(err.status)
      .json({ status: err.status, msg: err.message });
  }
  res.status(500).json({ status: 500, msg: "Internal server error" });
};
