import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeListComponent } from './employee-list.component';
import { EmployeeListFacadeService } from '../../data-access/employee-list.facade.service';
import { CustomMessageService } from '../../../shared/data-access/custom-message.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { DialogService } from 'primeng/dynamicdialog';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        EmployeeListFacadeService,
        MessageService,
        HttpClient,
        HttpHandler,
        DialogService,
        provideAnimations(),
        ConfirmationService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: {
              params: {},
              queryParams: {}
            }
          }
        },
      ],
      imports: [EmployeeListComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
