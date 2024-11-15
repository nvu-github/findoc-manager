import { Request, Response } from 'express';
import billerService from '~/services/biller.service';
import { StatusCodes } from 'http-status-codes';

class billerController {
  async createBiller(req: Request, res: Response): Promise<Response> {
    try {
      return await billerService.createBiller(req, res);
    } catch (error) {
      console.error('Error creating biller:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create biller' });
    }
  }

  async getAllBillers(req: Request, res: Response): Promise<Response> {
    try {
      return await billerService.getAllBillers(req, res);
    } catch (error) {
      console.error('Error fetching billers:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch billers' });
    }
  }

  async getBillerById(req: Request, res: Response): Promise<Response> {
    try {
      return await billerService.getBillerById(req, res);
    } catch (error) {
      console.error('Error fetching biller:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch biller' });
    }
  }

  async updateBiller(req: Request, res: Response): Promise<Response> {
    try {
      return await billerService.updateBiller(req, res);
    } catch (error) {
      console.error('Error updating biller:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update biller' });
    }
  }

  async deleteBiller(req: Request, res: Response): Promise<Response> {
    try {
      return await billerService.deleteBiller(req, res);
    } catch (error) {
      console.error('Error deleting biller:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete biller' });
    }
  }
}

export default new billerController();
