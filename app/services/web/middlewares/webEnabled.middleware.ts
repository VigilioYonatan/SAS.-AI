import { printFileWithDimension } from "@/uploads/libs/helpers";
import type { NextFunction, Request, Response } from "express";
import type { RequestVigilio } from "~/config/types";

export async function webEnabledMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const emp = (req as RequestVigilio).empresa;
	if (!emp.enabled_catalogo) {
		const html = /*html*/ `<div style="width:100%;height:100vh;display:flex;justify-content:center;align-items:center;flex-direction:column;">
                                    <h1>En este momento no estamos no estamos disponible</h1>
									${
										(req as RequestVigilio).empresa!.logo
											? `<img src="${printFileWithDimension(
													(req as RequestVigilio).empresa,
												)(
													(req as RequestVigilio).empresa!.logo!,
													100,
												)}" width="100" height="100" style=""/>`
											: ""
									}
                                   
                                    <a href="https://wa.me/${
																			(req as RequestVigilio).empresa.dial_code
																		}${
																			(req as RequestVigilio).empresa
																				?.telephoneFirst
																		}" _target="blank">Comunicate con nosotros ${
																			(req as RequestVigilio).empresa
																				?.telephoneFirst
																		}</a>
                                </div>`;
		// if web no is enabled
		return res.send(html);
	}
	next();
}
