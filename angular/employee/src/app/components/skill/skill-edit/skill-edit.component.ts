import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Skill } from '../../../models/skill.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SkillService } from '../../../services/skill/skill.service';
import { fireToast } from '../../../shared/utils';

@Component({
  selector: 'app-skill-edit',
  templateUrl: './skill-edit.component.html',
  styleUrl: './skill-edit.component.scss'
})
export class SkillEditComponent implements OnInit, OnDestroy {
  id: number | null = null;
  private routeSubscription$!: Subscription;
  private skillSubscription$!: Subscription;
  skill: Skill = new Skill();
  skillFormGroup!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private skillService: SkillService,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.routeSubscription$ = this.route.params.subscribe((params: Params) => {
      this.id = params["skillId"] ?? null;
      this.initFormFields();
    });
  }
  ngOnDestroy(): void {
    if (this.routeSubscription$ !== undefined) {
      this.routeSubscription$.unsubscribe();
    }
    if (this.skillSubscription$ !== undefined) {
      this.skillSubscription$.unsubscribe();
    }
  }

  buildForm() {
    this.skillFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(1)]],
      description: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(5)]]
    });
  }

  private initFormFields() {
    if (this.id !== null) {
      const skillObserver: any = {
        next: (value: Skill) => {
          this.skill = value;
          this.skillFormGroup.controls['name'].setValue(value.name);
          this.skillFormGroup.controls['description'].setValue(value.description);
        },
        error: (err: any) => { fireToast('error', 'Error', err.error.message, this.messageService); },
        complete: () => { console.log('Completed') }
      };
      this.skillSubscription$ = this.skillService.getSkill(this.id).subscribe(skillObserver);
    }
  }

  back() {
    this.router.navigate(["skill/list"])
  }

  submit() {
    this.skill.name = this.skillFormGroup.controls['name'].value;
    this.skill.description = this.skillFormGroup.controls['description'].value;
    const skillObserver: any = {
      next: (value: Skill) => {
        if (this.id === null) {
          fireToast("success", "Success", `Skill ${value.name} has been created`, this.messageService);
        } else {
          fireToast("success", "Success", `Skill ${value.name} has been updated`, this.messageService);
        }
        this.router.navigate([`skill/details/${value.id}`])
      },
      error: (err: any) => { fireToast('error', 'Error', err.error.message, this.messageService); },
      complete: () => { },
    }
    if (this.id === null) {
      this.skillService.save(this.skill).subscribe(skillObserver);
    } else {
      this.skillService.update(this.skill).subscribe(skillObserver);
    }
  }

  private fireToast(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail });
  }
}
