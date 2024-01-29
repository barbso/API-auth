import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { accessTokenSecret } from "../routes";

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authToken = request.headers.authorization;


    if(!authToken) {
        return response.status(401).json({
            message: "Está faltando o Token"
        })
    }

    const [ ,accessToken] = authToken.split(" ");

    try {
        verify(accessToken, accessTokenSecret);

        return next();
    }catch(err){
        return response.status(401).json({
            message: "O token é invalido"
        })
    }
}