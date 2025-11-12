import { Test, TestingModule } from '@nestjs/testing';
import { XuitService } from './xuit.service';

describe('XuitService', () => {
  let service: XuitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [XuitService],
    }).compile();

    service = module.get<XuitService>(XuitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
