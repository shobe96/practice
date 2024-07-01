import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { skillResolver } from './skill.resolver';

describe('skillResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => skillResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
