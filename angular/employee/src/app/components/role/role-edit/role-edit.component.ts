import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Role } from '../../../models/role.model';
import { RoleService } from '../../../services/role/role.service';
import { fireToast } from '../../../shared/utils';

@Component({
    selector: 'app-role-edit',
    templateUrl: './role-edit.component.html',
    styleUrl: './role-edit.component.scss',
    standalone: false
})
export class RoleEditComponent implements OnInit, OnDestroy {
  id: number | null = null;
  private routeSubscription$!: Subscription;
  private roleSubscription$!: Subscription;
  role: Role = {};
  roleFormGroup!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.routeSubscription$ = this.route.params.subscribe((params: Params) => {
      this.id = params["roleId"] ?? null;;
      this.initFormFields();
    });
  }
  ngOnDestroy(): void {
    if (this.routeSubscription$ !== undefined) {
      this.routeSubscription$.unsubscribe();
    }

    if (this.roleSubscription$ !== undefined) {
      this.roleSubscription$.unsubscribe();
    }
  }
  buildForm() {
    this.roleFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(5)]],
      code: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(5)]]
    });
  }

  private initFormFields() {
    if (this.id !== null) {
      const roleObserver: any = {
        next: (value: Role) => {
          this.role = value;
          this.roleFormGroup.controls['name'].setValue(value.name);
          this.roleFormGroup.controls['code'].setValue(value.code);
          this.roleFormGroup.controls['description'].setValue(value.description);
        },
        error: (err: any) => { fireToast('error', 'Error', err.error.message, this.messageService); },
        complete: () => { console.log('Completed') }
      };
      this.roleSubscription$ = this.roleService.getRole(this.id).subscribe(roleObserver);
    }
  }

  back() {
    this.router.navigate(["role/list"])
  }

  submit() {
    this.role.name = this.roleFormGroup.controls['name'].value;
    this.role.code = this.roleFormGroup.controls['code'].value;
    this.role.description = this.roleFormGroup.controls['description'].value;

    const roleObserver: any = {
      next: (value: Role) => {
        if (this.id === null) {
          fireToast("success", "Success", `Role ${value.name} has been created`, this.messageService);
        } else {
          fireToast("success", "Success", `Role ${value.name} has been updated`, this.messageService);
        }
        this.router.navigate([`role/details/${value.id}`])
      },
      error: (err: any) => { fireToast('error', 'Error', err.error.message, this.messageService); },
      complete: () => { },
    }
    if (this.id === null) {
      this.roleService.save(this.role).subscribe(roleObserver);
    } else {
      this.roleService.update(this.role).subscribe(roleObserver);
    }
  }
}
