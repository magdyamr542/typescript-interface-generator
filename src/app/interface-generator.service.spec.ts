import { TestBed } from '@angular/core/testing';
import { InterfaceGeneratorService } from './interface-generator.service';

describe('Interface Generator Service', () => {
  let service: InterfaceGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterfaceGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should contain a root interface', () => {
    const object = { name: 'some string' };
    const result = service.generateInterface(object, true);
    expect(result).toContain('Root');
  });

  it('should have undefined when value is undefined', () => {
    const object = { name: undefined };
    const result = service.generateInterface(object, true);
    expect(result).toContain('undefined');
  });

  it('should have an interface called Series', () => {
    const object = { series: {} };
    const result = service.generateInterface(object, true);
    expect(result).toContain('Series');
  });

  it('should have an array of interfaces called Series[]', () => {
    const object = { series: [{}] };
    const result = service.generateInterface(object, true);
    expect(result).toContain('Series[]');
  });

  it('should have a value of null for a property which has a null value', () => {
    const object = { val: null };
    const result = service.generateInterface(object, true);
    expect(result).toContain('null');
  });

  it('should have an array of any when the array is empty', () => {
    const object = { val: [] };
    const result = service.generateInterface(object, true);
    expect(result).toContain('val : any[]');
  });

  it('should increment the names of the interfaces when there is naming conflicts', () => {
    const object = {
      person: {
        name: 'amr',
        age: 12,
        father: {
          person: { name: 'magdy', age: 55 },
        },
      },
    };
    const result = service.generateInterface(object, true);
    expect(result).toContain('Person');
    expect(result).toContain('Person1');
  });

  it('should identify optional parameters when optional params is on', () => {
    const object = {
      series: [
        {
          label: 'label1',
          values: [1, 3, 4],
        },
        {
          label: 'label1',
        },
      ],
    };
    const result = service.generateInterface(object, true);
    expect(result).toContain('values?');
  });
});
