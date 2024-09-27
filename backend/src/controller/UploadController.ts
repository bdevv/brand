import { AppDataSource } from "../DataSource";
import { NextFunction, Request, Response } from "express";
import { Trademark } from "../entity/Trademark";
const fs = require("fs");
export class UploadController {
  private trademarkRepository = AppDataSource.getRepository(Trademark);

  async uploadImage(request: Request, response: Response, next: NextFunction) {
    const { base64Image, filename, title } = request.body;
    const buffer = Buffer.from(base64Image, "base64");

    // Define the file path
    const filePath = `./uploads/${filename }`;

    // Write the buffer to the file
    fs.writeFile(filePath, buffer, async (error) => {
      if (error) {
        console.error("Error saving the file:", error);
        // Handle the error and send an appropriate response
        return response.status(500).json({ error: "Failed to save the file" });
      }
      const trademark = await this.trademarkRepository.findOne({
        where: { title: title },
      });
      if (trademark)
        return response.status(409).json({ error: "Already exists" });
      else {
        const newTrademark = Object.assign(new Trademark(), {
          url: filename,
          title,
        });

        return response
          .status(200)
          .json({ data: await this.trademarkRepository.save(newTrademark) });
      }
    });
  }
  async all() {
    return this.trademarkRepository.find();
  }
  async deleteOne(request: Request, response: Response, next: NextFunction){
    const {id} = request.body;
    console.log("🚀 ~ UploadController ~ deleteOne ~ id:", id)

    let tradeToRemove = await this.trademarkRepository.findOneBy({ id:parseInt(id) });

    if (!tradeToRemove) {
      return "this trademark not exist";
    }

    await this.trademarkRepository.remove(tradeToRemove);

    return "user has been removed";
  }
}
