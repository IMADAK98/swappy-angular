import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioWizardComponent } from './portfolio-wizard.component';

describe('PortfolioWizardComponent', () => {
  let component: PortfolioWizardComponent;
  let fixture: ComponentFixture<PortfolioWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioWizardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PortfolioWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
