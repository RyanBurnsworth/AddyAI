import { AccountController } from './account.controller';
import { AccountService } from '../../service/account/account.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Response } from 'express';

describe('AccountController', () => {
  let controller: AccountController;
  let service: AccountService;

  const mockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res as Response;
  };

  beforeEach(() => {
    service = {
      fetchAccounts: jest.fn(),
    } as any;

    controller = new AccountController(service);
  });

  it('should return 400 if user_id or refresh_token is missing', async () => {
    const res = mockResponse();

    await controller.getAccounts(res, null as any, 'some-token');

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.any(BadRequestException));
  });

  it('should return 404 if no accounts are found', async () => {
    const res = mockResponse();
    (service.fetchAccounts as jest.Mock).mockResolvedValue([]);

    await controller.getAccounts(res, 123, 'valid-token');

    expect(service.fetchAccounts).toHaveBeenCalledWith(123, 'valid-token');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.any(NotFoundException));
  });

  it('should return 200 with accounts if found', async () => {
    const res = mockResponse();
    const accounts = [{ customerId: '12345' }];
    (service.fetchAccounts as jest.Mock).mockResolvedValue(accounts);

    await controller.getAccounts(res, 1, 'token');

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(accounts);
  });

  it('should handle service errors gracefully', async () => {
    const res = mockResponse();
    (service.fetchAccounts as jest.Mock).mockRejectedValue(new Error('Something bad happened'));

    await controller.getAccounts(res, 1, 'token');

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.any(String));
  });
});
