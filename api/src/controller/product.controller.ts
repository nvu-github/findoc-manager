import { Request, Response } from "express";

class productController {
  getProducts(req: Request, res: Response): any {
    // return product data from database
    return res.send("All product");
  }
}

export default new productController();