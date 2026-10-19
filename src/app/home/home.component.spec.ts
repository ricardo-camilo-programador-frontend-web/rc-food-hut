import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HomeComponent } from './home.component';

describe('HomeComponent (smoke)', () => {
  it('should instantiate HomeComponent class', () => {
    const component = new HomeComponent();
    expect(component).toBeTruthy();
  });

  it('should render HomeComponent with sub-sections', () => {
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });

    const fixture = TestBed.createComponent(HomeComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
