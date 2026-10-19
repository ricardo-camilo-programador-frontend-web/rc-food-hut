import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { MetaService } from '@/services/meta.service';

describe('AppComponent (smoke)', () => {
  it('should create the app component', () => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        {
          provide: MetaService,
          useValue: {
            updateMetadata() {
              /* noop */
            },
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
