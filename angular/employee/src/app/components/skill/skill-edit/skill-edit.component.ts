import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
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
  styleUrl: './skill-edit.component.scss',
  standalone: false
})
export class SkillEditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public id: number | null = null;
  @Input() public disable: boolean = false;
  @Output() public cancelEmiitter: EventEmitter<any> = new EventEmitter();
  private routeSubscription$!: Subscription;
  private skillSubscription$!: Subscription;
  private skill: Skill = {};
  public skillFormGroup!: FormGroup;
  private route: ActivatedRoute = inject(ActivatedRoute);
  private skillService: SkillService = inject(SkillService);
  private router: Router = inject(Router);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private messageService: MessageService = inject(MessageService);

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

  ngOnChanges(_changes: SimpleChanges): void {
    this.initFormFields();
  }

  buildForm() {
    this.skillFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(1)]],
      description: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(5)]]
    });
  }

  private initFormFields() {
    if (this.id) {
      const skillObserver: any = {
        next: (value: Skill) => {
          this.skill = value;
          this.setValuesToFields(value);
        },
        error: (err: any) => { fireToast('error', 'Error', err.error.message, this.messageService); },
        complete: () => { }
      };
      this.skillSubscription$ = this.skillService.getSkill(this.id).subscribe(skillObserver);
    } else {
      this.setValuesToFields({});
    }
  }

  public cancel(save: boolean) {
    this.cancelEmiitter.emit({ visible: false, save: save });
  }

  submit() {
    this.skill.name = this.skillFormGroup.controls['name'].value;
    this.skill.description = this.skillFormGroup.controls['description'].value;

    const skillObserver: any = {
      next: (value: Skill) => {
        !this.id ? fireToast("success", "Success", `Skill ${value.name} has been created`, this.messageService) : fireToast("success", "Success", `Skill ${value.name} has been updated`, this.messageService);
        this.cancel(true);
      },
      error: (err: any) => { fireToast('error', 'Error', err.error.message, this.messageService); },
      complete: () => { },
    }
    !this.id ?
      this.skillService.save(this.skill).subscribe(skillObserver) :
      this.skillService.update(this.skill).subscribe(skillObserver);
  }

  private setValuesToFields(value: Skill) {
    const name = value.name ?? '';
    const description = value.description ?? '';
    if (this.skillFormGroup) {
      this.skillFormGroup.controls['name'].setValue(name);
      this.skillFormGroup.controls['description'].setValue(description);
    }
  }
}
