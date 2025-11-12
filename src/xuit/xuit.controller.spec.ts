import { Test, TestingModule } from '@nestjs/testing';
import { XuitController } from './xuit.controller';

describe('XuitController', () => {
  let controller: XuitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [XuitController],
    }).compile();

    controller = module.get<XuitController>(XuitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
